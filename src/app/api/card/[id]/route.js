import { NextResponse } from 'next/server';
import { withAuth } from '@/lib/withAuth';
import Card from '@/models/Card';
import { sendCardActivityEmail } from '@/lib/email';

async function handler(req, { params }) {
  const { id } = await params;
  const card = await Card.findOne({ _id: id, user: req.user._id });
  if (!card) return NextResponse.json({ error: 'Card not found' }, { status: 404 });

  const { action } = await req.json();

  if (action === 'freeze')   card.status = 'frozen';
  else if (action === 'unfreeze') card.status = 'active';
  else return NextResponse.json({ error: 'Invalid action. Use freeze or unfreeze.' }, { status: 400 });

  await card.save();

  sendCardActivityEmail({
    to: req.user.email,
    name: `${req.user.firstName} ${req.user.lastName}`,
    action: action === 'freeze' ? 'frozen' : 'unfrozen',
    cardLast4: card.cardNumber ? card.cardNumber.slice(-4) : '****',
  }).catch((err) => console.error('[CARD_ACTIVITY_EMAIL]', err));

  return NextResponse.json({ card });
}

export const PATCH = withAuth(handler);