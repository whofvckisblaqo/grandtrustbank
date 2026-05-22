import { NextResponse } from 'next/server';
import { withAdminAuth } from '@/lib/withAdminAuth';
import Transaction from '@/models/Transaction';

async function handler(req) {
  try {
    const transfers = await Transaction.find({
      direction: 'debit',
      status: 'pending',
      type: 'transfer',
    })
      .sort({ createdAt: -1 })
      .populate('senderUser',    'firstName lastName email')
      .populate('receiverUser',  'firstName lastName email')
      .populate('senderAccount',   'accountNumber accountType')
      .populate('receiverAccount', 'accountNumber accountType');

    return NextResponse.json({ transfers });
  } catch (err) {
    console.error('[ADMIN/TRANSFERS]', err);
    return NextResponse.json({ error: 'Failed to fetch transfers' }, { status: 500 });
  }
}

export const GET = withAdminAuth(handler);
