'use client';
import { useState } from 'react';
import { HelpCircle, Mail, MessageCircle, Phone, FileText, Shield, ChevronDown } from 'lucide-react';

const faqs = [
  {
    q: 'How do I transfer money?',
    a: 'Go to the Transfer page from the sidebar. Choose between "My Accounts" (instant), "GTB Transfer" (to another GTB account), or "External Bank" (wire transfer). Internal and external transfers are reviewed by an admin before funds move.',
  },
  {
    q: 'How long do transfers take?',
    a: 'Transfers between your own accounts complete instantly. Transfers to other GTB accounts or external banks are reviewed by an admin before funds are released — typically within a few hours during business hours.',
  },
  {
    q: 'What are the transfer fees?',
    a: 'Own-account transfers are always free. For other transfers: up to $500 is free; $501–$5,000 costs $1.50; $5,001–$25,000 costs $3.00; above $25,000 costs $5.00. Fees are shown before you confirm.',
  },
  {
    q: 'How do I freeze my card?',
    a: 'Navigate to Cards in the sidebar. Click your card to flip it and reveal the back. Press the Freeze button below the card. Frozen cards cannot be used for transactions but can be unfrozen instantly.',
  },
  {
    q: 'How do I pay bills?',
    a: 'Go to Bill Payments, select a biller category (e.g. Electricity, Internet), choose your provider, enter your reference/account number and the amount, then confirm. The payment deducts instantly from your selected account.',
  },
  {
    q: 'How do I change my password?',
    a: 'Go to Settings → Security → Change Password. Enter your current password and choose a new one of at least 8 characters. Your session stays active after the change.',
  },
  {
    q: 'Why was my transfer rejected?',
    a: 'Transfers can be rejected if the details look suspicious, the daily limit is exceeded, or the recipient details cannot be verified. You\'ll see the rejection in your Transactions page with the reason. Contact support if you believe it was an error.',
  },
  {
    q: 'What is my daily transfer limit?',
    a: 'Each account has a daily transfer limit set at account creation. You can see your limit by going to Accounts and viewing your account details. Contact support to request a limit increase.',
  },
];

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="glass-card rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-4 text-left"
      >
        <span className="text-white font-semibold text-sm pr-4">{q}</span>
        <ChevronDown
          size={16}
          className={`text-gtb-muted flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <div className="px-5 pb-4 text-gtb-subtle text-sm leading-relaxed border-t border-white/[0.06] pt-3">
          {a}
        </div>
      )}
    </div>
  );
}

export default function HelpPage() {
  return (
    <div className="px-4 sm:px-6 py-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-black text-white">Help &amp; Support</h1>
        <p className="text-gtb-muted text-sm">We're here whenever you need us</p>
      </div>

      {/* Contact options */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        <a
          href="mailto:support@grandtrustbank.com"
          className="glass-card rounded-2xl p-4 flex flex-col items-center gap-2 text-center card-hover cursor-pointer no-underline"
        >
          <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: '#3B82F615', border: '1px solid #3B82F625' }}>
            <Mail size={20} style={{ color: '#3B82F6' }} />
          </div>
          <div className="text-white text-sm font-semibold">Email Us</div>
          <div className="text-gtb-muted text-xs">support@gtb.com</div>
        </a>

        <a
          href="tel:+18004822265"
          className="glass-card rounded-2xl p-4 flex flex-col items-center gap-2 text-center card-hover cursor-pointer no-underline"
        >
          <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: '#22C55E15', border: '1px solid #22C55E25' }}>
            <Phone size={20} style={{ color: '#22C55E' }} />
          </div>
          <div className="text-white text-sm font-semibold">Call Us</div>
          <div className="text-gtb-muted text-xs">+1 800 GTB BANK</div>
        </a>

        <div className="glass-card rounded-2xl p-4 flex flex-col items-center gap-2 text-center card-hover cursor-pointer relative">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: '#00E0B815', border: '1px solid #00E0B825' }}>
            <MessageCircle size={20} style={{ color: '#00E0B8' }} />
          </div>
          <div className="text-white text-sm font-semibold">Live Chat</div>
          <div className="text-gtb-muted text-xs">Mon–Fri 9am–6pm</div>
          <div className="absolute top-2 right-2 text-[9px] bg-gtb-accent/10 text-gtb-accent px-1.5 py-0.5 rounded-full border border-gtb-accent/20">Soon</div>
        </div>
      </div>

      {/* FAQs */}
      <div className="mb-6">
        <h2 className="text-white font-bold mb-4 flex items-center gap-2">
          <HelpCircle size={16} className="text-gtb-accent" /> Frequently Asked Questions
        </h2>
        <div className="space-y-2">
          {faqs.map(faq => <FaqItem key={faq.q} {...faq} />)}
        </div>
      </div>

      {/* Legal links */}
      <div className="flex flex-wrap gap-3">
        {[
          { icon: FileText, label: 'Terms of Service' },
          { icon: Shield,   label: 'Privacy Policy' },
          { icon: FileText, label: 'Cookie Policy' },
        ].map(({ icon: Icon, label }) => (
          <button key={label} className="flex items-center gap-2 text-gtb-muted hover:text-white text-sm transition-colors">
            <Icon size={14} /> {label}
          </button>
        ))}
      </div>
    </div>
  );
}
