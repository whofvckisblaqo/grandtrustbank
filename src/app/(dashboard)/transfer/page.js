'use client';
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import {
  Send, CheckCircle, AlertCircle, ArrowLeft, User,
  DollarSign, ChevronDown, ArrowLeftRight, Globe, Building2, Clock, Receipt
} from 'lucide-react';
import Link from 'next/link';
import TransactionReceipt from '@/components/TransactionReceipt';

const fmt = n => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n ?? 0);

function calcFee(amount, isOwn) {
  if (isOwn) return 0;
  if (amount <= 500)   return 0;
  if (amount <= 5000)  return 1.50;
  if (amount <= 25000) return 3.00;
  return 5.00;
}

const transferTypes = [
  {
    id:    'own',
    icon:  ArrowLeftRight,
    label: 'My Accounts',
    desc:  'Move money between your own accounts',
    color: '#00E0B8',
  },
  {
    id:    'internal',
    icon:  Building2,
    label: 'GTB Transfer',
    desc:  'Send to another Grand Trust Bank account',
    color: '#3B82F6',
  },
  {
    id:    'external',
    icon:  Globe,
    label: 'External Bank',
    desc:  'Send to any US or European bank account',
    color: '#A855F7',
  },
];

function SelectField({ label, value, onChange, options }) {
  return (
    <div>
      <label className="block text-gtb-muted text-xs mb-2 uppercase tracking-wider">{label}</label>
      <div className="input-wrap">
        <select
          value={value}
          onChange={e => onChange(e.target.value)}
          className="input-dark w-full appearance-none pr-12"
          style={{ backgroundColor: '#0B1020', color: '#fff' }}
        >
          {options.map(o => (
            <option key={o.value} value={o.value} style={{ backgroundColor: '#0B1020', color: '#fff' }}>
              {o.label}
            </option>
          ))}
        </select>
        <span className="input-icon-right pointer-events-none"><ChevronDown size={16} /></span>
      </div>
    </div>
  );
}

