import { NextResponse } from 'next/server';
import { withAuth } from '@/lib/withAuth';
import Card from '@/models/Card';
import Account from '@/models/Account';

async function getHandler(req) {
  const cards = await Card.find({ user: req.user._id })
    .populate('account', 'accountNumber accountType balance')
    .sort({ createdAt: -1 });
  return NextResponse.json({ cards });
}

async function postHandler(req) {
  const { accountId, cardType, network } = await req.json();

  const account = await Account.findOne({ _id: accountId, user: req.user._id, status: 'active' });
  if (!account) return NextResponse.json({ error: 'Account not found or inactive' }, { status: 404 });

  const existing = await Card.findOne({ account: accountId, user: req.user._id });
  if (existing) {
    return NextResponse.json({ error: 'This account already has a card. Cancel it first if you need a new one.' }, { status: 409 });
  }

  const cardName = `${req.user.firstName} ${req.user.lastName}`.toUpperCase();

  const card = await Card.create({
    user: req.user._id,
    account: accountId,
    cardType: cardType || 'debit',
    network: network || 'visa',
    cardName,
    creditLimit:     cardType === 'credit' ? 5000 : 0,
    availableCredit: cardType === 'credit' ? 5000 : 0,
  });

  const populated = await card.populate('account', 'accountNumber accountType balance');
  return NextResponse.json({ card: populated }, { status: 201 });
}

export const GET  = withAuth(getHandler);
export const POST = withAuth(postHandler);