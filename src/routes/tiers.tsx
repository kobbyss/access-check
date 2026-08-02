import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Check, Cpu, Monitor, MemoryStick, HardDrive, Droplets, ArrowRight, Star } from "lucide-react";
import { tiers, type Tier } from "../data";

export const Route = createFileRoute("/tiers")({
  head: () => ({
    meta: [
      { title: "System Tiers — KrushPC Custom PC Builds" },
      {
        name: "description",
        content:
          "Three curated PC tiers: Office & Productivity, Mid-Grade Gaming, and Elite High-Frame. Each engineered for a specific performance bracket and fully customizable.",
      },
      { property: "og:title", content: "System Tiers — KrushPC Custom PC Builds" },
      {
        property: "og:description",
        content:
          "Choose your performance tier — from silent productivity to 4K elite gaming. Every KrushPC build is hand-assembled and stress-tested.",
      },
    ],
  }),
  component: TiersPage,
});

const accentClasses: Record<
  Tier["accent"],
  { text: string; border: string; glow: string; bg: string; bgHover: string; badge: string }
> = {
  cyan: {
    text: "text-accent-cyan",
    border: "border-accent-cyan/30",
    glow: "glow-border-cyan",
    bg: "bg-accent-cyan/10",
    bgHover: "hover:bg-accent-cyan/5",
    badge: "bg-accent-cyan/15 text-accent-cyan",
  },
  orange: {
    text: "text-accent-orange",
    border: "border-accent-orange/30",
    glow: "glow-border-orange",
    bg: "bg-accent-orange/10",
    bgHover: "hover:bg-accent-orange/5",
    badge: "bg-accent-orange/15 text-accent-orange",
  },
  amber: {
    text: "text-accent-amber",
    border: "border-accent-amber/30",
    glow: "glow-border-amber",
    bg: "bg-accent-amber/10",
    bgHover: "hover:bg-accent-amber/5",
    badge: "bg-accent-amber/15 text-accent-amber",
  },
  ice: {
    text: "text-accent-ice",
    border: "border-accent-ice/30",
    glow: "glow-border-cyan",
    bg: "bg-accent-ice/10",
    bgHover: "hover:bg-accent-ice/5",
    badge: "bg-accent-ice/15 text-accent-ice",
  },
};

const componentIcons = {
  cpu: Cpu,
  gpu: Monitor,
  ram: MemoryStick,
  storage: HardDrive,
  cooling: Droplets,
};

const componentLabels: Record<keyof Tier["components"], string> = {
  cpu: "Processor (CPU)",
  gpu: "Graphics (GPU)",
  ram: "Memory (RAM)",
  storage: "Storage",
  cooling: "Cooling",
};

