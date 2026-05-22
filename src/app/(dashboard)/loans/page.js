'use client';
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import {
  Landmark, CheckCircle, Clock, XCircle, ArrowRight, X,
  DollarSign, Calendar, Percent, ChevronDown, AlertCircle,
  TrendingUp, ArrowLeft, Briefcase, GraduationCap, Home, Car, User
} from 'lucide-react';
import Link from 'next/link';

const fmt = n => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n ?? 0);
const fmtShort = n => {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `$${(n / 1_000).toFixed(1)}K`;
  return fmt(n);
};

const LOAN_TYPES = [
  { id: 'personal',  label: 'Personal Loan',   icon: User,           color: '#00E0B8', rate: 12.5, minMonths: 6,   maxMonths: 60,  min: 500,    max: 50000,    desc: 'For personal expenses, medical bills, or emergencies' },
  { id: 'business',  label: 'Business Loan',   icon: Briefcase,      color: '#3B82F6', rate: 9.5,  minMonths: 12,  maxMonths: 84,  min: 5000,   max: 500000,   desc: 'Grow your business with competitive financing' },
  { id: 'mortgage',  label: 'Mortgage',        icon: Home,           color: '#A855F7', rate: 5.5,  minMonths: 60,  maxMonths: 360, min: 50000,  max: 2000000,  desc: 'Finance your dream home at great rates' },
  { id: 'auto',      label: 'Auto Loan',       icon: Car,            color: '#F59E0B', rate: 7.5,  minMonths: 24,  maxMonths: 84,  min: 5000,   max: 100000,   desc: 'Drive away with flexible car financing' },
  { id: 'education', label: 'Education Loan',  icon: GraduationCap,  color: '#22C55E', rate: 6.5,  minMonths: 12,  maxMonths: 120, min: 1000,   max: 100000,   desc: 'Invest in your future with student financing' },
];

const STATUS_MAP = {
  pending:   { label: 'Under Review', color: '#F59E0B', bg: 'bg-gtb-warn/10 border-gtb-warn/20',    icon: Clock },
  approved:  { label: 'Approved',     color: '#22C55E', bg: 'bg-gtb-success/10 border-gtb-success/20', icon: CheckCircle },
  rejected:  { label: 'Rejected',     color: '#EF4444', bg: 'bg-gtb-danger/10 border-gtb-danger/20',  icon: XCircle },
  active:    { label: 'Active',       color: '#00E0B8', bg: 'bg-gtb-accent/10 border-gtb-accent/20',  icon: TrendingUp },
  completed: { label: 'Completed',    color: '#64748b', bg: 'bg-white/5 border-white/10',              icon: CheckCircle },
};

