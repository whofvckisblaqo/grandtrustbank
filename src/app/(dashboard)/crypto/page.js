'use client';
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import {
  TrendingUp, TrendingDown, ArrowUpDown, X, AlertCircle,
  ChevronDown, Wallet, RefreshCw, ArrowRight, Clock, DollarSign
} from 'lucide-react';

const fmt     = n  => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n ?? 0);
const fmtCoin = (n, sym) => {
  const dp = sym === 'USDT' ? 2 : sym === 'BTC' ? 8 : 6;
  return `${Number(n).toFixed(dp)} ${sym}`;
};

const COIN_ICONS = {
  BTC:  { emoji: '₿', bg: '#F7931A' },
  ETH:  { emoji: 'Ξ', bg: '#627EEA' },
  USDT: { emoji: '₮', bg: '#26A17B' },
  BNB:  { emoji: 'B', bg: '#F3BA2F' },
  SOL:  { emoji: 'S', bg: '#9945FF' },
};

function CoinIcon({ symbol, size = 40 }) {
  const c = COIN_ICONS[symbol] || { emoji: symbol[0], bg: '#00E0B8' };
  return (
    <div className="rounded-full flex items-center justify-center font-black text-white flex-shrink-0"
      style={{ width: size, height: size, background: c.bg, fontSize: size * 0.4 }}>
      {c.emoji}
    </div>
  );
}

