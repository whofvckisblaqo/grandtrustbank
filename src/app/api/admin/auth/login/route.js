import { NextResponse } from 'next/server';
import { signAdminToken } from '@/lib/adminAuth';

export async function POST(req) {
  try {
    const { username, password } = await req.json();

    const validUsername = process.env.ADMIN_USERNAME || 'admin';
    const validPassword = process.env.ADMIN_PASSWORD || 'Admin@GTB2026!';

    if (username !== validUsername || password !== validPassword) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const token = signAdminToken();

    const res = NextResponse.json({ message: 'Admin login successful' });
    res.cookies.set('admin-token', token, {
      httpOnly: true,
      secure:   process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge:   60 * 60 * 8, // 8 hours
      path:     '/',
    });
    return res;
  } catch (err) {
    console.error('[ADMIN/LOGIN]', err);
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}
