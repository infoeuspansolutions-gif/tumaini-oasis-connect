import { useEffect, useState } from "react";
import { Cloud, Sun, CloudRain, CloudSnow, Search, Volume2, VolumeX, Languages, ArrowRightLeft } from "lucide-react";

// ---------- Weather (Open-Meteo, no key) ----------
function useWeather() {
  const [data, setData] = useState<{ temp: number; code: number } | null>(null);
  useEffect(() => {
    fetch("https://api.open-meteo.com/v1/forecast?latitude=-1.6833&longitude=36.85&current=temperature_2m,weather_code&timezone=Africa/Nairobi")
      .then((r) => r.json())
      .then((j) => setData({ temp: Math.round(j.current.temperature_2m), code: j.current.weather_code }))
      .catch(() => {});
  }, []);
  return data;
}
function WeatherIcon({ code }: { code: number }) {
  if (code === 0 || code === 1) return <Sun className="h-4 w-4" />;
  if (code >= 71 && code <= 77) return <CloudSnow className="h-4 w-4" />;
  if (code >= 51 && code <= 82) return <CloudRain className="h-4 w-4" />;
  return <Cloud className="h-4 w-4" />;
}
function WeatherWidget() {
  const w = useWeather();
  return (
    <div className="flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-white">
      {w ? <WeatherIcon code={w.code} /> : <Cloud className="h-4 w-4 animate-pulse" />}
      <span className="text-xs font-semibold">Isinya {w ? `${w.temp}°C` : "…"}</span>
    </div>
  );
}

// ---------- Currency (exchangerate.host) ----------
function CurrencyWidget() {
  const [amount, setAmount] = useState("100");
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("KES");
  const [rate, setRate] = useState<number | null>(null);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    fetch(`https://open.er-api.com/v6/latest/${from}`)
      .then((r) => r.json())
      .then((j) => setRate(j?.rates?.[to] ?? null))
      .catch(() => setRate(null));
  }, [from, to, open]);
  const converted = rate ? (parseFloat(amount || "0") * rate).toFixed(2) : "…";
  const currencies = ["KES", "USD", "EUR", "GBP", "TZS", "UGX", "ZAR", "AED", "INR", "CNY", "JPY"];
  return (
    <div className="relative">
      <button onClick={() => setOpen((o) => !o)} className="flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white hover:bg-white/25">
        <ArrowRightLeft className="h-4 w-4" /> Currency
      </button>
      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-72 rounded-2xl border bg-card p-3 text-foreground shadow-glow">
          <p className="mb-2 text-xs font-bold uppercase tracking-wider text-primary">Currency Converter</p>
          <div className="flex items-center gap-2">
            <input value={amount} onChange={(e) => setAmount(e.target.value)} type="number" className="w-20 rounded-lg border bg-background px-2 py-1 text-sm" />
            <select value={from} onChange={(e) => setFrom(e.target.value)} className="rounded-lg border bg-background px-2 py-1 text-sm">
              {currencies.map((c) => <option key={c}>{c}</option>)}
            </select>
            <ArrowRightLeft className="h-4 w-4 text-muted-foreground" />
            <select value={to} onChange={(e) => setTo(e.target.value)} className="rounded-lg border bg-background px-2 py-1 text-sm">
              {currencies.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <p className="mt-3 rounded-lg bg-primary/10 p-2 text-center text-sm font-bold text-primary">
            {amount} {from} = {converted} {to}
          </p>
        </div>
      )}
    </div>
  );
}

// ---------- Google Site Search ----------
function GoogleSearch() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!q.trim()) return;
    const host = typeof window !== "undefined" ? window.location.hostname : "tumainigardens.co.ke";
    window.open(`https://www.google.com/search?q=${encodeURIComponent(`site:${host} ${q}`)}`, "_blank");
  };
  return (
    <div className="relative">
      <button onClick={() => setOpen((o) => !o)} className="flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white hover:bg-white/25">
        <Search className="h-4 w-4" /> Search
      </button>
      {open && (
        <form onSubmit={submit} className="absolute right-0 top-full z-50 mt-2 flex w-72 gap-2 rounded-2xl border bg-card p-3 shadow-glow">
          <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search Tumaini via Google…" className="flex-1 rounded-lg border bg-background px-3 py-1.5 text-sm outline-none" />
          <button className="rounded-lg bg-primary px-3 py-1.5 text-sm text-primary-foreground">Go</button>
        </form>
      )}
    </div>
  );
}

