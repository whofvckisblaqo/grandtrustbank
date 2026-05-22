'use client';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Zap, Wifi, Phone, Droplets, Flame, Tv, Shield, Home, Car, MoreHorizontal, CheckCircle, AlertCircle, ArrowLeft, ChevronDown } from 'lucide-react';

const fmt = n => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n ?? 0);

const categories = [
  { id: 'electricity', name: 'Electricity',  icon: Zap,          color: '#FFB020', bg: 'rgba(255,176,32,0.12)',  companies: ['ConEd', 'PECO Energy', 'National Grid', 'Duke Energy', 'Florida Power & Light'] },
  { id: 'internet',   name: 'Internet',      icon: Wifi,         color: '#00E0B8', bg: 'rgba(0,224,184,0.12)',   companies: ['Comcast Xfinity', 'AT&T Fiber', 'Spectrum', 'Verizon Fios', 'Cox Communications'] },
  { id: 'mobile',     name: 'Mobile Phone',  icon: Phone,        color: '#7C3AED', bg: 'rgba(124,58,237,0.12)',  companies: ['T-Mobile', 'AT&T Wireless', 'Verizon', 'Google Fi', 'Mint Mobile'] },
  { id: 'water',      name: 'Water Bill',    icon: Droplets,     color: '#3B82F6', bg: 'rgba(59,130,246,0.12)',  companies: ['American Water', 'Aqua America', 'City Water Dept', 'United Water'] },
  { id: 'gas',        name: 'Natural Gas',   icon: Flame,        color: '#F97316', bg: 'rgba(249,115,22,0.12)',  companies: ['National Gas', 'Piedmont Natural Gas', 'Atmos Energy', 'Nicor Gas'] },
  { id: 'tv',         name: 'TV / Cable',    icon: Tv,           color: '#EC4899', bg: 'rgba(236,72,153,0.12)',  companies: ['Comcast Xfinity TV', 'DirecTV', 'DISH Network', 'Spectrum TV', 'Hulu + Live TV'] },
  { id: 'insurance',  name: 'Insurance',     icon: Shield,       color: '#22C55E', bg: 'rgba(34,197,94,0.12)',   companies: ['State Farm', 'Allstate', 'Geico', 'Progressive', 'Liberty Mutual'] },
  { id: 'mortgage',   name: 'Mortgage/Rent', icon: Home,         color: '#A855F7', bg: 'rgba(168,85,247,0.12)',  companies: ['Wells Fargo Mortgage', 'Bank of America', 'Chase Home', 'Rocket Mortgage', 'My Landlord'] },
  { id: 'auto',       name: 'Auto Loan',     icon: Car,          color: '#14B8A6', bg: 'rgba(20,184,166,0.12)',  companies: ['Chase Auto', 'Capital One Auto', 'TD Auto Finance', 'Ally Financial'] },
  { id: 'other',      name: 'Other Bills',   icon: MoreHorizontal, color: '#94A3B8', bg: 'rgba(148,163,184,0.12)', companies: ['Other Biller'] },
];

