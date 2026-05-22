import { NextResponse } from 'next/server';
import { withAuth } from '@/lib/withAuth';
import User from '@/models/User';

async function handler(req) {
  try {
    const body = await req.json();
    const { firstName, lastName, phone, address } = body;

    if (!firstName?.trim() || !lastName?.trim()) {
      return NextResponse.json({ error: 'First and last name are required' }, { status: 400 });
    }

    const updates = {
      firstName: firstName.trim(),
      lastName:  lastName.trim(),
    };

    if (phone?.trim()) updates.phone = phone.trim();
    if (address)       updates.address = address;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    return NextResponse.json({
      message: 'Profile updated successfully',
      user: {
        firstName: user.firstName,
        lastName:  user.lastName,
        email:     user.email,
        phone:     user.phone,
        address:   user.address,
        dateOfBirth: user.dateOfBirth,
        kycStatus: user.kycStatus,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    console.error('[USER/PROFILE]', err);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}

export const PATCH = withAuth(handler);
