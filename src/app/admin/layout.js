'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Shield, LogOut, RefreshCw } from 'lucide-react';
import GTBLogo from '@/components/GTBLogo';

export default function AdminLayout({ children }) {
  const router   = useRouter();
  const pathname = usePathname();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (pathname === '/admin/login') { setChecked(true); return; }
    fetch('/api/admin/auth/me')
      .then(r => {
        if (r.status === 401) router.replace('/admin/login');
        else setChecked(true);
      })
      .catch(() => router.replace('/admin/login'));
  }, [pathname, router]);

  async function handleLogout() {
    await fetch('/api/admin/auth/logout', { method: 'POST' });
    router.push('/admin/login');
  }

  if (!checked) {
    return (
      <div className="min-h-screen bg-gtb-dark flex items-center justify-center">
        <div className="flex items-center gap-3 text-gtb-muted">
          <RefreshCw size={18} className="animate-spin" />
          <span className="text-sm">Verifying access…</span>
        </div>
      </div>
    );
  }

  if (pathname === '/admin/login') return <>{children}</>;

  return (
    <div className="min-h-screen bg-gtb-dark">
      <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/[0.06] h-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-full flex items-center justify-between">
          <div className="flex items-center gap-4">
            <GTBLogo size={30} showText={false} />
            <div className="h-5 w-px bg-white/10" />
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-gtb-danger/20 border border-gtb-danger/30 flex items-center justify-center">
                <Shield size={12} className="text-gtb-danger" />
              </div>
              <span className="text-white font-bold text-sm">Admin Portal</span>
              <span className="text-gtb-muted text-xs hidden sm:inline">— Restricted</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-gtb-success/10 border border-gtb-success/20">
              <div className="w-1.5 h-1.5 rounded-full bg-gtb-success animate-pulse" />
              <span className="text-gtb-success text-xs font-medium">Session active</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-gtb-muted hover:text-gtb-danger hover:bg-gtb-danger/10 transition-all"
            >
              <LogOut size={15} /> <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      <main className="pt-14">
        {children}
      </main>
    </div>
  );
}
