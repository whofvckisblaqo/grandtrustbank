'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

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
      <div className="min-h-screen flex items-center justify-center bg-[#0A2540] px-4">
        <div className="bg-white rounded-lg p-8 max-w-md w-full text-center">
          <p className="text-gray-700">
            No email address found. Please{' '}
            <a href="/register" className="text-[#0A2540] font-semibold underline">
              sign up
            </a>{' '}
            first.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A2540] px-4">
      <div className="bg-white rounded-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-[#0A2540] mb-2">Verify Your Email</h1>
        <p className="text-gray-600 mb-6">
          We sent a 6-digit code to <strong>{email}</strong>. Enter it below to activate your account.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            inputMode="numeric"
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
            placeholder="000000"
            className="w-full text-center text-3xl tracking-[0.5em] font-bold py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A2540]"
            autoFocus
          />

          {error && <p className="text-red-600 text-sm text-center">{error}</p>}
          {resendMessage && <p className="text-green-600 text-sm text-center">{resendMessage}</p>}

          <button
            type="submit"
            disabled={loading || otp.length !== 6}
            className="w-full bg-[#0A2540] text-white py-3 rounded-lg font-semibold disabled:opacity-50 hover:bg-[#0A2540]/90 transition"
          >
            {loading ? 'Verifying...' : 'Verify Account'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          Didn't get a code?{' '}
          <button
            onClick={handleResend}
            disabled={resending || cooldown > 0}
            className="text-[#0A2540] font-semibold underline disabled:opacity-50 disabled:no-underline"
          >
            {cooldown > 0 ? `Resend in ${cooldown}s` : resending ? 'Sending...' : 'Resend code'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#0A2540]" />}>
      <VerifyOtpForm />
    </Suspense>
  );
}