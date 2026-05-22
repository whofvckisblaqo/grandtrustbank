import { NextResponse } from 'next/server';
import { withAdminAuth } from '@/lib/withAdminAuth';
import Transaction from '@/models/Transaction';

async function handler(req) {
  try {
    const { searchParams } = new URL(req.url);
    const page      = Math.max(1, parseInt(searchParams.get('page')   || '1'));
    const limit     = Math.min(100, parseInt(searchParams.get('limit') || '20'));
    const status    = searchParams.get('status') || '';
    const type      = searchParams.get('type')   || '';
    const direction = searchParams.get('direction') || '';
    const search    = searchParams.get('search') || '';
    const skip      = (page - 1) * limit;

    const filter = {};
    if (status)    filter.status    = status;
    if (type)      filter.type      = type;
    if (direction) filter.direction = direction;
    if (search)    filter.reference = { $regex: search, $options: 'i' };

    const [transactions, total] = await Promise.all([
      Transaction.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('senderUser',   'firstName lastName email')
        .populate('receiverUser', 'firstName lastName email')
        .populate('senderAccount',   'accountNumber accountType')
        .populate('receiverAccount', 'accountNumber accountType'),
      Transaction.countDocuments(filter),
    ]);

    return NextResponse.json({ transactions, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (err) {
    console.error('[ADMIN/TRANSACTIONS]', err);
    return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 });
  }
}

export const GET = withAdminAuth(handler);