// ---------- Voice Greeting ----------
function VoiceGreeting() {
  const [on, setOn] = useState(false);
  const speak = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    if (on) {
      setOn(false);
      return;
    }
    const u = new SpeechSynthesisUtterance(
      "Karibu sana Tumaini Gardens Isinya! Welcome to our serene garden oasis. Explore our cottages, pool, and event spaces. We are delighted to host you."
    );
    u.rate = 0.95;
    u.pitch = 1.05;
    u.onend = () => setOn(false);
    window.speechSynthesis.speak(u);
    setOn(true);
  };
  return (
    <button onClick={speak} title="Voice greeting" className="flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white hover:bg-white/25">
      {on ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />} {on ? "Stop" : "Greet"}
    </button>
  );
}

// ---------- Language Selector (Google Translate) ----------
const LANGS = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "sw", label: "Kiswahili", flag: "🇰🇪" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "es", label: "Español", flag: "🇪🇸" },
  { code: "de", label: "Deutsch", flag: "🇩🇪" },
  { code: "it", label: "Italiano", flag: "🇮🇹" },
  { code: "zh-CN", label: "中文", flag: "🇨🇳" },
  { code: "ar", label: "العربية", flag: "🇸🇦" },
  { code: "ja", label: "日本語", flag: "🇯🇵" },
  { code: "pt", label: "Português", flag: "🇵🇹" },
  { code: "ru", label: "Русский", flag: "🇷🇺" },
  { code: "hi", label: "हिन्दी", flag: "🇮🇳" },
];

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: any;
  }
}

function LanguageSelector() {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState<{ code: string; label: string; flag: string }>(LANGS[0]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (document.getElementById("google-translate-script")) return;
    const container = document.createElement("div");
    container.id = "google_translate_element";
    container.style.display = "none";
    document.body.appendChild(container);

    window.googleTranslateElementInit = () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      new (window as any).google.translate.TranslateElement(
        { pageLanguage: "en", includedLanguages: LANGS.map((l) => l.code).join(","), autoDisplay: false },
        "google_translate_element"
      );
    };
    const s = document.createElement("script");
    s.id = "google-translate-script";
    s.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    s.async = true;
    document.body.appendChild(s);
  }, []);

  const pick = (l: typeof LANGS[number]) => {
    setCurrent(l);
    setOpen(false);
    // Trigger via cookie + reload for reliability
    const setCookie = (v: string) => {
      const host = window.location.hostname;
      document.cookie = `googtrans=${v};path=/`;
      document.cookie = `googtrans=${v};path=/;domain=${host}`;
      document.cookie = `googtrans=${v};path=/;domain=.${host}`;
    };
    if (l.code === "en") {
      setCookie("/en/en");
    } else {
      setCookie(`/en/${l.code}`);
    }
    window.location.reload();
  };

  useEffect(() => {
    // Read current cookie
    if (typeof document === "undefined") return;
    const m = document.cookie.match(/googtrans=\/[a-z-]+\/([a-zA-Z-]+)/);
    if (m) {
      const found = LANGS.find((l) => l.code === m[1]);
      if (found) setCurrent(found);
    }
  }, []);

  return (
    <div className="relative">
      <button onClick={() => setOpen((o) => !o)} className="flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white hover:bg-white/25">
        <Languages className="h-4 w-4" />
        <span>{current.flag} {current.label}</span>
      </button>
      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 max-h-72 w-52 overflow-auto rounded-2xl border bg-card p-2 shadow-glow">
          {LANGS.map((l) => (
            <button key={l.code} onClick={() => pick(l)} className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm hover:bg-secondary ${current.code === l.code ? "bg-secondary font-semibold" : ""}`}>
              <span className="text-lg">{l.flag}</span> {l.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function UtilityBar() {
  return (
    <>
      {/* Hide Google Translate top banner + tooltip */}
      <style>{`
        .goog-te-banner-frame.skiptranslate, .goog-tooltip, .goog-tooltip:hover { display: none !important; }
        body { top: 0 !important; }
        .goog-te-gadget { font-size: 0 !important; }
      `}</style>
      <div className="fixed top-0 inset-x-0 z-40 bg-gradient-to-r from-primary via-leaf to-primary text-white shadow-md">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-4 py-1.5">
          <div className="flex items-center gap-2">
            <WeatherWidget />
            <span className="hidden sm:inline text-xs opacity-80">🌿 Karibu Tumaini Gardens</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <VoiceGreeting />
            <GoogleSearch />
            <CurrencyWidget />
            <LanguageSelector />
          </div>
        </div>
      </div>
    </>
  );
}
