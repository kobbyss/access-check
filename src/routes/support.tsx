import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import {
  LifeBuoy,
  AlertCircle,
  Loader2,
  Check,
  Thermometer,
  Zap,
  MonitorX,
  Volume2,
  HardDrive,
  Gauge,
  ChevronDown,
  Mail,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { CONTACT_EMAIL } from "../config";
import supportHero from "../assets/support-hero.jpg";

export const Route = createFileRoute("/support")({
  head: () => ({
    meta: [
      { title: "Support & Troubleshooting Portal — KRUSH" },
      {
        name: "description",
        content:
          "Already bought a KRUSH build or had a repair done? Open a support ticket, track your issue, and browse our troubleshooting guides for boot, thermal, and performance problems.",
      },
      { property: "og:title", content: "Support & Troubleshooting Portal — KRUSH" },
      {
        property: "og:description",
        content:
          "Ask questions after your build. Submit a support ticket or work through our common-fault troubleshooting guides.",
      },
    ],
  }),
  component: SupportPage,
});

const categories = [
  { value: "hardware", label: "Hardware fault" },
  { value: "software", label: "Software / drivers" },
  { value: "performance", label: "Performance" },
  { value: "warranty", label: "Warranty claim" },
  { value: "general", label: "General question" },
] as const;

const priorities = [
  { value: "low", label: "Low" },
  { value: "normal", label: "Normal" },
  { value: "high", label: "High" },
  { value: "urgent", label: "Urgent — PC is down" },
] as const;

const guides = [
  {
    icon: Zap,
    title: "PC won't power on",
    accent: "text-accent-cyan",
    steps: [
      "Confirm the PSU switch on the back is set to I and the wall outlet is live.",
      "Reseat the 24-pin motherboard and 8-pin CPU power cables until they click.",
      "Hold the power button for 15 seconds with the cable unplugged to drain residual charge.",
      "Watch for motherboard debug LEDs (CPU / DRAM / VGA / BOOT) and tell us which one stays lit.",
    ],
  },
  {
    icon: MonitorX,
    title: "No display / black screen",
    accent: "text-accent-orange",
    steps: [
      "Plug the monitor cable into the graphics card, not the motherboard ports.",
      "Try a different cable and a different monitor input.",
      "Reseat the GPU and its PCIe power connectors.",
      "Reseat one stick of RAM in slot A2 and try to boot on that stick alone.",
    ],
  },
  {
    icon: Thermometer,
    title: "Running hot or throttling",
    accent: "text-accent-amber",
    steps: [
      "Check that intake filters and radiator fins are dust-free.",
      "Verify the fan curve in BIOS matches the profile we shipped.",
      "Confirm the AIO pump header is set to full speed, not PWM silent.",
      "Log peak CPU and GPU temps under load and include them in your ticket.",
    ],
  },
  {
    icon: Gauge,
    title: "Low FPS or stuttering",
    accent: "text-accent-cyan",
    steps: [
      "Set Windows power plan to High Performance and enable Game Mode.",
      "Confirm EXPO/XMP is still enabled in BIOS after any update.",
      "Update GPU drivers with a clean install.",
      "Check the monitor is running at its rated refresh rate in display settings.",
    ],
  },
  {
    icon: Volume2,
    title: "Loud or grinding noise",
    accent: "text-accent-orange",
    steps: [
      "Identify the source: stop each fan briefly with a plastic tool while listening.",
      "Grinding from the AIO usually means air in the pump — tell us and we'll bleed it.",
      "Ticking often means a cable touching a fan blade.",
      "Rattling can be a loose side panel or unsecured drive tray.",
    ],
  },
  {
    icon: HardDrive,
    title: "Storage or data issues",
    accent: "text-accent-amber",
    steps: [
      "Check the drive appears in BIOS and in Windows Disk Management.",
      "Run CrystalDiskInfo and note the health percentage.",
      "Stop writing to a failing drive immediately — it reduces recovery odds.",
      "Open an urgent ticket; we handle data recovery on the bench.",
    ],
  },
];

type Status = "idle" | "submitting" | "done" | "error";

function SupportPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [orderRef, setOrderRef] = useState("");
  const [category, setCategory] = useState("hardware");
  const [priority, setPriority] = useState("normal");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [open, setOpen] = useState<number | null>(0);

  const busy = status === "submitting";

  const field =
    "w-full px-4 py-3.5 rounded-xl bg-ink-950/60 border border-white/[0.06] text-white placeholder-gray-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:border-accent-cyan/40 focus:ring-accent-cyan/10 disabled:opacity-50";

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const err: Record<string, string> = {};
    if (!name.trim()) err.name = "Please enter your name";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) err.email = "Enter a valid email address";
    if (!subject.trim()) err.subject = "Give your issue a short title";
    if (message.trim().length < 10) err.message = "Please describe the issue in a little more detail";
    setErrors(err);
    if (Object.keys(err).length) return;

    setStatus("submitting");
    const { error } = await supabase.from("support_tickets").insert({
      name: name.trim(),
      email: email.trim(),
      order_reference: orderRef.trim() || null,
      category,
      priority,
      subject: subject.trim(),
      message: message.trim(),
      status: "open",
    });

    if (error) {
      console.error("Support ticket error:", error);
      setStatus("error");
      return;
    }
    setStatus("done");
  };

  return (
    <div className="pt-16">
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={supportHero}
            alt="KRUSH support bench with diagnostics running"
            width={1600}
            height={800}
            className="w-full h-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-ink-950/70 via-ink-950/85 to-ink-950" />
        </div>
        <div className="absolute inset-0 bg-grid opacity-40" />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <div className="kicker mb-4 justify-center">
            <LifeBuoy className="w-3.5 h-3.5" />
            Owner Support
          </div>
          <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight">
            Troubleshooting <span className="text-gradient-cyan">portal</span>
          </h1>
          <p className="mt-6 text-gray-400 max-w-2xl mx-auto text-lg">
            Bought a build or had a repair done with us? Work through the guides below, and open a
            ticket any time — every KRUSH customer gets direct support for the life of the machine.
          </p>
        </div>
      </section>

      <section className="relative pb-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h2 className="font-display font-bold text-2xl text-white mb-6">Common fixes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {guides.map((g, i) => (
              <div key={g.title} className="glass overflow-hidden">
                <button
                  type="button"
                  onClick={() => setOpen(open === i ? null : i)}
                  className="w-full flex items-center gap-4 p-5 text-left"
                >
                  <g.icon className={`w-5 h-5 ${g.accent} flex-shrink-0`} strokeWidth={1.5} />
                  <span className="flex-1 font-display font-semibold text-white text-base">{g.title}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-500 transition-transform ${open === i ? "rotate-180" : ""}`}
                  />
                </button>
                {open === i && (
                  <ol className="px-5 pb-5 space-y-2.5 border-t border-white/[0.05] pt-4">
                    {g.steps.map((s, k) => (
                      <li key={k} className="flex gap-3 text-sm text-gray-400 leading-relaxed">
                        <span className="font-mono text-xs text-gray-600 mt-0.5">{k + 1}.</span>
                        {s}
                      </li>
                    ))}
                  </ol>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative pb-24">
        <div className="absolute inset-0 flex justify-center">
          <div className="w-[600px] h-[600px] glow-radial-cyan opacity-20" />
        </div>
        <div className="relative max-w-3xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-8">
            <div className="kicker mb-4 justify-center">
              <Mail className="w-3.5 h-3.5" />
              Open a Ticket
            </div>
            <h2 className="font-display font-bold text-3xl text-white tracking-tight">
              Still stuck? Ask us directly
            </h2>
            <p className="mt-3 text-gray-500 text-sm">
              We reply to every ticket by email, usually within one business day.
            </p>
          </div>

          {status === "done" ? (
            <div className="glass p-10 text-center">
              <div className="w-14 h-14 rounded-2xl bg-accent-cyan/10 border border-accent-cyan/20 flex items-center justify-center mx-auto mb-5">
                <Check className="w-6 h-6 text-accent-cyan" strokeWidth={2.5} />
              </div>
              <h3 className="font-display font-bold text-xl text-white mb-2">Ticket received</h3>
              <p className="text-sm text-gray-400 max-w-md mx-auto">
                Thanks {name.split(" ")[0]} — we&apos;ve logged your issue and will reply to{" "}
                <span className="text-white">{email}</span>. For anything urgent you can also reach us at{" "}
                <a href={`mailto:${CONTACT_EMAIL}`} className="text-accent-cyan hover:underline">
                  {CONTACT_EMAIL}
                </a>
                .
              </p>
              <button
                onClick={() => {
                  setStatus("idle");
                  setSubject("");
                  setMessage("");
                }}
                className="btn-ghost mt-8"
              >
                Submit another ticket
              </button>
            </div>
          ) : (
            <form onSubmit={submit} className="glass p-8 lg:p-10 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                  <input value={name} onChange={(e) => setName(e.target.value)} disabled={busy} placeholder="John Doe" className={field} />
                  {errors.name && <FieldError text={errors.name} />}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={busy} placeholder="john@example.com" className={field} />
                  {errors.email && <FieldError text={errors.email} />}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Order ref</label>
                  <input value={orderRef} onChange={(e) => setOrderRef(e.target.value)} disabled={busy} placeholder="Optional" className={field} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                  <select value={category} onChange={(e) => setCategory(e.target.value)} disabled={busy} className={`${field} cursor-pointer`}>
                    {categories.map((c) => (
                      <option key={c.value} value={c.value} className="bg-ink-900">{c.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Priority</label>
                  <select value={priority} onChange={(e) => setPriority(e.target.value)} disabled={busy} className={`${field} cursor-pointer`}>
                    {priorities.map((p) => (
                      <option key={p.value} value={p.value} className="bg-ink-900">{p.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Subject</label>
                <input value={subject} onChange={(e) => setSubject(e.target.value)} disabled={busy} placeholder="GPU fans spin up then PC shuts off" className={field} />
                {errors.subject && <FieldError text={errors.subject} />}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">What&apos;s happening?</label>
                <textarea
                  rows={6}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  disabled={busy}
                  placeholder="Tell us when it started, what you were doing, any error codes or debug LEDs, and what you've already tried."
                  className={`${field} resize-none`}
                />
                {errors.message && <FieldError text={errors.message} />}
              </div>

              {status === "error" && (
                <div className="flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                  <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-300">
                    Something went wrong sending your ticket. Email {CONTACT_EMAIL} and we&apos;ll pick it up.
                  </p>
                </div>
              )}

              <button type="submit" disabled={busy} className="btn-primary w-full justify-center disabled:opacity-60">
                {busy ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending…
                  </>
                ) : (
                  "Submit Ticket"
                )}
              </button>
            </form>
          )}
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
