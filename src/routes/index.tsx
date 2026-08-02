import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowRight, ShieldCheck, Wrench, Zap, Thermometer, Eye, Sparkles } from "lucide-react";
import { builds } from "../data";
import PcCaseVisual from "../components/PcCaseVisual";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "KrushPC — Hand-Built, Performance-Tuned Custom PCs" },
      {
        name: "description",
        content:
          "KrushPC builds custom gaming and productivity PCs by hand. 72-hour stress testing, obsessive cable management, and component-matched builds tuned for peak performance.",
      },
      { property: "og:title", content: "KrushPC — Hand-Built, Performance-Tuned Custom PCs" },
      {
        property: "og:description",
        content:
          "Custom PC building studio. Every system meticulously assembled, stress-tested, and tuned for your dream build.",
      },
    ],
  }),
  component: HomePage,
});

const whyChooseUs = [
  {
    icon: ShieldCheck,
    title: "72-Hour Stress Testing",
    description:
      "Every build runs a full 72-hour burn-in with Cinebench, 3DMark, and MemTest86 to guarantee rock-solid stability before it ships.",
    accent: "cyan",
  },
  {
    icon: Wrench,
    title: "Component Matching",
    description:
      "We hand-pick and tune every part for optimal synergy — no bottlenecks, no wasted potential, just balanced performance.",
    accent: "orange",
  },
  {
    icon: Eye,
    title: "Clean Aesthetics",
    description:
      "Obsessive cable management, custom routing, and precision-built layouts that look as good as they perform.",
    accent: "amber",
  },
];

const accentMap = {
  cyan: { text: "text-accent-cyan", glow: "glow-border-cyan", radial: "glow-radial-cyan" },
  orange: { text: "text-accent-orange", glow: "glow-border-orange", radial: "glow-radial-orange" },
  amber: { text: "text-accent-amber", glow: "glow-border-amber", radial: "glow-radial-amber" },
};

function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="pt-16">
      <section className="relative min-h-[92vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-grid animate-grid-pan opacity-60" />
        <div className="absolute top-1/4 -left-32 w-[500px] h-[500px] glow-radial-cyan animate-glow-pulse" />
        <div
          className="absolute bottom-0 -right-32 w-[600px] h-[600px] glow-radial-orange animate-glow-pulse"
          style={{ animationDelay: "1.5s" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-ink-950" />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 w-full">
          <div className="max-w-3xl">
            <div className="kicker mb-6 animate-fade-in-down">
              <Sparkles className="w-3.5 h-3.5" />
              Custom PC Building Studio
            </div>
            <h1 className="font-display font-bold text-5xl sm:text-6xl lg:text-7xl leading-[1.05] tracking-tight text-white animate-fade-in-up">
              Hand-Built,
              <br />
              <span className="text-gradient-cyan">Performance-Tuned</span> PCs
            </h1>
            <p
              className="mt-6 text-lg text-gray-400 leading-relaxed max-w-xl animate-fade-in-up"
              style={{ animationDelay: "0.1s" }}
            >
              Every system is meticulously assembled, stress-tested for 72 hours, and tuned for peak performance. No pre-builts. No compromises. Just your dream machine.
            </p>
            <div
              className="mt-10 flex flex-col sm:flex-row gap-4 animate-fade-in-up"
              style={{ animationDelay: "0.2s" }}
            >
              <button onClick={() => navigate({ to: "/tiers" })} className="btn-primary group">
                View System Tiers
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
              <button onClick={() => navigate({ to: "/consultation" })} className="btn-ghost">
                Book a Consultation
              </button>
            </div>

            <div
              className="mt-16 grid grid-cols-3 gap-6 max-w-lg animate-fade-in-up"
              style={{ animationDelay: "0.3s" }}
            >
              {[
                { value: "500+", label: "Builds Shipped" },
                { value: "72hr", label: "Stress Testing" },
                { value: "100%", label: "Cable Managed" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="font-display font-bold text-2xl text-white">{stat.value}</div>
                  <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="hidden lg:block absolute right-12 top-1/2 -translate-y-1/2 animate-float">
          <PcCaseVisual />
        </div>
      </section>

      <section className="relative py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <div className="kicker mb-4">
                <Zap className="w-3.5 h-3.5" />
                Recent Builds
              </div>
              <h2 className="font-display font-bold text-3xl sm:text-4xl text-white tracking-tight">
                Crafted with precision
              </h2>
            </div>
            <p className="text-gray-500 text-sm max-w-sm">
              A glimpse into our studio — clean cable management, liquid cooling, and obsessive attention to detail.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {builds.map((build, i) => (
              <div
                key={build.id}
                className="group relative glass glass-hover overflow-hidden cursor-pointer"
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={build.image}
                    alt={build.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/30 to-transparent" />
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-t from-accent-cyan/10 to-transparent" />
                </div>

                <div className="absolute bottom-0 inset-x-0 p-5">
                  <div className="text-xs font-mono text-accent-cyan mb-1.5">{build.category}</div>
                  <h3 className="font-display font-semibold text-lg text-white mb-1">{build.title}</h3>
                  <p className="text-xs text-gray-400 leading-relaxed">{build.specs}</p>
                </div>

                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-accent-cyan/0 to-transparent group-hover:via-accent-cyan/60 transition-all duration-500" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-24">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] glow-radial-cyan opacity-40" />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="kicker mb-4 justify-center">
              <Sparkles className="w-3.5 h-3.5" />
              Why Choose Us
            </div>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-white tracking-tight max-w-2xl mx-auto">
              The difference is in the details
            </h2>
            <p className="mt-4 text-gray-500 max-w-xl mx-auto">
              We don&apos;t just assemble parts — we engineer complete systems tuned for your exact needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {whyChooseUs.map((item, i) => {
              const accent = accentMap[item.accent as keyof typeof accentMap];
              return (
                <div key={i} className={`glass glass-hover ${accent.glow} p-8 group`}>
                  <div className="relative inline-block mb-6">
                    <div
                      className={`absolute inset-0 ${accent.radial} blur-xl opacity-50 group-hover:opacity-100 transition-opacity duration-500`}
                    />
                    <item.icon className={`relative w-8 h-8 ${accent.text}`} strokeWidth={1.5} />
                  </div>
                  <h3 className="font-display font-semibold text-xl text-white mb-3">{item.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{item.description}</p>
                </div>
              );
            })}
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Thermometer, title: "Thermal Tuning", desc: "Custom fan curves and thermal paste optimization for peak cooling." },
              { icon: Zap, title: "BIOS Tuning", desc: "XMP/EXPO profiles enabled and RAM tuned for maximum bandwidth." },
              { icon: ShieldCheck, title: "2-Year Warranty", desc: "Every build backed by our workmanship guarantee." },
            ].map((f, i) => (
              <div key={i} className="flex items-start gap-4 p-6 glass">
                <f.icon className="w-5 h-5 text-accent-cyan flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                <div>
                  <h4 className="text-sm font-semibold text-white mb-1">{f.title}</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 relative glass overflow-hidden p-10 md:p-14 text-center group">
            <div className="absolute inset-0 glow-radial-orange opacity-30 group-hover:opacity-50 transition-opacity duration-700" />
            <div className="relative">
              <h3 className="font-display font-bold text-2xl sm:text-3xl text-white mb-3">
                Ready to build your dream PC?
              </h3>
              <p className="text-gray-400 mb-8 max-w-lg mx-auto">
                Book a consultation and we&apos;ll craft a custom part list tailored to your budget and use case.
              </p>
              <button onClick={() => navigate({ to: "/consultation" })} className="btn-primary group">
                Start Your Build
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
