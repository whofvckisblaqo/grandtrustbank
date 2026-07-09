import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import Account from '@/models/Account';
import Card from '@/models/Card';
import bcrypt from 'bcryptjs';
import { signToken } from '@/lib/auth';
import { cookies } from 'next/headers';
import { sendWelcomeEmail, sendCardActivityEmail } from '@/lib/email';

export const maxDuration = 30;

export async function POST(req) {
  try {
    await connectDB();
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json({ error: 'Email and code are required' }, { status: 400 });
    }

    const user = await User.findOne({ email }).select('+otpCode +otpExpiresAt');
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    if (user.isVerified) {
      return NextResponse.json({ error: 'Account already verified' }, { status: 400 });
    }
    if (!user.otpCode || !user.otpExpiresAt || user.otpExpiresAt < new Date()) {
      return NextResponse.json({ error: 'Code expired. Please request a new one.' }, { status: 400 });
    }

    const isValid = await bcrypt.compare(otp, user.otpCode);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid code' }, { status: 400 });
    }

    user.isVerified = true;
    user.otpCode = undefined;
    user.otpExpiresAt = undefined;
    await user.save();

    const token = signToken({ userId: user._id, email: user.email });
    const cookieStore = await cookies();
    cookieStore.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    const savings = await Account.findOne({ user: user._id, accountType: 'savings' });
    const checking = await Account.findOne({ user: user._id, accountType: 'current' });
    const card = await Card.findOne({ user: user._id });

    // Non-critical emails — wait for them so Vercel doesn't kill them mid-flight,
    // but a failure here shouldn't block verification from succeeding.
    try {
      await sendWelcomeEmail({
        to: user.email,
        name: `${user.firstName} ${user.lastName}`,
        accountNumbers: [
          { type: 'Savings', number: savings?.accountNumber },
          { type: 'Checking', number: checking?.accountNumber },
        ],
      });
    } catch (err) {
      console.error('[WELCOME_EMAIL]', err);
    }

    if (card) {
      try {
        await sendCardActivityEmail({
          to: user.email,
          name: `${user.firstName} ${user.lastName}`,
          action: 'issued',
          cardLast4: card.cardNumber ? card.cardNumber.slice(-4) : '****',
        });
      } catch (err) {
        console.error('[CARD_ISSUED_EMAIL]', err);
      }
    }

    return NextResponse.json({
      message: 'Email verified successfully',
      user: user.toJSON(),
      accounts: [
        { accountNumber: savings?.accountNumber, accountType: 'savings', balance: 0, currency: 'USD' },
        { accountNumber: checking?.accountNumber, accountType: 'current', balance: 0, currency: 'USD' },
      ],
    });
  } catch (err) {
    console.error('[VERIFY_OTP]', err);
    return NextResponse.json({ error: 'Verification failed. Please try again.' }, { status: 500 });
  }
}