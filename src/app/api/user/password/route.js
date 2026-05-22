import { NextResponse } from 'next/server';
import { withAuth } from '@/lib/withAuth';
import User from '@/models/User';

async function handler(req) {
  const { currentPassword, newPassword } = await req.json();

  if (!currentPassword || !newPassword) {
    return NextResponse.json({ error: 'Both fields are required' }, { status: 400 });
  }
  if (newPassword.length < 8) {
    return NextResponse.json({ error: 'New password must be at least 8 characters' }, { status: 400 });
  }

  const user = await User.findById(req.user._id).select('+password');
  const valid = await user.comparePassword(currentPassword);
  if (!valid) {
    return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 });
  }

  user.password = newPassword;
  await user.save();
  return NextResponse.json({ message: 'Password changed successfully' });
}

export const PATCH = withAuth(handler);
