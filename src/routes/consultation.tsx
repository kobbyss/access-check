import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { z } from "zod";
import {
  ClipboardList,
  ArrowRight,
  ArrowLeft,
  Check,
  AlertCircle,
  Loader2,
  ShieldCheck,
  Sliders,
  Cpu,
  Monitor,
  MemoryStick,
  HardDrive,
  Droplets,
  Wrench,
  User,
  Receipt,
} from "lucide-react";
import { tiers } from "../data";
import { supabase } from "@/integrations/supabase/client";
import { STRIPE_PAYMENT_LINK, CONSULTATION_FEE, CONSULTATION_FEE_POLICY } from "../config";
import consultationHero from "../assets/consultation-hero.jpg";

const consultationSearchSchema = z.object({ tier: z.string().optional() });

export const Route = createFileRoute("/consultation")({
  validateSearch: consultationSearchSchema,
  head: () => ({
    meta: [
      { title: "Book a Consultation — KRUSH Custom PC Builds" },
      {
        name: "description",
        content: `Build your spec in three steps. Pay a $${CONSULTATION_FEE} consultation fee — credited toward your PC — and get a custom part list within 24–48 hours.`,
      },
      { property: "og:title", content: "Book a Consultation — KRUSH Custom PC Builds" },
      {
        property: "og:description",
        content: "Pick a tier, customize every part, and start your KRUSH build.",
      },
    ],
  }),
  component: ConsultationPage,
});

const budgetRanges = [
  "Under $1,000",
  "$1,000 – $1,500",
  "$1,500 – $2,000",
  "$2,000 – $2,500",
  "$2,500 – $3,500",
  "$3,500 – $5,000",
  "$5,000+",
];

const partMeta: { key: "cpu" | "gpu" | "ram" | "storage" | "cooling"; label: string; icon: typeof Cpu }[] = [
  { key: "cpu", label: "Processor", icon: Cpu },
  { key: "gpu", label: "Graphics", icon: Monitor },
  { key: "ram", label: "Memory", icon: MemoryStick },
  { key: "storage", label: "Storage", icon: HardDrive },
  { key: "cooling", label: "Cooling", icon: Droplets },
];

const steps = [
  { n: 1, label: "Your build", icon: Sliders },
  { n: 2, label: "Configure", icon: Cpu },
  { n: 3, label: "Details & pay", icon: Receipt },
];

type Status = "idle" | "submitting" | "redirecting" | "error";

