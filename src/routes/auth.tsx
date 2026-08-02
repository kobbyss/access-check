import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { Lock, Loader2, AlertCircle, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { BRAND_NAME } from "../config";

export const Route = createFileRoute("/auth")({
  ssr: false,
  head: () => ({
    meta: [
      { title: `Owner Sign In — ${BRAND_NAME}` },
      {
        name: "description",
        content: "Private sign in for the KrushPC owner to manage the customer build gallery.",
      },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: `Owner Sign In — ${BRAND_NAME}` },
      { property: "og:description", content: "Private admin access." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/gallery" });
    });
  }, [navigate]);

  const field =
    "w-full px-4 py-3.5 rounded-xl bg-ink-950/60 border border-white/[0.06] text-white placeholder-gray-600 transition-all focus:outline-none focus:ring-2 focus:border-accent-cyan/40 focus:ring-accent-cyan/10 disabled:opacity-50";

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setNotice("");
    setBusy(true);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate({ to: "/gallery" });
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin + "/gallery" },
        });
        if (error) throw error;
        if (data.session) navigate({ to: "/gallery" });
        else setNotice("Check your email to confirm the account, then sign in.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="pt-32 pb-32 px-6 relative">
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="relative max-w-md mx-auto glass p-8">
        <div className="w-11 h-11 rounded-xl bg-accent-cyan/10 border border-accent-cyan/25 flex items-center justify-center mb-5">
          <Lock className="w-5 h-5 text-accent-cyan" strokeWidth={1.5} />
        </div>
        <h1 className="font-display font-bold text-2xl text-white mb-1">
          {mode === "signin" ? "Owner sign in" : "Create owner account"}
        </h1>
        <p className="text-sm text-gray-500 mb-7">
          Private access for managing the customer build gallery.
        </p>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={busy}
              required
              className={field}
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={busy}
              required
              minLength={8}
              className={field}
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-red-300">{error}</p>
            </div>
          )}
          {notice && (
            <p className="text-xs text-accent-cyan">{notice}</p>
          )}

          <button type="submit" disabled={busy} className="btn-primary w-full justify-center disabled:opacity-60">
            {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : mode === "signin" ? "Sign in" : "Create account"}
          </button>
        </form>

        <button
          type="button"
          onClick={() => {
            setMode(mode === "signin" ? "signup" : "signin");
            setError("");
            setNotice("");
          }}
          className="mt-5 text-xs text-gray-500 hover:text-accent-cyan transition-colors"
        >
          {mode === "signin" ? "First time? Create the owner account" : "Already have an account? Sign in"}
        </button>

        <div className="mt-6 pt-5 border-t border-white/[0.06]">
          <Link to="/gallery" className="text-xs text-gray-500 hover:text-white inline-flex items-center gap-1.5">
            <ArrowLeft className="w-3 h-3" /> Back to the gallery
          </Link>
        </div>
      </div>
    </div>
  );
}
