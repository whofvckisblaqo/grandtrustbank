'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, User, Mail, Phone, Calendar, Lock, AlertCircle, ArrowRight, CheckCircle, ChevronLeft } from 'lucide-react';
import InputField from '@/components/InputField';

const STEPS = ['Personal Info', 'Security'];

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep]       = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [showPw, setShowPw]   = useState(false);
  const [showPw2, setShowPw2] = useState(false);
  const [form, setForm]       = useState({
    firstName: '', lastName: '', email: '', phone: '',
    dateOfBirth: '', password: '', confirm: '',
  });

  const handle = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const nextStep = e => {
    e.preventDefault();
    setError('');
    if (step === 0) {
      if (!form.firstName || !form.lastName || !form.email || !form.phone) {
        return setError('Please fill in all fields.');
      }
      setStep(1);
    }
  };

  const submit = async e => {
    e.preventDefault();
    setError('');
    if (form.password.length < 8) return setError('Password must be at least 8 characters.');
    if (form.password !== form.confirm) return setError('Passwords do not match.');
    if (!form.dateOfBirth) return setError('Date of birth is required.');

    setLoading(true);
    try {
      const res  = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }
      router.push(`/verify?email=${encodeURIComponent(form.email)}`);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const EyeBtn1 = (
    <button type="button" onClick={() => setShowPw(p => !p)} className="text-gtb-muted hover:text-white transition-colors" tabIndex={-1}>
      {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
    </button>
  );
  const EyeBtn2 = (
    <button type="button" onClick={() => setShowPw2(p => !p)} className="text-gtb-muted hover:text-white transition-colors" tabIndex={-1}>
      {showPw2 ? <EyeOff size={16} /> : <Eye size={16} />}
    </button>
  );

  return (
    <div className="glass-card rounded-3xl p-8 sm:p-10 animate-slide-up" style={{ boxShadow: '0 32px 80px rgba(0,0,0,0.6)' }}>

      {/* Progress */}
      <div className="flex items-center gap-2 mb-8">
        {STEPS.map((label, i) => (
          <div key={label} className="flex items-center gap-2 flex-1">
            <div className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
              i < step ? 'bg-gtb-accent text-gtb-dark' :
              i === step ? 'bg-gtb-accent/20 border border-gtb-accent text-gtb-accent' :
              'bg-white/5 border border-white/10 text-gtb-muted'
            }`}>
              {i < step ? <CheckCircle size={14} /> : i + 1}
            </div>
            <span className={`text-xs hidden sm:block ${i === step ? 'text-white' : 'text-gtb-muted'}`}>{label}</span>
            {i < STEPS.length - 1 && <div className={`flex-1 h-px transition-colors duration-500 ${i < step ? 'bg-gtb-accent' : 'bg-white/10'}`} />}
          </div>
        ))}
      </div>

      <div className="text-center mb-8">
        <h1 className="text-2xl font-black text-white mb-1">
          {step === 0 ? 'Create your account' : 'Secure your account'}
        </h1>
        <p className="text-gtb-subtle text-sm">
          {step === 0 ? 'Start your banking journey with GTB' : 'Set a strong password to protect your account'}
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-3 p-4 rounded-xl mb-6 badge-danger animate-fade-in">
          <AlertCircle size={16} className="shrink-0" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {/* Step 0 — Personal Info */}
      {step === 0 && (
        <form onSubmit={nextStep} className="space-y-4" autoComplete="off">
          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="First Name"
              icon={User}
              name="firstName"
              type="text"
              required
              placeholder="John"
              value={form.firstName}
              onChange={handle}
              autoComplete="off"
            />
            <InputField
              label="Last Name"
              icon={User}
              name="lastName"
              type="text"
              required
              placeholder="Doe"
              value={form.lastName}
              onChange={handle}
              autoComplete="off"
            />
          </div>
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
          <InputField
            label="Phone Number"
            icon={Phone}
            name="phone"
            type="tel"
            required
            placeholder="+1 (555) 000-0000"
            value={form.phone}
            onChange={handle}
            autoComplete="off"
          />
          <button type="submit" className="btn-primary w-full justify-center text-base py-3.5 mt-2">
            Continue <ArrowRight size={16} />
          </button>
        </form>
      )}

      {/* Step 1 — Security */}
      {step === 1 && (
        <form onSubmit={submit} className="space-y-4" autoComplete="off">
          <InputField
            label="Date of Birth"
            icon={Calendar}
            name="dateOfBirth"
            type="date"
            required
            value={form.dateOfBirth}
            onChange={handle}
            style={{ colorScheme: 'dark' }}
          />

          <div>
            <label className="block text-gtb-muted text-xs mb-2 uppercase tracking-wider font-medium">Password</label>
            <div className="input-wrap">
              <span className="input-icon-left"><Lock size={16} /></span>
              <input
                name="password"
                type={showPw ? 'text' : 'password'}
                required
                placeholder="Min. 8 characters"
                value={form.password}
                onChange={handle}
                className="input-dark w-full pl-11 pr-12"
                autoComplete="new-password"
              />
              <span className="input-icon-right">{EyeBtn1}</span>
            </div>
            {form.password.length > 0 && (
              <div className="mt-2 flex gap-1">
                {[1, 2, 3, 4].map(n => (
                  <div key={n} className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                    form.password.length >= n * 2
                      ? n <= 2 ? 'bg-gtb-danger' : n === 3 ? 'bg-gtb-warn' : 'bg-gtb-success'
                      : 'bg-white/10'
                  }`} />
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-gtb-muted text-xs mb-2 uppercase tracking-wider font-medium">Confirm Password</label>
            <div className="input-wrap">
              <span className="input-icon-left"><Lock size={16} /></span>
              <input
                name="confirm"
                type={showPw2 ? 'text' : 'password'}
                required
                placeholder="Repeat password"
                value={form.confirm}
                onChange={handle}
                className="input-dark w-full pl-11 pr-12"
                autoComplete="new-password"
              />
              <span className="input-icon-right">{EyeBtn2}</span>
            </div>
          </div>

          <div className="flex gap-3 mt-2">
            <button type="button" onClick={() => { setStep(0); setError(''); }} className="btn-ghost flex-none px-4 py-3.5">
              <ChevronLeft size={16} />
            </button>
            <button type="submit" disabled={loading} className="btn-primary flex-1 justify-center text-base py-3.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none">
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-gtb-dark/30 border-t-gtb-dark rounded-full animate-spin" />
                  Creating account…
                </span>
              ) : (
                <>Create Account <ArrowRight size={16} /></>
              )}
            </button>
          </div>
        </form>
      )}

      <div className="mt-6 text-center">
        <p className="text-gtb-muted text-sm">
          Already have an account?{' '}
          <Link href="/login" className="text-gtb-accent hover:underline font-medium">Sign in</Link>
        </p>
      </div>
    </div>
  );
}