import { NextResponse } from 'next/server';
import { withAuth } from '@/lib/withAuth';
import CryptoWallet from '@/models/CryptoWallet';

export const COINS = {
  BTC:  { name: 'Bitcoin',   symbol: 'BTC',  price: 67234.50, change24h: 2.34,   color: '#F7931A' },
  ETH:  { name: 'Ethereum',  symbol: 'ETH',  price: 3542.80,  change24h: 1.82,   color: '#627EEA' },
  USDT: { name: 'Tether',    symbol: 'USDT', price: 1.00,     change24h: 0.01,   color: '#26A17B' },
  BNB:  { name: 'BNB',       symbol: 'BNB',  price: 452.30,   change24h: -0.54,  color: '#F3BA2F' },
  SOL:  { name: 'Solana',    symbol: 'SOL',  price: 152.40,   change24h: 4.21,   color: '#9945FF' },
};

async function handler(req, _ctx, userId) {
  let wallet = await CryptoWallet.findOne({ user: userId });
  if (!wallet) wallet = await CryptoWallet.create({ user: userId, holdings: [] });

  const holdings = wallet.holdings.map(h => {
    const market = COINS[h.symbol] || {};
    const currentPrice = market.price || 0;
    const currentValue = h.amount * currentPrice;
    const costBasis    = h.amount * h.avgBuyPrice;
    const pnl          = currentValue - costBasis;
    return {
      ...h.toObject(),
      currentPrice,
      currentValue,
      costBasis,
      pnl,
      pnlPct: costBasis > 0 ? (pnl / costBasis) * 100 : 0,
      color:  market.color,
      name:   market.name || h.coin,
      change24h: market.change24h || 0,
    };
  }).filter(h => h.amount > 0.000001);

  const totalValue = holdings.reduce((s, h) => s + h.currentValue, 0);
  const totalCost  = holdings.reduce((s, h) => s + h.costBasis, 0);

  return NextResponse.json({
    holdings,
    totalValue,
    totalPnL: totalValue - totalCost,
    market: Object.values(COINS),
  });
}

export const GET = withAuth(handler);
