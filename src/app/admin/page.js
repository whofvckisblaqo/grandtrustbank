'use client';
import { useState, useEffect, useCallback } from 'react';
import {
  Shield, RefreshCw, CheckCircle, XCircle, Clock, ArrowRight,
  Globe, Users, ArrowLeftRight, BarChart3, Search, ChevronLeft,
  ChevronRight, UserCheck, UserX, DollarSign, AlertCircle, X,
  TrendingUp, Wallet, Activity, Filter, Landmark, FileText,
} from 'lucide-react';

const fmt = n => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n ?? 0);
const fmtShort = n => {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `$${(n / 1_000).toFixed(1)}K`;
  return fmt(n);
};

function timeAgo(date) {
  const s = Math.floor((Date.now() - new Date(date)) / 1000);
  if (s < 60)    return `${s}s ago`;
  if (s < 3600)  return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

const typeLabel = t => ({ savings: 'Savings', current: 'Checking', 'fixed-deposit': 'Fixed Deposit', domiciliary: 'Domiciliary' }[t] || t);

const kycColors = { pending: '#F59E0B', verified: '#22C55E', rejected: '#EF4444' };
const kycLabels = { pending: 'Pending KYC', verified: 'Verified', rejected: 'Rejected' };

function TabBtn({ label, active, onClick, badge }) {
  return (
    <button
      onClick={onClick}
      className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
        active ? 'bg-gtb-accent text-gtb-dark' : 'text-gtb-subtle hover:text-white hover:bg-white/[0.06]'
      }`}
    >
      {label}
      {badge > 0 && (
        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center ${
          active ? 'bg-gtb-dark/20 text-gtb-dark' : 'bg-gtb-warn/20 text-gtb-warn'
        }`}>{badge}</span>
      )}
    </button>
  );
}