function TiersPage() {
  const navigate = useNavigate();

  const goConsult = (tierId?: string) =>
    navigate({ to: "/consultation", search: tierId ? { tier: tierId } : {} });

  return (
    <div className="pt-16">
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-40" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] glow-radial-orange opacity-30" />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <div className="kicker mb-4 justify-center">
            <Cpu className="w-3.5 h-3.5" />
            System Tiers
          </div>
          <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight">
            Choose your <span className="text-gradient-cyan">performance tier</span>
          </h1>
          <p className="mt-6 text-gray-400 max-w-2xl mx-auto text-lg">
            Three curated tiers plus a fully custom upgrade path. Every build is customizable part by part.
          </p>
        </div>
      </section>

      <section className="relative pb-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 lg:gap-4 items-stretch">
            {tiers.map((tier, i) => {
              const c = accentClasses[tier.accent];
              const isFeatured = tier.badge === "Most Popular";
              return (
                <div
                  key={tier.id}
                  className={`relative glass ${c.glow} overflow-hidden flex flex-col ${
                    isFeatured ? "xl:scale-[1.04] xl:z-10 border-white/10" : ""
                  }`}
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  {tier.badge && (
                    <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20">
                      <div className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-mono font-medium ${c.badge}`}>
                        <Star className="w-3 h-3 fill-current" />
                        {tier.badge}
                      </div>
                    </div>
                  )}

                  <div className="relative h-44 -mx-px -mt-px overflow-hidden">
                    <img
                      src={tier.image}
                      alt={`${tier.name} custom PC build by KrushPC`}
                      loading="lazy"
                      className="w-full h-full object-cover opacity-70 transition-transform duration-700 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/40 to-transparent" />
                  </div>

                  <div className="p-8 flex flex-col flex-1">
                  <div className="mb-6">
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-mono ${c.bg} ${c.text} mb-4`}>
                      {tier.id === "custom" ? "Custom" : `Tier ${i + 1}`}
                    </div>
                    <h3 className="font-display font-bold text-2xl text-white mb-2">{tier.name}</h3>
                    <p className="text-sm text-gray-400 leading-relaxed">{tier.tagline}</p>
                  </div>

                  <div className="mb-6 pb-6 border-b border-white/[0.06]">
                    <div className="font-display font-bold text-3xl text-white">{tier.priceRange}</div>
                    <div className="text-xs text-gray-500 mt-1">Estimated range · final quote after consultation</div>
                  </div>

                  <div className="flex-1 mb-8">
                    <ul className="space-y-3">
                      {tier.features.map((feat) => (
                        <li key={feat} className="flex items-start gap-3 text-sm text-gray-300">
                          <Check className={`w-4 h-4 ${c.text} flex-shrink-0 mt-0.5`} strokeWidth={2} />
                          {feat}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    onClick={() => goConsult(tier.id)}
                    className={`w-full py-3.5 rounded-xl font-display font-semibold text-sm tracking-wide transition-all duration-300 active:scale-[0.97] ${
                      isFeatured
                        ? "bg-gradient-to-r from-accent-orange to-accent-cyan text-ink-950 hover:shadow-[0_0_30px_rgba(255,107,0,0.4)]"
                        : `border border-white/10 ${c.bgHover} text-white hover:border-white/20`
                    }`}
                  >
                    Select {tier.name.split(" ")[0]}
                  </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="relative py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="kicker mb-4 justify-center">
              <HardDrive className="w-3.5 h-3.5" />
              Component Breakdown
            </div>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-white tracking-tight">
              What goes into each tier
            </h2>
            <p className="mt-4 text-gray-500 max-w-xl mx-auto">
              Detailed component specs for each tier. All parts are interchangeable — these are our recommended configurations.
            </p>
          </div>

          <div className="space-y-6">
            {tiers.map((tier, i) => {
              const c = accentClasses[tier.accent];
              return (
                <div key={tier.id} className={`glass ${c.glow} p-8 lg:p-10`}>
                  <div className="mb-8 rounded-xl overflow-hidden border border-white/[0.06] h-40 sm:h-52">
                    <img
                      src={tier.image}
                      alt={`${tier.name} build example`}
                      loading="lazy"
                      className="w-full h-full object-cover opacity-80"
                    />
                  </div>
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl ${c.bg} flex items-center justify-center font-display font-bold text-xl ${c.text}`}>
                        {tier.id === "custom" ? "+" : i + 1}
                      </div>
                      <div>
                        <h3 className="font-display font-bold text-xl text-white">{tier.name}</h3>
                        <p className="text-sm text-gray-500">{tier.priceRange}</p>
                      </div>
                    </div>
                    <div className={`text-xs font-mono px-4 py-2 rounded-lg ${c.bg} ${c.text} lg:self-end`}>
                      Best For
                    </div>
                  </div>

                  <div className="mb-8 p-5 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                    <div className={`text-xs font-mono uppercase tracking-widest ${c.text} mb-2`}>Use Case</div>
                    <p className="text-sm text-gray-300 leading-relaxed">{tier.useCase}</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                    {(Object.keys(tier.components) as (keyof Tier["components"])[]).map((key) => {
                      const Icon = componentIcons[key];
                      return (
                        <div key={key} className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-white/[0.08] transition-colors">
                          <Icon className={`w-5 h-5 ${c.text} mb-3`} strokeWidth={1.5} />
                          <div className="text-xs font-mono uppercase tracking-wider text-gray-500 mb-1.5">
                            {componentLabels[key]}
                          </div>
                          <div className="text-sm text-gray-200 leading-snug font-medium">
                            {tier.components[key]}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-16 text-center">
            <p className="text-gray-400 mb-6">
              Not sure which tier is right for you? Book a consultation and we&apos;ll help you decide.
            </p>
            <button onClick={() => goConsult()} className="btn-primary group">
              Book a Consultation
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}