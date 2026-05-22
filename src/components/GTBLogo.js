'use client';

export default function GTBLogo({ size = 40, showText = true, textSize = 'default' }) {
  const ts = textSize === 'sm';
  return (
    <div className="flex items-center gap-2.5">
      <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="gtb-grad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#00E0B8"/>
            <stop offset="100%" stopColor="#009E83"/>
          </linearGradient>
          <linearGradient id="gtb-sheen" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="rgba(255,255,255,0.2)"/>
            <stop offset="100%" stopColor="rgba(255,255,255,0)"/>
          </linearGradient>
        </defs>
        {/* Background */}
        <rect width="40" height="40" rx="10" fill="url(#gtb-grad)"/>
        {/* Sheen overlay */}
        <rect width="40" height="40" rx="10" fill="url(#gtb-sheen)"/>
        {/* G letterform — thick stroke arc with spur */}
        <path
          d="M29 14C27 11 24 9 20 9C14.5 9 10 13.5 10 20C10 26.5 14.5 31 20 31C25.5 31 30 27 30 22V21H21"
          stroke="#050816"
          strokeWidth="4.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
      {showText && (
        <div>
          <div className={`text-white font-black leading-tight tracking-tight ${ts ? 'text-xs' : 'text-sm'}`}>
            Grand Trust
          </div>
          <div className={`text-gtb-accent font-bold uppercase tracking-[0.2em] ${ts ? 'text-[8px]' : 'text-[10px]'}`}>
            Bank
          </div>
        </div>
      )}
    </div>
  );
}