// ─── OVERVIEW TAB ──────────────────────────────────────────────────────────────
function OverviewTab({ stats, loading }) {
  if (loading) return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => <div key={i} className="glass-card rounded-2xl p-5 shimmer h-28" />)}
    </div>
  );

  const cards = [
    { label: 'Total Users',       value: stats.totalUsers?.toLocaleString() || '0',    sub: `${stats.activeUsers} active`,       icon: Users,         color: '#00E0B8' },
    { label: 'Total Accounts',    value: stats.totalAccounts?.toLocaleString() || '0', sub: 'Active accounts',                    icon: Wallet,        color: '#3B82F6' },
    { label: 'Assets Under Mgmt', value: fmtShort(stats.totalBalance || 0),            sub: 'Across all accounts',                icon: TrendingUp,    color: '#22C55E' },
    { label: 'Txns Today',        value: stats.completedToday?.toLocaleString() || '0',sub: 'Completed today',                    icon: Activity,      color: '#A855F7' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(({ label, value, sub, icon: Icon, color }) => (
          <div key={label} className="glass-card rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="text-gtb-muted text-xs uppercase tracking-wider">{label}</div>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${color}15`, border: `1px solid ${color}25` }}>
                <Icon size={16} style={{ color }} />
              </div>
            </div>
            <div className="text-white text-2xl font-black mb-1">{value}</div>
            <div className="text-gtb-muted text-xs">{sub}</div>
          </div>
        ))}
      </div>

      {/* Alert boxes */}
      <div className="grid sm:grid-cols-2 gap-4">
        {stats.pendingTransfers > 0 && (
          <div className="glass-card rounded-2xl p-4 border border-gtb-warn/20 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gtb-warn/10 flex items-center justify-center flex-shrink-0">
              <Clock size={18} className="text-gtb-warn" />
            </div>
            <div>
              <div className="text-white font-semibold text-sm">{stats.pendingTransfers} Transfer{stats.pendingTransfers !== 1 ? 's' : ''} Awaiting Approval</div>
              <div className="text-gtb-muted text-xs">Switch to the Transfers tab to review</div>
            </div>
          </div>
        )}
        {stats.pendingKyc > 0 && (
          <div className="glass-card rounded-2xl p-4 border border-gtb-accent/20 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gtb-accent/10 flex items-center justify-center flex-shrink-0">
              <UserCheck size={18} className="text-gtb-accent" />
            </div>
            <div>
              <div className="text-white font-semibold text-sm">{stats.pendingKyc} KYC Verification{stats.pendingKyc !== 1 ? 's' : ''} Pending</div>
              <div className="text-gtb-muted text-xs">Review user identities in the Users tab</div>
            </div>
          </div>
        )}
      </div>

      {/* Recent transactions */}
      {stats.recentTxns?.length > 0 && (
        <div className="glass-card rounded-2xl p-5">
          <div className="text-white font-semibold text-sm mb-4 flex items-center gap-2">
            <Activity size={15} className="text-gtb-accent" /> Recent Activity
          </div>
          <div className="space-y-3">
            {stats.recentTxns.map(t => (
              <div key={t._id} className="flex items-center justify-between py-2 border-b border-white/[0.05] last:border-0">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                    t.direction === 'credit' ? 'bg-gtb-success/10 text-gtb-success' : 'bg-gtb-danger/10 text-gtb-danger'
                  }`}>
                    {t.direction === 'credit' ? '+' : '−'}
                  </div>
                  <div>
                    <div className="text-white text-sm font-medium">{t.narration || t.type}</div>
                    <div className="text-gtb-muted text-xs">{timeAgo(t.createdAt)}</div>
                  </div>
                </div>
                <div className={`text-sm font-bold ${t.direction === 'credit' ? 'text-gtb-success' : 'text-gtb-danger'}`}>
                  {t.direction === 'credit' ? '+' : '−'}{fmt(t.amount)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── TRANSFERS TAB ─────────────────────────────────────────────────────────────
function TransfersTab() {
  const [transfers, setTransfers] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [acting, setActing]       = useState('');
  const [rejectRef, setRejectRef] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [toast, setToast]         = useState('');

  const showToast = msg => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const fetchTransfers = useCallback(async () => {
    setLoading(true);
    try {
      const res  = await fetch('/api/admin/transfers');
      const data = await res.json();
      setTransfers(data.transfers || []);
    } catch { setTransfers([]); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchTransfers(); }, [fetchTransfers]);

  async function handleAction(ref, action, reason) {
    setActing(ref);
    try {
      const res = await fetch(`/api/admin/transfers/${ref}`, {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ action, reason }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      showToast(action === 'approve' ? '✓ Transfer approved' : '✗ Transfer rejected');
      setRejectRef(''); setRejectReason('');
      fetchTransfers();
    } catch (e) { showToast(`Error: ${e.message}`); }
    finally { setActing(''); }
  }

  return (
    <div className="space-y-4">
      {toast && (
        <div className="fixed top-6 right-6 z-50 glass-card rounded-xl px-4 py-3 text-sm font-medium text-white shadow-2xl">
          {toast}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="text-gtb-muted text-sm">{transfers.length} pending transfer{transfers.length !== 1 ? 's' : ''}</div>
        <button onClick={fetchTransfers} className="flex items-center gap-2 px-3 py-1.5 glass rounded-xl text-xs text-gtb-subtle hover:text-white transition-all">
          <RefreshCw size={12} /> Refresh
        </button>
      </div>

      {loading ? (
        <div className="space-y-4">{[1,2,3].map(i => <div key={i} className="glass-card rounded-2xl p-5 shimmer h-32" />)}</div>
      ) : transfers.length === 0 ? (
        <div className="glass-card rounded-3xl p-16 text-center">
          <CheckCircle size={48} className="text-gtb-success mx-auto mb-4" />
          <h3 className="text-white font-bold text-lg mb-2">All Clear!</h3>
          <p className="text-gtb-muted">No pending transfers to review.</p>
        </div>
      ) : (
        transfers.map(txn => {
          const isExternal = txn.metadata?.transferType === 'external';
          const ext = txn.metadata?.externalDetails;
          return (
            <div key={txn._id} className="glass-card rounded-2xl p-5">
              {/* Top row */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="px-2 py-0.5 rounded-full bg-gtb-warn/10 border border-gtb-warn/20 text-gtb-warn text-xs font-medium flex items-center gap-1">
                    <Clock size={10} /> Pending
                  </div>
                  {isExternal && (
                    <div className="px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-medium flex items-center gap-1">
                      <Globe size={10} /> External Wire
                    </div>
                  )}
                  <span className="text-gtb-muted text-xs">{timeAgo(txn.createdAt)}</span>
                </div>
                <span className="text-gtb-muted font-mono text-xs">{txn.reference}</span>
              </div>

              {/* Sender → Receiver */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1 glass rounded-xl p-3">
                  <div className="text-gtb-muted text-[10px] uppercase tracking-wider mb-1">From</div>
                  <div className="text-white font-semibold text-sm">{txn.senderUser?.firstName} {txn.senderUser?.lastName}</div>
                  <div className="text-gtb-muted text-xs font-mono mt-0.5">{txn.senderAccount?.accountNumber}</div>
                  <div className="text-gtb-muted text-xs capitalize">{typeLabel(txn.senderAccount?.accountType)}</div>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <ArrowRight size={18} className="text-gtb-accent" />
                  <div className="text-white font-black text-sm">{fmt(txn.amount)}</div>
                  {txn.fee > 0 && <div className="text-gtb-muted text-[10px]">+{fmt(txn.fee)} fee</div>}
                </div>
                <div className="flex-1 glass rounded-xl p-3">
                  <div className="text-gtb-muted text-[10px] uppercase tracking-wider mb-1">To</div>
                  {isExternal ? (
                    <>
                      <div className="text-white font-semibold text-sm">{ext?.accountName || 'External Account'}</div>
                      <div className="text-gtb-muted text-xs font-mono mt-0.5">{ext?.accountNumber || txn.metadata?.toAccountNumber}</div>
                      <div className="text-purple-400 text-xs mt-0.5">{ext?.bankName || 'External Bank'}</div>
                      {ext?.routingNumber && <div className="text-gtb-muted text-[10px] mt-0.5">Routing: {ext.routingNumber}</div>}
                    </>
                  ) : (
                    <>
                      <div className="text-white font-semibold text-sm">{txn.receiverUser?.firstName} {txn.receiverUser?.lastName}</div>
                      <div className="text-gtb-muted text-xs font-mono mt-0.5">{txn.receiverAccount?.accountNumber}</div>
                      <div className="text-gtb-muted text-xs capitalize">{typeLabel(txn.receiverAccount?.accountType)}</div>
                    </>
                  )}
                </div>
              </div>

              {txn.narration && (
                <div className="text-gtb-subtle text-xs mb-4 glass rounded-lg px-3 py-2 italic">"{txn.narration}"</div>
              )}

              {/* Reject form */}
              {rejectRef === txn.reference && (
                <div className="mb-4 space-y-2">
                  <input
                    type="text"
                    placeholder="Rejection reason (optional)"
                    value={rejectReason}
                    onChange={e => setRejectReason(e.target.value)}
                    className="input-dark w-full text-sm py-2"
                  />
                  <div className="flex gap-2">
                    <button onClick={() => { setRejectRef(''); setRejectReason(''); }} className="btn-ghost flex-1 justify-center text-sm py-2">Cancel</button>
                    <button
                      onClick={() => handleAction(txn.reference, 'reject', rejectReason)}
                      disabled={acting === txn.reference}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gtb-danger/10 border border-gtb-danger/20 text-gtb-danger text-sm font-medium hover:bg-gtb-danger/20 transition-all disabled:opacity-50"
                    >
                      <XCircle size={15} /> Confirm Reject
                    </button>
                  </div>
                </div>
              )}

              {rejectRef !== txn.reference && (
                <div className="flex gap-3">
                  <button onClick={() => setRejectRef(txn.reference)} className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gtb-danger/10 border border-gtb-danger/20 text-gtb-danger text-sm font-medium hover:bg-gtb-danger/20 transition-all">
                    <XCircle size={16} /> Reject
                  </button>
                  <button
                    onClick={() => handleAction(txn.reference, 'approve')}
                    disabled={acting === txn.reference}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gtb-success/10 border border-gtb-success/20 text-gtb-success text-sm font-medium hover:bg-gtb-success/20 transition-all disabled:opacity-50"
                  >
                    {acting === txn.reference
                      ? <div className="w-4 h-4 border-2 border-gtb-success/30 border-t-gtb-success rounded-full animate-spin" />
                      : <CheckCircle size={16} />}
                    {acting === txn.reference ? 'Processing…' : 'Approve'}
                  </button>
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}

// ─── USERS TAB ─────────────────────────────────────────────────────────────────
function UsersTab() {
  const [users, setUsers]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [page, setPage]         = useState(1);
  const [pages, setPages]       = useState(1);
  const [total, setTotal]       = useState(0);
  const [search, setSearch]     = useState('');
  const [kycFilter, setKyc]     = useState('');
  const [acting, setActing]     = useState('');
  const [toast, setToast]       = useState('');
  const [creditModal, setCreditModal] = useState(null); // { userId, userName, accounts[] }
  const [creditAcct, setCreditAcct]   = useState('');
  const [creditAmt, setCreditAmt]     = useState('');
  const [creditLoading, setCreditLoading] = useState(false);
  const [creditError, setCreditError] = useState('');
  const [acctLoading, setAcctLoading] = useState(false);

  const showToast = msg => { setToast(msg); setTimeout(() => setToast(''), 3500); };

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 15 });
      if (search)    params.set('search', search);
      if (kycFilter) params.set('kyc', kycFilter);
      const res  = await fetch(`/api/admin/users?${params}`);
      const data = await res.json();
      setUsers(data.users || []);
      setTotal(data.pagination?.total || 0);
      setPages(data.pagination?.pages || 1);
    } catch { setUsers([]); }
    finally { setLoading(false); }
  }, [page, search, kycFilter]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  async function doAction(userId, action) {
    setActing(userId + action);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ action }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      showToast(data.message);
      fetchUsers();
    } catch (e) { showToast(`Error: ${e.message}`); }
    finally { setActing(''); }
  }

  async function openCreditModal(user) {
    setCreditModal({ userId: user._id, userName: `${user.firstName} ${user.lastName}`, accounts: [] });
    setCreditAcct('');
    setCreditAmt('');
    setCreditError('');
    setAcctLoading(true);
    try {
      const res  = await fetch(`/api/admin/users/${user._id}`);
      const data = await res.json();
      const accts = data.accounts || [];
      setCreditModal(m => ({ ...m, accounts: accts }));
      if (accts.length) setCreditAcct(accts[0]._id);
    } catch {}
    finally { setAcctLoading(false); }
  }

  async function submitCredit() {
    const amount = parseFloat(creditAmt);
    if (!creditAcct) { setCreditError('Please select an account'); return; }
    if (!amount || amount <= 0) { setCreditError('Enter a valid amount greater than $0'); return; }
    setCreditLoading(true);
    setCreditError('');
    try {
      const res = await fetch(`/api/admin/users/${creditModal.userId}`, {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ action: 'credit', creditAmount: amount, accountId: creditAcct }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      showToast('✓ ' + data.message);
      setCreditModal(null);
      fetchUsers();
    } catch (e) { setCreditError(e.message); }
    finally { setCreditLoading(false); }
  }

  return (
    <div className="space-y-4">
      {toast && (
        <div className="fixed top-6 right-6 z-50 glass-card rounded-xl px-4 py-3 text-sm font-medium text-white shadow-2xl">{toast}</div>
      )}

      {/* Credit modal */}
      {creditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setCreditModal(null)} />
          <div className="relative glass-card rounded-2xl p-6 w-full max-w-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="text-white font-bold">Credit Account</div>
              <button onClick={() => setCreditModal(null)} className="text-gtb-muted hover:text-white"><X size={18} /></button>
            </div>
            <p className="text-gtb-muted text-sm mb-4">Crediting funds to <span className="text-white font-semibold">{creditModal.userName}</span></p>
            <div className="space-y-3">
              <div>
                <label className="block text-gtb-muted text-xs mb-2 uppercase tracking-wider">Destination Account</label>
                {acctLoading ? (
                  <div className="input-dark w-full flex items-center gap-2 text-gtb-muted text-sm">
                    <div className="w-4 h-4 border-2 border-gtb-accent/30 border-t-gtb-accent rounded-full animate-spin" /> Loading accounts…
                  </div>
                ) : creditModal?.accounts?.length > 0 ? (
                  <select
                    value={creditAcct}
                    onChange={e => setCreditAcct(e.target.value)}
                    className="input-dark w-full"
                    style={{ backgroundColor: '#0B1020', color: '#fff' }}
                  >
                    {creditModal.accounts.map(a => (
                      <option key={a._id} value={a._id} style={{ backgroundColor: '#0B1020' }}>
                        {a.accountType === 'current' ? 'Checking' : a.accountType.charAt(0).toUpperCase() + a.accountType.slice(1)} — {a.accountNumber} ({fmt(a.balance)})
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="text-gtb-muted text-sm">No accounts found for this user</div>
                )}
              </div>
              <div>
                <label className="block text-gtb-muted text-xs mb-2 uppercase tracking-wider">Amount (USD)</label>
                <input type="number" value={creditAmt} onChange={e => setCreditAmt(e.target.value)} placeholder="0.00" min="1" className="input-dark w-full" />
              </div>
              {creditError && (
                <div className="flex items-center gap-2 text-gtb-danger text-sm bg-gtb-danger/10 border border-gtb-danger/20 rounded-xl p-3">
                  <AlertCircle size={14} className="flex-shrink-0" /> {creditError}
                </div>
              )}
              <button
                onClick={submitCredit}
                disabled={creditLoading || acctLoading || !creditModal?.accounts?.length}
                className="btn-primary w-full justify-center disabled:opacity-50"
              >
                {creditLoading
                  ? <><div className="w-4 h-4 border-2 border-gtb-dark/30 border-t-gtb-dark rounded-full animate-spin" /> Crediting…</>
                  : <><DollarSign size={15} /> Credit Funds</>
                }
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="input-wrap flex-1">
          <span className="input-icon-left"><Search size={16} /></span>
          <input
            type="text"
            placeholder="Search by name, email or phone…"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="input-dark w-full pl-11 text-sm py-2.5"
          />
        </div>
        <select
          value={kycFilter}
          onChange={e => { setKyc(e.target.value); setPage(1); }}
          className="input-dark text-sm py-2.5 pr-8"
          style={{ backgroundColor: '#0B1020', color: '#fff' }}
        >
          <option value="" style={{ backgroundColor: '#0B1020' }}>All KYC statuses</option>
          <option value="pending"  style={{ backgroundColor: '#0B1020' }}>Pending KYC</option>
          <option value="verified" style={{ backgroundColor: '#0B1020' }}>Verified</option>
          <option value="rejected" style={{ backgroundColor: '#0B1020' }}>Rejected</option>
        </select>
      </div>

      <div className="text-gtb-muted text-sm">{total} user{total !== 1 ? 's' : ''} found</div>

      {loading ? (
        <div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="glass-card rounded-2xl p-4 shimmer h-20" />)}</div>
      ) : users.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center">
          <Users size={40} className="text-gtb-muted mx-auto mb-3" />
          <p className="text-gtb-muted">No users found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {users.map(user => (
            <div key={user._id} className="glass-card rounded-2xl p-4">
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="w-10 h-10 rounded-xl bg-gtb-accent/15 border border-gtb-accent/20 flex items-center justify-center flex-shrink-0 text-gtb-accent font-bold text-sm">
                  {user.firstName?.[0]}{user.lastName?.[0]}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="text-white font-semibold text-sm">{user.firstName} {user.lastName}</div>
                    <div className="px-2 py-0.5 rounded-full text-[10px] font-semibold" style={{
                      background: `${kycColors[user.kycStatus]}15`,
                      color:       kycColors[user.kycStatus],
                      border:      `1px solid ${kycColors[user.kycStatus]}25`,
                    }}>
                      {kycLabels[user.kycStatus] || user.kycStatus}
                    </div>
                    {user.isSuspended && (
                      <div className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gtb-danger/10 text-gtb-danger border border-gtb-danger/20">
                        Suspended
                      </div>
                    )}
                  </div>
                  <div className="text-gtb-muted text-xs mt-0.5">{user.email} · {user.phone}</div>
                  <div className="text-gtb-muted text-xs mt-0.5">
                    {user.accountCount} account{user.accountCount !== 1 ? 's' : ''} · {fmt(user.totalBalance)} balance · Joined {timeAgo(user.createdAt)}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-2 flex-shrink-0">
                  {user.kycStatus === 'pending' && (
                    <>
                      <button
                        onClick={() => doAction(user._id, 'approve_kyc')}
                        disabled={acting === user._id + 'approve_kyc'}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gtb-success/10 border border-gtb-success/20 text-gtb-success text-xs font-medium hover:bg-gtb-success/20 transition-all disabled:opacity-50"
                      >
                        <UserCheck size={13} /> Approve KYC
                      </button>
                      <button
                        onClick={() => doAction(user._id, 'reject_kyc')}
                        disabled={acting === user._id + 'reject_kyc'}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gtb-danger/10 border border-gtb-danger/20 text-gtb-danger text-xs font-medium hover:bg-gtb-danger/20 transition-all disabled:opacity-50"
                      >
                        <UserX size={13} /> Reject KYC
                      </button>
                    </>
                  )}
                  {user.isSuspended ? (
                    <button
                      onClick={() => doAction(user._id, 'activate')}
                      disabled={acting === user._id + 'activate'}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gtb-success/10 border border-gtb-success/20 text-gtb-success text-xs font-medium hover:bg-gtb-success/20 transition-all disabled:opacity-50"
                    >
                      <CheckCircle size={13} /> Activate
                    </button>
                  ) : (
                    <button
                      onClick={() => doAction(user._id, 'suspend')}
                      disabled={acting === user._id + 'suspend'}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gtb-danger/10 border border-gtb-danger/20 text-gtb-danger text-xs font-medium hover:bg-gtb-danger/20 transition-all disabled:opacity-50"
                    >
                      <XCircle size={13} /> Suspend
                    </button>
                  )}
                  <button
                    onClick={() => openCreditModal(user)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gtb-accent/10 border border-gtb-accent/20 text-gtb-accent text-xs font-medium hover:bg-gtb-accent/20 transition-all"
                  >
                    <DollarSign size={13} /> Credit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="flex items-center gap-1 px-3 py-2 glass rounded-xl text-sm text-gtb-subtle hover:text-white disabled:opacity-40 transition-all">
            <ChevronLeft size={15} /> Prev
          </button>
          <span className="text-gtb-muted text-sm">Page {page} of {pages}</span>
          <button disabled={page === pages} onClick={() => setPage(p => p + 1)} className="flex items-center gap-1 px-3 py-2 glass rounded-xl text-sm text-gtb-subtle hover:text-white disabled:opacity-40 transition-all">
            Next <ChevronRight size={15} />
          </button>
        </div>
      )}
    </div>
  );
}

// ─── LOANS TAB ─────────────────────────────────────────────────────────────────
const fmt2 = n => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n ?? 0);

const LOAN_STATUS = {
  pending:  { label: 'Pending',  color: '#F59E0B', bg: 'bg-gtb-warn/10 border-gtb-warn/20' },
  approved: { label: 'Approved', color: '#22C55E', bg: 'bg-gtb-success/10 border-gtb-success/20' },
  rejected: { label: 'Rejected', color: '#EF4444', bg: 'bg-gtb-danger/10 border-gtb-danger/20' },
  active:   { label: 'Active',   color: '#00E0B8', bg: 'bg-gtb-accent/10 border-gtb-accent/20' },
  completed:{ label: 'Done',     color: '#64748b', bg: 'bg-white/5 border-white/10' },
};

function LoansTab() {
  const [loans, setLoans]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [acting, setActing]   = useState('');
  const [filter, setFilter]   = useState('pending');
  const [notes, setNotes]     = useState({});
  const [toast, setToast]     = useState('');
  const [page, setPage]       = useState(1);
  const [pages, setPages]     = useState(1);
  const [total, setTotal]     = useState(0);

  const showToast = msg => { setToast(msg); setTimeout(() => setToast(''), 3500); };

  const fetchLoans = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 15 });
      if (filter) params.set('status', filter);
      const res  = await fetch(`/api/admin/loans?${params}`);
      const data = await res.json();
      setLoans(data.loans || []);
      setTotal(data.pagination?.total || 0);
      setPages(data.pagination?.pages || 1);
    } catch { setLoans([]); }
    finally { setLoading(false); }
  }, [page, filter]);

  useEffect(() => { fetchLoans(); }, [fetchLoans]);

  async function action(id, act) {
    setActing(id + act);
    try {
      const res = await fetch(`/api/admin/loans/${id}`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: act, adminNotes: notes[id] || '' }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      showToast((act === 'approve' ? '✓ ' : '✗ ') + data.message);
      fetchLoans();
    } catch (e) { showToast('Error: ' + e.message); }
    finally { setActing(''); }
  }

  const statuses = ['pending', 'approved', 'rejected', 'active'];

  return (
    <div className="space-y-4">
      {toast && (
        <div className="fixed top-6 right-6 z-50 glass-card rounded-xl px-4 py-3 text-sm font-medium text-white shadow-2xl">{toast}</div>
      )}

      <div className="flex flex-wrap gap-2 items-center justify-between">
        <div className="flex gap-1 p-1 glass rounded-xl">
          {statuses.map(s => (
            <button key={s} onClick={() => { setFilter(s); setPage(1); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${
                filter === s ? 'bg-gtb-accent text-gtb-dark' : 'text-gtb-muted hover:text-white'
              }`}>{s}</button>
          ))}
        </div>
        <div className="text-gtb-muted text-sm">{total} loan{total !== 1 ? 's' : ''}</div>
      </div>

      {loading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="glass-card rounded-2xl p-5 shimmer h-28" />)}</div>
      ) : loans.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center">
          <Landmark size={40} className="text-gtb-muted mx-auto mb-3" />
          <p className="text-gtb-muted">No {filter} loans</p>
        </div>
      ) : loans.map(loan => {
        const s = LOAN_STATUS[loan.status] || LOAN_STATUS.pending;
        return (
          <div key={loan._id} className="glass-card rounded-2xl p-5">
            <div className="flex items-start justify-between mb-3 flex-wrap gap-2">
              <div>
                <div className="text-white font-semibold text-sm capitalize">
                  {loan.user?.firstName} {loan.user?.lastName}
                  <span className="text-gtb-muted font-normal ml-2">· {loan.user?.email}</span>
                </div>
                <div className="text-gtb-muted text-xs mt-0.5">{new Date(loan.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
              </div>
              <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold ${s.bg}`} style={{ color: s.color }}>
                {s.label}
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
              {[
                ['Type', loan.type],
                ['Amount', fmt2(loan.amount)],
                ['Monthly', fmt2(loan.monthlyPayment)],
                ['Duration', `${loan.duration}mo`],
              ].map(([k, v]) => (
                <div key={k}>
                  <div className="text-gtb-muted text-[10px] uppercase tracking-wider">{k}</div>
                  <div className="text-white font-semibold text-sm capitalize mt-0.5">{v}</div>
                </div>
              ))}
            </div>
            {loan.purpose && <div className="text-gtb-subtle text-xs italic px-3 py-2 glass rounded-lg mb-3">"{loan.purpose}"</div>}

            {loan.status === 'pending' && (
              <div className="space-y-2">
                <input type="text" placeholder="Admin notes (optional)"
                  value={notes[loan._id] || ''}
                  onChange={e => setNotes(n => ({ ...n, [loan._id]: e.target.value }))}
                  className="input-dark w-full text-sm py-2" />
                <div className="flex gap-2">
                  <button onClick={() => action(loan._id, 'reject')} disabled={!!acting}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gtb-danger/10 border border-gtb-danger/20 text-gtb-danger text-sm font-medium hover:bg-gtb-danger/20 transition-all disabled:opacity-50">
                    <XCircle size={15} /> Reject
                  </button>
                  <button onClick={() => action(loan._id, 'approve')} disabled={!!acting}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gtb-success/10 border border-gtb-success/20 text-gtb-success text-sm font-medium hover:bg-gtb-success/20 transition-all disabled:opacity-50">
                    {acting === loan._id + 'approve'
                      ? <span className="w-4 h-4 border-2 border-gtb-success/30 border-t-gtb-success rounded-full animate-spin" />
                      : <CheckCircle size={15} />}
                    Approve & Disburse
                  </button>
                </div>
              </div>
            )}
            {loan.adminNotes && <div className="text-gtb-muted text-xs mt-2">Note: {loan.adminNotes}</div>}
          </div>
        );
      })}

      {pages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="flex items-center gap-1 px-3 py-2 glass rounded-xl text-sm text-gtb-subtle hover:text-white disabled:opacity-40">
            <ChevronLeft size={15} /> Prev
          </button>
          <span className="text-gtb-muted text-sm">Page {page} of {pages}</span>
          <button disabled={page === pages} onClick={() => setPage(p => p + 1)} className="flex items-center gap-1 px-3 py-2 glass rounded-xl text-sm text-gtb-subtle hover:text-white disabled:opacity-40">
            Next <ChevronRight size={15} />
          </button>
        </div>
      )}
    </div>
  );
}

// ─── TRANSACTIONS TAB ──────────────────────────────────────────────────────────
function TransactionsTab() {
  const [txns, setTxns]         = useState([]);
  const [loading, setLoading]   = useState(true);
  const [page, setPage]         = useState(1);
  const [pages, setPages]       = useState(1);
  const [total, setTotal]       = useState(0);
  const [status, setStatus]     = useState('');
  const [type, setType]         = useState('');
  const [direction, setDir]     = useState('');
  const [search, setSearch]     = useState('');

  const fetchTxns = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 20 });
      if (status)    params.set('status', status);
      if (type)      params.set('type', type);
      if (direction) params.set('direction', direction);
      if (search)    params.set('search', search);
      const res  = await fetch(`/api/admin/transactions?${params}`);
      const data = await res.json();
      setTxns(data.transactions || []);
      setTotal(data.pagination?.total || 0);
      setPages(data.pagination?.pages || 1);
    } catch { setTxns([]); }
    finally { setLoading(false); }
  }, [page, status, type, direction, search]);

  useEffect(() => { fetchTxns(); }, [fetchTxns]);

  const statusColor = s => ({ completed: 'text-gtb-success', pending: 'text-gtb-warn', failed: 'text-gtb-danger' }[s] || 'text-gtb-muted');
  const statusBg    = s => ({ completed: 'bg-gtb-success/10 border-gtb-success/20', pending: 'bg-gtb-warn/10 border-gtb-warn/20', failed: 'bg-gtb-danger/10 border-gtb-danger/20' }[s] || '');

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="input-wrap flex-1 min-w-48">
          <span className="input-icon-left"><Search size={16} /></span>
          <input type="text" placeholder="Search reference…" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} className="input-dark w-full pl-11 text-sm py-2.5" />
        </div>
        {[
          { value: status,    setter: setStatus,    options: [['', 'All statuses'], ['completed', 'Completed'], ['pending', 'Pending'], ['failed', 'Failed']] },
          { value: direction, setter: setDir,       options: [['', 'All directions'], ['debit', 'Debits'], ['credit', 'Credits']] },
          { value: type,      setter: setType,      options: [['', 'All types'], ['transfer', 'Transfer'], ['bill-payment', 'Bill'], ['deposit', 'Deposit'], ['withdrawal', 'Withdrawal']] },
        ].map((sel, i) => (
          <select key={i} value={sel.value} onChange={e => { sel.setter(e.target.value); setPage(1); }} className="input-dark text-sm py-2.5" style={{ backgroundColor: '#0B1020', color: '#fff' }}>
            {sel.options.map(([v, l]) => <option key={v} value={v} style={{ backgroundColor: '#0B1020' }}>{l}</option>)}
          </select>
        ))}
      </div>

      <div className="text-gtb-muted text-sm">{total.toLocaleString()} transaction{total !== 1 ? 's' : ''}</div>

      {loading ? (
        <div className="space-y-2">{[...Array(6)].map((_, i) => <div key={i} className="glass-card rounded-xl p-4 shimmer h-16" />)}</div>
      ) : txns.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center">
          <ArrowLeftRight size={40} className="text-gtb-muted mx-auto mb-3" />
          <p className="text-gtb-muted">No transactions found</p>
        </div>
      ) : (
        <div className="glass-card rounded-2xl overflow-hidden">
          {txns.map((t, i) => (
            <div key={t._id} className={`flex items-center gap-4 px-5 py-4 ${i > 0 ? 'border-t border-white/[0.05]' : ''}`}>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                t.direction === 'credit' ? 'bg-gtb-success/10 text-gtb-success' : 'bg-gtb-danger/10 text-gtb-danger'
              }`}>
                {t.direction === 'credit' ? '+' : '−'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-white text-sm font-medium truncate">{t.narration || t.type}</span>
                  <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-semibold border ${statusBg(t.status)} ${statusColor(t.status)}`}>
                    {t.status}
                  </span>
                </div>
                <div className="text-gtb-muted text-xs truncate">
                  {t.senderUser?.firstName} {t.senderUser?.lastName}
                  {t.receiverUser && <> → {t.receiverUser.firstName} {t.receiverUser.lastName}</>}
                  {' · '}{timeAgo(t.createdAt)}
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className={`text-sm font-bold ${t.direction === 'credit' ? 'text-gtb-success' : 'text-white'}`}>
                  {t.direction === 'credit' ? '+' : '−'}{fmt(t.amount)}
                </div>
                <div className="text-gtb-muted font-mono text-[10px]">{t.reference}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {pages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="flex items-center gap-1 px-3 py-2 glass rounded-xl text-sm text-gtb-subtle hover:text-white disabled:opacity-40 transition-all">
            <ChevronLeft size={15} /> Prev
          </button>
          <span className="text-gtb-muted text-sm">Page {page} of {pages}</span>
          <button disabled={page === pages} onClick={() => setPage(p => p + 1)} className="flex items-center gap-1 px-3 py-2 glass rounded-xl text-sm text-gtb-subtle hover:text-white disabled:opacity-40 transition-all">
            Next <ChevronRight size={15} />
          </button>
        </div>
      )}
    </div>
  );
}

// ─── ROOT PAGE ─────────────────────────────────────────────────────────────────
export default function AdminPage() {
  const [tab, setTab]       = useState('overview');
  const [stats, setStats]   = useState({});
  const [statsLoading, setStatsLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const res  = await fetch('/api/admin/stats');
      const data = await res.json();
      setStats(data);
    } catch {}
    finally { setStatsLoading(false); }
  }, []);

  useEffect(() => { fetchStats(); }, [fetchStats]);

  return (
    <div className="px-4 sm:px-6 py-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gtb-accent/10 border border-gtb-accent/20 flex items-center justify-center">
            <Shield size={18} className="text-gtb-accent" />
          </div>
          <div>
            <h1 className="text-xl font-black text-white">Admin Panel</h1>
            <p className="text-gtb-muted text-sm">Manage users, transfers, and transactions</p>
          </div>
        </div>
        <button onClick={fetchStats} className="flex items-center gap-2 px-4 py-2 glass rounded-xl text-sm text-gtb-subtle hover:text-white transition-all">
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 glass-card rounded-xl mb-6 flex-wrap">
        <TabBtn label="Overview"     active={tab === 'overview'}     onClick={() => setTab('overview')} />
        <TabBtn label="Transfers"    active={tab === 'transfers'}    onClick={() => setTab('transfers')}    badge={stats.pendingTransfers} />
        <TabBtn label="Users"        active={tab === 'users'}        onClick={() => setTab('users')}        badge={stats.pendingKyc} />
        <TabBtn label="Loans"        active={tab === 'loans'}        onClick={() => setTab('loans')} />
        <TabBtn label="Transactions" active={tab === 'transactions'} onClick={() => setTab('transactions')} />
      </div>

      {tab === 'overview'     && <OverviewTab stats={stats} loading={statsLoading} />}
      {tab === 'transfers'    && <TransfersTab />}
      {tab === 'users'        && <UsersTab />}
      {tab === 'loans'        && <LoansTab />}
      {tab === 'transactions' && <TransactionsTab />}
    </div>
  );
}
