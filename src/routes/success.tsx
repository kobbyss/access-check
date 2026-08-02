import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { CheckCircle2, Mail, Clock, ArrowRight, Home as HomeIcon } from "lucide-react";
import { BRAND_NAME, CONTACT_EMAIL } from "../config";

export const Route = createFileRoute("/success")({
  head: () => ({
    meta: [
      { title: `Consultation Confirmed — ${BRAND_NAME}` },
      {
        name: "description",
        content:
          "Your KrushPC consultation payment is confirmed. Our team will send your custom PC part list within 24–48 hours.",
      },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: `Consultation Confirmed — ${BRAND_NAME}` },
      { property: "og:description", content: "Your custom PC build journey has begun." },
    ],
  }),
  component: SuccessPage,
});

function SuccessPage() {
  const navigate = useNavigate();
  return (
    <div className="pt-16 min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-30" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] glow-radial-amber opacity-40 animate-glow-pulse" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] glow-radial-cyan opacity-20" />

      <div className="relative max-w-2xl mx-auto px-6 lg:px-8 py-20 text-center">
        <div className="relative inline-block mb-8 animate-scale-in">
          <div className="absolute inset-0 bg-accent-amber/30 blur-2xl animate-glow-pulse" />
          <div className="relative w-20 h-20 rounded-full bg-accent-amber/10 border border-accent-amber/30 flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-accent-amber" strokeWidth={1.5} />
          </div>
        </div>

        <div className="kicker mb-4 justify-center animate-fade-in-down">
          <CheckCircle2 className="w-3.5 h-3.5" />
          Payment Confirmed
        </div>

        <h1 className="font-display font-bold text-4xl sm:text-5xl text-white tracking-tight animate-fade-in-up">
          Thank you for your <span className="text-gradient-cyan">trust</span>
        </h1>

        <p className="mt-6 text-lg text-gray-400 leading-relaxed max-w-xl mx-auto animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
          Your consultation payment has been received. Our team will review your requirements and reach out within{" "}
          <span className="text-white font-medium">24–48 hours</span> with your custom spec sheet.
        </p>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          <div className="glass p-6 text-left">
            <Clock className="w-6 h-6 text-accent-cyan mb-3" strokeWidth={1.5} />
            <h3 className="text-sm font-semibold text-white mb-1">What happens next</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              We&apos;ll craft your custom part list and email it to you within 24–48 hours.
            </p>
          </div>
          <div className="glass p-6 text-left">
            <Mail className="w-6 h-6 text-accent-amber mb-3" strokeWidth={1.5} />
            <h3 className="text-sm font-semibold text-white mb-1">Need to reach us?</h3>
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-xs text-gray-500 hover:text-accent-amber transition-colors leading-relaxed">
              {CONTACT_EMAIL}
            </a>
          </div>
        </div>

        <div className="mt-8 glass p-6 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
          <div className="flex items-center justify-center gap-2 text-xs font-mono text-gray-500 mb-4 uppercase tracking-widest">
            Your Build Journey
          </div>
          <div className="flex items-center justify-center gap-2 flex-wrap">
            {[
              { label: "Consultation", active: true },
              { label: "Part List", active: false },
              { label: "Deposit", active: false },
              { label: "Sourcing", active: false },
              { label: "Assembly", active: false },
              { label: "Delivery", active: false },
            ].map((step, i, arr) => (
              <div key={step.label} className="flex items-center gap-2">
                <span className={`text-xs font-medium ${step.active ? "text-accent-amber" : "text-gray-600"}`}>
                  {step.label}
                </span>
                {i < arr.length - 1 && <span className="text-gray-700 text-xs">→</span>}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
          <button onClick={() => navigate({ to: "/" })} className="btn-ghost">
            <HomeIcon className="w-4 h-4" />
            Back to Home
          </button>
          <button onClick={() => navigate({ to: "/tiers" })} className="btn-primary group">
            View System Tiers
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        <p className="mt-12 text-xs text-gray-600">
          A confirmation email from {BRAND_NAME} is on its way.
        </p>
      </div>
    </div>
  );
}