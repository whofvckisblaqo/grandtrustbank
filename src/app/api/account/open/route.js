import { NextResponse } from 'next/server';
import { withAuth } from '@/lib/withAuth';
import Account from '@/models/Account';

async function handler(req) {
  try {
    const body = await req.json();
    const { accountType } = body;

    const validTypes = ['savings', 'current', 'fixed-deposit', 'domiciliary'];
    if (!validTypes.includes(accountType)) {
      return NextResponse.json({ error: 'Invalid account type' }, { status: 400 });
    }

    const existing = await Account.findOne({ user: req.user._id, accountType, status: { $ne: 'closed' } });
    if (existing) {
      const label = accountType === 'current' ? 'Checking' : accountType;
      return NextResponse.json({ error: `You already have a ${label} account` }, { status: 409 });
    }

    const account = await Account.create({
      user: req.user._id,
      accountType,
      isPrimary: false,
    });

    return NextResponse.json({ account }, { status: 201 });
  } catch (err) {
    console.error('[ACCOUNT/OPEN]', err);
    return NextResponse.json({ error: 'Failed to open account. Please try again.' }, { status: 500 });
  }
}

export const POST = withAuth(handler);
