import { NextResponse } from 'next/server';
import { withAdminAuth } from '@/lib/withAdminAuth';
import User from '@/models/User';
import Account from '@/models/Account';
import Transaction from '@/models/Transaction';

async function handler(req) {
  try {
    const [
      totalUsers,
      activeUsers,
      pendingKyc,
      totalAccounts,
      pendingTransfers,
      completedToday,
      allAccounts,
      recentTxns,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ isActive: true, isSuspended: false }),
      User.countDocuments({ kycStatus: 'pending' }),
      Account.countDocuments({ status: 'active' }),
      Transaction.countDocuments({ direction: 'debit', status: 'pending', type: 'transfer' }),
      Transaction.countDocuments({
        status: 'completed',
        createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) },
      }),
      Account.find({ status: 'active' }).select('balance'),
      Transaction.find({ status: 'completed' })
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('senderUser', 'firstName lastName')
        .populate('receiverUser', 'firstName lastName'),
    ]);

    const totalBalance = allAccounts.reduce((s, a) => s + (a.balance || 0), 0);

    return NextResponse.json({
      totalUsers,
      activeUsers,
      pendingKyc,
      totalAccounts,
      pendingTransfers,
      completedToday,
      totalBalance,
      recentTxns,
    });
  } catch (err) {
    console.error('[ADMIN/STATS]', err);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}

export const GET = withAdminAuth(handler);
