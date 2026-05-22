import { NextResponse } from 'next/server';
import { withAuth } from '@/lib/withAuth';
import Account from '@/models/Account';
import Transaction from '@/models/Transaction';

async function handler(req, { params }) {
  const { id } = await params;

  const account = await Account.findOne({ _id: id, user: req.user._id });
  if (!account) {
    return NextResponse.json({ error: 'Account not found' }, { status: 404 });
  }

  const { searchParams } = new URL(req.url);
  const page  = Math.max(1, parseInt(searchParams.get('page')  || '1'));
  const limit = Math.min(50, parseInt(searchParams.get('limit') || '10'));
  const skip  = (page - 1) * limit;

  const filter = {
    $or: [{ senderAccount: account._id }, { receiverAccount: account._id }],
    status: 'completed',
  };

  const [transactions, total] = await Promise.all([
    Transaction.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('senderUser', 'firstName lastName')
      .populate('receiverUser', 'firstName lastName'),
    Transaction.countDocuments(filter),
  ]);

  return NextResponse.json({
    account,
    transactions,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
}

export const GET = withAuth(handler);
