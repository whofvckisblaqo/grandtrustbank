'use client';
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import TransactionItem from '@/components/TransactionItem';
import { ArrowLeftRight, Filter, ChevronLeft, ChevronRight, Search, X } from 'lucide-react';

export default function TransactionsPage() {
  const { accounts } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [page, setPage]           = useState(1);
  const [total, setTotal]         = useState(0);
  const [pages, setPages]         = useState(1);
  const [direction, setDirection] = useState('');
  const [type, setType]           = useState('');
  const [dateFrom, setDateFrom]   = useState('');
  const [dateTo, setDateTo]       = useState('');
  const [search, setSearch]       = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const limit = 15;

  const fetchTxns = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit });
      if (direction) params.set('direction', direction);
      if (type)      params.set('type', type);
      if (dateFrom)  params.set('from', dateFrom);
      if (dateTo)    params.set('to', dateTo);
      const res  = await fetch(`/api/transaction/history?${params}`);
      const data = await res.json();
      setTransactions(data.transactions || []);
      setTotal(data.pagination?.total || 0);
      setPages(data.pagination?.pages || 1);
    } catch { setTransactions([]); }
    finally { setLoading(false); }
  }, [page, direction, type, dateFrom, dateTo]);

  useEffect(() => { fetchTxns(); }, [fetchTxns]);

  const accountIds = accounts.map(a => String(a._id));

  const filtered = search
    ? transactions.filter(t => t.narration?.toLowerCase().includes(search.toLowerCase()) || t.reference?.toLowerCase().includes(search.toLowerCase()))
    : transactions;

  const tabs = [
    { label: 'All',     value: '' },
    { label: 'Credits', value: 'credit' },
    { label: 'Debits',  value: 'debit' },
  ];

  const typeOptions = [
    { label: 'All Types',    value: '' },
    { label: 'Transfers',    value: 'transfer' },
    { label: 'Bill Payments', value: 'bill-payment' },
    { label: 'Deposits',     value: 'deposit' },
    { label: 'Withdrawals',  value: 'withdrawal' },
  ];

  function resetFilters() {
    setDirection(''); setType(''); setDateFrom(''); setDateTo(''); setPage(1);
  }

  const hasFilters = direction || type || dateFrom || dateTo;

  return (
    <div className="px-4 sm:px-6 py-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-black text-white">Transactions</h1>
          <p className="text-gtb-muted text-sm">{total} total transactions</p>
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            hasFilters ? 'bg-gtb-accent text-gtb-dark' : 'glass text-gtb-subtle hover:text-white'
          }`}
        >
          <Filter size={15} /> Filters {hasFilters && '•'}
        </button>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="glass-card rounded-2xl p-5 mb-5 space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="text-gtb-muted text-xs mb-1 block">Type</label>
              <select value={type} onChange={e => { setType(e.target.value); setPage(1); }} className="input-dark w-full text-sm py-2">
                {typeOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-gtb-muted text-xs mb-1 block">From Date</label>
              <input type="date" value={dateFrom} onChange={e => { setDateFrom(e.target.value); setPage(1); }} className="input-dark w-full text-sm py-2" />
            </div>
            <div>
              <label className="text-gtb-muted text-xs mb-1 block">To Date</label>
              <input type="date" value={dateTo} onChange={e => { setDateTo(e.target.value); setPage(1); }} className="input-dark w-full text-sm py-2" />
            </div>
            <div className="flex items-end">
              {hasFilters && (
                <button onClick={resetFilters} className="flex items-center gap-1 text-gtb-danger text-sm hover:underline">
                  <X size={13} /> Clear
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Direction tabs */}
      <div className="flex gap-1 p-1 glass-card rounded-xl mb-5 w-fit">
        {tabs.map(t => (
          <button
            key={t.value}
            onClick={() => { setDirection(t.value); setPage(1); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              direction === t.value ? 'bg-gtb-accent text-gtb-dark' : 'text-gtb-muted hover:text-white'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="input-wrap mb-5">
        <span className="input-icon-left"><Search size={16} /></span>
        <input
          type="text"
          placeholder="Search by narration or reference…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="input-dark w-full pl-11 text-sm"
        />
        {search && (
          <span className="input-icon-right">
            <button onClick={() => setSearch('')} className="text-gtb-muted hover:text-white"><X size={15} /></button>
          </span>
        )}
      </div>

      {/* List */}
      <div className="glass-card rounded-2xl overflow-hidden">
        {loading ? (
          <div className="space-y-4 p-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl shimmer flex-shrink-0" />
                <div className="flex-1 space-y-2"><div className="h-3 shimmer rounded-full w-36" /><div className="h-2 shimmer rounded-full w-24" /></div>
                <div className="h-4 shimmer rounded-full w-20" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <ArrowLeftRight size={32} className="text-gtb-muted mx-auto mb-3" />
            <p className="text-gtb-muted text-sm">No transactions found</p>
            {hasFilters && <button onClick={resetFilters} className="text-gtb-accent text-sm mt-2 hover:underline">Clear filters</button>}
          </div>
        ) : (
          <div className="divide-y divide-white/[0.04]">
            {filtered.map(txn => (
              <TransactionItem key={txn._id} txn={txn} userAccountIds={accountIds} />
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {pages > 1 && !loading && (
        <div className="flex items-center justify-between mt-5">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="flex items-center gap-2 px-4 py-2 glass rounded-xl text-sm text-gtb-subtle hover:text-white disabled:opacity-40 transition-all"
          >
            <ChevronLeft size={16} /> Previous
          </button>
          <span className="text-gtb-muted text-sm">Page {page} of {pages}</span>
          <button
            onClick={() => setPage(p => Math.min(pages, p + 1))}
            disabled={page === pages}
            className="flex items-center gap-2 px-4 py-2 glass rounded-xl text-sm text-gtb-subtle hover:text-white disabled:opacity-40 transition-all"
          >
            Next <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
