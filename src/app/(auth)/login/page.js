'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Lock, Mail, AlertCircle, ArrowRight } from 'lucide-react';
import InputField from '@/components/InputField';

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm]       = useState({ email: '', password: '' });
  const [showPw, setShowPw]   = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const handle = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const submit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res  = await fetch('/api/auth/login', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }
      router.push('/dashboard');
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const EyeBtn = (
    <button
      type="button"
      onClick={() => setShowPw(p => !p)}
      className="text-gtb-muted hover:text-white transition-colors"
      tabIndex={-1}
    >
      {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
    </button>
  );

  return (
    <div className="glass-card rounded-3xl p-8 sm:p-10 animate-slide-up" style={{ boxShadow: '0 32px 80px rgba(0,0,0,0.6)' }}>
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-14 h-14 rounded-2xl bg-gtb-accent flex items-center justify-center mx-auto mb-4 glow-teal-sm">
          <Lock size={24} className="text-gtb-dark" />
        </div>
        <h1 className="text-2xl font-black text-white mb-1">Welcome back</h1>
        <p className="text-gtb-subtle text-sm">Sign in to your Grand Trust Bank account</p>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 rounded-xl mb-6 badge-danger animate-fade-in">
          <AlertCircle size={16} className="shrink-0" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      <form onSubmit={submit} className="space-y-5" autoComplete="off">
        <InputField
          label="Email Address"
          icon={Mail}
          name="email"
          type="email"
          required
          placeholder="you@example.com"
          value={form.email}
          onChange={handle}
          autoComplete="off"
        />

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-gtb-muted text-xs uppercase tracking-wider font-medium">Password</label>
            <a href="#" className="text-xs text-gtb-accent hover:underline">Forgot password?</a>
          </div>
          <div className="input-wrap">
            <span className="input-icon-left"><Lock size={16} /></span>
            <input
              name="password"
              type={showPw ? 'text' : 'password'}
              required
              placeholder="Enter your password"
              value={form.password}
              onChange={handle}
              className="input-dark w-full pl-11 pr-12"
              autoComplete="off"
            />
            <span className="input-icon-right">
              <button type="button" onClick={() => setShowPw(p => !p)} className="text-gtb-muted hover:text-white transition-colors" tabIndex={-1}>
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </span>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full justify-center text-base py-3.5 mt-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-gtb-dark/30 border-t-gtb-dark rounded-full animate-spin" />
              Signing in…
            </span>
          ) : (
            <>Sign In <ArrowRight size={16} /></>
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-gtb-muted text-sm">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-gtb-accent hover:underline font-medium">Create one free</Link>
        </p>
      </div>
    </div>
  );
}
