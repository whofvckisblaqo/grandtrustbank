import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import Account from '@/models/Account';
import Card from '@/models/Card';
import { signToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const { firstName, lastName, email, phone, password, dateOfBirth } = body;

    if (!firstName || !lastName || !email || !phone || !password || !dateOfBirth) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
    }

    const existing = await User.findOne({ $or: [{ email }, { phone }] });
    if (existing) {
      const field = existing.email === email.toLowerCase() ? 'Email' : 'Phone number';
      return NextResponse.json({ error: `${field} is already registered` }, { status: 409 });
    }

    const user = await User.create({ firstName, lastName, email, phone, password, dateOfBirth: new Date(dateOfBirth) });

    // Create savings (primary) + checking accounts
    const [savings, checking] = await Promise.all([
      Account.create({ user: user._id, accountType: 'savings', isPrimary: true }),
      Account.create({ user: user._id, accountType: 'current', isPrimary: false }),
    ]);

    // Auto-create a Visa debit card for savings
    const cardName = `${firstName} ${lastName}`.toUpperCase();
    await Card.create({ user: user._id, account: savings._id, cardType: 'debit', network: 'visa', cardName });

    const token = signToken({ userId: user._id, email: user.email });
    const cookieStore = await cookies();
    cookieStore.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return NextResponse.json(
      {
        message: 'Account created successfully',
        user: user.toJSON(),
        accounts: [
          { accountNumber: savings.accountNumber, accountType: 'savings', balance: 0, currency: 'USD' },
          { accountNumber: checking.accountNumber, accountType: 'current', balance: 0, currency: 'USD' },
        ],
      },
      { status: 201 }
    );
  } catch (err) {
    console.error('[REGISTER]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
