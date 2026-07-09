import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { withAdminAuth } from '@/lib/withAdminAuth';
import Transaction from '@/models/Transaction';
import Account from '@/models/Account';
import { sendTransferSentEmail, sendTransferReceivedEmail, sendTransferDeclinedEmail } from '@/lib/email';

export const maxDuration = 30;

async function handler(req, { params }) {
  try {
    const { ref } = await params;
    const { action, reason } = await req.json();

    if (!['approve', 'reject'].includes(action)) {
      return NextResponse.json({ error: 'action must be approve or reject' }, { status: 400 });
    }

    const debitTxn = await Transaction.findOne({ reference: ref, direction: 'debit', status: 'pending' })
      .populate('senderUser', 'firstName lastName email');
    if (!debitTxn) {
      return NextResponse.json({ error: 'Pending transfer not found' }, { status: 404 });
    }

    const creditTxn = await Transaction.findOne({ reference: `${ref}C`, direction: 'credit', status: 'pending' });

    if (action === 'reject') {
      debitTxn.status = 'failed';
      debitTxn.failureReason = reason || 'Rejected by administrator';
      await debitTxn.save();
      if (creditTxn) {
        creditTxn.status = 'failed';
        creditTxn.failureReason = reason || 'Rejected by administrator';
        await creditTxn.save();
      }

      if (debitTxn.senderUser?.email) {
        try {
          await sendTransferDeclinedEmail({
            to: debitTxn.senderUser.email,
            name: `${debitTxn.senderUser.firstName} ${debitTxn.senderUser.lastName}`,
            amount: debitTxn.amount,
            currency: debitTxn.currency,
            reference: debitTxn.reference,
            reason,
          });
        } catch (err) {
          console.error('[TRANSFER_DECLINED_EMAIL]', err);
        }
      }

      return NextResponse.json({ message: 'Transfer rejected' });
    }

    // Approve — execute the actual balance changes atomically
    const isExternal = debitTxn.metadata?.transferType === 'external';
    const senderAccount = await Account.findById(debitTxn.senderAccount);

    if (!senderAccount) {
      return NextResponse.json({ error: 'Sender account not found' }, { status: 404 });
    }

    const receiverAccount = isExternal
      ? null
      : await Account.findById(debitTxn.receiverAccount).populate('user', 'firstName lastName email');
    if (!isExternal && !receiverAccount) {
      return NextResponse.json({ error: 'Receiver account not found' }, { status: 404 });
    }

    const totalDebit = debitTxn.amount + debitTxn.fee + debitTxn.tax;

    if (senderAccount.availableBalance < totalDebit) {
      return NextResponse.json({ error: 'Sender has insufficient funds at time of approval' }, { status: 422 });
    }

    const dbSession = await mongoose.startSession();
    dbSession.startTransaction();

    try {
      const senderBefore = senderAccount.balance;

      senderAccount.balance          -= totalDebit;
      senderAccount.availableBalance -= totalDebit;
      senderAccount.ledgerBalance    -= totalDebit;
      await senderAccount.save({ session: dbSession });

      if (receiverAccount) {
        const receiverBefore = receiverAccount.balance;
        receiverAccount.balance          += debitTxn.amount;
        receiverAccount.availableBalance += debitTxn.amount;
        receiverAccount.ledgerBalance    += debitTxn.amount;
        await receiverAccount.save({ session: dbSession });

        if (creditTxn) {
          creditTxn.status        = 'completed';
          creditTxn.balanceBefore = receiverBefore;
          creditTxn.balanceAfter  = receiverAccount.balance;
          await creditTxn.save({ session: dbSession });
        }
      }

      debitTxn.status       = 'completed';
      debitTxn.balanceBefore = senderBefore;
      debitTxn.balanceAfter  = senderAccount.balance;
      await debitTxn.save({ session: dbSession });

      await dbSession.commitTransaction();

      if (debitTxn.senderUser?.email) {
        try {
          await sendTransferSentEmail({
            to: debitTxn.senderUser.email,
            name: `${debitTxn.senderUser.firstName} ${debitTxn.senderUser.lastName}`,
            amount: debitTxn.amount,
            currency: debitTxn.currency,
            recipientName: receiverAccount
              ? `${receiverAccount.user.firstName} ${receiverAccount.user.lastName}`
              : (debitTxn.metadata?.externalDetails?.accountName || 'External Account'),
            accountNumber: senderAccount.accountNumber,
            newBalance: senderAccount.balance,
          });
        } catch (err) {
          console.error('[TRANSFER_SENT_EMAIL]', err);
        }
      }

      if (receiverAccount?.user?.email) {
        try {
          await sendTransferReceivedEmail({
            to: receiverAccount.user.email,
            name: `${receiverAccount.user.firstName} ${receiverAccount.user.lastName}`,
            amount: debitTxn.amount,
            currency: debitTxn.currency,
            senderName: `${debitTxn.senderUser.firstName} ${debitTxn.senderUser.lastName}`,
            accountNumber: receiverAccount.accountNumber,
            newBalance: receiverAccount.balance,
          });
        } catch (err) {
          console.error('[TRANSFER_RECEIVED_EMAIL]', err);
        }
      }

      return NextResponse.json({ message: 'Transfer approved and completed' });
    } catch (err) {
      await dbSession.abortTransaction();
      throw err;
    } finally {
      dbSession.endSession();
    }
  } catch (err) {
    console.error('[ADMIN/TRANSFERS/APPROVE]', err);
    return NextResponse.json({ error: 'Action failed. Please try again.' }, { status: 500 });
  }
}

export const PATCH = withAdminAuth(handler);