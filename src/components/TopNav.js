'use client';
import { useState } from 'react';
import { Bell, Menu, Search } from 'lucide-react';
import { MobileMenuDrawer } from './Sidebar';

export default function TopNav({ user, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const initials = user ? `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase() : '?';

  return (
    <>
      <header className="sticky top-0 z-40 flex items-center justify-between gap-4 px-4 sm:px-6 h-16 glass border-b border-white/[0.06]">
        {/* Left */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMenuOpen(true)}
            className="lg:hidden w-9 h-9 rounded-xl flex items-center justify-center text-gtb-subtle hover:text-white hover:bg-white/[0.06] transition-all"
          >
            <Menu size={20} />
          </button>
          <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.06] text-sm text-gtb-muted w-52 cursor-text">
            <Search size={14} />
            <span>Search…</span>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          {/* Notification bell */}
          <button className="relative w-9 h-9 rounded-xl flex items-center justify-center text-gtb-subtle hover:text-white hover:bg-white/[0.06] transition-all">
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-gtb-accent glow-teal-sm" />
          </button>

          {/* Avatar */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm text-gtb-dark flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #00E0B8, #00A88A)' }}>
              {initials}
            </div>
            <div className="hidden sm:block">
              <div className="text-sm font-semibold text-white leading-tight">
                {user?.firstName} {user?.lastName}
              </div>
              <div className="text-[11px] text-gtb-muted capitalize">{user?.kycStatus ?? 'pending'} · GTB</div>
            </div>
          </div>
        </div>
      </header>

      <MobileMenuDrawer open={menuOpen} onClose={() => setMenuOpen(false)} onLogout={onLogout} />
    </>
  );
}
