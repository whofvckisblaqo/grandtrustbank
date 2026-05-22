import { NextResponse } from 'next/server';
import { withAuth } from '@/lib/withAuth';
import Account from '@/models/Account';

async function handler(req) {
  const accounts = await Account.find({ user: req.user._id, status: { $ne: 'closed' } }).sort({ isPrimary: -1 });
  return NextResponse.json({ user: req.user.toJSON(), accounts });
}

export const GET = withAuth(handler);
