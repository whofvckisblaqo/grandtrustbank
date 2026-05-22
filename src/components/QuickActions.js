import { Send, Download, Receipt, CreditCard, BarChart3, Plus } from 'lucide-react';

const actions = [
  { icon: Send,      label: 'Send',       color: '#00E0B8', key: 'send' },
  { icon: Download,  label: 'Receive',    color: '#00C9A7', key: 'receive' },
  { icon: Receipt,   label: 'Pay Bills',  color: '#00E0B8', key: 'bills' },
  { icon: CreditCard,label: 'Cards',      color: '#00C9A7', key: 'cards' },
  { icon: BarChart3, label: 'Analytics',  color: '#00E0B8', key: 'analytics' },
  { icon: Plus,      label: 'More',       color: '#64748b', key: 'more' },
];

export default function QuickActions({ onAction }) {
  return (
    <div>
      <h2 className="text-sm font-semibold text-gtb-subtle mb-4">Quick Actions</h2>
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
        {actions.map(({ icon: Icon, label, color, key }) => (
          <button
            key={key}
            onClick={() => onAction?.(key)}
            className="flex flex-col items-center gap-2.5 p-3 sm:p-4 rounded-2xl glass-card card-hover group transition-all duration-200"
          >
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200 group-hover:scale-110"
              style={{ background: `${color}15`, border: `1px solid ${color}25` }}
            >
              <Icon size={20} style={{ color }} />
            </div>
            <span className="text-xs text-gtb-subtle group-hover:text-white transition-colors text-center leading-tight">
              {label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