export default function BillsPage() {
  const { accounts } = useAuth();
  const [step, setStep]           = useState('select');
  const [category, setCategory]   = useState(null);
  const [company, setCompany]     = useState('');
  const [billerRef, setBillerRef] = useState('');
  const [amount, setAmount]       = useState('');
  const [fromId, setFromId]       = useState('');
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState('');
  const [result, setResult]       = useState(null);

  const activeAccounts = accounts.filter(a => a.status === 'active');

  function selectCategory(cat) {
    setCategory(cat);
    setCompany(cat.companies[0]);
    setFromId(activeAccounts[0]?._id || '');
    setStep('form');
  }

  async function handlePay() {
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/bills/pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fromAccountId: fromId, biller: company, billerRef, amount: parseFloat(amount), category: category.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResult(data);
      setStep('success');
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }

  if (step === 'success' && result) {
    return (
      <div className="px-4 sm:px-6 py-6 max-w-lg mx-auto">
        <div className="glass-card rounded-3xl p-8 text-center">
          <div className="w-20 h-20 rounded-full bg-gtb-success/10 border-2 border-gtb-success/30 flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-gtb-success" />
          </div>
          <h2 className="text-2xl font-black text-white mb-2">Payment Successful!</h2>
          <p className="text-gtb-subtle mb-8">Your bill has been paid</p>
          <div className="glass rounded-2xl p-5 mb-6 text-left space-y-3">
            <div className="flex justify-between text-sm"><span className="text-gtb-muted">Biller</span><span className="text-white font-semibold">{company}</span></div>
            <div className="flex justify-between text-sm"><span className="text-gtb-muted">Amount Paid</span><span className="text-white font-bold">{fmt(parseFloat(amount))}</span></div>
            <div className="flex justify-between text-sm"><span className="text-gtb-muted">Reference</span><span className="text-gtb-accent font-mono text-xs">{result.reference}</span></div>
            <div className="flex justify-between text-sm border-t border-white/10 pt-3"><span className="text-gtb-muted">New Balance</span><span className="text-white font-bold">{fmt(result.newBalance)}</span></div>
          </div>
          <div className="flex gap-3">
            <button onClick={() => { setStep('select'); setCategory(null); setAmount(''); setBillerRef(''); setResult(null); }} className="btn-ghost flex-1 justify-center">Pay Another</button>
            <button onClick={() => setStep('select')} className="btn-primary flex-1 justify-center">Done</button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'form' && category) {
    const fromAccount = activeAccounts.find(a => a._id === fromId);
    return (
      <div className="px-4 sm:px-6 py-6 max-w-lg mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => setStep('select')} className="text-gtb-muted hover:text-white transition-colors"><ArrowLeft size={20} /></button>
          <div>
            <h1 className="text-xl font-black text-white">{category.name}</h1>
            <p className="text-gtb-muted text-sm">Pay your bill securely</p>
          </div>
        </div>

        <div className="glass-card rounded-3xl p-6 space-y-5">
          {/* Category icon */}
          <div className="flex items-center gap-4 p-4 glass rounded-2xl">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: category.bg, border: `1px solid ${category.color}30` }}>
              <category.icon size={22} style={{ color: category.color }} />
            </div>
            <div>
              <div className="text-white font-semibold">{category.name}</div>
              <div className="text-gtb-muted text-xs">Select biller and enter details</div>
            </div>
          </div>

          {/* Biller / Company */}
          <div>
            <label className="block text-gtb-muted text-xs mb-2 uppercase tracking-wider">Biller</label>
            <div className="input-wrap">
              <select value={company} onChange={e => setCompany(e.target.value)} className="input-dark w-full appearance-none pr-12">
                {category.companies.map(c => <option key={c}>{c}</option>)}
              </select>
              <span className="input-icon-right pointer-events-none"><ChevronDown size={16} /></span>
            </div>
          </div>

          {/* Biller reference */}
          <div>
            <label className="block text-gtb-muted text-xs mb-2 uppercase tracking-wider">Account / Meter Number</label>
            <input
              type="text"
              placeholder="Enter your reference number"
              value={billerRef}
              onChange={e => setBillerRef(e.target.value)}
              className="input-dark w-full"
            />
          </div>

          {/* From account */}
          <div>
            <label className="block text-gtb-muted text-xs mb-2 uppercase tracking-wider">Pay From</label>
            <div className="input-wrap">
              <select value={fromId} onChange={e => setFromId(e.target.value)} className="input-dark w-full appearance-none pr-12">
                {activeAccounts.map(a => (
                  <option key={a._id} value={a._id}>
                    {a.accountType === 'current' ? 'Checking' : a.accountType} — {fmt(a.availableBalance ?? a.balance)}
                  </option>
                ))}
              </select>
              <span className="input-icon-right pointer-events-none"><ChevronDown size={16} /></span>
            </div>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-gtb-muted text-xs mb-2 uppercase tracking-wider">Amount (USD)</label>
            <input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              className="input-dark w-full text-lg font-bold"
              min="1" step="0.01"
            />
            {fromAccount && parseFloat(amount) > (fromAccount.availableBalance ?? fromAccount.balance) && (
              <div className="flex items-center gap-2 text-gtb-danger text-xs mt-1"><AlertCircle size={12} /> Insufficient balance</div>
            )}
          </div>

          {error && (
            <div className="flex items-start gap-2 bg-gtb-danger/10 border border-gtb-danger/20 rounded-xl p-3 text-gtb-danger text-sm">
              <AlertCircle size={16} className="flex-shrink-0 mt-0.5" /> {error}
            </div>
          )}

          <button
            onClick={handlePay}
            disabled={loading || !amount || parseFloat(amount) < 1 || !fromId || (fromAccount && parseFloat(amount) > (fromAccount.availableBalance ?? fromAccount.balance))}
            className="btn-primary w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-gtb-dark/30 border-t-gtb-dark rounded-full animate-spin" /> Processing…</div>
            ) : `Pay ${amount ? fmt(parseFloat(amount)) : ''}`}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 py-6 max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-black text-white">Bill Payments</h1>
        <p className="text-gtb-muted text-sm">Pay all your bills in one place</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => selectCategory(cat)}
            className="glass-card rounded-2xl p-5 flex flex-col items-center gap-3 card-hover text-center group"
          >
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110" style={{ background: cat.bg, border: `1px solid ${cat.color}30` }}>
              <cat.icon size={24} style={{ color: cat.color }} />
            </div>
            <span className="text-white text-xs font-semibold leading-tight">{cat.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
