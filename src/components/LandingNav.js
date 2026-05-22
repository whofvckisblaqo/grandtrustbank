'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight, Menu, X, ArrowRight } from 'lucide-react';

const navLinks = ['Features', 'Security', 'Pricing', 'About'];

export default function LandingNav() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gtb-accent flex items-center justify-center">
                <span className="text-gtb-dark font-black text-sm">G</span>
              </div>
              <span className="font-bold text-white text-lg hidden sm:block">Grand Trust Bank</span>
              <span className="font-bold text-white text-lg sm:hidden">GTB</span>
            </Link>

            {/* Desktop links */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map(item => (
                <a key={item} href="#" className="text-gtb-subtle hover:text-white text-sm transition-colors">{item}</a>
              ))}
            </div>

            {/* Desktop auth buttons */}
            <div className="hidden md:flex items-center gap-3">
              <Link href="/login" className="text-gtb-subtle hover:text-white text-sm transition-colors">
                Sign In
              </Link>
              <Link href="/register" className="btn-primary text-sm py-2 px-4">
                Get Started <ChevronRight size={14} />
              </Link>
            </div>

            {/* Mobile: Sign In + Hamburger */}
            <div className="flex md:hidden items-center gap-2">
              <Link href="/login" className="text-gtb-subtle hover:text-white text-sm transition-colors px-2 py-1">
                Sign In
              </Link>
              <button
                onClick={() => setOpen(true)}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-gtb-subtle hover:text-white hover:bg-white/[0.06] transition-all"
              >
                <Menu size={20} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-[60] md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          {/* Panel */}
          <div className="absolute top-0 right-0 bottom-0 w-72 bg-gtb-card border-l border-white/[0.08] flex flex-col animate-slide-up"
            style={{ animation: 'slideInRight 0.25s ease-out' }}>

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-5 border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-gtb-accent flex items-center justify-center">
                  <span className="text-gtb-dark font-black text-xs">G</span>
                </div>
                <span className="font-bold text-white text-sm">Grand Trust Bank</span>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-gtb-muted hover:text-white hover:bg-white/[0.06] transition-all"
              >
                <X size={18} />
              </button>
            </div>

            {/* Nav links */}
            <nav className="flex-1 px-4 py-6 space-y-1">
              {navLinks.map(item => (
                <a
                  key={item}
                  href="#"
                  onClick={() => setOpen(false)}
                  className="flex items-center px-3 py-3 rounded-xl text-gtb-subtle hover:text-white hover:bg-white/[0.06] text-sm font-medium transition-all"
                >
                  {item}
                </a>
              ))}
            </nav>

            {/* Auth buttons */}
            <div className="px-4 pb-8 space-y-3 border-t border-white/[0.06] pt-4">
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="btn-ghost w-full justify-center text-sm py-3"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                onClick={() => setOpen(false)}
                className="btn-primary w-full justify-center text-sm py-3"
              >
                Open Free Account <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
      `}</style>
    </>
  );
}