export default function TransferPage() {
  const { accounts } = useAuth();
  const [type, setType]           = useState('own');
  const [step, setStep]           = useState(1);
  const [fromId, setFromId]       = useState('');
  const [toAccountId, setToAccountId] = useState(''); // for own transfers
  const [toNumber, setToNumber]   = useState('');
  // External bank fields
  const [extBank, setExtBank]         = useState('');
  const [extRouting, setExtRouting]   = useState('');
  const [extAcctNum, setExtAcctNum]   = useState('');
  const [extAcctName, setExtAcctName] = useState('');
  const [recipient, setRecipient] = useState(null);
  const [recipientErr, setRecipientErr] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [amount, setAmount]       = useState('');
  const [narration, setNarration] = useState('');
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState('');
  const [result, setResult]       = useState(null);
  const [showReceipt, setShowReceipt] = useState(false);

  const active = accounts.filter(a => a.status === 'active');

  useEffect(() => {
    if (active.length && !fromId) {
      setFromId(active[0]._id);
      const others = active.filter(a => a._id !== active[0]._id);
      if (others.length) setToAccountId(others[0]._id);
    }
  }, [active.length]);

  const fromAccount = active.find(a => a._id === fromId) || active[0];
  const toAccount   = active.find(a => a._id === toAccountId);

  const isOwn    = type === 'own';
  const parsed   = parseFloat(amount) || 0;
  const fee      = calcFee(parsed, isOwn);
  const total    = parsed + fee;
  const hasEnough = fromAccount ? total <= (fromAccount.availableBalance ?? fromAccount.balance) : false;

  // Recipient verification for GTB internal
  const verifyAccount = useCallback(async (num) => {
    if (num.length < 10) { setRecipient(null); setRecipientErr(''); return; }
    setVerifying(true); setRecipientErr('');
    try {
      const res  = await fetch(`/api/account/verify?accountNumber=${num}`);
      const data = await res.json();
      if (!res.ok) { setRecipient(null); setRecipientErr(data.error || 'Account not found'); }
      else setRecipient(data);
    } catch { setRecipientErr('Could not verify account'); }
    finally { setVerifying(false); }
  }, []);

  useEffect(() => {
    if (type !== 'internal') return;
    const t = setTimeout(() => verifyAccount(toNumber), 600);
    return () => clearTimeout(t);
  }, [toNumber, verifyAccount, type]);

  // Effective toAccountNumber depending on type
  const isExternal = type === 'external';
  const effectiveToNumber = isOwn ? toAccount?.accountNumber : toNumber;
  const externalRef = isExternal ? `EXT-${extRouting}-${extAcctNum}` : null;
  const canSubmit = parsed >= 1 && hasEnough && fromId && (
    isOwn     ? (toAccountId && toAccountId !== fromId) :
    isExternal ? (extBank && extRouting.length === 9 && extAcctNum && extAcctName) :
    !!recipient
  );

  async function handleTransfer() {
    setLoading(true); setError('');
    try {
      const body = isExternal
        ? {
            fromAccountId: fromId,
            toAccountNumber: externalRef,
            amount: parsed,
            narration: narration || `Wire to ${extAcctName} at ${extBank}`,
            transferType: 'external',
            externalDetails: { bankName: extBank, routingNumber: extRouting, accountNumber: extAcctNum, accountName: extAcctName },
          }
        : {
            fromAccountId: fromId,
            toAccountNumber: effectiveToNumber,
            amount: parsed,
            narration,
            transferType: type,
          };

      const res = await fetch('/api/transaction/transfer', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResult(data);
      setStep(3);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }

  // ── Success screen ──
  if (step === 3 && result) {
    const isInstant = result.status === 'completed';

    // Build a receipt-shaped object from the transfer result
    const receiptTxn = {
      reference: result.reference,
      amount: result.amount,
      fee: result.fee,
      tax: result.tax,
      currency: fromAccount?.currency || 'USD',
      status: result.status,
      narration: narration || (isExternal ? `Wire to ${extAcctName}` : undefined),
      createdAt: new Date().toISOString(),
      type: 'transfer',
      fromLabel: `${fromAccount?.accountType === 'current' ? 'Checking' : fromAccount?.accountType}`,
      fromAccountNumber: fromAccount?.accountNumber,
      toLabel: result.recipient?.name,
      toAccountNumber: result.recipient?.accountNumber,
    };

    return (
      <div className="px-4 sm:px-6 py-6 max-w-lg mx-auto">
        <div className="glass-card rounded-3xl p-8 text-center">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${
            isInstant ? 'bg-gtb-success/10 border-2 border-gtb-success/30' : 'bg-gtb-warn/10 border-2 border-gtb-warn/30'
          }`}>
            {isInstant ? <CheckCircle size={40} className="text-gtb-success" /> : <Clock size={40} className="text-gtb-warn" />}
          </div>
          <h2 className="text-2xl font-black text-white mb-2">
            {isInstant ? 'Transfer Complete!' : 'Transfer Submitted!'}
          </h2>
          <p className="text-gtb-subtle mb-2">
            {isInstant ? 'Funds moved instantly between your accounts.' : 'Awaiting admin approval before funds move.'}
          </p>
          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-8 ${
            isInstant
              ? 'bg-gtb-success/10 border border-gtb-success/20 text-gtb-success'
              : 'bg-gtb-warn/10 border border-gtb-warn/20 text-gtb-warn'
          }`}>
            {isInstant ? <><CheckCircle size={12} /> Completed</> : <><Clock size={12} /> Pending Admin Review</>}
          </div>
          <div className="glass rounded-2xl p-5 mb-6 text-left space-y-3">
            <div className="flex justify-between text-sm"><span className="text-gtb-muted">Amount</span><span className="text-white font-bold">{fmt(result.amount)}</span></div>
            {result.fee > 0 && <div className="flex justify-between text-sm"><span className="text-gtb-muted">Fee</span><span className="text-white">{fmt(result.fee)}</span></div>}
            <div className="flex justify-between text-sm border-t border-white/10 pt-3"><span className="text-gtb-muted">To</span><span className="text-white font-semibold">{result.recipient?.name}</span></div>
            <div className="flex justify-between text-sm"><span className="text-gtb-muted">Account</span><span className="text-white font-mono text-xs">{result.recipient?.accountNumber}</span></div>
            <div className="flex justify-between text-sm"><span className="text-gtb-muted">Reference</span><span className="text-gtb-accent font-mono text-xs">{result.reference}</span></div>
          </div>

          <button onClick={() => setShowReceipt(true)} className="btn-ghost w-full justify-center mb-3">
            <Receipt size={16} /> View Receipt
          </button>

          <div className="flex gap-3">
            <button onClick={() => { setStep(1); setAmount(''); setNarration(''); setRecipient(null); setToNumber(''); setResult(null); }}
              className="btn-ghost flex-1 justify-center">New Transfer</button>
            <Link href="/transactions" className="btn-primary flex-1 justify-center">View Status</Link>
          </div>
        </div>

        {showReceipt && <TransactionReceipt txn={receiptTxn} onClose={() => setShowReceipt(false)} />}
      </div>
    );
  }

  // ── Form ──
  return (
    <div className="px-4 sm:px-6 py-6 max-w-lg mx-auto">
      <div className="mb-6 flex items-center gap-3">
        <Link href="/dashboard" className="text-gtb-muted hover:text-white transition-colors"><ArrowLeft size={20} /></Link>
        <div>
          <h1 className="text-xl font-black text-white">Send Money</h1>
          <p className="text-gtb-muted text-sm">Send money securely anywhere in the US or Europe</p>
        </div>
      </div>

      {/* Transfer type selector */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {transferTypes.map(t => (
          <button
            key={t.id}
            onClick={() => { if (!t.disabled) { setType(t.id); setError(''); setRecipient(null); setToNumber(''); } }}
            disabled={t.disabled}
            className={`relative flex flex-col items-center gap-2 p-4 rounded-2xl border text-center transition-all ${
              t.disabled
                ? 'opacity-40 cursor-not-allowed border-white/[0.06] bg-white/[0.02]'
                : type === t.id
                  ? 'border-gtb-accent/40 bg-gtb-accent/5'
                  : 'border-white/[0.08] bg-white/[0.02] hover:border-white/20'
            }`}
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${t.color}15`, border: `1px solid ${t.color}25` }}>
              <t.icon size={18} style={{ color: type === t.id || t.disabled ? t.color : '#64748b' }} />
            </div>
            <div className="text-xs font-semibold" style={{ color: type === t.id ? t.color : t.disabled ? '#64748b' : '#94a3b8' }}>{t.label}</div>
            {t.disabled && <div className="absolute top-2 right-2 text-[9px] bg-white/10 px-1.5 py-0.5 rounded-full text-gtb-muted">Soon</div>}
          </button>
        ))}
      </div>

      {/* Form card */}
      <div className="glass-card rounded-3xl p-6 space-y-5">

        {/* FROM account */}
        <SelectField
          label="From Account"
          value={fromId}
          onChange={setFromId}
          options={active.map(a => ({
            value: a._id,
            label: `${a.accountType === 'current' ? 'Checking' : a.accountType.charAt(0).toUpperCase() + a.accountType.slice(1)} — ${a.accountNumber} (${fmt(a.availableBalance ?? a.balance)})`,
          }))}
        />

        {/* TO — depends on type */}
        {type === 'own' && (
          <SelectField
            label="To Account"
            value={toAccountId}
            onChange={setToAccountId}
            options={active.filter(a => a._id !== fromId).map(a => ({
              value: a._id,
              label: `${a.accountType === 'current' ? 'Checking' : a.accountType.charAt(0).toUpperCase() + a.accountType.slice(1)} — ${a.accountNumber} (${fmt(a.availableBalance ?? a.balance)})`,
            }))}
          />
        )}

        {type === 'internal' && (
          <div>
            <label className="block text-gtb-muted text-xs mb-2 uppercase tracking-wider">Recipient GTB Account Number</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Enter GTB account number"
                value={toNumber}
                onChange={e => setToNumber(e.target.value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase())}
                className="input-dark w-full"
                maxLength={20}
              />
              {verifying && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-gtb-accent/30 border-t-gtb-accent rounded-full animate-spin" />
              )}
            </div>
            {recipient && (
              <div className="mt-2 flex items-center gap-2 text-gtb-success text-sm">
                <CheckCircle size={14} />
                <span className="font-semibold">{recipient.name}</span>
                <span className="text-gtb-muted capitalize">· {recipient.accountType === 'current' ? 'Checking' : recipient.accountType}</span>
              </div>
            )}
            {recipientErr && (
              <div className="mt-2 flex items-center gap-2 text-gtb-danger text-sm">
                <AlertCircle size={14} /> {recipientErr}
              </div>
            )}
          </div>
        )}

        {/* External bank fields */}
        {type === 'external' && (
          <>
            <div>
              <label className="block text-gtb-muted text-xs mb-2 uppercase tracking-wider">Bank Name</label>
              <input type="text" placeholder="e.g. Chase, Bank of America, Deutsche Bank" value={extBank} onChange={e => setExtBank(e.target.value)} className="input-dark w-full" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-gtb-muted text-xs mb-2 uppercase tracking-wider">Routing Number</label>
                <input type="text" placeholder="9-digit ABA number" value={extRouting} onChange={e => setExtRouting(e.target.value.replace(/\D/g, '').slice(0, 9))} className="input-dark w-full font-mono" maxLength={9} />
                {extRouting && extRouting.length !== 9 && <p className="text-gtb-danger text-xs mt-1">Must be 9 digits</p>}
              </div>
              <div>
                <label className="block text-gtb-muted text-xs mb-2 uppercase tracking-wider">Account Number / IBAN</label>
                <input
                  type="text"
                  placeholder="Account number or IBAN"
                  value={extAcctNum}
                  onChange={e => setExtAcctNum(e.target.value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 34))}
                  className="input-dark w-full font-mono"
                  maxLength={34}
                />
                <p className="text-gtb-muted text-[10px] mt-1">Supports US account numbers and European IBANs (up to 34 characters)</p>
              </div>
            </div>
            <div>
              <label className="block text-gtb-muted text-xs mb-2 uppercase tracking-wider">Account Holder Name</label>
              <input type="text" placeholder="Full name on account" value={extAcctName} onChange={e => setExtAcctName(e.target.value)} className="input-dark w-full" />
            </div>
          </>
        )}

        {/* AMOUNT */}
        <div>
          <label className="block text-gtb-muted text-xs mb-2 uppercase tracking-wider">Amount (USD)</label>
          <div className="relative">
            <DollarSign size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gtb-muted" />
            <input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              className="input-dark w-full pl-11 text-lg font-bold"
              min="1" step="0.01"
            />
          </div>
        </div>

        {/* NARRATION */}
        <div>
          <label className="block text-gtb-muted text-xs mb-2 uppercase tracking-wider">Note (Optional)</label>
          <input
            type="text"
            placeholder="What's this for?"
            value={narration}
            onChange={e => setNarration(e.target.value)}
            className="input-dark w-full"
            maxLength={100}
          />
        </div>

        {/* Fee breakdown */}
        {parsed > 0 && (
          <div className="glass rounded-xl p-4 space-y-2">
            <div className="flex justify-between text-sm"><span className="text-gtb-muted">Amount</span><span className="text-white">{fmt(parsed)}</span></div>
            <div className="flex justify-between text-sm"><span className="text-gtb-muted">Transfer Fee</span><span className="text-white">{fee === 0 ? 'Free' : fmt(fee)}</span></div>
            <div className="flex justify-between text-sm font-bold border-t border-white/10 pt-2">
              <span className="text-gtb-accent">Total Debit</span><span className="text-white">{fmt(total)}</span>
            </div>
            {!hasEnough && parsed > 0 && (
              <div className="flex items-center gap-2 text-gtb-danger text-xs"><AlertCircle size={12} /> Insufficient balance</div>
            )}
          </div>
        )}

        {/* Admin note — only for non-own transfers */}
        {type !== 'own' && (
          <div className="flex items-start gap-2 bg-gtb-warn/5 border border-gtb-warn/15 rounded-xl p-3 text-xs text-gtb-muted">
            <Clock size={13} className="text-gtb-warn flex-shrink-0 mt-0.5" />
            This transfer will be reviewed before funds are moved. Track status in Transactions.
          </div>
        )}
        {type === 'own' && (
          <div className="flex items-start gap-2 bg-gtb-success/5 border border-gtb-success/15 rounded-xl p-3 text-xs text-gtb-muted">
            <CheckCircle size={13} className="text-gtb-success flex-shrink-0 mt-0.5" />
            Transfers between your own accounts are processed instantly.
          </div>
        )}

        {error && (
          <div className="flex items-start gap-2 bg-gtb-danger/10 border border-gtb-danger/20 rounded-xl p-3 text-gtb-danger text-sm">
            <AlertCircle size={16} className="flex-shrink-0 mt-0.5" /> {error}
          </div>
        )}

        <button
          onClick={handleTransfer}
          disabled={loading || !canSubmit}
          className="btn-primary w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-gtb-dark/30 border-t-gtb-dark rounded-full animate-spin" /> Submitting…
            </div>
          ) : (
            <><Send size={16} /> Submit Transfer</>
          )}
        </button>
      </div>
    </div>
  );
}