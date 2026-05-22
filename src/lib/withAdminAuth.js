import { NextResponse } from 'next/server';
import { getAdminSession } from './adminAuth';
import { connectDB } from './mongodb';

export function withAdminAuth(handler) {
  return async function (req, context) {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Admin authentication required' }, { status: 401 });
    }
    await connectDB();
    return handler(req, context);
  };
}
