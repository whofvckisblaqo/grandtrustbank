import Link from 'next/link';

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen hero-gradient flex flex-col">
      {/* Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="orb orb-teal w-[500px] h-[500px] -top-32 -left-32 animate-pulse-glow" />
        <div className="orb orb-blue w-[400px] h-[400px] -bottom-20 -right-20 animate-pulse-glow delay-700" />
      </div>

      {/* Nav */}
      <nav className="relative z-10 px-6 py-5">
        <Link href="/" className="inline-flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gtb-accent flex items-center justify-center">
            <span className="text-gtb-dark font-black text-sm">G</span>
          </div>
          <span className="font-bold text-white">Grand Trust Bank</span>
        </Link>
      </nav>

      {/* Content */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>

      <p className="relative z-10 text-center text-gtb-muted text-xs pb-6">
        © 2026 Grand Trust Bank. FDIC & FCA regulated.
      </p>
    </div>
  );
}
