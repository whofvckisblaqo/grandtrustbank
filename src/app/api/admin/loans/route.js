import { NextResponse } from 'next/server';
import { withAdminAuth } from '@/lib/withAdminAuth';
import Loan from '@/models/Loan';
import User from '@/models/User';

async function handler(req) {
  const { searchParams } = new URL(req.url);
  const page   = parseInt(searchParams.get('page')   || '1');
  const limit  = parseInt(searchParams.get('limit')  || '20');
  const status = searchParams.get('status') || '';
  const type   = searchParams.get('type')   || '';

  const filter = {};
  if (status) filter.status = status;
  if (type)   filter.type   = type;

  const [loans, total] = await Promise.all([
    Loan.find(filter)
      .populate('user', 'firstName lastName email phone')
      .populate('creditedAccount', 'accountNumber accountType')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Loan.countDocuments(filter),
  ]);

  return NextResponse.json({ loans, pagination: { total, page, pages: Math.ceil(total / limit) } });
}

export const GET = withAdminAuth(handler);