function BuySellModal({ mode, coin, accounts, onClose, onSuccess }) {
  const [usdAmount, setUsdAmount]   = useState('');
  const [coinAmount, setCoinAmount] = useState('');
  const [accountId, setAccountId]   = useState(accounts[0]?._id || '');
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState('');

  const price  = coin?.currentPrice || coin?.price || 0;
  const isBuy  = mode === 'buy';
  const fmtAcc = a => `${a.accountType === 'current' ? 'Checking' : a.accountType} — ${fmt(a.availableBalance ?? a.balance)}`;

  function handleUsdChange(val) {
    setUsdAmount(val);
    const p = parseFloat(val);
    setCoinAmount(p && price ? (p / price).toFixed(8) : '');
  }
  function handleCoinChange(val) {
    setCoinAmount(val);
    const p = parseFloat(val);
    setUsdAmount(p && price ? (p * price).toFixed(2) : '');
  }

  async function submit() {
    setError(''); setLoading(true);
    try {
      const endpoint = isBuy ? '/api/crypto/buy' : '/api/crypto/sell';
      const body = isBuy
        ? { symbol: coin.symbol, usdAmount: parseFloat(usdAmount), fromAccountId: accountId }
        : { symbol: coin.symbol, coinAmount: parseFloat(coinAmount), toAccountId: accountId };
      const res  = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      onSuccess(data.message);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }

  const coinMeta = COIN_ICONS[coin?.symbol] || {};
  const canSubmit = isBuy ? (parseFloat(usdAmount) >= 1 && accountId) : (parseFloat(coinAmount) > 0 && accountId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative glass-card rounded-3xl p-6 w-full max-w-sm animate-slide-up"
        style={{ boxShadow: '0 32px 80px rgba(0,0,0,0.7)' }}>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <CoinIcon symbol={coin?.symbol} size={36} />
            <div>
              <div className="text-white font-black">{isBuy ? 'Buy' : 'Sell'} {coin?.symbol}</div>
              <div className="text-gtb-muted text-xs">{fmt(price)} per coin</div>
            </div>
          </div>
          <button onClick={onClose} className="text-gtb-muted hover:text-white"><X size={20} /></button>
        </div>

        {error && (
          <div className="flex items-center gap-2 bg-gtb-danger/10 border border-gtb-danger/20 rounded-xl p-3 text-gtb-danger text-sm mb-4">
            <AlertCircle size={14} /> {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-gtb-muted text-xs mb-2 uppercase tracking-wider">
              {isBuy ? 'You Pay (USD)' : 'You Sell (Coin)'}
            </label>
            <div className="input-wrap">
              <span className="input-icon-left">{isBuy ? <DollarSign size={16} /> : <span className="text-xs font-bold" style={{ color: coinMeta.bg }}>{coin?.symbol?.slice(0,1)}</span>}</span>
              <input
                type="number" min="0" step="any"
                value={isBuy ? usdAmount : coinAmount}
                onChange={e => isBuy ? handleUsdChange(e.target.value) : handleCoinChange(e.target.value)}
                placeholder={isBuy ? '0.00' : '0.00000000'}
                className="input-dark w-full pl-11"
              />
            </div>
          </div>
          <div>
            <label className="block text-gtb-muted text-xs mb-2 uppercase tracking-wider">
              {isBuy ? 'You Receive' : 'You Receive (USD)'}
            </label>
            <div className="input-wrap">
              <span className="input-icon-left">{isBuy ? <span className="text-xs font-bold" style={{ color: coinMeta.bg }}>{coin?.symbol?.slice(0,1)}</span> : <DollarSign size={16} />}</span>
              <input
                type="number" min="0" step="any"
                value={isBuy ? coinAmount : usdAmount}
                onChange={e => isBuy ? handleCoinChange(e.target.value) : handleUsdChange(e.target.value)}
                placeholder={isBuy ? '0.00000000' : '0.00'}
                className="input-dark w-full pl-11"
              />
            </div>
          </div>
          <div>
            <label className="block text-gtb-muted text-xs mb-2 uppercase tracking-wider">
              {isBuy ? 'Pay From Account' : 'Receive Into Account'}
            </label>
            <div className="input-wrap">
              <select value={accountId} onChange={e => setAccountId(e.target.value)}
                className="input-dark w-full appearance-none pr-12"
                style={{ backgroundColor: '#0B1020', color: '#fff' }}>
                {accounts.filter(a => a.status === 'active').map(a => (
                  <option key={a._id} value={a._id} style={{ backgroundColor: '#0B1020' }}>{fmtAcc(a)}</option>
                ))}
              </select>
              <span className="input-icon-right pointer-events-none"><ChevronDown size={16} /></span>
            </div>
          </div>

          <button onClick={submit} disabled={loading || !canSubmit}
            className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
              isBuy
                ? 'bg-gtb-success text-white hover:bg-gtb-success/90'
                : 'bg-gtb-danger text-white hover:bg-gtb-danger/90'
            }`}>
            {loading
              ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Processing…</>
              : <>{isBuy ? <TrendingUp size={16} /> : <TrendingDown size={16} />} {isBuy ? 'Buy' : 'Sell'} {coin?.symbol}</>
            }
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CryptoPage() {
  const { accounts } = useAuth();
  const [portfolio, setPortfolio]   = useState({ holdings: [], totalValue: 0, totalPnL: 0, market: [] });
  const [txns, setTxns]             = useState([]);
  const [loading, setLoading]       = useState(true);
  const [modal, setModal]           = useState(null); // { mode: 'buy'|'sell', coin }
  const [toast, setToast]           = useState('');
  const [activeTab, setActiveTab]   = useState('portfolio');

  const showToast = msg => { setToast(msg); setTimeout(() => setToast(''), 3500); };

  const fetchPortfolio = useCallback(async () => {
    setLoading(true);
    try {
      const [pRes, tRes] = await Promise.all([
        fetch('/api/crypto/portfolio'),
        fetch('/api/crypto/transactions?limit=20'),
      ]);
      const [p, t] = await Promise.all([pRes.json(), tRes.json()]);
      setPortfolio(p);
      setTxns(t.transactions || []);
    } catch {}
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchPortfolio(); }, [fetchPortfolio]);

  function handleSuccess(msg) {
    setModal(null);
    showToast('✓ ' + msg);
    fetchPortfolio();
  }

  const pnlPositive = portfolio.totalPnL >= 0;

  return (
    <div className="px-4 sm:px-6 py-6 max-w-4xl mx-auto">
      {modal && (
        <BuySellModal
          mode={modal.mode} coin={modal.coin}
          accounts={accounts}
          onClose={() => setModal(null)}
          onSuccess={handleSuccess}
        />
      )}
      {toast && (
        <div className="fixed top-6 right-6 z-50 glass-card rounded-xl px-4 py-3 text-sm font-medium text-white shadow-2xl animate-fade-in">
          {toast}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-black text-white">Crypto Wallet</h1>
          <p className="text-gtb-muted text-sm">Buy, sell and manage your digital assets</p>
        </div>
        <button onClick={fetchPortfolio} className="flex items-center gap-2 px-4 py-2 glass rounded-xl text-sm text-gtb-subtle hover:text-white transition-all">
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* Portfolio summary */}
      {!loading && (
        <div className="glass-card rounded-3xl p-6 mb-6"
          style={{ background: 'linear-gradient(135deg, rgba(0,224,184,0.08) 0%, rgba(0,0,0,0) 60%)' }}>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="text-gtb-muted text-xs uppercase tracking-wider mb-1">Total Portfolio Value</div>
              <div className="text-white text-3xl font-black">{fmt(portfolio.totalValue)}</div>
              <div className={`flex items-center gap-1.5 mt-1 text-sm font-semibold ${pnlPositive ? 'text-gtb-success' : 'text-gtb-danger'}`}>
                {pnlPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                {pnlPositive ? '+' : ''}{fmt(portfolio.totalPnL)} all time P&L
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => setModal({ mode: 'buy', coin: portfolio.market?.[0] })}
                className="btn-primary text-sm py-2.5 px-5">
                <TrendingUp size={15} /> Buy Crypto
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 p-1 glass-card rounded-xl mb-5 w-fit">
        {['portfolio', 'market', 'history'].map(t => (
          <button key={t} onClick={() => setActiveTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${
              activeTab === t ? 'bg-gtb-accent text-gtb-dark' : 'text-gtb-muted hover:text-white'
            }`}>
            {t}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-4">{[1,2,3].map(i => <div key={i} className="glass-card rounded-2xl p-5 shimmer h-20" />)}</div>
      ) : (
        <>
          {/* Portfolio tab */}
          {activeTab === 'portfolio' && (
            <div className="space-y-3">
              {portfolio.holdings.length === 0 ? (
                <div className="glass-card rounded-3xl p-12 text-center">
                  <div className="w-20 h-20 rounded-full bg-gtb-accent/10 border border-gtb-accent/20 flex items-center justify-center mx-auto mb-5">
                    <Wallet size={36} className="text-gtb-accent" />
                  </div>
                  <h3 className="text-white font-bold text-lg mb-2">Empty Wallet</h3>
                  <p className="text-gtb-muted text-sm mb-6">Start building your crypto portfolio. Buy BTC, ETH, or other digital assets.</p>
                  <button onClick={() => { setActiveTab('market'); }} className="btn-primary justify-center">
                    View Market <ArrowRight size={16} />
                  </button>
                </div>
              ) : portfolio.holdings.map(h => (
                <div key={h.symbol} className="glass-card rounded-2xl p-4 flex items-center gap-4 card-hover">
                  <CoinIcon symbol={h.symbol} size={44} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-white font-bold">{h.name}</span>
                      <span className="text-gtb-muted text-xs">{h.symbol}</span>
                    </div>
                    <div className="text-gtb-muted text-xs">{fmtCoin(h.amount, h.symbol)}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-bold">{fmt(h.currentValue)}</div>
                    <div className={`text-xs font-semibold ${h.pnl >= 0 ? 'text-gtb-success' : 'text-gtb-danger'}`}>
                      {h.pnl >= 0 ? '+' : ''}{fmt(h.pnl)} ({h.pnlPct.toFixed(2)}%)
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={() => setModal({ mode: 'buy', coin: h })}
                      className="px-3 py-1.5 rounded-lg bg-gtb-success/10 border border-gtb-success/20 text-gtb-success text-xs font-medium hover:bg-gtb-success/20 transition-all">
                      Buy
                    </button>
                    <button onClick={() => setModal({ mode: 'sell', coin: h })}
                      className="px-3 py-1.5 rounded-lg bg-gtb-danger/10 border border-gtb-danger/20 text-gtb-danger text-xs font-medium hover:bg-gtb-danger/20 transition-all">
                      Sell
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Market tab */}
          {activeTab === 'market' && (
            <div className="space-y-3">
              {(portfolio.market || []).map(coin => {
                const holding = portfolio.holdings.find(h => h.symbol === coin.symbol);
                const up = coin.change24h >= 0;
                return (
                  <div key={coin.symbol} className="glass-card rounded-2xl p-4 flex items-center gap-4 card-hover">
                    <CoinIcon symbol={coin.symbol} size={44} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-white font-bold">{coin.name}</span>
                        <span className="text-gtb-muted text-xs">{coin.symbol}</span>
                      </div>
                      {holding && holding.amount > 0 && (
                        <div className="text-gtb-accent text-xs">You own: {fmtCoin(holding.amount, coin.symbol)}</div>
                      )}
                    </div>
                    <div className="text-right mr-2">
                      <div className="text-white font-bold">{fmt(coin.price)}</div>
                      <div className={`text-xs font-semibold flex items-center gap-1 justify-end ${up ? 'text-gtb-success' : 'text-gtb-danger'}`}>
                        {up ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                        {up ? '+' : ''}{coin.change24h.toFixed(2)}%
                      </div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button onClick={() => setModal({ mode: 'buy', coin })}
                        className="px-3 py-1.5 rounded-lg bg-gtb-success/10 border border-gtb-success/20 text-gtb-success text-xs font-medium hover:bg-gtb-success/20 transition-all">
                        Buy
                      </button>
                      {holding && holding.amount > 0 && (
                        <button onClick={() => setModal({ mode: 'sell', coin: { ...coin, ...holding } })}
                          className="px-3 py-1.5 rounded-lg bg-gtb-danger/10 border border-gtb-danger/20 text-gtb-danger text-xs font-medium hover:bg-gtb-danger/20 transition-all">
                          Sell
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* History tab */}
          {activeTab === 'history' && (
            <div>
              {txns.length === 0 ? (
                <div className="glass-card rounded-2xl p-12 text-center">
                  <ArrowUpDown size={40} className="text-gtb-muted mx-auto mb-3" />
                  <p className="text-gtb-muted">No transactions yet</p>
                </div>
              ) : (
                <div className="glass-card rounded-2xl overflow-hidden">
                  {txns.map((t, i) => {
                    const isBuy = t.type === 'buy';
                    return (
                      <div key={t._id} className={`flex items-center gap-4 px-5 py-4 ${i > 0 ? 'border-t border-white/[0.05]' : ''}`}>
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          isBuy ? 'bg-gtb-success/10' : 'bg-gtb-danger/10'
                        }`}>
                          {isBuy ? <TrendingUp size={16} className="text-gtb-success" /> : <TrendingDown size={16} className="text-gtb-danger" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-white font-semibold text-sm capitalize">{t.type} {t.symbol}</div>
                          <div className="text-gtb-muted text-xs">{fmtCoin(t.coinAmount, t.symbol)} @ {fmt(t.priceAtTime)}</div>
                        </div>
                        <div className="text-right">
                          <div className={`font-bold text-sm ${isBuy ? 'text-gtb-danger' : 'text-gtb-success'}`}>
                            {isBuy ? '−' : '+'}{fmt(t.totalUSD)}
                          </div>
                          <div className="text-gtb-muted text-xs flex items-center gap-1 justify-end">
                            <Clock size={10} />
                            {new Date(t.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
