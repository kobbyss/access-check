import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { z } from "zod";
import {
  DollarSign,
  ClipboardList,
  CreditCard,
  Truck,
  Wrench,
  PackageCheck,
  ArrowRight,
  Check,
  AlertCircle,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { tiers } from "../data";
import { supabase } from "@/integrations/supabase/client";
import { STRIPE_PAYMENT_LINK, CONSULTATION_FEE } from "../config";

const consultationSearchSchema = z.object({
  tier: z.string().optional(),
});

export const Route = createFileRoute("/consultation")({
  validateSearch: consultationSearchSchema,
  head: () => ({
    meta: [
      { title: "Book a Consultation — KRUSH Custom PC Builds" },
      {
        name: "description",
        content:
          "Tell us about your dream build. Submit your intake form and pay a refundable $30 consultation fee to receive a custom part list within 24–48 hours.",
      },
      { property: "og:title", content: "Book a Consultation — KRUSH Custom PC Builds" },
      {
        property: "og:description",
        content:
          "From consultation to delivery — start your KRUSH custom build in six carefully engineered steps.",
      },
    ],
  }),
  component: ConsultationPage,
});

const timelineSteps = [
  { icon: DollarSign, title: "Consultation Fee", description: `Pay a $${CONSULTATION_FEE} refundable fee to begin your custom build journey.`, accent: "cyan" },
  { icon: ClipboardList, title: "Custom Part List", description: "We generate a tailored component list based on your needs and budget.", accent: "cyan" },
  { icon: CreditCard, title: "Deposit", description: "Review and approve your spec sheet, then place a deposit on parts.", accent: "orange" },
  { icon: PackageCheck, title: "Sourcing", description: "We source all components from trusted suppliers at the best prices.", accent: "orange" },
  { icon: Wrench, title: "Assembly & Stress Testing", description: "Hand-assembled, cable-managed, and stress-tested for 72 hours.", accent: "amber" },
  { icon: Truck, title: "Delivery", description: "Your completed PC is carefully packaged and delivered to your door.", accent: "amber" },
];

const accentText = { cyan: "text-accent-cyan", orange: "text-accent-orange", amber: "text-accent-amber" };
const accentBg = {
  cyan: "bg-accent-cyan/10 border-accent-cyan/20",
  orange: "bg-accent-orange/10 border-accent-orange/20",
  amber: "bg-accent-amber/10 border-accent-amber/20",
};

const budgetRanges = [
  "Under $1,000",
  "$1,000 – $1,500",
  "$1,500 – $2,000",
  "$2,000 – $2,500",
  "$2,500 – $3,500",
  "$3,500 – $5,000",
  "$5,000+",
];

type Status = "idle" | "submitting" | "redirecting" | "error";

function ConsultationPage() {
  const navigate = useNavigate();
  const { tier: preselectedTier } = Route.useSearch();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [tier, setTier] = useState<string>(preselectedTier ?? "");
  const [budget, setBudget] = useState("");
  const [customRequests, setCustomRequests] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Status>("idle");

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Please enter your name";
    if (!email.trim()) {
      e.email = "Please enter your email";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      e.email = "Please enter a valid email address";
    }
    if (!tier) e.tier = "Please select a tier";
    if (!budget) e.budget = "Please select a budget range";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;

    setStatus("submitting");

    try {
      const { error } = await supabase.from("consultations").insert({
        name: name.trim(),
        email: email.trim(),
        tier,
        budget,
        custom_requests: customRequests.trim() || null,
        payment_status: "pending",
      });

      if (error) console.error("Insert error:", error);

      await new Promise((r) => setTimeout(r, 1800));
      setStatus("redirecting");
      await new Promise((r) => setTimeout(r, 800));

      if (STRIPE_PAYMENT_LINK && !STRIPE_PAYMENT_LINK.includes("YOUR_PAYMENT_LINK_ID")) {
        window.location.href = STRIPE_PAYMENT_LINK;
      } else {
        navigate({ to: "/success" });
      }
    } catch (err) {
      console.error("Submission error:", err);
      setStatus("error");
    }
  };

  const busy = status === "submitting" || status === "redirecting";

  return (
    <div className="pt-16">
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-40" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] glow-radial-amber opacity-30" />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <div className="kicker mb-4 justify-center">
            <ClipboardList className="w-3.5 h-3.5" />
            Consultation & Order
          </div>
          <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight">
            Let&apos;s build your <span className="text-gradient-cyan">dream PC</span>
          </h1>
          <p className="mt-6 text-gray-400 max-w-2xl mx-auto text-lg">
            From consultation to delivery, here&apos;s how our build process works.
          </p>
        </div>
      </section>

      <section className="relative pb-20">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-accent-cyan/40 via-accent-orange/40 to-accent-amber/40 hidden sm:block" />

            <div className="space-y-6">
              {timelineSteps.map((step, i) => (
                <div
                  key={i}
                  className="relative flex items-start gap-5 group animate-fade-in-up"
                  style={{ animationDelay: `${i * 0.08}s` }}
                >
                  <div className="relative flex-shrink-0 hidden sm:block">
                    <div className={`w-12 h-12 rounded-xl border flex items-center justify-center ${accentBg[step.accent as keyof typeof accentBg]} transition-all duration-300 group-hover:scale-110`}>
                      <step.icon className={`w-5 h-5 ${accentText[step.accent as keyof typeof accentText]}`} strokeWidth={1.5} />
                    </div>
                  </div>

                  <div className="glass glass-hover flex-1 p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs font-mono text-gray-500">STEP {String(i + 1).padStart(2, "0")}</span>
                      <h3 className="font-display font-semibold text-lg text-white">{step.title}</h3>
                    </div>
                    <p className="text-sm text-gray-400 leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative pb-24">
        <div className="absolute inset-0 flex justify-center">
          <div className="w-[600px] h-[600px] glow-radial-cyan opacity-20" />
        </div>
        <div className="relative max-w-3xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-10">
            <div className="kicker mb-4 justify-center">
              <CreditCard className="w-3.5 h-3.5" />
              Intake Form
            </div>
            <h2 className="font-display font-bold text-3xl text-white tracking-tight">
              Tell us about your build
            </h2>
            <p className="mt-3 text-gray-500 text-sm">
              Fill out the form below, then proceed to the ${CONSULTATION_FEE} consultation payment.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="glass p-8 lg:p-10 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                disabled={busy}
                className={`w-full px-4 py-3.5 rounded-xl bg-ink-900/60 border text-white placeholder-gray-600 transition-all duration-300 focus:outline-none focus:ring-2 disabled:opacity-50 ${
                  errors.name ? "border-red-500/50 focus:ring-red-500/20" : "border-white/[0.06] focus:border-accent-cyan/40 focus:ring-accent-cyan/10"
                }`}
              />
              {errors.name && (
                <p className="mt-2 text-xs text-red-400 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.name}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
                disabled={busy}
                className={`w-full px-4 py-3.5 rounded-xl bg-ink-900/60 border text-white placeholder-gray-600 transition-all duration-300 focus:outline-none focus:ring-2 disabled:opacity-50 ${
                  errors.email ? "border-red-500/50 focus:ring-red-500/20" : "border-white/[0.06] focus:border-accent-cyan/40 focus:ring-accent-cyan/10"
                }`}
              />
              {errors.email && (
                <p className="mt-2 text-xs text-red-400 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">Desired PC Tier</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {tiers.map((t, i) => {
                  const selected = tier === t.id;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setTier(t.id)}
                      disabled={busy}
                      className={`relative p-4 rounded-xl border text-left transition-all duration-300 disabled:opacity-50 ${
                        selected
                          ? "border-accent-cyan/40 bg-accent-cyan/5 shadow-[0_0_20px_rgba(34,211,238,0.1)]"
                          : "border-white/[0.06] bg-ink-900/40 hover:border-white/10"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-mono text-gray-500">Tier {i + 1}</span>
                        {selected && <Check className="w-4 h-4 text-accent-cyan" strokeWidth={2.5} />}
                      </div>
                      <div className="text-sm font-semibold text-white leading-tight">{t.name}</div>
                      <div className="text-xs text-gray-500 mt-1">{t.priceRange}</div>
                    </button>
                  );
                })}
              </div>
              {errors.tier && (
                <p className="mt-2 text-xs text-red-400 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.tier}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Budget Range</label>
              <select
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                disabled={busy}
                className={`w-full px-4 py-3.5 rounded-xl bg-ink-900/60 border text-white transition-all duration-300 focus:outline-none focus:ring-2 disabled:opacity-50 appearance-none cursor-pointer ${
                  errors.budget ? "border-red-500/50 focus:ring-red-500/20" : "border-white/[0.06] focus:border-accent-cyan/40 focus:ring-accent-cyan/10"
                }`}
              >
                <option value="" className="bg-ink-900">Select your budget…</option>
                {budgetRanges.map((b) => (
                  <option key={b} value={b} className="bg-ink-900">{b}</option>
                ))}
              </select>
              {errors.budget && (
                <p className="mt-2 text-xs text-red-400 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.budget}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Custom Requests <span className="text-gray-600 font-normal">(optional)</span>
              </label>
              <textarea
                value={customRequests}
                onChange={(e) => setCustomRequests(e.target.value)}
                placeholder="e.g. specific color scheme, RGB preferences, particular games or software, storage needs, monitor resolution…"
                rows={4}
                disabled={busy}
                className="w-full px-4 py-3.5 rounded-xl bg-ink-900/60 border text-white placeholder-gray-600 transition-all duration-300 focus:outline-none focus:ring-2 disabled:opacity-50 resize-none border-white/[0.06] focus:border-accent-cyan/40 focus:ring-accent-cyan/10"
              />
            </div>

            {status === "error" && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                <p className="text-sm text-red-300">
                  Something went wrong. Please try again or contact us directly.
                </p>
              </div>
            )}

            <div className="pt-2">
              <button
                type="submit"
                disabled={busy}
                className="btn-primary w-full text-base py-4 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {status === "submitting" && (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin-slow" />
                    Processing your request…
                  </>
                )}
                {status === "redirecting" && (
                  <>
                    <ShieldCheck className="w-5 h-5" />
                    Redirecting to secure checkout…
                  </>
                )}
                {(status === "idle" || status === "error") && (
                  <>
                    Proceed to ${CONSULTATION_FEE} Consultation Payment
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
              <p className="mt-4 text-center text-xs text-gray-600 flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                Secure checkout via Stripe. Fee is applied toward your final build.
              </p>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}