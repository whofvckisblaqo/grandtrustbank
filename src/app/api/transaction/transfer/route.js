import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { withAuth } from '@/lib/withAuth';
import Account from '@/models/Account';
import Transaction from '@/models/Transaction';
import { getTransactionCost } from '@/lib/fees';

async function handler(req) {
  try {
    const body = await req.json();
    const { fromAccountId, toAccountNumber, amount, narration, transferType, externalDetails } = body;

    if (!fromAccountId || !toAccountNumber || !amount) {
      return NextResponse.json({ error: 'fromAccountId, toAccountNumber, and amount are required' }, { status: 400 });
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount < 1) {
      return NextResponse.json({ error: 'Amount must be at least $1' }, { status: 400 });
    }

    const senderAccount = await Account.findOne({ _id: fromAccountId, user: req.user._id, status: 'active' });
    if (!senderAccount) {
      return NextResponse.json({ error: 'Sender account not found or inactive' }, { status: 404 });
    }

    // External bank transfer — no GTB receiver account
    if (transferType === 'external') {
      const { fee, tax } = getTransactionCost(parsedAmount);
      const totalDebit = parsedAmount + fee + tax;

      if (senderAccount.availableBalance < totalDebit) {
        return NextResponse.json({ error: `Insufficient funds. You need $${totalDebit.toLocaleString()} (including $${fee.toFixed(2)} fee)` }, { status: 422 });
      }
      if (parsedAmount > senderAccount.dailyTransferLimit) {
        return NextResponse.json({ error: `Amount exceeds your daily transfer limit of $${senderAccount.dailyTransferLimit.toLocaleString()}` }, { status: 422 });
      }

      const debitTxn = await Transaction.create({
        type:          'transfer',
        direction:     'debit',
        amount:        parsedAmount,
        fee, tax,
        currency:      senderAccount.currency,
        senderAccount: senderAccount._id,
        senderUser:    req.user._id,
        balanceBefore: senderAccount.balance,
        balanceAfter:  senderAccount.balance,
        narration:     narration || `Wire transfer to ${externalDetails?.accountName || 'external account'}`,
        status:        'pending',
        channel:       'web',
        metadata:      { transferType: 'external', externalDetails, toAccountNumber },
      });

      return NextResponse.json({
        message:   'External wire transfer submitted and awaiting admin approval',
        reference: debitTxn.reference,
        amount:    parsedAmount,
        fee, tax,
        recipient: {
          accountNumber: toAccountNumber,
          name: externalDetails?.accountName || 'External Account',
        },
        status: 'pending',
      });
    }

    if (senderAccount.accountNumber === toAccountNumber) {
      return NextResponse.json({ error: 'Cannot transfer to the same account' }, { status: 400 });
    }

    const receiverAccount = await Account.findOne({ accountNumber: toAccountNumber, status: 'active' })
      .populate('user', 'firstName lastName email');
    if (!receiverAccount) {
      return NextResponse.json({ error: 'Destination account not found or inactive' }, { status: 404 });
    }

    // For own-account transfers, no fee
    const isOwnAccount = String(receiverAccount.user._id) === String(req.user._id);
    const { fee, tax } = isOwnAccount ? { fee: 0, tax: 0 } : getTransactionCost(parsedAmount);
    const totalDebit = parsedAmount + fee + tax;

    if (senderAccount.availableBalance < totalDebit) {
      return NextResponse.json(
        { error: `Insufficient funds. You need $${totalDebit.toLocaleString()} (including $${fee.toFixed(2)} fee)` },
        { status: 422 }
      );
    }

    if (parsedAmount > senderAccount.dailyTransferLimit) {
      return NextResponse.json(
        { error: `Amount exceeds your daily transfer limit of $${senderAccount.dailyTransferLimit.toLocaleString()}` },
        { status: 422 }
      );
    }

    // Own-account transfers complete instantly; all others require admin approval
    const requiresApproval = !isOwnAccount;

    if (requiresApproval) {
      // Create PENDING transactions — balances unchanged until admin approves
      const debitTxn = await Transaction.create({
        type:            'transfer',
        direction:       'debit',
        amount:          parsedAmount,
        fee,
        tax,
        currency:        senderAccount.currency,
        senderAccount:   senderAccount._id,
        senderUser:      req.user._id,
        receiverAccount: receiverAccount._id,
        receiverUser:    receiverAccount.user._id,
        balanceBefore:   senderAccount.balance,
        balanceAfter:    senderAccount.balance,
        narration:       narration || `Transfer to ${receiverAccount.accountNumber}`,
        status:          'pending',
        channel:         'web',
        metadata:        { transferType: transferType || 'internal' },
      });

      await Transaction.create({
        type:            'transfer',
        direction:       'credit',
        amount:          parsedAmount,
        fee:             0,
        tax:             0,
        currency:        receiverAccount.currency,
        senderAccount:   senderAccount._id,
        senderUser:      req.user._id,
        receiverAccount: receiverAccount._id,
        receiverUser:    receiverAccount.user._id,
        balanceBefore:   receiverAccount.balance,
        balanceAfter:    receiverAccount.balance,
        reference:       `${debitTxn.reference}C`,
        narration:       narration || `Transfer from ${req.user.firstName} ${req.user.lastName}`,
        status:          'pending',
        channel:         'web',
      });

      return NextResponse.json({
        message:   'Transfer submitted and awaiting admin approval',
        reference: debitTxn.reference,
        amount:    parsedAmount,
        fee,
        tax,
        recipient: {
          accountNumber: receiverAccount.accountNumber,
          name:          `${receiverAccount.user.firstName} ${receiverAccount.user.lastName}`,
        },
        status: 'pending',
      });
    }

    // Own-account transfer — execute immediately with atomic session
    const dbSession = await mongoose.startSession();
    dbSession.startTransaction();
    try {
      const senderBefore   = senderAccount.balance;
      const receiverBefore = receiverAccount.balance;

      senderAccount.balance          -= totalDebit;
      senderAccount.availableBalance -= totalDebit;
      senderAccount.ledgerBalance    -= totalDebit;
      await senderAccount.save({ session: dbSession });

      receiverAccount.balance          += parsedAmount;
      receiverAccount.availableBalance += parsedAmount;
      receiverAccount.ledgerBalance    += parsedAmount;
      await receiverAccount.save({ session: dbSession });

      const debitTxn = new Transaction({
        type:            'transfer',
        direction:       'debit',
        amount:          parsedAmount,
        fee,
        tax,
        currency:        senderAccount.currency,
        senderAccount:   senderAccount._id,
        senderUser:      req.user._id,
        receiverAccount: receiverAccount._id,
        receiverUser:    receiverAccount.user._id,
        balanceBefore:   senderBefore,
        balanceAfter:    senderAccount.balance,
        narration:       narration || `Transfer to ${receiverAccount.accountNumber}`,
        status:          'completed',
        channel:         'web',
        metadata:        { transferType: 'own' },
      });

      await debitTxn.save({ session: dbSession });

      await Transaction.create([{
        type:            'transfer',
        direction:       'credit',
        amount:          parsedAmount,
        fee:             0,
        tax:             0,
        currency:        receiverAccount.currency,
        senderAccount:   senderAccount._id,
        senderUser:      req.user._id,
        receiverAccount: receiverAccount._id,
        receiverUser:    receiverAccount.user._id,
        balanceBefore:   receiverBefore,
        balanceAfter:    receiverAccount.balance,
        reference:       `${debitTxn.reference}C`,
        narration:       narration || `Transfer from ${req.user.firstName} ${req.user.lastName}`,
        status:          'completed',
        channel:         'web',
      }], { session: dbSession });

      await dbSession.commitTransaction();

      return NextResponse.json({
        message:    'Transfer completed successfully',
        reference:  debitTxn.reference,
        amount:     parsedAmount,
        fee,
        tax,
        recipient: {
          accountNumber: receiverAccount.accountNumber,
          name:          `${receiverAccount.user.firstName} ${receiverAccount.user.lastName}`,
        },
        newBalance: senderAccount.balance,
        status:     'completed',
      });
    } catch (err) {
      await dbSession.abortTransaction();
      throw err;
    } finally {
      dbSession.endSession();
    }
  } catch (err) {
    console.error('[TRANSFER]', err);
    return NextResponse.json({ error: 'Transfer failed. Please try again.' }, { status: 500 });
  }
}

export const POST = withAuth(handler);
