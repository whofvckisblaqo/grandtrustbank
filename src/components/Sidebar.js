'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, CreditCard, ArrowLeftRight, Send,
  Receipt, BarChart3, Settings, HelpCircle, LogOut, X,
  Landmark, Coins, HandCoins
} from 'lucide-react';
import GTBLogo from './GTBLogo';

const navItems = [
  { href: '/dashboard',    icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/accounts',     icon: Landmark,        label: 'Accounts' },
  { href: '/cards',        icon: CreditCard,      label: 'Cards' },
  { href: '/transactions', icon: ArrowLeftRight,  label: 'Transactions' },
  { href: '/transfer',     icon: Send,            label: 'Transfer' },
  { href: '/bills',        icon: Receipt,         label: 'Bill Payments' },
  { href: '/loans',        icon: HandCoins,       label: 'Loans' },
  { href: '/crypto',       icon: Coins,           label: 'Crypto' },
  { href: '/analytics',   icon: BarChart3,        label: 'Analytics' },
];

const bottomItems = [
  { href: '/settings', icon: Settings,   label: 'Settings' },
  { href: '/help',     icon: HelpCircle, label: 'Help' },
];

function NavLink({ href, icon: Icon, label, onClick }) {
  const pathname = usePathname();
  const active   = pathname === href;
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative ${
        active
          ? 'text-gtb-dark bg-gtb-accent'
          : 'text-gtb-subtle hover:text-white hover:bg-white/[0.06]'
      }`}
    >
      <Icon size={18} className={active ? 'text-gtb-dark' : 'text-gtb-muted group-hover:text-gtb-accent transition-colors'} />
      <span className="truncate">{label}</span>
      {active && <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-gtb-dark/40" />}
    </Link>
  );
}

function MobileNavLink({ href, icon: Icon, label }) {
  const pathname = usePathname();
  const active   = pathname === href;
  return (
    <Link href={href} className="flex flex-col items-center gap-1 flex-1 py-2">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 ${
        active ? 'bg-gtb-accent' : 'bg-transparent'
      }`}>
        <Icon size={20} className={active ? 'text-gtb-dark' : 'text-gtb-muted'} />
      </div>
      <span className={`text-[10px] font-medium ${active ? 'text-gtb-accent' : 'text-gtb-muted'}`}>{label}</span>
    </Link>
  );
}

export function Sidebar({ onLogout }) {
  return (
    <aside className="hidden lg:flex flex-col w-60 min-h-screen bg-gtb-card border-r border-white/[0.06] flex-shrink-0">
      <div className="px-5 py-5 border-b border-white/[0.06]">
        <GTBLogo size={36} showText={true} />
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="text-[10px] text-gtb-muted font-semibold uppercase tracking-wider px-3 mb-2">Main Menu</div>
        {navItems.map(item => <NavLink key={item.href} {...item} />)}
        <div className="border-t border-white/[0.06] my-4" />
        <div className="text-[10px] text-gtb-muted font-semibold uppercase tracking-wider px-3 mb-2">Account</div>
        {bottomItems.map(item => <NavLink key={item.href} {...item} />)}
      </nav>

      <div className="px-3 py-4 border-t border-white/[0.06]">
        <button
          onClick={onLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gtb-muted hover:text-gtb-danger hover:bg-gtb-danger/10 w-full transition-all duration-200"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}

export function MobileNav({ onLogout }) {
  const mobileItems = [
    { href: '/dashboard',    icon: LayoutDashboard, label: 'Home' },
    { href: '/accounts',     icon: Landmark,        label: 'Accounts' },
    { href: '/transfer',     icon: Send,            label: 'Transfer' },
    { href: '/crypto',       icon: Coins,           label: 'Crypto' },
    { href: '/transactions', icon: ArrowLeftRight,  label: 'History' },
  ];
  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 glass border-t border-white/[0.06]"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <div className="flex items-center justify-around px-2">
        {mobileItems.map(item => <MobileNavLink key={item.href} {...item} />)}
      </div>
    </div>
  );
}

export function MobileMenuDrawer({ open, onClose, onLogout }) {
  if (!open) return null;
  return (
    <div className="lg:hidden fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute left-0 top-0 bottom-0 w-72 bg-gtb-card border-r border-white/[0.06] flex flex-col animate-slide-up">
        <div className="flex items-center justify-between px-5 py-5 border-b border-white/[0.06]">
          <GTBLogo size={34} showText={true} />
          <button onClick={onClose} className="text-gtb-muted hover:text-white p-1"><X size={20} /></button>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map(item => <NavLink key={item.href} {...item} onClick={onClose} />)}
          <div className="border-t border-white/[0.06] my-4" />
          {bottomItems.map(item => <NavLink key={item.href} {...item} onClick={onClose} />)}
        </nav>
        <div className="px-3 py-4 border-t border-white/[0.06]">
          <button
            onClick={onLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gtb-muted hover:text-gtb-danger hover:bg-gtb-danger/10 w-full transition-all duration-200"
          >
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
