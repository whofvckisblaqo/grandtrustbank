'use client';
import { useState } from 'react';
import { Eye, EyeOff, Copy, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

function fmt(n) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(n ?? 0);
}

export default function BalanceCard({ account, onSend, onReceive }) {
  const [visible, setVisible] = useState(true);
  const [copied, setCopied]   = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(account?.accountNumber ?? '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!account) {
    return (
      <div className="rounded-2xl h-48 shimmer" />
    );
  }

  return (
    <div
      className="relative rounded-2xl p-6 sm:p-7 overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #00453b 0%, #0B1020 55%, #050816 100%)',
        border: '1px solid rgba(0,224,184,0.2)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 40px rgba(0,224,184,0.06)',
      }}
    >
      {/* Background grid dots */}
      <div className="absolute inset-0 opacity-[0.04]"
        style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

      {/* Glow orb */}
      <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full animate-pulse-glow"
        style={{ background: 'radial-gradient(circle, rgba(0,224,184,0.15) 0%, transparent 70%)' }} />

      <div className="relative z-10">
        {/* Top row */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="text-white/50 text-xs mb-1 uppercase tracking-wider">
              {account.accountType} Account
            </div>
            <div className="flex items-center gap-2">
              <span className="text-white/70 text-sm">{account.accountNumber}</span>
              <button onClick={copy} className="text-gtb-muted hover:text-gtb-accent transition-colors">
                <Copy size={13} />
              </button>
              {copied && <span className="text-gtb-accent text-xs">Copied!</span>}
            </div>
          </div>
          <button
            onClick={() => setVisible(v => !v)}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all"
          >
            {visible ? <Eye size={15} /> : <EyeOff size={15} />}
          </button>
        </div>

        {/* Balance */}
        <div className="mb-6">
          <div className="text-white/40 text-xs mb-1">Available Balance</div>
          <div className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            {visible ? fmt(account.availableBalance ?? account.balance) : '$ ••••••'}
          </div>
          {account.balance !== account.availableBalance && visible && (
            <div className="text-white/40 text-xs mt-1">
              Ledger: {fmt(account.balance)}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button onClick={onSend} className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200"
            style={{ background: 'rgba(0,224,184,0.15)', border: '1px solid rgba(0,224,184,0.25)', color: '#00E0B8' }}
            onMouseOver={e => e.currentTarget.style.background = 'rgba(0,224,184,0.22)'}
            onMouseOut={e  => e.currentTarget.style.background = 'rgba(0,224,184,0.15)'}>
            <ArrowUpRight size={15} /> Send
          </button>
          <button onClick={onReceive} className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200"
            style={{ border: '1px solid rgba(255,255,255,0.12)' }}>
            <ArrowDownLeft size={15} /> Receive
          </button>
          <div className="ml-auto flex items-center gap-1.5">
            <div className={`w-2 h-2 rounded-full ${account.status === 'active' ? 'bg-gtb-success' : 'bg-gtb-warn'}`} />
            <span className="text-white/40 text-xs capitalize">{account.status}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
