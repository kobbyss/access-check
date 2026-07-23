interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: number;
}

/**
 * KRUSH shield logo: split cyan (left) / orange (right) shield with an
 * internal PC case silhouette lit by RGB fans.
 */
export default function Logo({ className = "", showText = true, size = 32 }: LogoProps) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="krushShieldL" x1="0" y1="0" x2="24" y2="48" gradientUnits="userSpaceOnUse">
            <stop stopColor="#00F0FF" />
            <stop offset="1" stopColor="#0099B8" />
          </linearGradient>
          <linearGradient id="krushShieldR" x1="24" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FF6B00" />
            <stop offset="1" stopColor="#FF9E00" />
          </linearGradient>
          <linearGradient id="krushFan" x1="0" y1="0" x2="0" y2="1">
            <stop stopColor="#00F0FF" />
            <stop offset="0.33" stopColor="#FF6B00" />
            <stop offset="0.66" stopColor="#FF9E00" />
            <stop offset="1" stopColor="#7FE5FF" />
          </linearGradient>
          <filter id="krushGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1.4" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <path d="M24 2L6 8v14c0 11 7.5 19 18 22 10.5-3 18-11 18-22V8L24 2z" fill="#0B111A" stroke="rgba(255,255,255,0.12)" strokeWidth="0.8" />
        <path d="M24 2L6 8v14c0 11 7.5 19 18 22V2z" fill="url(#krushShieldL)" opacity="0.92" />
        <path d="M24 2L42 8v14c0 11-7.5 19-18 22V2z" fill="url(#krushShieldR)" opacity="0.92" />
        <rect x="14" y="14" width="20" height="22" rx="2" fill="#0B111A" stroke="rgba(255,255,255,0.08)" strokeWidth="0.6" />
        <g filter="url(#krushGlow)">
          <circle cx="24" cy="20" r="3.2" fill="none" stroke="url(#krushFan)" strokeWidth="1.1" />
          <circle cx="24" cy="20" r="1" fill="url(#krushFan)" />
          <circle cx="24" cy="28" r="3.2" fill="none" stroke="url(#krushFan)" strokeWidth="1.1" />
          <circle cx="24" cy="28" r="1" fill="url(#krushFan)" />
        </g>
        <line x1="24" y1="2" x2="24" y2="44" stroke="rgba(11,17,26,0.6)" strokeWidth="0.6" />
      </svg>

      {showText && (
        <span className="font-display font-bold text-lg tracking-[0.18em] text-white">
          <span className="text-accent-cyan">KRU</span>
          <span className="text-accent-orange">SH</span>
        </span>
      )}
    </div>
  );
}