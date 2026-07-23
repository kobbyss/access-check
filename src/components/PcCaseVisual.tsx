import RgbFan from "./RgbFan";

/**
 * A stylized PC case silhouette with RGB fans glowing inside, used as a
 * hero visual. Cyan-lit on the left, orange-lit on the right.
 */
export default function PcCaseVisual({ className = "" }: { className?: string } = {}) {
  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 rounded-full bg-accent-cyan/25 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-1/2 h-1/2 rounded-full bg-accent-orange/25 blur-3xl" />
      </div>

      <div className="relative aspect-[3/5] max-w-[320px] mx-auto rounded-2xl border border-white/10 bg-gradient-to-b from-ink-850 to-ink-900 overflow-hidden shadow-[0_0_60px_rgba(0,240,255,0.15),0_0_60px_rgba(255,107,0,0.1)]">
        <div className="h-3 bg-ink-950 border-b border-white/10 flex items-center justify-center gap-1 px-3">
          {Array.from({ length: 12 }).map((_, i) => (
            <span key={i} className="h-1 w-px bg-white/20" />
          ))}
        </div>

        <div className="relative h-full p-5 flex flex-col items-center justify-center gap-5">
          <div className="absolute inset-0 bg-gradient-to-r from-accent-cyan/15 via-transparent to-accent-orange/15" />

          <RgbFan className="w-28 h-28 relative z-10" />
          <RgbFan className="w-28 h-28 relative z-10" />
          <RgbFan className="w-28 h-28 relative z-10" />
        </div>

        <div className="absolute top-0 bottom-0 left-0 w-px bg-gradient-to-b from-accent-cyan/40 via-transparent to-accent-cyan/20" />
        <div className="absolute top-0 bottom-0 right-0 w-px bg-gradient-to-b from-accent-orange/40 via-transparent to-accent-orange/20" />
      </div>
    </div>
  );
}