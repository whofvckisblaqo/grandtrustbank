import { ArrowUpRight, ArrowDownLeft, RefreshCw } from 'lucide-react';

function fmt(n) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(n ?? 0);
}

function timeAgo(date) {
  const diff = Date.now() - new Date(date).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins  < 1)  return 'Just now';
  if (mins  < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days  < 7)  return `${days}d ago`;
  return new Date(date).toLocaleDateString('en-NG', { day: 'numeric', month: 'short' });
}

export default function TransactionItem({ txn, userAccountIds = [] }) {
  const isCredit = txn.direction === 'credit';
  const isSelf   = userAccountIds.includes(String(txn.senderAccount?._id ?? txn.senderAccount));

  const counterpart = isCredit
    ? txn.senderUser
    : txn.receiverUser;

  const name = counterpart
    ? `${counterpart.firstName} ${counterpart.lastName}`
    : isCredit ? 'External Credit' : 'External Transfer';

  const statusColors = {
    completed:  { bg: 'rgba(34,197,94,0.1)',   text: '#22c55e' },
    pending:    { bg: 'rgba(245,158,11,0.1)',   text: '#f59e0b' },
    failed:     { bg: 'rgba(239,68,68,0.1)',    text: '#ef4444' },
    reversed:   { bg: 'rgba(148,163,184,0.1)', text: '#94a3b8' },
    processing: { bg: 'rgba(0,224,184,0.1)',    text: '#00E0B8' },
  };
  const sc = statusColors[txn.status] ?? statusColors.pending;

  return (
    <div className="flex items-center gap-4 py-3.5 border-b border-white/[0.04] last:border-0 group hover:bg-white/[0.02] rounded-xl px-2 -mx-2 transition-colors cursor-default">
      {/* Icon */}
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: isCredit ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)' }}
      >
        {txn.type === 'reversal'
          ? <RefreshCw  size={16} className="text-gtb-subtle" />
          : isCredit
            ? <ArrowDownLeft size={16} className="text-gtb-success" />
            : <ArrowUpRight  size={16} className="text-gtb-danger" />
        }
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold text-white truncate">{name}</div>
        <div className="text-xs text-gtb-muted truncate mt-0.5">
          {txn.narration || txn.type}
        </div>
      </div>

      {/* Amount + meta */}
      <div className="text-right flex-shrink-0">
        <div className={`text-sm font-bold ${isCredit ? 'text-gtb-success' : 'text-white'}`}>
          {isCredit ? '+' : '-'}{fmt(txn.amount)}
        </div>
        <div className="flex items-center justify-end gap-1.5 mt-0.5">
          <span className="text-[10px] text-gtb-muted">{timeAgo(txn.createdAt)}</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium"
            style={{ background: sc.bg, color: sc.text }}>
            {txn.status}
          </span>
        </div>
      </div>
    </div>
  );
}