function ConsultationPage() {
  const navigate = useNavigate();
  const { tier: preselectedTier } = Route.useSearch();

  const [step, setStep] = useState(preselectedTier ? 2 : 1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [tier, setTier] = useState<string>(preselectedTier ?? "");
  const [budget, setBudget] = useState("");
  const [customRequests, setCustomRequests] = useState("");
  const [parts, setParts] = useState<Record<string, string>>({});
  const [service, setService] = useState("");
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Status>("idle");

  const selectedTier = tiers.find((t) => t.id === tier);
  const isRepairPath = Boolean(selectedTier?.symptoms) && service.toLowerCase().includes("repair");
  const busy = status === "submitting" || status === "redirecting";

  const field =
    "w-full px-4 py-3.5 rounded-xl bg-ink-950/60 border border-white/[0.06] text-white placeholder-gray-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:border-accent-cyan/40 focus:ring-accent-cyan/10 disabled:opacity-50";

  const pickTier = (id: string) => {
    setTier(id);
    setParts({});
    setService("");
    setSymptoms([]);
    setErrors({});
    setStep(2);
  };

  const toggleSymptom = (s: string) =>
    setSymptoms((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Please enter your name";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) e.email = "Enter a valid email address";
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
      const partLines = Object.entries(parts)
        .filter(([, v]) => v)
        .map(([k, v]) => `${k.toUpperCase()}: ${v}`);
      const notes = [
        service ? `Service type: ${service}` : "",
        symptoms.length ? `Reported symptoms —\n${symptoms.map((s) => `• ${s}`).join("\n")}` : "",
        partLines.length ? `Custom part selections —\n${partLines.join("\n")}` : "",
        customRequests.trim(),
      ]
        .filter(Boolean)
        .join("\n\n");

      const { error } = await supabase.from("consultations").insert({
        name: name.trim(),
        email: email.trim(),
        tier,
        budget,
        custom_requests: notes || null,
        payment_status: "pending",
      });
      if (error) console.error("Insert error:", error);

      await new Promise((r) => setTimeout(r, 1200));
      setStatus("redirecting");
      await new Promise((r) => setTimeout(r, 600));

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

  return (
    <div className="pt-16">
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={consultationHero}
            alt="KRUSH build bench with PC components laid out"
            width={1600}
            height={800}
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-ink-950/70 via-ink-950/85 to-ink-950" />
        </div>
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <div className="kicker mb-4 justify-center">
            <ClipboardList className="w-3.5 h-3.5" />
            Consultation & Order
          </div>
          <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight">
            Configure your <span className="text-gradient-cyan">build</span>
          </h1>
          <p className="mt-5 text-gray-400 max-w-xl mx-auto">
            Three quick steps. We turn it into a full part list and quote within 24–48 hours.
          </p>
        </div>
      </section>

      <section className="relative pb-24">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          {/* progress rail */}
          <div className="flex items-center gap-3 sm:gap-5 mb-10">
            {steps.map((s, i) => {
              const active = step === s.n;
              const done = step > s.n;
              return (
                <div key={s.n} className="flex items-center gap-3 sm:gap-5 flex-1 last:flex-none">
                  <button
                    type="button"
                    onClick={() => (s.n < step ? setStep(s.n) : undefined)}
                    className={`flex items-center gap-3 transition-opacity ${s.n < step ? "cursor-pointer" : "cursor-default"} ${active || done ? "opacity-100" : "opacity-45"}`}
                  >
                    <span
                      className={`w-10 h-10 rounded-xl border flex items-center justify-center flex-shrink-0 ${
                        done
                          ? "bg-accent-cyan/15 border-accent-cyan/40 text-accent-cyan"
                          : active
                            ? "bg-accent-orange/15 border-accent-orange/40 text-accent-orange"
                            : "bg-ink-900/60 border-white/[0.06] text-gray-500"
                      }`}
                    >
                      {done ? <Check className="w-4 h-4" strokeWidth={2.5} /> : <s.icon className="w-4 h-4" strokeWidth={1.75} />}
                    </span>
                    <span className="hidden sm:block text-left">
                      <span className="block text-[10px] font-mono uppercase tracking-widest text-gray-600">Step {s.n}</span>
                      <span className="block text-sm font-medium text-white">{s.label}</span>
                    </span>
                  </button>
                  {i < steps.length - 1 && (
                    <span className={`h-px flex-1 ${step > s.n ? "bg-accent-cyan/40" : "bg-white/[0.07]"}`} />
                  )}
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start">
            <form onSubmit={handleSubmit} className="glass p-6 sm:p-8 lg:p-10">
              {/* STEP 1 */}
              {step === 1 && (
                <div className="animate-fade-in-up">
                  <h2 className="font-display font-bold text-2xl text-white mb-1">What are we building?</h2>
                  <p className="text-sm text-gray-500 mb-7">
                    Pick the closest starting point — you can change every part in the next step.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {tiers.map((t) => {
                      const selected = tier === t.id;
                      return (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => pickTier(t.id)}
                          className={`group relative rounded-2xl border overflow-hidden text-left transition-all duration-300 ${
                            selected
                              ? "border-accent-cyan/50 shadow-[0_0_28px_rgba(34,211,238,0.14)]"
                              : "border-white/[0.06] hover:border-white/15"
                          }`}
                        >
                          <div className="relative h-32">
                            <img
                              src={t.image}
                              alt={`${t.name} build`}
                              loading="lazy"
                              className="w-full h-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/40 to-transparent" />
                            {t.badge && (
                              <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-mono bg-accent-orange/20 text-accent-orange">
                                {t.badge}
                              </span>
                            )}
                            {selected && (
                              <span className="absolute top-3 right-3 w-6 h-6 rounded-full bg-accent-cyan flex items-center justify-center">
                                <Check className="w-3.5 h-3.5 text-ink-950" strokeWidth={3} />
                              </span>
                            )}
                          </div>
                          <div className="p-5 bg-ink-950/60">
                            <div className="font-display font-semibold text-white leading-tight">{t.name}</div>
                            <div className="text-xs text-gray-500 mt-1">{t.priceRange}</div>
                            <p className="text-xs text-gray-500 mt-2.5 leading-relaxed">{t.tagline}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  {errors.tier && <FieldError text={errors.tier} />}
                </div>
              )}

              {/* STEP 2 */}
              {step === 2 && selectedTier && (
                <div className="animate-fade-in-up">
                  <h2 className="font-display font-bold text-2xl text-white mb-1">
                    Configure {selectedTier.name}
                  </h2>
                  <p className="text-sm text-gray-500 mb-7">
                    Keep our recommended spec or swap any part. Unsure? Leave it recommended and we&apos;ll advise.
                  </p>

                  {selectedTier.services && (
                    <div className="mb-8">
                      <label className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-gray-500 mb-3">
                        <Wrench className="w-3.5 h-3.5 text-accent-ice" strokeWidth={1.5} />
                        Service type
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {selectedTier.services.map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => setService(s)}
                            className={`px-4 py-3 rounded-xl border text-sm text-left transition-all ${
                              service === s
                                ? "border-accent-ice/50 bg-accent-ice/10 text-white"
                                : "border-white/[0.06] bg-ink-950/50 text-gray-400 hover:border-white/15"
                            }`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {isRepairPath && selectedTier.symptoms && (
                    <div className="mb-8 rounded-2xl border border-accent-orange/20 bg-accent-orange/[0.04] p-5">
                      <div className="text-xs font-mono uppercase tracking-wider text-accent-orange mb-3">
                        What&apos;s wrong with it?
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {selectedTier.symptoms.map((s) => {
                          const on = symptoms.includes(s);
                          return (
                            <button
                              key={s}
                              type="button"
                              onClick={() => toggleSymptom(s)}
                              className={`px-3.5 py-2 rounded-full border text-xs transition-all ${
                                on
                                  ? "border-accent-orange/50 bg-accent-orange/15 text-white"
                                  : "border-white/[0.08] text-gray-400 hover:border-white/20"
                              }`}
                            >
                              {on && <Check className="w-3 h-3 inline mr-1.5 -mt-px" strokeWidth={3} />}
                              {s}
                            </button>
                          );
                        })}
                      </div>
                      <p className="text-xs text-gray-500 mt-4">
                        Every repair starts with a bench diagnosis — we quote before replacing anything.
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {partMeta.map(({ key, label, icon: Icon }) => (
                      <div key={key}>
                        <label className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-gray-500 mb-2">
                          <Icon className="w-3.5 h-3.5 text-accent-cyan" strokeWidth={1.5} />
                          {label}
                        </label>
                        <select
                          value={parts[key] ?? selectedTier.options[key][0]}
                          onChange={(e) => setParts((p) => ({ ...p, [key]: e.target.value }))}
                          className={`${field} py-3 text-sm cursor-pointer`}
                        >
                          {selectedTier.options[key].map((opt) => (
                            <option key={opt} value={opt} className="bg-ink-900">
                              {opt}
                            </option>
                          ))}
                        </select>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 flex flex-col sm:flex-row gap-3">
                    <button type="button" onClick={() => setStep(1)} className="btn-ghost">
                      <ArrowLeft className="w-4 h-4" />
                      Back
                    </button>
                    <button type="button" onClick={() => setStep(3)} className="btn-primary group flex-1 justify-center">
                      Continue
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3 */}
              {step === 3 && (
                <div className="animate-fade-in-up space-y-6">
                  <div>
                    <h2 className="font-display font-bold text-2xl text-white mb-1">Your details</h2>
                    <p className="text-sm text-gray-500">
                      We&apos;ll send your part list and quote here.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                        <User className="w-3.5 h-3.5 text-gray-500" /> Full Name
                      </label>
                      <input value={name} onChange={(e) => setName(e.target.value)} disabled={busy} placeholder="John Doe" className={field} />
                      {errors.name && <FieldError text={errors.name} />}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={busy} placeholder="john@example.com" className={field} />
                      {errors.email && <FieldError text={errors.email} />}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Budget Range</label>
                    <select value={budget} onChange={(e) => setBudget(e.target.value)} disabled={busy} className={`${field} cursor-pointer`}>
                      <option value="" className="bg-ink-900">Select your budget…</option>
                      {budgetRanges.map((b) => (
                        <option key={b} value={b} className="bg-ink-900">{b}</option>
                      ))}
                    </select>
                    {errors.budget && <FieldError text={errors.budget} />}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Anything else? <span className="text-gray-600">(optional)</span>
                    </label>
                    <textarea
                      rows={5}
                      value={customRequests}
                      onChange={(e) => setCustomRequests(e.target.value)}
                      disabled={busy}
                      placeholder="Case colour, RGB preferences, games you play, monitors you own, deadlines…"
                      className={`${field} resize-none`}
                    />
                  </div>

                  <div className="flex items-start gap-3 p-4 rounded-xl bg-accent-cyan/[0.06] border border-accent-cyan/15">
                    <ShieldCheck className="w-5 h-5 text-accent-cyan flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                    <p className="text-sm text-gray-400 leading-relaxed">
                      <span className="text-white font-medium">${CONSULTATION_FEE} consultation fee.</span>{" "}
                      {CONSULTATION_FEE_POLICY}
                    </p>
                  </div>

                  {status === "error" && (
                    <div className="flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                      <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-red-300">Something went wrong. Please try again.</p>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-3">
                    <button type="button" onClick={() => setStep(2)} disabled={busy} className="btn-ghost">
                      <ArrowLeft className="w-4 h-4" />
                      Back
                    </button>
                    <button type="submit" disabled={busy} className="btn-primary flex-1 justify-center disabled:opacity-60">
                      {status === "submitting" ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" /> Saving your build…
                        </>
                      ) : status === "redirecting" ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" /> Redirecting to payment…
                        </>
                      ) : (
                        <>
                          Proceed to ${CONSULTATION_FEE} Consultation Payment
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </form>

            {/* summary rail */}
            <aside className="glass p-6 lg:sticky lg:top-24">
              <div className="text-xs font-mono uppercase tracking-widest text-gray-500 mb-4">Build summary</div>
              {selectedTier ? (
                <>
                  <div className="rounded-xl overflow-hidden mb-4 h-28">
                    <img src={selectedTier.image} alt={selectedTier.name} loading="lazy" className="w-full h-full object-cover opacity-70" />
                  </div>
                  <div className="font-display font-semibold text-white">{selectedTier.name}</div>
                  <div className="text-xs text-gray-500 mb-4">{selectedTier.priceRange}</div>
                  {service && (
                    <div className="mb-3 text-xs text-accent-ice">{service}</div>
                  )}
                  <ul className="space-y-2 border-t border-white/[0.06] pt-4">
                    {partMeta.map(({ key, label }) => (
                      <li key={key} className="text-xs">
                        <span className="text-gray-600">{label}: </span>
                        <span className="text-gray-300">{parts[key] ?? selectedTier.options[key][0]}</span>
                      </li>
                    ))}
                  </ul>
                  {symptoms.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-white/[0.06]">
                      <div className="text-xs text-gray-600 mb-1.5">Reported faults</div>
                      <ul className="space-y-1">
                        {symptoms.map((s) => (
                          <li key={s} className="text-xs text-accent-orange">• {s}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-sm text-gray-500">Pick a starting point and your spec appears here.</p>
              )}
              <div className="mt-5 pt-4 border-t border-white/[0.06] flex items-center justify-between">
                <span className="text-xs text-gray-500">Consultation fee</span>
                <span className="font-display font-bold text-white">${CONSULTATION_FEE}</span>
              </div>
              <p className="text-[11px] text-gray-600 mt-2 leading-relaxed">
                Credited toward your build. Only refundable if you go ahead with a purchase.
              </p>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}

function FieldError({ text }: { text: string }) {
  return (
    <p className="mt-2 text-xs text-red-400 flex items-center gap-1.5">
      <AlertCircle className="w-3.5 h-3.5" />
      {text}
    </p>
  );
}
