'use client';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Copy, CheckCircle, Send, Eye, Plus, Landmark, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';
import Link from 'next/link';

const fmt = n => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n ?? 0);

const typeLabel = t => ({ savings: 'Savings Account', current: 'Checking Account', 'fixed-deposit': 'Fixed Deposit', domiciliary: 'Domiciliary Account' }[t] || t);

const gradients = {
  savings:         'linear-gradient(135deg, #00E0B8 0%, #0d3d35 40%, #0B1020 100%)',
  current:         'linear-gradient(135deg, #3B82F6 0%, #1e3a8a 40%, #0B1020 100%)',
  'fixed-deposit': 'linear-gradient(135deg, #F59E0B 0%, #92400e 40%, #1a0800 100%)',
  domiciliary:     'linear-gradient(135deg, #8B5CF6 0%, #4c1d95 40%, #0B1020 100%)',
};

function AccountCard({ account, onCopy, copied }) {
  return (
    <div className="glass-card rounded-3xl overflow-hidden">
      {/* Visual card header */}
      <div className="relative p-6 overflow-hidden" style={{ background: gradients[account.accountType] || gradients.savings, minHeight: 160 }}>
        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        <div className="relative">
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="text-white/60 text-xs">Grand Trust Bank</div>
              <div className="text-white font-bold text-sm">{typeLabel(account.accountType)}</div>
            </div>
            <div className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
              account.status === 'active' ? 'bg-gtb-success/20 text-gtb-success' : 'bg-gtb-danger/20 text-gtb-danger'
            }`}>{account.status}</div>
          </div>
          <div className="text-white/50 text-xs mb-1">Available Balance</div>
          <div className="text-white text-2xl font-black">{fmt(account.availableBalance ?? account.balance)}</div>
          <div className="text-white/60 font-mono text-sm mt-3 tracking-wider">{account.accountNumber}</div>
        </div>
      </div>

      {/* Actions */}
      <div className="p-4 space-y-4">
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => onCopy(account.accountNumber)}
            className={`flex flex-col items-center gap-1.5 p-3 rounded-xl text-xs font-medium transition-all ${
              copied === account.accountNumber ? 'bg-gtb-success/10 text-gtb-success' : 'glass text-gtb-subtle hover:text-white'
            }`}
          >
            {copied === account.accountNumber ? <CheckCircle size={16} /> : <Copy size={16} />}
            {copied === account.accountNumber ? 'Copied!' : 'Copy No.'}
          </button>
          <Link
            href={`/transfer?from=${account._id}`}
            className="flex flex-col items-center gap-1.5 p-3 rounded-xl text-xs font-medium glass text-gtb-subtle hover:text-white transition-all"
          >
            <Send size={16} />
            Transfer
          </Link>
          <Link
            href={`/transactions`}
            className="flex flex-col items-center gap-1.5 p-3 rounded-xl text-xs font-medium glass text-gtb-subtle hover:text-white transition-all"
          >
            <Eye size={16} />
            History
          </Link>
        </div>

        {/* Account details */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="glass rounded-xl p-3">
            <div className="text-gtb-muted text-xs mb-1">Ledger Balance</div>
            <div className="text-white font-semibold">{fmt(account.ledgerBalance)}</div>
          </div>
          <div className="glass rounded-xl p-3">
            <div className="text-gtb-muted text-xs mb-1">Daily Limit</div>
            <div className="text-white font-semibold">{fmt(account.dailyTransferLimit)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function OpenAccountModal({ onClose, onSuccess }) {
  const [type, setType] = useState('current');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const options = [
    { value: 'current',        label: 'Checking Account',   desc: 'Everyday spending, no limits' },
    { value: 'fixed-deposit',  label: 'Fixed Deposit',      desc: 'Higher interest, locked term' },
    { value: 'domiciliary',    label: 'Domiciliary Account', desc: 'Multi-currency foreign account' },
  ];

  async function handleOpen() {
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/account/open', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accountType: type }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      onSuccess();
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative glass-card rounded-3xl p-6 w-full max-w-sm animate-slide-up">
        <h3 className="text-white font-bold text-lg mb-4">Open New Account</h3>
        <div className="space-y-2 mb-5">
          {options.map(o => (
            <button
              key={o.value}
              onClick={() => setType(o.value)}
              className={`w-full flex items-start gap-3 p-4 rounded-xl text-left transition-all ${
                type === o.value ? 'bg-gtb-accent/10 border border-gtb-accent/40' : 'glass hover:border-white/20 border border-transparent'
              }`}
            >
              <div className={`w-4 h-4 rounded-full border-2 mt-0.5 flex-shrink-0 flex items-center justify-center ${type === o.value ? 'border-gtb-accent' : 'border-white/30'}`}>
                {type === o.value && <div className="w-2 h-2 rounded-full bg-gtb-accent" />}
              </div>
              <div>
                <div className="text-white text-sm font-semibold">{o.label}</div>
                <div className="text-gtb-muted text-xs">{o.desc}</div>
              </div>
            </button>
          ))}
        </div>
        {error && (
          <div className="flex items-center gap-2 text-gtb-danger text-sm bg-gtb-danger/10 rounded-xl p-3 mb-4">
            <AlertCircle size={14} /> {error}
          </div>
        )}
        <div className="flex gap-3">
          <button onClick={onClose} className="btn-ghost flex-1 justify-center">Cancel</button>
          <button onClick={handleOpen} disabled={loading} className="btn-primary flex-1 justify-center">
            {loading ? 'Opening…' : 'Open Account'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AccountsPage() {
  const { accounts, refetch } = useAuth();
  const [copied, setCopied]   = useState('');
  const [showOpen, setShowOpen] = useState(false);

  const handleCopy = (num) => {
    navigator.clipboard.writeText(num);
    setCopied(num);
    setTimeout(() => setCopied(''), 2000);
  };

  const totalBalance = accounts.reduce((s, a) => s + (a.availableBalance ?? a.balance ?? 0), 0);

  return (
    <div className="px-4 sm:px-6 py-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-black text-white">My Accounts</h1>
          <p className="text-gtb-muted text-sm">{accounts.length} account{accounts.length !== 1 ? 's' : ''} · Total {fmt(totalBalance)}</p>
        </div>
        <button onClick={() => setShowOpen(true)} className="btn-primary text-sm">
          <Plus size={16} /> New Account
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="glass-card rounded-2xl p-4 text-center">
          <div className="text-gtb-accent text-xl font-black">{fmt(totalBalance)}</div>
          <div className="text-gtb-muted text-xs mt-1">Total Balance</div>
        </div>
        <div className="glass-card rounded-2xl p-4 text-center">
          <div className="text-white text-xl font-black">{accounts.length}</div>
          <div className="text-gtb-muted text-xs mt-1">Accounts</div>
        </div>
        <div className="glass-card rounded-2xl p-4 text-center">
          <div className="text-gtb-success text-xl font-black">{accounts.filter(a => a.status === 'active').length}</div>
          <div className="text-gtb-muted text-xs mt-1">Active</div>
        </div>
      </div>

      {/* Account cards */}
      {accounts.length === 0 ? (
        <div className="text-center py-16">
          <Landmark size={40} className="text-gtb-muted mx-auto mb-3" />
          <p className="text-gtb-muted">No accounts found</p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2">
          {accounts.map(account => (
            <AccountCard key={account._id} account={account} onCopy={handleCopy} copied={copied} />
          ))}
        </div>
      )}

      {showOpen && (
        <OpenAccountModal
          onClose={() => setShowOpen(false)}
          onSuccess={() => { setShowOpen(false); refetch(); }}
        />
      )}
    </div>
  );
}
