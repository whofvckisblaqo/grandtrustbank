'use client';
import { useAuth } from '@/hooks/useAuth';
import { Sidebar, MobileNav } from '@/components/Sidebar';
import TopNav from '@/components/TopNav';

export default function DashboardLayout({ children }) {
  const { user, loading, logout } = useAuth({ redirectIfUnauthenticated: true });

  if (loading) {
    return (
      <div className="min-h-screen bg-gtb-dark flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gtb-accent flex items-center justify-center glow-teal animate-pulse">
            <span className="text-gtb-dark font-black text-lg">G</span>
          </div>
          <div className="text-gtb-subtle text-sm">Loading your dashboard…</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gtb-dark overflow-hidden">
      <Sidebar onLogout={logout} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNav user={user} onLogout={logout} />
        <main className="flex-1 overflow-y-auto pb-20 lg:pb-6">
          {children}
        </main>
      </div>
      <MobileNav onLogout={logout} />
    </div>
  );
}
