import { NextResponse } from 'next/server';
import { withAuth } from '@/lib/withAuth';
import Account from '@/models/Account';

async function handler(req) {
  const { searchParams } = new URL(req.url);
  const accountNumber = searchParams.get('accountNumber');

  if (!accountNumber) {
    return NextResponse.json({ error: 'accountNumber is required' }, { status: 400 });
  }

  const account = await Account.findOne({ accountNumber, status: 'active' })
    .populate('user', 'firstName lastName');

  if (!account) {
    return NextResponse.json({ error: 'Account not found' }, { status: 404 });
  }

  return NextResponse.json({
    accountNumber: account.accountNumber,
    accountType:   account.accountType,
    name: `${account.user.firstName} ${account.user.lastName}`,
  });
}

export const GET = withAuth(handler);
