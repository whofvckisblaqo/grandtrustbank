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
  const { symbol, usdAmount, fromAccountId } = await req.json();

  if (!COINS[symbol]) return NextResponse.json({ error: 'Unsupported coin' }, { status: 400 });
  const coin = COINS[symbol];

  const usd = parseFloat(usdAmount);
  if (!usd || usd < 1) return NextResponse.json({ error: 'Minimum purchase is $1' }, { status: 400 });

  const account = await Account.findOne({ _id: fromAccountId, user: userId, status: 'active' });
  if (!account) return NextResponse.json({ error: 'Account not found' }, { status: 404 });
  if (account.availableBalance < usd)
    return NextResponse.json({ error: 'Insufficient balance' }, { status: 400 });

  const coinAmount = usd / coin.price;

  // Debit account
  account.balance          -= usd;
  account.availableBalance -= usd;
  account.ledgerBalance    -= usd;
  await account.save();

  // Update wallet
  let wallet = await CryptoWallet.findOne({ user: userId });
  if (!wallet) wallet = await CryptoWallet.create({ user: userId, holdings: [] });

  const existing = wallet.holdings.find(h => h.symbol === symbol);
  if (existing) {
    const totalCost     = existing.amount * existing.avgBuyPrice + usd;
    const totalAmount   = existing.amount + coinAmount;
    existing.avgBuyPrice = totalCost / totalAmount;
    existing.amount      = totalAmount;
  } else {
    wallet.holdings.push({ coin: coin.name, symbol, amount: coinAmount, avgBuyPrice: coin.price });
  }
  await wallet.save();

  await CryptoTransaction.create({
    user: userId, type: 'buy',
    coin: coin.name, symbol,
    coinAmount, priceAtTime: coin.price, totalUSD: usd,
    fromAccount: account._id,
    reference: ref(),
  });

  return NextResponse.json({
    message: `Successfully purchased ${coinAmount.toFixed(8)} ${symbol}`,
    coinAmount, priceAtTime: coin.price, totalUSD: usd,
    newBalance: account.availableBalance,
  });
}

export const POST = withAuth(handler);
