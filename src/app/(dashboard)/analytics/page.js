'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownLeft, BarChart3, Calendar } from 'lucide-react';

const fmt = n => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n ?? 0);

const typeColors = {
  transfer:       '#00E0B8',
  'bill-payment': '#F97316',
  deposit:        '#22C55E',
  withdrawal:     '#EF4444',
  fee:            '#94A3B8',
  other:          '#7C3AED',
};

const typeLabels = {
  transfer:       'Transfers',
  'bill-payment': 'Bill Payments',
  deposit:        'Deposits',
  withdrawal:     'Withdrawals',
  fee:            'Fees',
  other:          'Other',
};

function groupByMonth(transactions) {
  const months = {};
  transactions.forEach(t => {
    const d = new Date(t.createdAt);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const label = d.toLocaleString('default', { month: 'short', year: '2-digit' });
    if (!months[key]) months[key] = { key, label, credits: 0, debits: 0 };
    if (t.direction === 'credit') months[key].credits += t.amount;
    else months[key].debits += t.amount;
  });
  return Object.values(months).sort((a, b) => a.key.localeCompare(b.key)).slice(-6);
}

function groupByType(transactions) {
  const types = {};
  transactions.filter(t => t.direction === 'debit').forEach(t => {
    const k = t.type || 'other';
    types[k] = (types[k] || 0) + t.amount;
  });
  return Object.entries(types)
    .map(([type, amount]) => ({ type, amount }))
    .sort((a, b) => b.amount - a.amount);
}

export default function AnalyticsPage() {
  const { accounts } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [period, setPeriod]     = useState(30);

  useEffect(() => {
    async function fetch90() {
      try {
        const from = new Date();
        from.setDate(from.getDate() - 90);
        const res = await fetch(`/api/transaction/history?limit=200&from=${from.toISOString().slice(0, 10)}`);
        const data = await res.json();
        setTransactions(data.transactions || []);
      } catch { setTransactions([]); }
      finally { setLoading(false); }
    }
    fetch90();
  }, []);

  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - period);
  const periodTxns = transactions.filter(t => new Date(t.createdAt) >= cutoff);

  const accountIds = accounts.map(a => String(a._id));

  const credits = periodTxns.filter(t => t.direction === 'credit').reduce((s, t) => s + t.amount, 0);
  const debits  = periodTxns.filter(t => t.direction === 'debit').reduce((s, t) => s + t.amount, 0);
  const netFlow = credits - debits;

  const byMonth   = groupByMonth(transactions);
  const maxBar    = Math.max(...byMonth.map(m => Math.max(m.credits, m.debits)), 1);

  const byType    = groupByType(periodTxns);
  const totalSpend = byType.reduce((s, t) => s + t.amount, 0);

  return (
    <div className="px-4 sm:px-6 py-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-black text-white">Analytics</h1>
          <p className="text-gtb-muted text-sm">Your financial insights</p>
        </div>
        <div className="flex gap-1 p-1 glass-card rounded-xl">
          {[30, 60, 90].map(d => (
            <button key={d} onClick={() => setPeriod(d)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${period === d ? 'bg-gtb-accent text-gtb-dark' : 'text-gtb-muted hover:text-white'}`}>
              {d}d
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1,2,3].map(i => <div key={i} className="glass-card rounded-2xl p-5 shimmer h-24" />)}
        </div>
      ) : (
        <>
          {/* Summary cards */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="glass-card rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <ArrowDownLeft size={14} className="text-gtb-success" />
                <span className="text-gtb-muted text-xs">Money In</span>
              </div>
              <div className="text-gtb-success font-black text-lg">{fmt(credits)}</div>
            </div>
            <div className="glass-card rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <ArrowUpRight size={14} className="text-gtb-danger" />
                <span className="text-gtb-muted text-xs">Money Out</span>
              </div>
              <div className="text-gtb-danger font-black text-lg">{fmt(debits)}</div>
            </div>
            <div className="glass-card rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                {netFlow >= 0 ? <TrendingUp size={14} className="text-gtb-accent" /> : <TrendingDown size={14} className="text-gtb-danger" />}
                <span className="text-gtb-muted text-xs">Net Flow</span>
              </div>
              <div className={`font-black text-lg ${netFlow >= 0 ? 'text-gtb-accent' : 'text-gtb-danger'}`}>{fmt(Math.abs(netFlow))}</div>
            </div>
          </div>

          {/* Monthly bar chart */}
          {byMonth.length > 0 && (
            <div className="glass-card rounded-2xl p-5 mb-6">
              <div className="flex items-center gap-2 mb-5">
                <BarChart3 size={16} className="text-gtb-accent" />
                <h3 className="text-white font-semibold text-sm">Monthly Overview</h3>
              </div>
              <div className="flex items-end gap-3 h-40">
                {byMonth.map(m => (
                  <div key={m.key} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full flex gap-1 items-end" style={{ height: 120 }}>
                      <div
                        className="flex-1 rounded-t-md transition-all"
                        style={{ height: `${(m.credits / maxBar) * 100}%`, background: 'rgba(34,197,94,0.7)', minHeight: 2 }}
                        title={`Credits: ${fmt(m.credits)}`}
                      />
                      <div
                        className="flex-1 rounded-t-md transition-all"
                        style={{ height: `${(m.debits / maxBar) * 100}%`, background: 'rgba(239,68,68,0.7)', minHeight: 2 }}
                        title={`Debits: ${fmt(m.debits)}`}
                      />
                    </div>
                    <div className="text-gtb-muted text-[10px] font-medium">{m.label}</div>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-4 mt-3">
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-green-500/70" /><span className="text-gtb-muted text-xs">Credits</span></div>
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-red-500/70" /><span className="text-gtb-muted text-xs">Debits</span></div>
              </div>
            </div>
          )}

          {/* Spending by type */}
          {byType.length > 0 && (
            <div className="glass-card rounded-2xl p-5 mb-6">
              <h3 className="text-white font-semibold text-sm mb-5">Spending Breakdown</h3>
              <div className="space-y-4">
                {byType.map(({ type, amount }) => {
                  const pct = totalSpend > 0 ? Math.round((amount / totalSpend) * 100) : 0;
                  const color = typeColors[type] || typeColors.other;
                  return (
                    <div key={type}>
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-white text-sm font-medium">{typeLabels[type] || type}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-gtb-muted text-xs">{pct}%</span>
                          <span className="text-white text-sm font-bold">{fmt(amount)}</span>
                        </div>
                      </div>
                      <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: color }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Transaction count */}
          <div className="glass-card rounded-2xl p-5">
            <h3 className="text-white font-semibold text-sm mb-4">Activity Summary</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Total Transactions', value: periodTxns.length },
                { label: 'Credits', value: periodTxns.filter(t => t.direction === 'credit').length },
                { label: 'Debits', value: periodTxns.filter(t => t.direction === 'debit').length },
                { label: 'Avg. Transaction', value: fmt(periodTxns.length ? (credits + debits) / periodTxns.length : 0) },
              ].map(stat => (
                <div key={stat.label} className="glass rounded-xl p-3 text-center">
                  <div className="text-white font-black text-lg">{stat.value}</div>
                  <div className="text-gtb-muted text-xs mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {periodTxns.length === 0 && (
            <div className="text-center py-12">
              <BarChart3 size={40} className="text-gtb-muted mx-auto mb-3" />
              <p className="text-gtb-muted">No transactions in the last {period} days</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
