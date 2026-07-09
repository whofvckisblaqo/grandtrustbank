import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { sendOtpEmail } from '@/lib/email';

export const maxDuration = 30;

export async function POST(req) {
  try {
    await connectDB();
    const { email } = await req.json();
    if (!email) return NextResponse.json({ error: 'Email is required' }, { status: 400 });

    const user = await User.findOne({ email }).select('+otpCode +otpExpiresAt');
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    if (user.isVerified) return NextResponse.json({ error: 'Account already verified' }, { status: 400 });

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.otpCode = await bcrypt.hash(otp, 10);
    user.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    const emailResult = await sendOtpEmail({
      to: user.email,
      name: `${user.firstName} ${user.lastName}`,
      otp,
    });

    if (!emailResult.success) {
      console.error('[OTP_RESEND_EMAIL]', emailResult.error);
      return NextResponse.json({ error: 'Failed to send email. Please try again.' }, { status: 500 });
    }

    return NextResponse.json({ message: 'A new code has been sent to your email' });
  } catch (err) {
    console.error('[RESEND_OTP]', err);
    return NextResponse.json({ error: 'Failed to resend code. Please try again.' }, { status: 500 });
  }
}