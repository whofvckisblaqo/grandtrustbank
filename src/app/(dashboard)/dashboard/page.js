'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import BalanceCard from '@/components/BalanceCard';
import QuickActions from '@/components/QuickActions';
import TransactionItem from '@/components/TransactionItem';
import { ArrowRight, TrendingUp, TrendingDown, Wallet, RefreshCw } from 'lucide-react';
import Link from 'next/link';

function StatCard({ label, value, sub, trend, icon: Icon, color }) {
  return (
    <div className="glass-card rounded-2xl p-5 flex items-start gap-4 card-hover">
      <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: `${color}15`, border: `1px solid ${color}25` }}>
        <Icon size={20} style={{ color }} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-gtb-muted text-xs mb-1">{label}</div>
        <div className="text-white text-lg font-black truncate">{value}</div>
        {sub && <div className="text-gtb-muted text-xs mt-0.5 flex items-center gap-1">
          {trend === 'up'   && <TrendingUp   size={11} className="text-gtb-success" />}
          {trend === 'down' && <TrendingDown  size={11} className="text-gtb-danger" />}
          {sub}
        </div>}
      </div>
    </div>
  );
}

function ReceiveModal({ account, onClose }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(account?.accountNumber ?? '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative glass-card rounded-3xl p-8 w-full max-w-sm text-center animate-slide-up" style={{ boxShadow: '0 32px 80px rgba(0,0,0,0.7)' }}>
        <div className="w-16 h-16 rounded-2xl bg-gtb-accent/10 border border-gtb-accent/25 flex items-center justify-center mx-auto mb-4">
          <Wallet size={28} className="text-gtb-accent" />
        </div>
        <h3 className="text-white font-bold text-lg mb-1">Receive Money</h3>
        <p className="text-gtb-subtle text-sm mb-6">Share your account number to receive payments</p>
        <div className="glass rounded-xl p-4 mb-6">
          <div className="text-gtb-muted text-xs mb-1">Account Number</div>
          <div className="text-2xl font-black text-white tracking-widest">{account?.accountNumber}</div>
          <div className="text-gtb-subtle text-xs mt-1 capitalize">{account?.accountType} · GTB</div>
        </div>
        <button onClick={copy} className="btn-primary w-full justify-center mb-3">
          {copied ? '✓ Copied!' : 'Copy Account Number'}
        </button>
        <button onClick={onClose} className="btn-ghost w-full justify-center">Close</button>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, accounts, primaryAccount } = useAuth();
  const [transactions, setTransactions]   = useState([]);
  const [txnLoading, setTxnLoading]       = useState(true);
  const [showReceive, setShowReceive]     = useState(false);

  useEffect(() => {
    if (!primaryAccount?._id) return;
    setTxnLoading(true);
    fetch(`/api/account/${primaryAccount._id}?limit=8`)
      .then(r => r.json())
      .then(d => setTransactions(d.transactions || []))
      .catch(() => {})
      .finally(() => setTxnLoading(false));
  }, [primaryAccount?._id]);

  const totalBalance = accounts.reduce((s, a) => s + (a.availableBalance ?? a.balance ?? 0), 0);

  const fmt = n => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(n ?? 0);

  const credits = transactions.filter(t => t.direction === 'credit').reduce((s, t) => s + t.amount, 0);
  const debits  = transactions.filter(t => t.direction === 'debit').reduce((s, t) => s + t.amount, 0);

  const handleAction = key => {
    if (key === 'send')     router.push('/transfer');
    if (key === 'receive')  setShowReceive(true);
    if (key === 'bills')    router.push('/bills');
    if (key === 'analytics')router.push('/analytics');
    if (key === 'cards')    router.push('/accounts');
  };

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="px-4 sm:px-6 py-6 max-w-5xl mx-auto">

      {/* Welcome */}
      <div className="mb-6">
        <div className="text-gtb-subtle text-sm mb-0.5">{greeting},</div>
        <h1 className="text-2xl font-black text-white">
          {user?.firstName} {user?.lastName} <span className="text-gtb-accent">👋</span>
        </h1>
        <p className="text-gtb-muted text-sm mt-1">Here's your financial overview for today.</p>
      </div>

      {/* Main balance card */}
      <div className="mb-6">
        <BalanceCard
          account={primaryAccount}
          onSend={() => router.push('/transfer')}
          onReceive={() => setShowReceive(true)}
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard
          label="Total Portfolio"
          value={fmt(totalBalance)}
          sub={`${accounts.length} account${accounts.length !== 1 ? 's' : ''}`}
          icon={Wallet}
          color="#00E0B8"
        />
        <StatCard
          label="Total Credits (30d)"
          value={fmt(credits)}
          sub="Incoming transfers"
          trend="up"
          icon={TrendingUp}
          color="#22c55e"
        />
        <StatCard
          label="Total Debits (30d)"
          value={fmt(debits)}
          sub="Outgoing transfers"
          trend="down"
          icon={TrendingDown}
          color="#ef4444"
        />
      </div>

      {/* Quick actions */}
      <div className="mb-6">
        <QuickActions onAction={handleAction} />
      </div>

      {/* Accounts list (if more than 1) */}
      {accounts.length > 1 && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gtb-subtle">Your Accounts</h2>
            <Link href="/accounts" className="text-xs text-gtb-accent hover:underline flex items-center gap-1">
              View all <ArrowRight size={11} />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {accounts.slice(0, 4).map(acct => (
              <div key={acct._id} className="glass-card rounded-xl p-4 flex items-center gap-3 card-hover cursor-default">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold"
                  style={{ background: 'rgba(0,224,184,0.12)', border: '1px solid rgba(0,224,184,0.2)', color: '#00E0B8' }}>
                  {acct.accountType[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-white text-sm font-semibold capitalize">{acct.accountType}</div>
                  <div className="text-gtb-muted text-xs truncate">{acct.accountNumber}</div>
                </div>
                <div className="text-right">
                  <div className="text-white text-sm font-bold">{fmt(acct.balance)}</div>
                  <div className={`text-[10px] px-1.5 py-0.5 rounded-full mt-0.5 capitalize ${
                    acct.status === 'active' ? 'badge-success' : 'badge-warn'
                  }`}>{acct.status}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent transactions */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-gtb-subtle">Recent Transactions</h2>
          <Link href="/transactions" className="text-xs text-gtb-accent hover:underline flex items-center gap-1">
            View all <ArrowRight size={11} />
          </Link>
        </div>

        <div className="glass-card rounded-2xl px-4 py-2">
          {txnLoading ? (
            <div className="space-y-4 py-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl shimmer flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 shimmer rounded-full w-32" />
                    <div className="h-2 shimmer rounded-full w-24" />
                  </div>
                  <div className="h-4 shimmer rounded-full w-20" />
                </div>
              ))}
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 rounded-2xl bg-white/[0.04] flex items-center justify-center mx-auto mb-3">
                <RefreshCw size={20} className="text-gtb-muted" />
              </div>
              <p className="text-gtb-muted text-sm">No transactions yet</p>
              <p className="text-gtb-muted text-xs mt-1">Make your first transfer to get started</p>
            </div>
          ) : (
            transactions.map(txn => (
              <TransactionItem
                key={txn._id}
                txn={txn}
                userAccountIds={accounts.map(a => String(a._id))}
              />
            ))
          )}
        </div>
      </div>

      {showReceive && <ReceiveModal account={primaryAccount} onClose={() => setShowReceive(false)} />}
    </div>
  );
}
