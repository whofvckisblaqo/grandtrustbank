import { NextResponse } from 'next/server';
import { withAuth } from '@/lib/withAuth';
import Loan from '@/models/Loan';

async function handler(req, _ctx, userId) {
  const loans = await Loan.find({ user: userId }).sort({ createdAt: -1 });
  return NextResponse.json({ loans });
}

export const GET = withAuth(handler);
