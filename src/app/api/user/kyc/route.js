import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { withAuth } from '@/lib/withAuth';
import User from '@/models/User';

async function handler(req) {
  try {
    await connectDB();
    const { idType, frontImageUrl, backImageUrl } = await req.json();

    const validTypes = ['passport', 'drivers_license', 'national_id'];
    if (!validTypes.includes(idType)) {
      return NextResponse.json({ error: 'Invalid ID type' }, { status: 400 });
    }
    if (!frontImageUrl || !backImageUrl) {
      return NextResponse.json({ error: 'Both front and back images are required' }, { status: 400 });
    }

    const user = await User.findById(req.user._id);
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    if (user.kycStatus === 'verified') {
      return NextResponse.json({ error: 'Your identity is already verified' }, { status: 400 });
    }

    user.kycDocuments.push({
      idType,
      frontImageUrl,
      backImageUrl,
      submittedAt: new Date(),
    });
    user.kycStatus = 'pending';
    await user.save();

    return NextResponse.json({ message: 'KYC submitted successfully. Review usually takes 1-2 business days.' });
  } catch (err) {
    console.error('[KYC_SUBMIT]', err);
    return NextResponse.json({ error: 'Submission failed. Please try again.' }, { status: 500 });
  }
}

export const POST = withAuth(handler);