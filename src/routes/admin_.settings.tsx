import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { ArrowLeft, Save, Globe, Bot, Volume2, MessageCircle, Palette, ShieldCheck, Loader2 } from "lucide-react";

export const Route = createFileRoute("/admin/settings")({
  component: AdminSettingsPage,
});

type Settings = {
  siteTitle: string;
  tagline: string;
  defaultLanguage: string;
  whatsappNumber: string;
  contactEmail: string;
  showWelcomeRobot: boolean;
  enableVoiceGreeting: boolean;
  enableChatbot: boolean;
  enableWeather: boolean;
  enableCurrency: boolean;
  chatbotGreeting: string;
  themeAccent: string;
};

const DEFAULT_SETTINGS: Settings = {
  siteTitle: "Tumaini Gardens Isinya",
  tagline: "Serene garden lodge & event venue in Kajiado",
  defaultLanguage: "en",
  whatsappNumber: "+254759473510",
  contactEmail: "info@tumainigardens.co.ke",
  showWelcomeRobot: true,
  enableVoiceGreeting: true,
  enableChatbot: true,
  enableWeather: true,
  enableCurrency: true,
  chatbotGreeting: "Karibu! I'm Tumaini Assistant — ask me anything about our lodge, cuisine, events or staff training.",
  themeAccent: "forest",
};

