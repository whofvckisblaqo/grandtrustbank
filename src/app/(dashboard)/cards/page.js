'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Plus, Eye, EyeOff, Snowflake, Unlock, Copy, CheckCircle, AlertCircle, CreditCard } from 'lucide-react';

const fmt = n => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n ?? 0);

function formatNumber(n) {
  return (n || '').replace(/(.{4})/g, '$1 ').trim();
}

const cardGradient = (type, network) => {
  if (type === 'credit') return 'linear-gradient(135deg, #d4a020 0%, #8B6914 50%, #1a0a00 100%)';
  if (network === 'mastercard') return 'linear-gradient(135deg, #3B82F6 0%, #1e3a8a 50%, #0B1020 100%)';
  return 'linear-gradient(135deg, #00E0B8 0%, #0d3d35 50%, #0B1020 100%)';
};

function FlipCard({ card, onToggleFreeze, toggling }) {
  const [flipped, setFlipped] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);

  const masked = `**** **** **** ${card.last4}`;
  const full = formatNumber(card.fullNumber);

  function copyNumber(e) {
    e.stopPropagation();
    navigator.clipboard.writeText(card.fullNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="space-y-4">
      {/* 3D Card */}
      <div style={{ perspective: '1000px' }} onClick={() => setFlipped(f => !f)} className="cursor-pointer select-none">
        <div style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '1.586',
          transformStyle: 'preserve-3d',
          transition: 'transform 0.7s cubic-bezier(0.4, 0.2, 0.2, 1)',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}>

          {/* FRONT */}
          <div style={{
            position: 'absolute', inset: 0,
            backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden',
            background: cardGradient(card.cardType, card.network),
            borderRadius: '20px', padding: '24px', overflow: 'hidden',
            boxShadow: card.status === 'frozen'
              ? '0 20px 60px rgba(59,130,246,0.3)'
              : '0 20px 60px rgba(0,224,184,0.25)',
          }}>
            {/* Dot grid */}
            <div style={{ position: 'absolute', inset: 0, opacity: 0.06, backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

            {/* Frozen overlay */}
            {card.status === 'frozen' && (
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
                <div style={{ textAlign: 'center' }}>
                  <Snowflake size={32} color="#60a5fa" />
                  <div style={{ color: '#93c5fd', fontSize: '13px', fontWeight: 600, marginTop: 8 }}>Card Frozen</div>
                </div>
              </div>
            )}

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, position: 'relative', zIndex: 1 }}>
              <div>
                <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: 11 }}>Grand Trust Bank</div>
                <div style={{ color: 'white', fontWeight: 700, fontSize: 12 }}>{card.cardType.toUpperCase()} · {card.isVirtual ? 'VIRTUAL' : 'PHYSICAL'}</div>
              </div>
              {card.network === 'visa' ? (
                <div style={{ color: 'white', fontStyle: 'italic', fontSize: 22, fontWeight: 900, letterSpacing: '-1px' }}>VISA</div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{ width: 26, height: 26, borderRadius: '50%', background: '#eb001b' }} />
                  <div style={{ width: 26, height: 26, borderRadius: '50%', background: '#f79e1b', marginLeft: -10, opacity: 0.9 }} />
                </div>
              )}
            </div>

            {/* Chip */}
            <div style={{ width: 40, height: 30, borderRadius: 6, background: 'linear-gradient(135deg,#f0c040,#d4a020)', boxShadow: '0 2px 8px rgba(240,192,64,0.4)', marginBottom: 16, position: 'relative', zIndex: 1 }} />

            {/* Card number */}
            <div style={{ color: 'white', fontSize: 17, fontWeight: 700, letterSpacing: '3px', marginBottom: 16, fontFamily: 'monospace', position: 'relative', zIndex: 1 }}>
              {masked}
            </div>

            {/* Name + expiry */}
            <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', zIndex: 1 }}>
              <div>
                <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: 9, marginBottom: 2, textTransform: 'uppercase' }}>Cardholder</div>
                <div style={{ color: 'white', fontSize: 13, fontWeight: 600 }}>{card.cardName}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: 9, marginBottom: 2, textTransform: 'uppercase' }}>Expires</div>
                <div style={{ color: 'white', fontSize: 13, fontWeight: 600 }}>{card.expiryMonth}/{card.expiryYear}</div>
              </div>
            </div>
          </div>

          {/* BACK */}
          <div style={{
            position: 'absolute', inset: 0,
            backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            background: '#0d1117',
            borderRadius: '20px', overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}>
            {/* Magnetic stripe */}
            <div style={{ width: '100%', height: 50, background: '#111', marginTop: 28 }} />

            {/* Signature strip */}
            <div style={{ padding: '16px 24px' }}>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10, marginBottom: 6 }}>AUTHORIZED SIGNATURE</div>
              <div style={{ background: 'linear-gradient(90deg, #f0f0f0, #e0e0e0)', borderRadius: 4, padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontStyle: 'italic', color: '#333', fontSize: 12, letterSpacing: 1 }}>{card.cardName}</div>
                <div style={{ background: 'white', padding: '2px 10px', borderRadius: 4, fontWeight: 700, color: '#111', fontFamily: 'monospace', fontSize: 14, letterSpacing: 2 }}>
                  {revealed ? card.cvv : '•••'}
                </div>
              </div>
              <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 10, textAlign: 'right', marginTop: 3 }}>CVV / CVC</div>

              <div style={{ marginTop: 16, fontFamily: 'monospace', fontSize: 13, color: revealed ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.4)', letterSpacing: 3 }}>
                {revealed ? full : '**** **** **** ' + card.last4}
              </div>
            </div>

            {/* Footer */}
            <div style={{ position: 'absolute', bottom: 18, left: 24, right: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 10 }}>Grand Trust Bank · grandtrustbank.com</div>
              <button
                onClick={e => { e.stopPropagation(); setRevealed(r => !r); }}
                style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#00E0B8', fontSize: 11, background: 'none', border: 'none', cursor: 'pointer' }}
              >
                {revealed ? <EyeOff size={13} /> : <Eye size={13} />}
                {revealed ? 'Hide' : 'Reveal'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <p className="text-gtb-muted text-xs text-center">Click card to flip · Tap Reveal on back to show details</p>

      {/* Actions */}
      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={e => { e.stopPropagation(); copyNumber(e); }}
          className={`flex flex-col items-center gap-1.5 p-3 rounded-xl text-xs font-medium transition-all ${
            copied ? 'bg-gtb-success/10 text-gtb-success' : 'glass text-gtb-subtle hover:text-white'
          }`}
        >
          {copied ? <CheckCircle size={16} /> : <Copy size={16} />}
          {copied ? 'Copied!' : 'Copy No.'}
        </button>

        <button
          onClick={() => onToggleFreeze(card._id, card.status)}
          disabled={toggling === card._id}
          className={`flex flex-col items-center gap-1.5 p-3 rounded-xl text-xs font-medium transition-all ${
            card.status === 'frozen'
              ? 'bg-gtb-accent/10 text-gtb-accent hover:bg-gtb-accent/20'
              : 'bg-blue-500/10 text-blue-400 hover:bg-blue-500/20'
          } disabled:opacity-50`}
        >
          {card.status === 'frozen' ? <Unlock size={16} /> : <Snowflake size={16} />}
          {toggling === card._id ? '…' : card.status === 'frozen' ? 'Unfreeze' : 'Freeze'}
        </button>

        <div className={`flex flex-col items-center gap-1.5 p-3 rounded-xl text-xs font-medium glass text-gtb-subtle`}>
          <div className={`w-2 h-2 rounded-full ${card.status === 'active' ? 'bg-gtb-success' : 'bg-blue-400'}`} />
          {card.status.charAt(0).toUpperCase() + card.status.slice(1)}
        </div>
      </div>

      {/* Credit info */}
      {card.cardType === 'credit' && (
        <div className="glass-card rounded-xl p-4 grid grid-cols-2 gap-3 text-sm">
          <div><div className="text-gtb-muted text-xs mb-1">Credit Limit</div><div className="text-white font-bold">{fmt(card.creditLimit)}</div></div>
          <div><div className="text-gtb-muted text-xs mb-1">Available Credit</div><div className="text-gtb-success font-bold">{fmt(card.availableCredit)}</div></div>
        </div>
      )}
    </div>
  );
}

