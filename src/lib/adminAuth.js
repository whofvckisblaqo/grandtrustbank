import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const ADMIN_SECRET = process.env.ADMIN_JWT_SECRET || process.env.JWT_SECRET + '_admin';

export function signAdminToken() {
  return jwt.sign({ role: 'admin' }, ADMIN_SECRET, { expiresIn: '8h' });
}

export function verifyAdminToken(token) {
  try {
    return jwt.verify(token, ADMIN_SECRET);
  } catch {
    return null;
  }
}

export async function getAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin-token')?.value;
  if (!token) return null;
  const payload = verifyAdminToken(token);
  if (!payload || payload.role !== 'admin') return null;
  return payload;
}