function AdminSettingsPage() {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [saved, setSaved] = useState(false);
  const [tab, setTab] = useState<"general" | "features" | "chatbot" | "appearance">("general");

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        navigate({ to: "/auth" });
        return;
      }
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", data.session.user.id);
      const admin = (roles || []).some((r: any) => r.role === "admin");
      setAuthorized(admin);
      setChecking(false);

      // Load persisted settings from localStorage
      try {
        const raw = localStorage.getItem("tumaini_site_settings");
        if (raw) setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(raw) });
      } catch {}
    })();
  }, [navigate]);

  function save() {
    localStorage.setItem("tumaini_site_settings", JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  function update<K extends keyof Settings>(k: K, v: Settings[K]) {
    setSettings((s) => ({ ...s, [k]: v }));
  }

  if (checking) {
    return (
      <div className="min-h-screen grid place-items-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  if (!authorized) {
    return (
      <div className="min-h-screen grid place-items-center bg-background px-4 text-center">
        <div>
          <ShieldCheck className="mx-auto mb-4 h-12 w-12 text-primary" />
          <h1 className="text-2xl font-bold">Admin access required</h1>
          <Link to="/admin" className="mt-4 inline-block text-primary underline">Back to admin</Link>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "general" as const, label: "General", icon: Globe },
    { id: "features" as const, label: "Features", icon: Bot },
    { id: "chatbot" as const, label: "AI Chatbot", icon: MessageCircle },
    { id: "appearance" as const, label: "Appearance", icon: Palette },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-cream/40 to-background pt-24 pb-16">
      <div className="mx-auto max-w-5xl px-4">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <Link to="/admin" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
              <ArrowLeft className="h-4 w-4" /> Back to Admin
            </Link>
            <h1 className="mt-2 text-3xl font-black text-foreground">Site Settings</h1>
            <p className="text-sm text-muted-foreground">Configure your website's identity, features, chatbot behaviour, and look.</p>
          </div>
          <button
            onClick={save}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-glow hover:opacity-90"
          >
            <Save className="h-4 w-4" /> {saved ? "Saved ✓" : "Save changes"}
          </button>
        </div>

        <div className="grid gap-6 md:grid-cols-[220px_1fr]">
          <aside className="space-y-1">
            {tabs.map((t) => {
              const Icon = t.icon;
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`flex w-full items-center gap-2 rounded-xl px-4 py-2.5 text-left text-sm font-semibold transition ${
                    tab === t.id ? "bg-primary text-primary-foreground shadow" : "hover:bg-secondary"
                  }`}
                >
                  <Icon className="h-4 w-4" /> {t.label}
                </button>
              );
            })}
          </aside>

          <motion.section
            key={tab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl border bg-card p-6 shadow-lg"
          >
            {tab === "general" && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold">General</h2>
                <Field label="Site title">
                  <input className="input" value={settings.siteTitle} onChange={(e) => update("siteTitle", e.target.value)} />
                </Field>
                <Field label="Tagline">
                  <input className="input" value={settings.tagline} onChange={(e) => update("tagline", e.target.value)} />
                </Field>
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="WhatsApp number">
                    <input className="input" value={settings.whatsappNumber} onChange={(e) => update("whatsappNumber", e.target.value)} />
                  </Field>
                  <Field label="Contact email">
                    <input className="input" value={settings.contactEmail} onChange={(e) => update("contactEmail", e.target.value)} />
                  </Field>
                </div>
                <Field label="Default language (ISO code)">
                  <input className="input" value={settings.defaultLanguage} onChange={(e) => update("defaultLanguage", e.target.value)} />
                  <p className="mt-1 text-xs text-muted-foreground">e.g. en, sw, fr, es, ar, zh-CN. Guests can still switch via the language selector — 90+ languages supported.</p>
                </Field>
              </div>
            )}

            {tab === "features" && (
              <div className="space-y-3">
                <h2 className="text-xl font-bold">Site features</h2>
                <Toggle label="Show welcome robot (Tumi mascot)" value={settings.showWelcomeRobot} onChange={(v) => update("showWelcomeRobot", v)} />
                <Toggle label="Enable voice greeting button" value={settings.enableVoiceGreeting} onChange={(v) => update("enableVoiceGreeting", v)} />
                <Toggle label="Enable floating AI chatbot" value={settings.enableChatbot} onChange={(v) => update("enableChatbot", v)} />
                <Toggle label="Show live Isinya weather widget" value={settings.enableWeather} onChange={(v) => update("enableWeather", v)} />
                <Toggle label="Show currency converter" value={settings.enableCurrency} onChange={(v) => update("enableCurrency", v)} />
              </div>
            )}

            {tab === "chatbot" && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold flex items-center gap-2"><MessageCircle className="h-5 w-5 text-primary" /> AI Chatbot</h2>
                <p className="text-sm text-muted-foreground">The concierge is trained on Tumaini Gardens plus full hospitality, culinary, events, and general knowledge. It auto-detects the guest's language and pulls live posts from the CMS.</p>
                <Field label="Chatbot welcome message">
                  <textarea rows={3} className="input" value={settings.chatbotGreeting} onChange={(e) => update("chatbotGreeting", e.target.value)} />
                </Field>
                <div className="rounded-2xl bg-secondary/40 p-4 text-sm">
                  <p className="font-semibold text-foreground">✅ Chatbot capabilities</p>
                  <ul className="mt-2 list-disc pl-5 text-muted-foreground space-y-1">
                    <li>Hospitality, tourism, hotel management, revenue & operations</li>
                    <li>Culinary arts, world cuisine, mixology, HACCP food safety</li>
                    <li>Housekeeping SOPs, front-office scripts, event planning</li>
                    <li>Kenyan destinations, Maasai culture, safaris, logistics</li>
                    <li>Live pricing, booking guidance, WhatsApp handover</li>
                    <li>Multilingual answers in the guest's own language</li>
                  </ul>
                </div>
              </div>
            )}

            {tab === "appearance" && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold">Appearance</h2>
                <Field label="Accent theme">
                  <select className="input" value={settings.themeAccent} onChange={(e) => update("themeAccent", e.target.value)}>
                    <option value="forest">Forest Green (default)</option>
                    <option value="terracotta">Terracotta Clay</option>
                    <option value="ocean">Ocean Blue</option>
                    <option value="sunset">Kenyan Sunset</option>
                  </select>
                </Field>
                <p className="text-xs text-muted-foreground">Theme is saved locally. Deep re-skinning requires updating design tokens in <code>src/styles.css</code>.</p>
              </div>
            )}
          </motion.section>
        </div>

        <p className="mt-8 text-center text-xs text-muted-foreground">
          Website by <a href="https://www.euspansolutions.co.ke/" className="font-semibold text-primary hover:underline">Emmanuel Ndunda — Euspan Solutions</a> · 0769 722 940
        </p>
      </div>

      <style>{`.input{width:100%;border-radius:0.75rem;border:1px solid hsl(var(--border));background:hsl(var(--background));padding:0.6rem 0.9rem;font-size:0.9rem;color:hsl(var(--foreground));outline:none}
      .input:focus{box-shadow:0 0 0 3px hsl(var(--primary)/0.25)}`}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

function Toggle({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-center justify-between rounded-xl border bg-background/50 px-4 py-3 hover:bg-secondary/30">
      <span className="text-sm font-medium text-foreground">{label}</span>
      <button
        type="button"
        onClick={() => onChange(!value)}
        className={`relative h-6 w-11 rounded-full transition ${value ? "bg-primary" : "bg-muted"}`}
      >
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${value ? "left-5" : "left-0.5"}`} />
      </button>
    </label>
  );
}