function RequestCardModal({ accounts, onClose, onSuccess }) {
  const [accountId, setAccountId] = useState(accounts[0]?._id || '');
  const [cardType, setCardType]   = useState('debit');
  const [network, setNetwork]     = useState('visa');
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState('');

  async function handleCreate() {
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/card', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accountId, cardType, network }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      onSuccess(data.card);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative glass-card rounded-3xl p-6 w-full max-w-sm animate-slide-up space-y-5">
        <h3 className="text-white font-bold text-lg">Request New Card</h3>

        <div>
          <label className="text-gtb-muted text-xs mb-2 block uppercase tracking-wider">Linked Account</label>
          <select value={accountId} onChange={e => setAccountId(e.target.value)} className="input-dark w-full">
            {accounts.map(a => (
              <option key={a._id} value={a._id}>
                {a.accountType === 'current' ? 'Checking' : a.accountType} — {a.accountNumber}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-gtb-muted text-xs mb-2 block uppercase tracking-wider">Card Type</label>
          <div className="grid grid-cols-2 gap-2">
            {[{ v: 'debit', l: 'Debit Card' }, { v: 'credit', l: 'Credit Card' }].map(o => (
              <button key={o.v} onClick={() => setCardType(o.v)}
                className={`p-3 rounded-xl text-sm font-medium text-center transition-all ${cardType === o.v ? 'bg-gtb-accent text-gtb-dark' : 'glass text-gtb-subtle hover:text-white'}`}>
                {o.l}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-gtb-muted text-xs mb-2 block uppercase tracking-wider">Network</label>
          <div className="grid grid-cols-2 gap-2">
            {[{ v: 'visa', l: 'Visa' }, { v: 'mastercard', l: 'Mastercard' }].map(o => (
              <button key={o.v} onClick={() => setNetwork(o.v)}
                className={`p-3 rounded-xl text-sm font-medium text-center transition-all ${network === o.v ? 'bg-gtb-accent text-gtb-dark' : 'glass text-gtb-subtle hover:text-white'}`}>
                {o.l}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-gtb-danger text-sm bg-gtb-danger/10 rounded-xl p-3">
            <AlertCircle size={14} /> {error}
          </div>
        )}

        <div className="flex gap-3">
          <button onClick={onClose} className="btn-ghost flex-1 justify-center">Cancel</button>
          <button onClick={handleCreate} disabled={loading || !accountId} className="btn-primary flex-1 justify-center">
            {loading ? 'Creating…' : 'Request Card'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CardsPage() {
  const { accounts } = useAuth();
  const [cards, setCards]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [toggling, setToggling]   = useState('');
  const [showModal, setShowModal] = useState(false);

  async function fetchCards() {
    try {
      const res = await fetch('/api/card');
      const data = await res.json();
      setCards(data.cards || []);
    } catch { setCards([]); }
    finally { setLoading(false); }
  }

  useEffect(() => { fetchCards(); }, []);

  async function handleToggleFreeze(id, status) {
    setToggling(id);
    try {
      const res = await fetch(`/api/card/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: status === 'frozen' ? 'unfreeze' : 'freeze' }),
      });
      const data = await res.json();
      if (res.ok) setCards(prev => prev.map(c => c._id === id ? { ...c, status: data.card.status } : c));
    } catch { }
    finally { setToggling(''); }
  }

  return (
    <div className="px-4 sm:px-6 py-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-black text-white">My Cards</h1>
          <p className="text-gtb-muted text-sm">{cards.length} card{cards.length !== 1 ? 's' : ''} · Click to flip</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary text-sm">
          <Plus size={16} /> Request Card
        </button>
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 gap-6">
          {[1, 2].map(i => <div key={i} className="glass-card rounded-3xl p-6"><div className="shimmer rounded-2xl" style={{ aspectRatio: '1.586' }} /></div>)}
        </div>
      ) : cards.length === 0 ? (
        <div className="glass-card rounded-3xl p-12 text-center">
          <CreditCard size={48} className="text-gtb-muted mx-auto mb-4" />
          <h3 className="text-white font-bold mb-2">No Cards Yet</h3>
          <p className="text-gtb-muted text-sm mb-6">Request your first virtual card to start spending</p>
          <button onClick={() => setShowModal(true)} className="btn-primary mx-auto">
            <Plus size={16} /> Request Card
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-8">
          {cards.map(card => (
            <div key={card._id} className="glass-card rounded-3xl p-5">
              <FlipCard card={card} onToggleFreeze={handleToggleFreeze} toggling={toggling} />
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <RequestCardModal
          accounts={accounts.filter(a => a.status === 'active')}
          onClose={() => setShowModal(false)}
          onSuccess={card => { setCards(prev => [card, ...prev]); setShowModal(false); }}
        />
      )}
    </div>
  );
}
