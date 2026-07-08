import { NextResponse } from 'next/server';
import { withAdminAuth } from '@/lib/withAdminAuth';
import User from '@/models/User';
import Account from '@/models/Account';
import Transaction from '@/models/Transaction';
import { sendDepositApprovedEmail, sendAccountStatusEmail } from '@/lib/email';

async function getHandler(req, { params }) {
  try {
    const { id } = await params;
    const user = await User.findById(id).select('-password -pin -twoFactorSecret');
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    const accounts = await Account.find({ user: id, status: { $ne: 'closed' } });
    return NextResponse.json({ user, accounts });
  } catch (err) {
    console.error('[ADMIN/USERS/GET]', err);
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
  }
}

async function patchHandler(req, { params }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { action, creditAmount, accountId } = body;

    const user = await User.findById(id);
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    if (action === 'approve_kyc') {
      user.kycStatus = 'verified';
      await user.save();
      return NextResponse.json({ message: 'KYC approved' });
    }

    if (action === 'reject_kyc') {
      user.kycStatus = 'rejected';
      await user.save();
      return NextResponse.json({ message: 'KYC rejected' });
    }

    if (action === 'suspend') {
      user.isSuspended = true;
      await user.save();

      const accounts = await Account.find({ user: id, status: { $ne: 'closed' } });
      for (const acct of accounts) {
        sendAccountStatusEmail({
          to: user.email,
          name: `${user.firstName} ${user.lastName}`,
          status: 'frozen',
          accountNumber: acct.accountNumber,
        }).catch((err) => console.error('[ACCOUNT_FROZEN_EMAIL]', err));
      }

      return NextResponse.json({ message: 'User suspended' });
    }

    if (action === 'activate') {
      user.isSuspended = false;
      user.isActive    = true;
      await user.save();

      const accounts = await Account.find({ user: id, status: { $ne: 'closed' } });
      for (const acct of accounts) {
        sendAccountStatusEmail({
          to: user.email,
          name: `${user.firstName} ${user.lastName}`,
          status: 'unfrozen',
          accountNumber: acct.accountNumber,
        }).catch((err) => console.error('[ACCOUNT_UNFROZEN_EMAIL]', err));
      }

      return NextResponse.json({ message: 'User activated' });
    }

    if (action === 'credit') {
      const amount = parseFloat(creditAmount);
      if (!amount || amount <= 0) {
        return NextResponse.json({ error: 'Amount must be greater than zero' }, { status: 400 });
      }
      if (!accountId) {
        return NextResponse.json({ error: 'Account is required' }, { status: 400 });
      }

      const account = await Account.findOne({ _id: accountId, user: id });
      if (!account) {
        return NextResponse.json({ error: 'Account not found for this user' }, { status: 404 });
      }

      const before = account.balance;
      account.balance          += amount;
      account.availableBalance += amount;
      account.ledgerBalance    += amount;
      await account.save();

      await Transaction.create({
        type:            'deposit',
        direction:       'credit',
        amount,
        currency:        account.currency,
        receiverAccount: account._id,
        receiverUser:    user._id,
        balanceBefore:   before,
        balanceAfter:    account.balance,
        narration:       'Admin credit',
        status:          'completed',
        channel:         'admin',
      });

      sendDepositApprovedEmail({
        to: user.email,
        name: `${user.firstName} ${user.lastName}`,
        amount,
        currency: account.currency,
        newBalance: account.balance,
      }).catch((err) => console.error('[DEPOSIT_APPROVED_EMAIL]', err));

      return NextResponse.json({
        message:    `${fmt(amount)} credited to ${account.accountNumber}`,
        newBalance: account.balance,
      });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (err) {
    console.error('[ADMIN/USERS/PATCH]', err);
    return NextResponse.json({ error: 'Action failed. Please try again.' }, { status: 500 });
  }
}

function fmt(n) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);
}

export const GET   = withAdminAuth(getHandler);
export const PATCH = withAdminAuth(patchHandler);