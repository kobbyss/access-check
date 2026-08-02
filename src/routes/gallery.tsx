import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import {
  Images,
  Upload,
  Loader2,
  Trash2,
  AlertCircle,
  Lock,
  LogOut,
  Plus,
  X,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { BRAND_NAME } from "../config";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: `Customer Builds Gallery — ${BRAND_NAME}` },
      {
        name: "description",
        content:
          "Real KrushPC machines in real homes and offices — photos of finished custom builds, upgrades and repairs delivered to customers.",
      },
      { property: "og:title", content: `Customer Builds Gallery — ${BRAND_NAME}` },
      {
        property: "og:description",
        content: "Photos of actual KrushPC builds delivered to customers.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: GalleryPage,
});

interface BuildRow {
  id: string;
  title: string;
  caption: string | null;
  specs: string | null;
  image_path: string;
  created_at: string;
}

function GalleryPage() {
  const [rows, setRows] = useState<BuildRow[]>([]);
  const [urls, setUrls] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("customer_builds")
      .select("id, title, caption, specs, image_path, created_at")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });
    if (error) console.error(error);
    const list = (data ?? []) as BuildRow[];
    setRows(list);

    if (list.length) {
      const { data: signed } = await supabase.storage
        .from("build-photos")
        .createSignedUrls(list.map((r) => r.image_path), 60 * 60);
      const map: Record<string, string> = {};
      signed?.forEach((s) => {
        if (s.path && s.signedUrl) map[s.path] = s.signedUrl;
      });
      setUrls(map);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    const check = async () => {
      const { data } = await supabase.auth.getUser();
      const user = data.user;
      setSignedIn(Boolean(user));
      if (!user) {
        setIsAdmin(false);
        return;
      }
      const { data: admin } = await supabase.rpc("has_role", {
        _user_id: user.id,
        _role: "admin",
      });
      setIsAdmin(Boolean(admin));
    };
    void check();
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "USER_UPDATED") void check();
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setPanelOpen(false);
  };

  const remove = async (row: BuildRow) => {
    if (!confirm(`Delete "${row.title}"?`)) return;
    await supabase.storage.from("build-photos").remove([row.image_path]);
    const { error } = await supabase.from("customer_builds").delete().eq("id", row.id);
    if (error) {
      console.error(error);
      return;
    }
    void load();
  };

  return (
    <div className="pt-16">
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] glow-radial-cyan opacity-25" />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <div className="kicker mb-4 justify-center">
            <Images className="w-3.5 h-3.5" />
            Customer Builds
          </div>
          <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight">
            Real builds, <span className="text-gradient-cyan">real customers</span>
          </h1>
          <p className="mt-5 text-gray-400 max-w-xl mx-auto">
            Photos of finished {BRAND_NAME} machines — custom builds, upgrades and repairs, shot after
            final testing.
          </p>

          <div className="mt-8 flex items-center justify-center gap-3">
            {isAdmin ? (
              <>
                <button onClick={() => setPanelOpen((v) => !v)} className="btn-primary text-xs">
                  {panelOpen ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  {panelOpen ? "Close uploader" : "Add a build"}
                </button>
                <button onClick={signOut} className="btn-ghost text-xs">
                  <LogOut className="w-4 h-4" /> Sign out
                </button>
              </>
            ) : signedIn ? (
              <button onClick={signOut} className="btn-ghost text-xs">
                <LogOut className="w-4 h-4" /> Sign out
              </button>
            ) : (
              <Link to="/auth" className="btn-ghost text-xs">
                <Lock className="w-3.5 h-3.5" /> Owner sign in
              </Link>
            )}
          </div>
        </div>
      </section>

      {isAdmin && panelOpen && (
        <section className="pb-8">
          <div className="max-w-3xl mx-auto px-6 lg:px-8">
            <UploadPanel
              onDone={() => {
                setPanelOpen(false);
                void load();
              }}
            />
          </div>
        </section>
      )}

      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {loading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="w-6 h-6 text-accent-cyan animate-spin" />
            </div>
          ) : rows.length === 0 ? (
            <div className="glass p-10 text-center max-w-lg mx-auto">
              <Images className="w-8 h-8 text-gray-600 mx-auto mb-4" strokeWidth={1.5} />
              <p className="text-sm text-gray-500">
                No customer builds posted yet — check back soon.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {rows.map((row) => (
                <article
                  key={row.id}
                  className="group relative rounded-2xl overflow-hidden border border-white/[0.06] bg-ink-900/40 hover:border-white/15 transition-all"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-ink-950">
                    {urls[row.image_path] ? (
                      <img
                        src={urls[row.image_path]}
                        alt={`${row.title} — customer build by ${BRAND_NAME}`}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Loader2 className="w-5 h-5 text-gray-600 animate-spin" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-ink-950/90 via-transparent to-transparent" />
                    {isAdmin && (
                      <button
                        onClick={() => remove(row)}
                        className="absolute top-3 right-3 w-8 h-8 rounded-lg bg-ink-950/80 border border-red-500/30 text-red-400 flex items-center justify-center hover:bg-red-500/20 transition-colors"
                        aria-label={`Delete ${row.title}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <div className="p-5">
                    <h2 className="font-display font-semibold text-white leading-tight">{row.title}</h2>
                    {row.caption && (
                      <p className="text-xs text-gray-500 mt-2 leading-relaxed">{row.caption}</p>
                    )}
                    {row.specs && (
                      <p className="mt-3 text-[11px] font-mono text-accent-cyan/80 leading-relaxed">
                        {row.specs}
                      </p>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function UploadPanel({ onDone }: { onDone: () => void }) {
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [specs, setSpecs] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const field =
    "w-full px-4 py-3 rounded-xl bg-ink-950/60 border border-white/[0.06] text-white placeholder-gray-600 text-sm focus:outline-none focus:ring-2 focus:border-accent-cyan/40 focus:ring-accent-cyan/10 disabled:opacity-50";

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (!file) {
      setError("Pick a photo to upload.");
      return;
    }
    if (!title.trim()) {
      setError("Give the build a title.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("Photo must be under 10MB.");
      return;
    }
    setBusy(true);
    try {
      const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
      const path = `${crypto.randomUUID()}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("build-photos")
        .upload(path, file, { contentType: file.type, upsert: false });
      if (upErr) throw upErr;

      const { error: insErr } = await supabase.from("customer_builds").insert({
        title: title.trim(),
        caption: caption.trim() || null,
        specs: specs.trim() || null,
        image_path: path,
      });
      if (insErr) throw insErr;

      setTitle("");
      setCaption("");
      setSpecs("");
      setFile(null);
      onDone();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="glass p-6 sm:p-8 space-y-4">
      <h2 className="font-display font-semibold text-lg text-white">Add a customer build</h2>

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="w-full rounded-xl border border-dashed border-white/15 bg-ink-950/40 py-8 flex flex-col items-center gap-2 hover:border-accent-cyan/40 transition-colors"
      >
        <Upload className="w-5 h-5 text-accent-cyan" strokeWidth={1.5} />
        <span className="text-sm text-gray-300">{file ? file.name : "Choose a photo"}</span>
        <span className="text-[11px] text-gray-600">JPG or PNG, up to 10MB</span>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
      />

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Build title (e.g. Dan's 1440p rig)"
        disabled={busy}
        maxLength={120}
        className={field}
      />
      <input
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        placeholder="Short caption (optional)"
        disabled={busy}
        maxLength={300}
        className={field}
      />
      <input
        value={specs}
        onChange={(e) => setSpecs(e.target.value)}
        placeholder="Specs line (optional) — e.g. Ryzen 7 7800X3D · RTX 5080 · 32GB DDR5"
        disabled={busy}
        maxLength={300}
        className={field}
      />

      {error && (
        <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20">
          <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-red-300">{error}</p>
        </div>
      )}

      <button type="submit" disabled={busy} className="btn-primary w-full justify-center disabled:opacity-60">
        {busy ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" /> Uploading…
          </>
        ) : (
          <>
            <Upload className="w-4 h-4" /> Publish to gallery
          </>
        )}
      </button>
    </form>
  );
}
