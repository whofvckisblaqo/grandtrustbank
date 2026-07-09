import { NextResponse } from 'next/server';
import { withAdminAuth } from '@/lib/withAdminAuth';
import User from '@/models/User';
import Account from '@/models/Account';
import Card from '@/models/Card';
import Loan from '@/models/Loan';
import Transaction from '@/models/Transaction';
import { sendDepositApprovedEmail, sendAccountStatusEmail, sendKycStatusEmail } from '@/lib/email';

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
    const { action, creditAmount, accountId, reason } = body;

    const user = await User.findById(id);
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    if (action === 'approve_kyc') {
      user.kycStatus = 'verified';
      if (user.kycDocuments.length > 0) {
        user.kycDocuments[user.kycDocuments.length - 1].reviewedAt = new Date();
      }
      await user.save();

      sendKycStatusEmail({
        to: user.email,
        name: `${user.firstName} ${user.lastName}`,
        status: 'verified',
      }).catch((err) => console.error('[KYC_APPROVED_EMAIL]', err));

      return NextResponse.json({ message: 'KYC approved' });
    }

    if (action === 'reject_kyc') {
      user.kycStatus = 'rejected';
      if (user.kycDocuments.length > 0) {
        const lastDoc = user.kycDocuments[user.kycDocuments.length - 1];
        lastDoc.reviewedAt = new Date();
        lastDoc.rejectionReason = reason || '';
      }
      await user.save();

      sendKycStatusEmail({
        to: user.email,
        name: `${user.firstName} ${user.lastName}`,
        status: 'rejected',
        reason,
      }).catch((err) => console.error('[KYC_REJECTED_EMAIL]', err));

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

async function deleteHandler(req, { params }) {
  try {
    const { id } = await params;

    const user = await User.findById(id);
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const accounts = await Account.find({ user: id });
    const accountIds = accounts.map((a) => a._id);

    // Transactions where this user was BOTH sender and receiver (e.g. admin credits,
    // own-account transfers) are safe to fully delete.
    await Transaction.deleteMany({
      $and: [
        { $or: [{ senderUser: id }, { senderUser: null }] },
        { $or: [{ receiverUser: id }, { receiverUser: null }] },
        { $or: [{ senderAccount: { $in: accountIds } }, { senderAccount: null }] },
        { $or: [{ receiverAccount: { $in: accountIds } }, { receiverAccount: null }] },
      ],
    });

    // For transactions involving another party, keep the record for the other user's
    // history but strip this user's identifying references.
    await Transaction.updateMany(
      { senderUser: id },
      { $set: { senderUser: null, senderAccount: null } }
    );
    await Transaction.updateMany(
      { receiverUser: id },
      { $set: { receiverUser: null, receiverAccount: null } }
    );

    await Promise.all([
      Card.deleteMany({ user: id }),
      Account.deleteMany({ user: id }),
      Loan.deleteMany({ user: id }),
    ]);

    await User.findByIdAndDelete(id);

    return NextResponse.json({ message: 'User and all associated data permanently deleted' });
  } catch (err) {
    console.error('[ADMIN/USERS/DELETE]', err);
    return NextResponse.json({ error: 'Failed to delete user. Please try again.' }, { status: 500 });
  }
}

function fmt(n) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);
}

export const GET    = withAdminAuth(getHandler);
export const PATCH  = withAdminAuth(patchHandler);
export const DELETE = withAdminAuth(deleteHandler);