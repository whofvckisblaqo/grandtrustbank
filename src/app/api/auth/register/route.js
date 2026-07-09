import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import Account from '@/models/Account';
import Card from '@/models/Card';
import bcrypt from 'bcryptjs';
import { sendOtpEmail } from '@/lib/email';

export const maxDuration = 30;

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

    // Generate 6-digit OTP, hashed before storage
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    const otpHash = await bcrypt.hash(otp, 10);
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    const user = await User.create({
      firstName, lastName, email, phone, password,
      dateOfBirth: new Date(dateOfBirth),
      isVerified: false,
      otpCode: otpHash,
      otpExpiresAt,
    });

    // Accounts and card are pre-created so they're ready the moment OTP is verified
    const [savings, checking] = await Promise.all([
      Account.create({ user: user._id, accountType: 'savings', isPrimary: true }),
      Account.create({ user: user._id, accountType: 'current', isPrimary: false }),
    ]);

    const cardName = `${firstName} ${lastName}`.toUpperCase();
    await Card.create({ user: user._id, account: savings._id, cardType: 'debit', network: 'visa', cardName });

    // OTP delivery is critical to this flow — actually wait for it and surface failure
    const emailResult = await sendOtpEmail({
      to: user.email,
      name: `${firstName} ${lastName}`,
      otp,
    });

    if (!emailResult.success) {
      console.error('[OTP_EMAIL]', emailResult.error);
      // User + accounts already exist, so don't block them — they can use "Resend code" on the verify page
      return NextResponse.json(
        {
          message: 'Account created, but we had trouble sending your verification code. Use "Resend code" on the next page.',
          email: user.email,
          requiresVerification: true,
        },
        { status: 201 }
      );
    }

    return NextResponse.json(
      {
        message: 'Account created. Please verify your email with the code we sent.',
        email: user.email,
        requiresVerification: true,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error('[REGISTER]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}