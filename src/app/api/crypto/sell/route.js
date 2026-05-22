import { NextResponse } from 'next/server';
import { withAuth } from '@/lib/withAuth';
import CryptoWallet from '@/models/CryptoWallet';
import CryptoTransaction from '@/models/CryptoTransaction';
import Account from '@/models/Account';
import { COINS } from '../portfolio/route';

function ref() {
  return 'CRY-' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).slice(2, 6).toUpperCase();
}

async function handler(req, _ctx, userId) {
  const { symbol, coinAmount, toAccountId } = await req.json();

  if (!COINS[symbol]) return NextResponse.json({ error: 'Unsupported coin' }, { status: 400 });
  const coin = COINS[symbol];

  const amount = parseFloat(coinAmount);
  if (!amount || amount <= 0) return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });

  const wallet = await CryptoWallet.findOne({ user: userId });
  const holding = wallet?.holdings.find(h => h.symbol === symbol);
  if (!holding || holding.amount < amount)
    return NextResponse.json({ error: 'Insufficient crypto balance' }, { status: 400 });

  const usdValue = amount * coin.price;

  const account = await Account.findOne({ _id: toAccountId, user: userId, status: 'active' });
  if (!account) return NextResponse.json({ error: 'Account not found' }, { status: 404 });

  // Deduct crypto
  holding.amount -= amount;
  if (holding.amount < 0.000001) holding.amount = 0;
  await wallet.save();

  // Credit account
  account.balance          += usdValue;
  account.availableBalance += usdValue;
  account.ledgerBalance    += usdValue;
  await account.save();

  await CryptoTransaction.create({
    user: userId, type: 'sell',
    coin: coin.name, symbol,
    coinAmount: amount, priceAtTime: coin.price, totalUSD: usdValue,
    toAccount: account._id,
    reference: ref(),
  });

  return NextResponse.json({
    message: `Successfully sold ${amount} ${symbol} for $${usdValue.toFixed(2)}`,
    usdValue, priceAtTime: coin.price,
    newBalance: account.availableBalance,
  });
}

export const POST = withAuth(handler);
