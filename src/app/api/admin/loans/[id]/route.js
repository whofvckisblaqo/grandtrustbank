import { NextResponse } from 'next/server';
import { withAdminAuth } from '@/lib/withAdminAuth';
import Loan from '@/models/Loan';
import Account from '@/models/Account';
import Transaction from '@/models/Transaction';

async function handler(req, { params }) {
  const { id } = params;
  const { action, adminNotes, accountId } = await req.json();

  const loan = await Loan.findById(id).populate('user', 'firstName lastName email');
  if (!loan) return NextResponse.json({ error: 'Loan not found' }, { status: 404 });

  if (loan.status !== 'pending')
    return NextResponse.json({ error: 'Only pending loans can be actioned' }, { status: 400 });

  if (action === 'approve') {
    // Find target account
    const acctQuery = accountId
      ? Account.findOne({ _id: accountId, user: loan.user })
      : Account.findOne({ user: loan.user, status: 'active' });
    const account = await acctQuery;
    if (!account) return NextResponse.json({ error: 'No active account found for user' }, { status: 404 });

    account.balance         += loan.amount;
    account.availableBalance += loan.amount;
    account.ledgerBalance   += loan.amount;
    await account.save();

    await Transaction.create({
      type:          'deposit',
      direction:     'credit',
      amount:        loan.amount,
      narration:     `${loan.type.charAt(0).toUpperCase() + loan.type.slice(1)} loan disbursement`,
      status:        'completed',
      channel:       'admin',
      senderAccount: null,
      receiverAccount: account._id,
      reference:     `LOAN-DISB-${loan._id}`,
      metadata:      { loanId: loan._id, loanType: loan.type },
    });

    loan.status          = 'approved';
    loan.adminNotes      = adminNotes || '';
    loan.approvedAt      = new Date();
    loan.creditedAccount = account._id;
    await loan.save();

    return NextResponse.json({ message: `Loan approved and $${loan.amount.toLocaleString()} credited` });
  }

  if (action === 'reject') {
    loan.status     = 'rejected';
    loan.adminNotes = adminNotes || '';
    loan.rejectedAt = new Date();
    await loan.save();
    return NextResponse.json({ message: 'Loan application rejected' });
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}

export const PATCH = withAdminAuth(handler);
