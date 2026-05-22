import { NextResponse } from 'next/server';
import { withAuth } from '@/lib/withAuth';
import CryptoTransaction from '@/models/CryptoTransaction';

async function handler(req, _ctx, userId) {
  const { searchParams } = new URL(req.url);
  const page  = parseInt(searchParams.get('page')  || '1');
  const limit = parseInt(searchParams.get('limit') || '20');

  const [txns, total] = await Promise.all([
    CryptoTransaction.find({ user: userId })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    CryptoTransaction.countDocuments({ user: userId }),
  ]);

  return NextResponse.json({ transactions: txns, pagination: { total, page, pages: Math.ceil(total / limit) } });
}

export const GET = withAuth(handler);
