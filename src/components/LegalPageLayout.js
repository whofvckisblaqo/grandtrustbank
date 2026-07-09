import Link from 'next/link';
import LandingNav from '@/components/LandingNav';
import { ArrowLeft, Shield } from 'lucide-react';

export default function LegalPageLayout({ title, lastUpdated, children }) {
  return (
    <div className="min-h-screen bg-gtb-dark">
      <LandingNav />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
        <Link href="/" className="inline-flex items-center gap-2 text-gtb-muted hover:text-white text-sm mb-8 transition-colors">
          <ArrowLeft size={15} /> Back to Home
        </Link>

        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gtb-accent/10 border border-gtb-accent/20 flex-shrink-0">
            <Shield size={18} className="text-gtb-accent" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white">{title}</h1>
        </div>
        <p className="text-gtb-muted text-sm mb-12">Last updated: {lastUpdated}</p>

        <div className="glass-card rounded-3xl p-6 sm:p-10 space-y-8 legal-content">
          {children}
        </div>

        <p className="text-gtb-muted text-xs text-center mt-10">
          Questions about this policy? Contact us at{' '}
          <a href="mailto:grandtrustsuport@outlook.com" className="text-gtb-accent hover:underline">
            grandtrustsuport@outlook.com
          </a>
        </p>
      </div>
    </div>
  );
}