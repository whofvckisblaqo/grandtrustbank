import Link from 'next/link';
import LandingNav from '@/components/LandingNav';
import GTBLogo from '@/components/GTBLogo';
import {
  ArrowRight, Shield, Users, Globe2, TrendingUp,
  Target, Heart, Zap, Award, MapPin
} from 'lucide-react';

export const metadata = {
  title: 'About Us — Grand Trust Bank',
  description: 'Learn about Grand Trust Bank\'s mission to bring premium digital banking to individuals and businesses worldwide.',
};

const stats = [
  { value: '50,000+', label: 'Active Customers' },
  { value: '2019',    label: 'Founded' },
  { value: '12',      label: 'Countries Served' },
  { value: '$2B+',    label: 'Monthly Transactions' },
];

const values = [
  { icon: Shield,     title: 'Security First',        desc: 'Every decision we make starts with a simple question: does this keep our customers\' money and data safe?' },
  { icon: Zap,        title: 'Relentless Simplicity',  desc: 'Banking shouldn\'t require a finance degree. We strip away complexity so you can just get things done.' },
  { icon: Heart,      title: 'Customer Obsessed',      desc: 'We build for real people with real financial lives — not for what looks good in a boardroom deck.' },
  { icon: Globe2,     title: 'Borderless by Design',   desc: 'Money shouldn\'t stop at a border. We built our infrastructure to move as freely as our customers do.' },
];

const milestones = [
  { year: '2019', title: 'Grand Trust Bank founded',        desc: 'Started with a small team and a big idea: banking that actually respects your time.' },
  { year: '2021', title: 'FDIC insurance secured',          desc: 'Became a fully regulated, deposit-insured institution serving customers across the US.' },
  { year: '2023', title: 'European expansion',              desc: 'Launched FCA-regulated operations, bringing GTB to customers across Europe.' },
  { year: '2025', title: '50,000+ customers',               desc: 'Crossed 50,000 active customers and $2B in monthly transaction volume.' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gtb-dark">
      <LandingNav />

      {/* Hero */}
      <section className="relative pt-28 pb-16 lg:pt-36 lg:pb-20 overflow-hidden">
        <div className="orb orb-teal w-[500px] h-[500px] -top-40 -right-20 animate-pulse-glow" style={{ opacity: 0.25 }} />
        <div className="orb orb-blue w-[350px] h-[350px] -bottom-10 -left-20 animate-pulse-glow delay-700" style={{ opacity: 0.2 }} />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass border border-gtb-accent/20 mb-6">
            <Users size={13} className="text-gtb-accent" />
            <span className="text-gtb-accent text-xs font-medium">Our Story</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.1] mb-6 text-white">
            Building the bank <span className="gradient-text">we always wanted</span>
          </h1>
          <p className="text-gtb-subtle text-lg leading-relaxed max-w-2xl mx-auto">
            Grand Trust Bank was founded on a simple frustration: traditional banking was slow, opaque,
            and built for the institution — not the customer. We set out to build something different.
          </p>
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

      {/* Mission */}
      <section className="py-20 lg:py-28">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full badge-info text-xs font-medium mb-4">
                <Target size={12} /> Our Mission
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
                Banking that moves <span className="gradient-text">as fast as you do</span>
              </h2>
              <p className="text-gtb-subtle leading-relaxed mb-4">
                We believe access to fast, secure, borderless financial infrastructure shouldn't be a
                luxury reserved for large institutions. Whether you're a freelancer getting paid from
                three continents or a business managing payroll across currencies, GTB is built to keep up.
              </p>
              <p className="text-gtb-subtle leading-relaxed">
                Every feature we ship — from instant transfers to real-time analytics — starts with the
                same question: does this make our customers' financial lives measurably better?
              </p>
            </div>
            <div className="glass-card rounded-3xl p-8">
              <TrendingUp size={32} className="text-gtb-accent mb-4" />
              <div className="text-white font-bold text-lg mb-2">Growing with our customers</div>
              <p className="text-gtb-muted text-sm leading-relaxed">
                From a handful of early adopters to over 50,000 active customers moving more than $2
                billion every month, our growth has always followed one principle: earn trust, then
                scale.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 lg:py-28 section-gradient border-t border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
              What we <span className="gradient-text">stand for</span>
            </h2>
            <p className="text-gtb-subtle max-w-xl mx-auto">
              These aren't wall posters. They're the filters every product decision runs through.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="glass-card rounded-2xl p-6 card-hover">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-gtb-accent/10 border border-gtb-accent/20">
                  <Icon size={22} className="text-gtb-accent" />
                </div>
                <h3 className="text-white font-semibold text-base mb-2">{title}</h3>
                <p className="text-gtb-subtle text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 lg:py-28 border-t border-white/[0.06]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
              Our <span className="gradient-text">journey so far</span>
            </h2>
          </div>
          <div className="space-y-6">
            {milestones.map(({ year, title, desc }, i) => (
              <div key={year} className="flex gap-5">
                <div className="flex flex-col items-center flex-shrink-0">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-gtb-accent/10 border border-gtb-accent/20">
                    <span className="gradient-text font-black text-sm">{year}</span>
                  </div>
                  {i < milestones.length - 1 && <div className="w-px flex-1 bg-white/10 my-2" />}
                </div>
                <div className="glass-card rounded-2xl p-5 flex-1 mb-2">
                  <h3 className="text-white font-semibold text-base mb-1.5">{title}</h3>
                  <p className="text-gtb-subtle text-sm leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Locations */}
      <section className="py-20 lg:py-28 border-t border-white/[0.06] section-gradient">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full badge-info text-xs font-medium mb-4">
            <MapPin size={12} /> Where We Operate
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
            Regulated and operating <span className="gradient-text">across two continents</span>
          </h2>
          <p className="text-gtb-subtle max-w-xl mx-auto mb-10">
            Headquartered in New York, with regulated operations extending across Europe.
          </p>
          <div className="grid sm:grid-cols-2 gap-5 max-w-xl mx-auto">
            <div className="glass-card rounded-2xl p-6 text-left">
              <div className="flex items-center gap-2 mb-2">
                <Award size={16} className="text-gtb-accent" />
                <span className="text-white font-semibold text-sm">United States</span>
              </div>
              <p className="text-gtb-muted text-xs">350 Fifth Avenue, New York, NY 10118 · FDIC Insured</p>
            </div>
            <div className="glass-card rounded-2xl p-6 text-left">
              <div className="flex items-center gap-2 mb-2">
                <Award size={16} className="text-gtb-accent" />
                <span className="text-white font-semibold text-sm">Europe</span>
              </div>
              <p className="text-gtb-muted text-xs">FCA Regulated · Registration No. 987654</p>
            </div>
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
                Want to bank with people who <span className="gradient-text">actually care?</span>
              </h2>
              <p className="text-gtb-subtle mb-8 max-w-lg mx-auto">
                Join thousands of customers who've already made the switch.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/register" className="btn-primary text-base px-8 py-4">
                  Open Free Account <ArrowRight size={18} />
                </Link>
                <Link href="/login" className="btn-ghost text-base px-8 py-4">Sign In</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}