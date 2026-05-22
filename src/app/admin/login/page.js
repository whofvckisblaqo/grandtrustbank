'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Eye, EyeOff, AlertCircle, Lock, User } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd]   = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res  = await fetch('/api/admin/auth/login', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      router.push('/admin');
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gtb-dark flex items-center justify-center px-4">
      {/* Background orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="orb orb-teal w-[500px] h-[500px] -top-40 -right-40 animate-pulse-glow opacity-30" />
        <div className="orb orb-blue w-[400px] h-[400px] -bottom-20 -left-20 animate-pulse-glow delay-700 opacity-20" />
      </div>

      <div className="relative w-full max-w-sm animate-slide-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gtb-danger/10 border border-gtb-danger/30 flex items-center justify-center mx-auto mb-4">
            <Shield size={28} className="text-gtb-danger" />
          </div>
          <h1 className="text-2xl font-black text-white">Admin Portal</h1>
          <p className="text-gtb-muted text-sm mt-1">Grand Trust Bank — Restricted Access</p>
        </div>

        {/* Card */}
        <div className="glass-card rounded-3xl p-8" style={{ boxShadow: '0 32px 80px rgba(0,0,0,0.6)' }}>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-gtb-muted text-xs mb-2 uppercase tracking-wider">Admin Username</label>
              <div className="input-wrap">
                <span className="input-icon-left"><User size={16} /></span>
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="Enter admin username"
                  className="input-dark w-full pl-11"
                  required
                  autoComplete="username"
                />
              </div>
            </div>

            <div>
              <label className="block text-gtb-muted text-xs mb-2 uppercase tracking-wider">Password</label>
              <div className="input-wrap">
                <span className="input-icon-left"><Lock size={16} /></span>
                <input
                  type={showPwd ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-dark w-full pl-11 pr-12"
                  required
                  autoComplete="current-password"
                />
                <span className="input-icon-right">
                  <button type="button" onClick={() => setShowPwd(s => !s)} className="text-gtb-muted hover:text-white transition-colors">
                    {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </span>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 bg-gtb-danger/10 border border-gtb-danger/20 rounded-xl p-3 text-gtb-danger text-sm">
                <AlertCircle size={15} className="flex-shrink-0" /> {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !username || !password}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)', color: '#fff' }}
            >
              {loading
                ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Authenticating…</>
                : <><Shield size={16} /> Access Admin Panel</>
              }
            </button>
          </form>
        </div>

        <p className="text-center text-gtb-muted text-xs mt-6">
          This portal is for authorized personnel only.
          Unauthorized access attempts are logged.
        </p>

        <div className="text-center mt-4">
          <a href="/" className="text-gtb-muted hover:text-white text-xs transition-colors">← Back to main site</a>
        </div>
      </div>
    </div>
  );
}
