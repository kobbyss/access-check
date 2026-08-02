import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Receipt,
  ArrowLeft,
  ArrowRight,
  Check,
  Loader2,
  AlertCircle,
  Pencil,
  ShieldCheck,
  CreditCard,
} from "lucide-react";
import { tiers } from "../data";
import { supabase } from "@/integrations/supabase/client";
import { BRAND_NAME, CONSULTATION_FEE, CONSULTATION_FEE_POLICY } from "../config";
import { loadOrderDraft, clearOrderDraft, partMetaKeys, type OrderDraft } from "@/lib/order";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: `Review Your Order — ${BRAND_NAME}` },
      {
        name: "description",
        content:
          "Review every part of your KrushPC build, your contact details and your consultation choice before sending the request.",
      },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: `Review Your Order — ${BRAND_NAME}` },
      {
        property: "og:description",
        content: "One last look at your spec before we build your quote.",
      },
    ],
  }),
  component: CheckoutPage,
});

type Status = "loading" | "ready" | "empty" | "submitting" | "error";

function CheckoutPage() {
  const navigate = useNavigate();
  const [draft, setDraft] = useState<OrderDraft | null>(null);
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    const d = loadOrderDraft();
    if (!d || !d.tier) {
      setStatus("empty");
      return;
    }
    setDraft(d);
    setStatus("ready");
  }, []);

  const tier = tiers.find((t) => t.id === draft?.tier);
  const guided = draft?.consultationType === "guided";
  const busy = status === "submitting";

  const placeOrder = async () => {
    if (!draft) return;
    setStatus("submitting");
    try {
      const partLines = partMetaKeys
        .filter(({ key }) => draft.parts[key])
        .map(({ label, key }) => `${label}: ${draft.parts[key]}`);
      const notes = [
        draft.service ? `Service type: ${draft.service}` : "",
        draft.symptoms.length
          ? `Reported symptoms —\n${draft.symptoms.map((s) => `• ${s}`).join("\n")}`
          : "",
        partLines.length ? `Part selections —\n${partLines.join("\n")}` : "",
        draft.customRequests,
      ]
        .filter(Boolean)
        .join("\n\n");

      const { error } = await supabase.from("consultations").insert({
        name: draft.name,
        email: draft.email,
        tier: draft.tier,
        budget: draft.budget,
        custom_requests: notes || null,
        payment_status: "pending",
        consultation_type: draft.consultationType,
      });
      if (error) throw error;

      clearOrderDraft();
      navigate({ to: "/success", search: { type: draft.consultationType } });
    } catch (err) {
      console.error("Order submission failed:", err);
      setStatus("error");
    }
  };

  if (status === "loading") {
    return (
      <div className="pt-32 pb-32 flex justify-center">
        <Loader2 className="w-6 h-6 text-accent-cyan animate-spin" />
      </div>
    );
  }

  if (status === "empty" || !draft || !tier) {
    return (
      <div className="pt-32 pb-32 px-6">
        <div className="max-w-lg mx-auto glass p-8 text-center">
          <Receipt className="w-8 h-8 text-accent-cyan mx-auto mb-4" strokeWidth={1.5} />
          <h1 className="font-display font-bold text-2xl text-white mb-2">No order to review yet</h1>
          <p className="text-sm text-gray-500 mb-6">
            Configure a build first and we&apos;ll bring you straight back here.
          </p>
          <Link to="/consultation" className="btn-primary inline-flex">
            Start your build
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16">
      <section className="relative py-14 overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="relative max-w-6xl mx-auto px-6 lg:px-8 text-center">
          <div className="kicker mb-4 justify-center">
            <Receipt className="w-3.5 h-3.5" />
            Checkout
          </div>
          <h1 className="font-display font-bold text-4xl sm:text-5xl text-white tracking-tight">
            Review your <span className="text-gradient-cyan">order</span>
          </h1>
          <p className="mt-4 text-gray-400 max-w-xl mx-auto">
            Everything you picked, in one place. Nothing is charged on this page.
          </p>
        </div>
      </section>

      <section className="pb-24">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 items-start">
          <div className="space-y-6">
            <div className="glass overflow-hidden">
              <div className="relative h-40">
                <img
                  src={tier.image}
                  alt={`${tier.name} build`}
                  className="w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/40 to-transparent" />
                <div className="absolute bottom-4 left-6">
                  <div className="font-display font-bold text-xl text-white">{tier.name}</div>
                  <div className="text-xs text-gray-400">{tier.priceRange}</div>
                </div>
                <EditLink />
              </div>
            </div>

            <div className="glass p-6 sm:p-8 relative">
              <SectionTitle>Your configuration</SectionTitle>
              <EditLink />
              {draft.service && (
                <div className="mb-5 text-sm text-accent-ice">{draft.service}</div>
              )}
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
                {partMetaKeys.map(({ key, label }) => (
                  <div key={key} className="flex justify-between gap-4 border-b border-white/[0.05] pb-2">
                    <dt className="text-xs text-gray-500">{label}</dt>
                    <dd className="text-xs text-gray-200 text-right">{draft.parts[key] ?? "—"}</dd>
                  </div>
                ))}
              </dl>
              {draft.symptoms.length > 0 && (
                <div className="mt-6 pt-5 border-t border-white/[0.06]">
                  <div className="text-xs font-mono uppercase tracking-wider text-accent-orange mb-2">
                    Reported faults
                  </div>
                  <ul className="space-y-1">
                    {draft.symptoms.map((s) => (
                      <li key={s} className="text-xs text-gray-300">• {s}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="glass p-6 sm:p-8 relative">
              <SectionTitle>Your details</SectionTitle>
              <EditLink />
              <dl className="space-y-3">
                <Row label="Name" value={draft.name} />
                <Row label="Email" value={draft.email} />
                <Row label="Budget" value={draft.budget} />
                {draft.customRequests && <Row label="Notes" value={draft.customRequests} />}
              </dl>
            </div>
          </div>

          <aside className="glass p-6 lg:sticky lg:top-24">
            <div className="text-xs font-mono uppercase tracking-widest text-gray-500 mb-5">
              Order summary
            </div>

            <div className="flex justify-between gap-4 pb-3 border-b border-white/[0.06]">
              <span className="text-sm text-gray-400">{tier.name} (estimate)</span>
              <span className="text-sm text-white font-medium whitespace-nowrap">{tier.priceRange}</span>
            </div>
            <div className="flex justify-between gap-4 py-3 border-b border-white/[0.06]">
              <span className="text-sm text-gray-400">
                {guided ? "Guided consultation" : "Consultation"}
              </span>
              <span className="text-sm text-white font-medium">
                {guided ? `$${CONSULTATION_FEE}` : "Free"}
              </span>
            </div>

            <div className="flex justify-between items-baseline pt-4">
              <span className="text-xs font-mono uppercase tracking-widest text-gray-500">
                Due today
              </span>
              <span className="font-display font-bold text-2xl text-white">$0</span>
            </div>

            {guided ? (
              <div className="mt-4 flex items-start gap-3 p-3.5 rounded-xl bg-accent-cyan/[0.06] border border-accent-cyan/15">
                <ShieldCheck className="w-4 h-4 text-accent-cyan flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                <p className="text-[11px] text-gray-400 leading-relaxed">{CONSULTATION_FEE_POLICY}</p>
              </div>
            ) : (
              <p className="mt-4 text-[11px] text-gray-500 leading-relaxed">
                Sending this request is free. Prices above are estimates — your exact quote arrives with
                your part list.
              </p>
            )}

            <div className="mt-4 flex items-start gap-3 p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <CreditCard className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" strokeWidth={1.5} />
              <p className="text-[11px] text-gray-500 leading-relaxed">
                No card is taken here. We&apos;ll contact you to arrange payment once your build is
                confirmed.
              </p>
            </div>

            {status === "error" && (
              <div className="mt-4 flex items-start gap-3 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-red-300">Something went wrong. Please try again.</p>
              </div>
            )}

            <button
              onClick={placeOrder}
              disabled={busy}
              className="btn-primary w-full justify-center mt-5 disabled:opacity-60"
            >
              {busy ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Sending your request…
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" strokeWidth={2.5} />
                  Place request
                </>
              )}
            </button>

            <Link to="/consultation" className="btn-ghost w-full justify-center mt-3">
              <ArrowLeft className="w-4 h-4" />
              Back to configurator
            </Link>
          </aside>
        </div>
      </section>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-display font-semibold text-lg text-white mb-5">{children}</h2>
  );
}

function EditLink() {
  return (
    <Link
      to="/consultation"
      className="absolute top-5 right-5 z-10 inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-gray-400 hover:text-accent-cyan transition-colors"
    >
      <Pencil className="w-3 h-3" />
      Edit
    </Link>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-6 border-b border-white/[0.05] pb-2">
      <dt className="text-xs text-gray-500 flex-shrink-0">{label}</dt>
      <dd className="text-xs text-gray-200 text-right whitespace-pre-wrap">{value}</dd>
    </div>
  );
}
