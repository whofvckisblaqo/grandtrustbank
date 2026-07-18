import { NextResponse } from 'next/server';
import { withAuth } from '@/lib/withAuth';
import Account from '@/models/Account';
import Transaction from '@/models/Transaction';

async function handler(req) {
  const { searchParams } = new URL(req.url);
  const page     = Math.max(1, parseInt(searchParams.get('page')   || '1'));
  const limit    = Math.min(100, parseInt(searchParams.get('limit') || '20'));
  const type      = searchParams.get('type');
  const direction = searchParams.get('direction');
  const status    = searchParams.get('status');
  const from      = searchParams.get('from');
  const to        = searchParams.get('to');
  const skip     = (page - 1) * limit;

  const userAccounts = await Account.find({ user: req.user._id }).select('_id');
  const accountIds   = userAccounts.map(a => a._id);

  const filter = {
    $or: [{ senderAccount: { $in: accountIds } }, { receiverAccount: { $in: accountIds } }],
  };

  if (type)      filter.type      = type;
  if (direction) filter.direction = direction;
  if (status)    filter.status    = status;
  if (from || to) {
    filter.createdAt = {};
    if (from) filter.createdAt.$gte = new Date(from);
    if (to)   filter.createdAt.$lte = new Date(new Date(to).setHours(23, 59, 59, 999));
  }

  const [transactions, total] = await Promise.all([
    Transaction.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('senderUser',   'firstName lastName')
      .populate('receiverUser', 'firstName lastName')
      .populate('senderAccount',   'accountNumber accountType')
      .populate('receiverAccount', 'accountNumber accountType'),
    Transaction.countDocuments(filter),
  ]);

  return NextResponse.json({
    transactions,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
}

export const GET = withAuth(handler);