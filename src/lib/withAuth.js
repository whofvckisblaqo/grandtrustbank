import { NextResponse } from 'next/server';
import { getSessionUser } from './auth';
import { connectDB } from './mongodb';
import User from '@/models/User';

export function withAuth(handler) {
  return async function (req, context) {
    const session = await getSessionUser();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const user = await User.findById(session.userId);

    if (!user || !user.isActive || user.isSuspended) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    req.user = user;
    return handler(req, context);
  };
}
