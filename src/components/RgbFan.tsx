interface RgbFanProps {
  className?: string;
  spinning?: boolean;
}

/**
 * A single PC cooling fan with an RGB rainbow ring. Optional slow spin.
 */
export default function RgbFan({ className = "", spinning = true }: RgbFanProps) {
  return (
    <div className={`relative ${className}`}>
      <svg viewBox="0 0 100 100" className="w-full h-full" aria-hidden="true">
        <defs>
          <linearGradient id="rgbRing" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#00F0FF" />
            <stop offset="25%" stopColor="#7FE5FF" />
            <stop offset="50%" stopColor="#FF6B00" />
            <stop offset="75%" stopColor="#FF9E00" />
            <stop offset="100%" stopColor="#00F0FF" />
          </linearGradient>
          <filter id="rgbGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1.6" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <circle cx="50" cy="50" r="46" fill="none" stroke="url(#rgbRing)" strokeWidth="3" filter="url(#rgbGlow)" />
        <circle cx="50" cy="50" r="40" fill="#0B111A" stroke="rgba(255,255,255,0.08)" strokeWidth="0.8" />
        <g
          className={spinning ? "origin-center animate-[spin_4s_linear_infinite]" : ""}
          style={{ transformBox: "fill-box", transformOrigin: "center" }}
        >
          {[0, 72, 144, 216, 288].map((deg) => (
            <path
              key={deg}
              d="M50 50 C 56 30, 64 28, 50 12 C 44 28, 44 38, 50 50 Z"
              fill="rgba(255,255,255,0.06)"
              stroke="rgba(127,229,255,0.35)"
              strokeWidth="0.5"
              transform={`rotate(${deg} 50 50)`}
            />
          ))}
        </g>
        <circle cx="50" cy="50" r="6" fill="#0B111A" stroke="url(#rgbRing)" strokeWidth="1.2" />
        <circle cx="50" cy="50" r="2" fill="url(#rgbRing)" />
      </svg>
    </div>
  );
}