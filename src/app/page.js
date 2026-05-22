import Link from 'next/link';
import LandingNav from '@/components/LandingNav';
import {
  Shield, Zap, Globe, BarChart3, ArrowRight, Lock,
  CheckCircle, Smartphone, CreditCard, Send, Bell
} from 'lucide-react';

const features = [
  { icon: Zap,      title: 'Instant Transfers',    desc: 'Send money to any bank in the US or Europe in seconds. 24/7, every day of the year.',                      color: '#00E0B8' },
  { icon: Shield,   title: 'Bank-Grade Security',  desc: 'Military-grade 256-bit encryption with real-time fraud detection protecting every transaction.',             color: '#00C9A7' },
  { icon: BarChart3,title: 'Smart Analytics',      desc: 'Beautiful spending insights and reports that help you take control of your finances.',                       color: '#00E0B8' },
  { icon: Globe,    title: 'Global Payments',      desc: 'Send and receive money internationally with the best exchange rates.',                                       color: '#00C9A7' },
];

const stats = [
  { value: '50,000+',  label: 'Active Customers' },
  { value: '$2B+',    label: 'Monthly Transactions' },
  { value: '99.9%',   label: 'Uptime SLA' },
  { value: '256-bit', label: 'Encryption Standard' },
];

const steps = [
  { step: '01', title: 'Create Your Account', desc: 'Fill in your details and get started in under 2 minutes.' },
  { step: '02', title: 'Verify Your Identity', desc: 'Quick KYC process to keep your account safe and compliant.' },
  { step: '03', title: 'Start Banking',        desc: 'Deposit, transfer, pay bills, and manage your finances with ease.' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gtb-dark overflow-x-hidden">

      <LandingNav />

      {/* Hero */}
      <section className="hero-gradient relative pt-28 pb-20 lg:pt-36 lg:pb-32 overflow-hidden">
        <div className="orb orb-teal w-[600px] h-[600px] -top-40 -right-40 animate-pulse-glow" />
        <div className="orb orb-blue w-[400px] h-[400px] -bottom-20 -left-20 animate-pulse-glow delay-700" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">

            {/* Left */}
            <div className="animate-slide-up">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass border border-gtb-accent/20 mb-6">
                <div className="w-2 h-2 rounded-full bg-gtb-accent animate-pulse" />
                <span className="text-gtb-accent text-xs font-medium">Now live in USA &amp; Europe</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.1] mb-6">
                Banking
                <span className="block gradient-text">Beyond</span>
                <span className="block text-white">Boundaries.</span>
              </h1>
              <p className="text-gtb-subtle text-lg leading-relaxed mb-8 max-w-md">
                Grand Trust Bank — where cutting-edge technology meets financial excellence.
                Experience banking that actually works for you.
              </p>
              <div className="flex flex-wrap gap-4 mb-10">
                <Link href="/register" className="btn-primary text-base px-6 py-3">
                  Open Free Account <ArrowRight size={16} />
                </Link>
                <Link href="/login" className="btn-ghost text-base px-6 py-3">Sign In</Link>
              </div>
              <div className="flex flex-wrap gap-5">
                {['No monthly fees', 'Instant setup', 'FDIC insured'].map(item => (
                  <div key={item} className="flex items-center gap-2 text-sm text-gtb-subtle">
                    <CheckCircle size={14} className="text-gtb-accent" /> {item}
                  </div>
                ))}
              </div>
            </div>

            {/* Right — floating card */}
            <div className="relative flex justify-center lg:justify-end animate-slide-up delay-200">
              <div className="relative w-full max-w-sm">

                <div
                  className="relative w-full aspect-[1.7/1] rounded-2xl p-6 overflow-hidden animate-float"
                  style={{
                    background: 'linear-gradient(135deg, #00E0B8 0%, #0d3d35 40%, #0B1020 100%)',
                    boxShadow: '0 25px 80px rgba(0,224,184,0.35), 0 0 120px rgba(0,224,184,0.1)',
                  }}
                >
                  <div className="absolute inset-0 opacity-[0.07]"
                    style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <div className="text-white/60 text-xs">Grand Trust Bank</div>
                      <div className="text-white font-bold text-sm">PREMIUM</div>
                    </div>
                    <div className="w-10 h-8 rounded"
                      style={{ background: 'linear-gradient(135deg, #f0c040, #d4a020)', boxShadow: '0 2px 8px rgba(240,192,64,0.4)' }} />
                  </div>
                  <div className="mb-4">
                    <div className="text-white/50 text-xs mb-1">Available Balance</div>
                    <div className="text-white text-2xl font-black">$ 2,845,392.50</div>
                  </div>
                  <div className="flex justify-between items-end">
                    <div>
                      <div className="text-white/50 text-xs">**** **** **** 4521</div>
                      <div className="text-white text-sm font-medium mt-1">JOHN DOE</div>
                    </div>
                    <div className="text-right">
                      <div className="text-white/50 text-xs">EXPIRES</div>
                      <div className="text-white text-sm">12/28</div>
                    </div>
                  </div>
                </div>

                <div className="absolute -bottom-6 -left-6 glass-card rounded-2xl p-4 animate-float2" style={{ minWidth: 170, boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'rgba(0,224,184,0.15)' }}>
                      <Send size={14} className="text-gtb-accent" />
                    </div>
                    <div>
                      <div className="text-xs text-gtb-subtle">Last Transfer</div>
                      <div className="text-white text-sm font-semibold">$45,000</div>
                    </div>
                  </div>
                  <div className="text-xs text-gtb-success flex items-center gap-1">
                    <CheckCircle size={11} /> Completed
                  </div>
                </div>

                <div className="absolute -top-4 -right-4 glass-card rounded-2xl p-3 animate-float delay-300" style={{ minWidth: 155, boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gtb-success/10">
                      <Bell size={13} className="text-gtb-success" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white">Credit Alert</div>
                      <div className="text-xs text-gtb-accent">+$150,000</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-white/[0.06] py-8 bg-gtb-card/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-0 md:divide-x divide-white/[0.06]">
            {stats.map(({ value, label }) => (
              <div key={label} className="text-center px-6">
                <div className="text-2xl sm:text-3xl font-black gradient-text mb-1">{value}</div>
                <div className="text-gtb-muted text-sm">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section-gradient py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full badge-info text-xs font-medium mb-4">
              <Zap size={12} /> Why Choose GTB
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
              Everything you need to <span className="gradient-text">bank smarter</span>
            </h2>
            <p className="text-gtb-subtle max-w-xl mx-auto">
              Built with the latest technology to give you the most seamless and secure banking experience possible.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map(({ icon: Icon, title, desc, color }) => (
              <div key={title} className="glass-card rounded-2xl p-6 card-hover cursor-default">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: `${color}15`, border: `1px solid ${color}25` }}>
                  <Icon size={22} style={{ color }} />
                </div>
                <h3 className="text-white font-semibold text-base mb-2">{title}</h3>
                <p className="text-gtb-subtle text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 lg:py-28 border-t border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
              Up and running in <span className="gradient-text">3 simple steps</span>
            </h2>
            <p className="text-gtb-subtle max-w-md mx-auto">
              No branch visits. No paperwork. Open your account from anywhere in minutes.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map(({ step, title, desc }, i) => (
              <div key={step} className="relative">
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-full h-px"
                    style={{ background: 'linear-gradient(90deg, rgba(0,224,184,0.3), transparent)' }} />
                )}
                <div className="glass-card rounded-2xl p-6 text-center card-hover">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                    style={{ background: 'linear-gradient(135deg, rgba(0,224,184,0.15), rgba(0,201,167,0.08))', border: '1px solid rgba(0,224,184,0.25)' }}>
                    <span className="gradient-text font-black text-lg">{step}</span>
                  </div>
                  <h3 className="text-white font-semibold text-base mb-2">{title}</h3>
                  <p className="text-gtb-subtle text-sm leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 lg:py-28 border-t border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative glass-card rounded-3xl p-8 md:p-12 overflow-hidden text-center">
            <div className="orb orb-teal w-96 h-96 -top-20 -right-20 animate-pulse-glow" />
            <div className="orb orb-blue w-80 h-80 -bottom-10 -left-10 animate-pulse-glow delay-500" />
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
                Ready to experience <span className="gradient-text">premium banking?</span>
              </h2>
              <p className="text-gtb-subtle mb-8 max-w-lg mx-auto">
                Join thousands of customers who have already made the switch to smarter banking.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/register" className="btn-primary text-base px-8 py-4">
                  Open Free Account <ArrowRight size={18} />
                </Link>
                <Link href="/login" className="btn-ghost text-base px-8 py-4">Sign In</Link>
              </div>
              <div className="flex flex-wrap justify-center gap-6 mt-8">
                {[Shield, Lock, CreditCard, Smartphone].map((Icon, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-gtb-subtle">
                    <Icon size={14} className="text-gtb-accent" />
                    {['Bank-grade security', 'FDIC insured', 'Free virtual card', 'Mobile ready'][i]}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gtb-accent flex items-center justify-center">
                <span className="text-gtb-dark font-black text-xs">G</span>
              </div>
              <span className="text-white font-semibold">Grand Trust Bank</span>
            </div>
            <p className="text-gtb-muted text-sm">© 2026 Grand Trust Bank. FDIC &amp; FCA regulated.</p>
            <div className="flex gap-5 items-center">
              {['Privacy', 'Terms', 'Support'].map(l => (
                <a key={l} href="#" className="text-gtb-muted hover:text-white text-sm transition-colors">{l}</a>
              ))}
              <Link href="/admin/login" className="text-gtb-muted/40 hover:text-gtb-muted text-xs transition-colors">
                Staff
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
