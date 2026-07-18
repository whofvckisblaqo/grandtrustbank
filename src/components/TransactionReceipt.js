'use client';
import { CheckCircle, Clock, XCircle, Download, X, Landmark } from 'lucide-react';

const fmt = (n, currency = 'USD') => new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(n ?? 0);

const statusConfig = {
  completed: { icon: CheckCircle, color: '#22C55E', label: 'Completed' },
  pending:   { icon: Clock,       color: '#F59E0B', label: 'Pending' },
  failed:    { icon: XCircle,     color: '#EF4444', label: 'Failed' },
};

function fmtDate(d) {
  return new Date(d).toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: 'numeric', minute: '2-digit',
  });
}

/**
 * Renders a transaction receipt.
 * `txn` is flexible — pass whatever fields you have; missing ones are just skipped.
 * Expected shape (all optional except amount/reference):
 * {
 *   reference, amount, fee, tax, currency, status, narration, createdAt,
 *   direction, type,
 *   fromLabel, fromAccountNumber,
 *   toLabel, toAccountNumber,
 * }
 */
export default function TransactionReceipt({ txn, onClose }) {
  if (!txn) return null;

  const s = statusConfig[txn.status] || statusConfig.pending;
  const StatusIcon = s.icon;
  const total = (txn.amount ?? 0) + (txn.fee ?? 0) + (txn.tax ?? 0);

  function handleDownload() {
    window.print();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 print:static print:p-0">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm print:hidden" onClick={onClose} />

      <div className="relative glass-card rounded-3xl w-full max-w-md max-h-[90vh] overflow-y-auto print:max-h-none print:overflow-visible print:bg-white print:shadow-none" id="receipt-printable">
        {/* Close button */}
        <button onClick={onClose} className="absolute top-4 right-4 text-gtb-muted hover:text-white p-1 print:hidden z-10">
          <X size={20} />
        </button>

        <div className="p-6 sm:p-8">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-9 h-9 rounded-xl bg-gtb-accent flex items-center justify-center mx-auto mb-3 print:bg-black">
              <Landmark size={18} className="text-gtb-dark print:text-white" />
            </div>
            <div className="text-white font-black text-lg print:text-black">Grand Trust Bank</div>
            <div className="text-gtb-muted text-xs print:text-gray-500">Transaction Receipt</div>
          </div>

          {/* Status */}
          <div className="flex flex-col items-center gap-2 mb-6">
            <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: `${s.color}15`, border: `2px solid ${s.color}30` }}>
              <StatusIcon size={26} style={{ color: s.color }} />
            </div>
            <div className="text-white font-bold text-sm print:text-black" style={{ color: s.color }}>{s.label}</div>
          </div>

          {/* Amount */}
          <div className="text-center mb-6">
            <div className="text-gtb-muted text-xs mb-1 print:text-gray-500">Amount</div>
            <div className="text-white text-3xl font-black print:text-black">{fmt(txn.amount, txn.currency)}</div>
          </div>

          {/* Details */}
          <div className="glass rounded-2xl p-4 space-y-3 mb-4 print:border print:border-gray-200 print:bg-white">
            {txn.narration && (
              <div className="flex justify-between text-sm gap-4">
                <span className="text-gtb-muted print:text-gray-500 flex-shrink-0">Description</span>
                <span className="text-white text-right print:text-black">{txn.narration}</span>
              </div>
            )}
            {txn.fromLabel && (
              <div className="flex justify-between text-sm gap-4">
                <span className="text-gtb-muted print:text-gray-500 flex-shrink-0">From</span>
                <span className="text-white text-right print:text-black">
                  {txn.fromLabel}
                  {txn.fromAccountNumber && <span className="block text-gtb-muted text-xs font-mono print:text-gray-500">{txn.fromAccountNumber}</span>}
                </span>
              </div>
            )}
            {txn.toLabel && (
              <div className="flex justify-between text-sm gap-4">
                <span className="text-gtb-muted print:text-gray-500 flex-shrink-0">To</span>
                <span className="text-white text-right print:text-black">
                  {txn.toLabel}
                  {txn.toAccountNumber && <span className="block text-gtb-muted text-xs font-mono print:text-gray-500">{txn.toAccountNumber}</span>}
                </span>
              </div>
            )}
            {txn.fee > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gtb-muted print:text-gray-500">Fee</span>
                <span className="text-white print:text-black">{fmt(txn.fee, txn.currency)}</span>
              </div>
            )}
            {txn.tax > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gtb-muted print:text-gray-500">Tax</span>
                <span className="text-white print:text-black">{fmt(txn.tax, txn.currency)}</span>
              </div>
            )}
            {(txn.fee > 0 || txn.tax > 0) && (
              <div className="flex justify-between text-sm font-bold border-t border-white/10 pt-3 print:border-gray-200">
                <span className="text-gtb-accent print:text-black">Total</span>
                <span className="text-white print:text-black">{fmt(total, txn.currency)}</span>
              </div>
            )}
          </div>

          <div className="glass rounded-2xl p-4 space-y-3 mb-6 print:border print:border-gray-200 print:bg-white">
            <div className="flex justify-between text-sm">
              <span className="text-gtb-muted print:text-gray-500">Reference</span>
              <span className="text-gtb-accent font-mono text-xs print:text-black">{txn.reference}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gtb-muted print:text-gray-500">Date</span>
              <span className="text-white print:text-black">{fmtDate(txn.createdAt)}</span>
            </div>
            {txn.type && (
              <div className="flex justify-between text-sm">
                <span className="text-gtb-muted print:text-gray-500">Type</span>
                <span className="text-white capitalize print:text-black">{txn.type.replace('-', ' ')}</span>
              </div>
            )}
          </div>

          <p className="text-gtb-muted text-[10px] text-center mb-6 print:text-gray-400">
            This receipt is a record of a transaction processed by Grand Trust Bank, N.A., Member FDIC.
            Keep this for your records.
          </p>

          <div className="flex gap-3 print:hidden">
            <button onClick={onClose} className="btn-ghost flex-1 justify-center">Close</button>
            <button onClick={handleDownload} className="btn-primary flex-1 justify-center">
              <Download size={16} /> Download / Print
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}