function calcMonthly(principal, annualRate, months) {
  const r = annualRate / 100 / 12;
  if (r === 0) return principal / months;
  return (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
}

function LoanCard({ loan }) {
  const s    = STATUS_MAP[loan.status] || STATUS_MAP.pending;
  const Icon = s.icon;
  const type = LOAN_TYPES.find(t => t.id === loan.type);
  const TypeIcon = type?.icon || Landmark;
  return (
    <div className="glass-card rounded-2xl p-5 card-hover">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: `${type?.color || '#00E0B8'}15`, border: `1px solid ${type?.color || '#00E0B8'}25` }}>
            <TypeIcon size={18} style={{ color: type?.color || '#00E0B8' }} />
          </div>
          <div>
            <div className="text-white font-semibold text-sm capitalize">{loan.type} Loan</div>
            <div className="text-gtb-muted text-xs">{new Date(loan.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
          </div>
        </div>
        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold ${s.bg}`} style={{ color: s.color }}>
          <Icon size={11} /> {s.label}
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
        <div>
          <div className="text-gtb-muted text-[10px] uppercase tracking-wider">Amount</div>
          <div className="text-white font-bold text-sm mt-0.5">{fmt(loan.amount)}</div>
        </div>
        <div>
          <div className="text-gtb-muted text-[10px] uppercase tracking-wider">Monthly</div>
          <div className="text-white font-bold text-sm mt-0.5">{fmt(loan.monthlyPayment)}</div>
        </div>
        <div>
          <div className="text-gtb-muted text-[10px] uppercase tracking-wider">Duration</div>
          <div className="text-white font-bold text-sm mt-0.5">{loan.duration} months</div>
        </div>
        <div>
          <div className="text-gtb-muted text-[10px] uppercase tracking-wider">Rate</div>
          <div className="text-white font-bold text-sm mt-0.5">{loan.interestRate}% APR</div>
        </div>
      </div>
      {loan.purpose && (
        <div className="text-gtb-muted text-xs italic px-3 py-2 glass rounded-lg">"{loan.purpose}"</div>
      )}
      {loan.adminNotes && (
        <div className="mt-2 text-xs text-gtb-subtle px-3 py-2 glass rounded-lg">Note: {loan.adminNotes}</div>
      )}
    </div>
  );
}

function ApplyModal({ onClose, accounts, onSuccess }) {
  const [step, setStep]         = useState(0); // 0=type, 1=details, 2=purpose
  const [loanType, setLoanType] = useState(null);
  const [amount, setAmount]     = useState('');
  const [duration, setDuration] = useState('');
  const [purpose, setPurpose]   = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  const config = loanType ? LOAN_TYPES.find(t => t.id === loanType) : null;
  const parsed  = parseFloat(amount) || 0;
  const months  = parseInt(duration) || 0;
  const monthly = config && parsed && months ? calcMonthly(parsed, config.rate, months) : 0;
  const total   = monthly * months;
  const interest = total - parsed;

  async function submit() {
    setError(''); setLoading(true);
    try {
      const res  = await fetch('/api/loans/apply', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: loanType, amount: parsed, duration: months, purpose }),
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
      <div className="relative glass-card rounded-3xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto animate-slide-up"
        style={{ boxShadow: '0 32px 80px rgba(0,0,0,0.7)' }}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            {step > 0 && (
              <button onClick={() => setStep(s => s - 1)} className="text-gtb-muted hover:text-white">
                <ArrowLeft size={18} />
              </button>
            )}
            <h2 className="text-white font-black text-lg">Apply for Loan</h2>
          </div>
          <button onClick={onClose} className="text-gtb-muted hover:text-white"><X size={20} /></button>
        </div>

        {/* Step indicator */}
        <div className="flex gap-2 mb-6">
          {['Type', 'Details', 'Purpose'].map((s, i) => (
            <div key={s} className={`flex-1 h-1 rounded-full transition-colors ${i <= step ? 'bg-gtb-accent' : 'bg-white/10'}`} />
          ))}
        </div>

        {error && (
          <div className="flex items-center gap-2 bg-gtb-danger/10 border border-gtb-danger/20 rounded-xl p-3 text-gtb-danger text-sm mb-4">
            <AlertCircle size={14} /> {error}
          </div>
        )}

        {/* Step 0: Loan type */}
        {step === 0 && (
          <div className="space-y-3">
            {LOAN_TYPES.map(t => {
              const TIcon = t.icon;
              return (
                <button key={t.id} onClick={() => { setLoanType(t.id); setStep(1); }}
                  className="w-full flex items-center gap-4 p-4 glass-card rounded-2xl hover:border-gtb-accent/30 transition-all text-left border border-transparent">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `${t.color}15`, border: `1px solid ${t.color}25` }}>
                    <TIcon size={20} style={{ color: t.color }} />
                  </div>
                  <div className="flex-1">
                    <div className="text-white font-semibold text-sm">{t.label}</div>
                    <div className="text-gtb-muted text-xs mt-0.5">{t.desc}</div>
                  </div>
                  <div className="text-gtb-accent text-sm font-bold">{t.rate}%</div>
                  <ArrowRight size={16} className="text-gtb-muted" />
                </button>
              );
            })}
          </div>
        )}

        {/* Step 1: Amount & duration */}
        {step === 1 && config && (
          <div className="space-y-4">
            <div className="glass rounded-xl p-4 flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${config.color}15` }}>
                <config.icon size={16} style={{ color: config.color }} />
              </div>
              <div>
                <div className="text-white font-semibold text-sm">{config.label}</div>
                <div className="text-gtb-muted text-xs">{config.rate}% APR · {config.minMonths}–{config.maxMonths} months</div>
              </div>
            </div>

            <div>
              <label className="block text-gtb-muted text-xs mb-2 uppercase tracking-wider">Loan Amount</label>
              <div className="input-wrap">
                <span className="input-icon-left"><DollarSign size={16} /></span>
                <input type="number" value={amount} onChange={e => setAmount(e.target.value)}
                  placeholder={`${config.min.toLocaleString()} – ${config.max.toLocaleString()}`}
                  className="input-dark w-full pl-11" min={config.min} max={config.max} />
              </div>
              <div className="text-gtb-muted text-xs mt-1">Min: {fmt(config.min)} · Max: {fmtShort(config.max)}</div>
            </div>

            <div>
              <label className="block text-gtb-muted text-xs mb-2 uppercase tracking-wider">Loan Duration</label>
              <div className="input-wrap">
                <span className="input-icon-left"><Calendar size={16} /></span>
                <select value={duration} onChange={e => setDuration(e.target.value)}
                  className="input-dark w-full pl-11 appearance-none pr-12"
                  style={{ backgroundColor: '#0B1020', color: '#fff' }}>
                  <option value="">Select duration</option>
                  {Array.from({ length: Math.min(25, (config.maxMonths - config.minMonths) / 6 + 1) }, (_, i) => {
                    const m = config.minMonths + i * 6;
                    if (m > config.maxMonths) return null;
                    return <option key={m} value={m}>{m} months ({(m / 12).toFixed(1)} years)</option>;
                  }).filter(Boolean)}
                </select>
                <span className="input-icon-right pointer-events-none"><ChevronDown size={16} /></span>
              </div>
            </div>

            {monthly > 0 && (
              <div className="glass rounded-xl p-4 space-y-2">
                <div className="text-white font-semibold text-sm mb-3">Repayment Summary</div>
                <div className="flex justify-between text-sm"><span className="text-gtb-muted">Monthly Payment</span><span className="text-white font-bold">{fmt(monthly)}</span></div>
                <div className="flex justify-between text-sm"><span className="text-gtb-muted">Total Interest</span><span className="text-gtb-warn">{fmt(interest)}</span></div>
                <div className="flex justify-between text-sm border-t border-white/10 pt-2"><span className="text-gtb-accent font-semibold">Total Repayable</span><span className="text-white font-bold">{fmt(total)}</span></div>
              </div>
            )}

            <button onClick={() => setStep(2)} disabled={!parsed || !months}
              className="btn-primary w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed">
              Continue <ArrowRight size={16} />
            </button>
          </div>
        )}

        {/* Step 2: Purpose */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <label className="block text-gtb-muted text-xs mb-2 uppercase tracking-wider">Loan Purpose</label>
              <textarea
                value={purpose}
                onChange={e => setPurpose(e.target.value)}
                placeholder="Briefly describe what this loan will be used for…"
                rows={4}
                className="input-dark w-full resize-none"
                maxLength={500}
              />
              <div className="text-gtb-muted text-xs mt-1 text-right">{purpose.length}/500</div>
            </div>

            <div className="glass rounded-xl p-4 space-y-2">
              <div className="text-white font-semibold text-sm mb-3">Application Summary</div>
              {[
                ['Type', config?.label],
                ['Amount', fmt(parsed)],
                ['Duration', `${months} months`],
                ['Rate', `${config?.rate}% APR`],
                ['Monthly Payment', fmt(monthly)],
                ['Total Repayable', fmt(monthly * months)],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between text-sm">
                  <span className="text-gtb-muted">{k}</span>
                  <span className="text-white font-medium">{v}</span>
                </div>
              ))}
            </div>

            <button onClick={submit} disabled={loading || !purpose.trim()}
              className="btn-primary w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-gtb-dark/30 border-t-gtb-dark rounded-full animate-spin" />
                  Submitting…
                </span>
              ) : 'Submit Application'}
            </button>

            <div className="flex items-start gap-2 bg-gtb-warn/5 border border-gtb-warn/15 rounded-xl p-3 text-xs text-gtb-muted">
              <Clock size={13} className="text-gtb-warn flex-shrink-0 mt-0.5" />
              Applications are reviewed by our team within 1–3 business days. Approved loans are instantly disbursed to your account.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function LoansPage() {
  const { accounts } = useAuth();
  const [loans, setLoans]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [showApply, setShowApply] = useState(false);
  const [success, setSuccess]   = useState(false);

  const fetchLoans = useCallback(async () => {
    setLoading(true);
    try {
      const res  = await fetch('/api/loans');
      const data = await res.json();
      setLoans(data.loans || []);
    } catch { setLoans([]); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchLoans(); }, [fetchLoans]);

  function handleSuccess() {
    setShowApply(false);
    setSuccess(true);
    fetchLoans();
    setTimeout(() => setSuccess(false), 4000);
  }

  const totalBorrowed = loans.filter(l => ['approved', 'active'].includes(l.status)).reduce((s, l) => s + l.amount, 0);
  const pending       = loans.filter(l => l.status === 'pending').length;

  return (
    <div className="px-4 sm:px-6 py-6 max-w-3xl mx-auto">
      {showApply && <ApplyModal onClose={() => setShowApply(false)} accounts={accounts} onSuccess={handleSuccess} />}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-black text-white">Loans</h1>
          <p className="text-gtb-muted text-sm">Flexible financing for every need</p>
        </div>
        <button onClick={() => setShowApply(true)} className="btn-primary text-sm py-2.5 px-5">
          Apply Now <ArrowRight size={15} />
        </button>
      </div>

      {success && (
        <div className="flex items-center gap-3 bg-gtb-success/10 border border-gtb-success/20 rounded-2xl p-4 mb-5 animate-fade-in">
          <CheckCircle size={18} className="text-gtb-success flex-shrink-0" />
          <div>
            <div className="text-white font-semibold text-sm">Application Submitted!</div>
            <div className="text-gtb-muted text-xs">We'll review your application and respond within 1–3 business days.</div>
          </div>
        </div>
      )}

      {/* Stats */}
      {loans.length > 0 && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: 'Total Borrowed', value: fmt(totalBorrowed), color: '#00E0B8' },
            { label: 'Active Loans',  value: loans.filter(l => ['approved','active'].includes(l.status)).length, color: '#3B82F6' },
            { label: 'Under Review',  value: pending, color: '#F59E0B' },
          ].map(({ label, value, color }) => (
            <div key={label} className="glass-card rounded-2xl p-4 text-center">
              <div className="text-gtb-muted text-[10px] uppercase tracking-wider mb-1">{label}</div>
              <div className="text-white font-black text-lg" style={{ color }}>{value}</div>
            </div>
          ))}
        </div>
      )}

      {/* Loans list */}
      {loading ? (
        <div className="space-y-4">{[1,2,3].map(i => <div key={i} className="glass-card rounded-2xl p-5 shimmer h-36" />)}</div>
      ) : loans.length === 0 ? (
        <div className="glass-card rounded-3xl p-12 text-center">
          <div className="w-20 h-20 rounded-full bg-gtb-accent/10 border border-gtb-accent/20 flex items-center justify-center mx-auto mb-5">
            <Landmark size={36} className="text-gtb-accent" />
          </div>
          <h3 className="text-white font-bold text-lg mb-2">No Loans Yet</h3>
          <p className="text-gtb-muted text-sm mb-6 max-w-sm mx-auto">
            Apply for a personal, business, mortgage, auto, or education loan with competitive rates.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6 max-w-md mx-auto">
            {LOAN_TYPES.map(t => (
              <div key={t.id} className="glass rounded-xl p-3 text-center">
                <div className="text-white text-xs font-semibold">{t.label}</div>
                <div className="font-bold text-sm mt-0.5" style={{ color: t.color }}>{t.rate}% APR</div>
              </div>
            ))}
          </div>
          <button onClick={() => setShowApply(true)} className="btn-primary justify-center">
            Apply for a Loan <ArrowRight size={16} />
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {loans.map(loan => <LoanCard key={loan._id} loan={loan} />)}
        </div>
      )}
    </div>
  );
}
