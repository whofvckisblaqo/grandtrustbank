import { NextResponse } from 'next/server';
import { withAdminAuth } from '@/lib/withAdminAuth';
import User from '@/models/User';
import Account from '@/models/Account';

async function handler(req) {
  try {
    const { searchParams } = new URL(req.url);
    const page     = Math.max(1, parseInt(searchParams.get('page')  || '1'));
    const limit    = Math.min(50, parseInt(searchParams.get('limit') || '20'));
    const search   = searchParams.get('search') || '';
    const kyc      = searchParams.get('kyc') || '';
    const skip     = (page - 1) * limit;

    const filter = {};
    if (kyc) filter.kycStatus = kyc;
    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName:  { $regex: search, $options: 'i' } },
        { email:     { $regex: search, $options: 'i' } },
        { phone:     { $regex: search, $options: 'i' } },
      ];
    }

    const [users, total] = await Promise.all([
      User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).select('-password -pin -twoFactorSecret'),
      User.countDocuments(filter),
    ]);

    // Attach account count + total balance per user
    const userIds = users.map(u => u._id);
    const accounts = await Account.find({ user: { $in: userIds } }).select('user balance status');
    const accountMap = {};
    accounts.forEach(a => {
      const uid = String(a.user);
      if (!accountMap[uid]) accountMap[uid] = { count: 0, balance: 0 };
      accountMap[uid].count++;
      if (a.status === 'active') accountMap[uid].balance += a.balance || 0;
    });

    const enriched = users.map(u => ({
      ...u.toJSON(),
      accountCount: accountMap[String(u._id)]?.count  || 0,
      totalBalance: accountMap[String(u._id)]?.balance || 0,
    }));

    return NextResponse.json({ users: enriched, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (err) {
    console.error('[ADMIN/USERS]', err);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

export const GET = withAdminAuth(handler);
