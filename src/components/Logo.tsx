import krushMark from "../assets/krush-mark.png";

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: number;
}

/** KRUSH shield mark. */
export default function Logo({ className = "", showText = true, size = 32 }: LogoProps) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <img
        src={krushMark}
        alt="KRUSH logo"
        width={size}
        height={size}
        style={{ width: size, height: size }}
        className="flex-shrink-0 object-contain drop-shadow-[0_0_10px_rgba(0,240,255,0.35)]"
      />

      {showText && (
        <span className="font-display font-bold text-lg tracking-[0.18em] text-white">
          <span className="text-accent-cyan">KRU</span>
          <span className="text-accent-orange">SH</span>
        </span>
      )}
    </div>
  );
}