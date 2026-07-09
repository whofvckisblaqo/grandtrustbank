'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ShieldCheck, AlertCircle } from 'lucide-react';

function VerifyOtpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';

  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendMessage, setResendMessage] = useState('');
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (otp.length !== 6) {
      setError('Enter the 6-digit code sent to your email');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Verification failed');
        setLoading(false);
        return;
      }

      router.push('/dashboard');
    } catch (err) {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  }

  async function handleResend() {
    setResendMessage('');
    setError('');
    setResending(true);
    try {
      const res = await fetch('/api/auth/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to resend code');
      } else {
        setResendMessage('A new code has been sent to your email');
        setCooldown(60);
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setResending(false);
    }
  }

  if (!email) {
    return (
      <div className="glass-card rounded-3xl p-8 sm:p-10 animate-slide-up text-center" style={{ boxShadow: '0 32px 80px rgba(0,0,0,0.6)' }}>
        <p className="text-gtb-subtle text-sm">
          No email address found. Please{' '}
          <a href="/register" className="text-gtb-accent underline font-medium">sign up</a> first.
        </p>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-3xl p-8 sm:p-10 animate-slide-up" style={{ boxShadow: '0 32px 80px rgba(0,0,0,0.6)' }}>
      <div className="text-center mb-8">
        <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
          style={{ background: 'rgba(0,224,184,0.12)', border: '1px solid rgba(0,224,184,0.3)' }}>
          <ShieldCheck size={24} className="text-gtb-accent" />
        </div>
        <h1 className="text-2xl font-black text-white mb-1">Verify Your Email</h1>
        <p className="text-gtb-subtle text-sm">
          We sent a 6-digit code to <span className="text-white font-medium">{email}</span>
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 rounded-xl mb-6 badge-danger animate-fade-in">
          <AlertCircle size={16} className="shrink-0" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          inputMode="numeric"
          maxLength={6}
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
          placeholder="000000"
          className="input-dark w-full text-center text-3xl tracking-[0.5em] font-bold py-4"
          style={{ color: '#ffffff', caretColor: '#00E0B8' }}
          autoFocus
        />

        {resendMessage && <p className="text-gtb-success text-sm text-center">{resendMessage}</p>}

        <button
          type="submit"
          disabled={loading || otp.length !== 6}
          className="btn-primary w-full justify-center text-base py-3.5 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-gtb-dark/30 border-t-gtb-dark rounded-full animate-spin" />
              Verifying...
            </span>
          ) : (
            'Verify Account'
          )}
        </button>
      </form>

      <div className="mt-6 text-center text-sm">
        <span className="text-gtb-muted">Didn't get a code? </span>
        <button
          onClick={handleResend}
          disabled={resending || cooldown > 0}
          className="text-gtb-accent hover:underline font-medium disabled:opacity-50 disabled:no-underline"
        >
          {cooldown > 0 ? `Resend in ${cooldown}s` : resending ? 'Sending...' : 'Resend code'}
        </button>
      </div>
    </div>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <VerifyOtpForm />
    </Suspense>
  );
}