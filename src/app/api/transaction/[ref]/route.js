import { NextResponse } from 'next/server';
import { withAuth } from '@/lib/withAuth';
import Account from '@/models/Account';
import Transaction from '@/models/Transaction';

async function handler(req, { params }) {
  const { ref } = await params;

  const userAccounts = await Account.find({ user: req.user._id }).select('_id');
  const accountIds   = userAccounts.map(a => a._id);

  const txn = await Transaction.findOne({
    reference: ref,
    $or: [{ senderAccount: { $in: accountIds } }, { receiverAccount: { $in: accountIds } }],
  })
    .populate('senderUser',      'firstName lastName email')
    .populate('receiverUser',    'firstName lastName email')
    .populate('senderAccount',   'accountNumber accountType')
    .populate('receiverAccount', 'accountNumber accountType');

  if (!txn) {
    return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
  }

  return NextResponse.json({ transaction: txn });
}

export const GET = withAuth(handler);
