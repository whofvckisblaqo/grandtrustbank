import { NextResponse } from 'next/server';
import { withAuth } from '@/lib/withAuth';
import Account from '@/models/Account';
import Transaction from '@/models/Transaction';

async function handler(req) {
  const { fromAccountId, biller, billerRef, amount, category } = await req.json();

  if (!fromAccountId || !biller || !amount) {
    return NextResponse.json({ error: 'fromAccountId, biller, and amount are required' }, { status: 400 });
  }

  const parsedAmount = parseFloat(amount);
  if (isNaN(parsedAmount) || parsedAmount < 1) {
    return NextResponse.json({ error: 'Amount must be at least $1' }, { status: 400 });
  }

  const account = await Account.findOne({ _id: fromAccountId, user: req.user._id, status: 'active' });
  if (!account) return NextResponse.json({ error: 'Account not found or inactive' }, { status: 404 });

  if (account.availableBalance < parsedAmount) {
    return NextResponse.json({ error: 'Insufficient funds' }, { status: 422 });
  }

  const balanceBefore = account.balance;
  account.balance          -= parsedAmount;
  account.availableBalance -= parsedAmount;
  account.ledgerBalance    -= parsedAmount;
  await account.save();

  const txn = await Transaction.create({
    type:          'bill-payment',
    direction:     'debit',
    amount:        parsedAmount,
    currency:      account.currency,
    senderAccount: account._id,
    senderUser:    req.user._id,
    balanceBefore,
    balanceAfter:  account.balance,
    narration:     `Bill Payment: ${biller}${billerRef ? ` — Ref: ${billerRef}` : ''}`,
    category:      category || 'utilities',
    status:        'completed',
    channel:       'web',
  });

  return NextResponse.json({
    message:    'Bill payment successful',
    reference:  txn.reference,
    newBalance: account.balance,
  });
}

export const POST = withAuth(handler);
