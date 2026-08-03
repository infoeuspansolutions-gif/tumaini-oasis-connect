import { useEffect, useState } from "react";
import { Cloud, Sun, CloudRain, CloudSnow, Search, Volume2, VolumeX, Languages, ArrowRightLeft, Droplets, Wind } from "lucide-react";
import { useIsinyaWeather } from "@/components/weather-panel";

// ---------- Weather (Open-Meteo, no key) ----------
function WeatherIcon({ code }: { code: number }) {
  if (code === 0 || code === 1) return <Sun className="h-4 w-4" />;
  if (code >= 71 && code <= 77) return <CloudSnow className="h-4 w-4" />;
  if (code >= 51 && code <= 82) return <CloudRain className="h-4 w-4" />;
  return <Cloud className="h-4 w-4" />;
}
function WeatherWidget() {
  const { data, label } = useIsinyaWeather();
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label="Live Isinya weather"
        className="flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-white hover:bg-white/25"
      >
        {data ? <WeatherIcon code={data.current.code} /> : <Cloud className="h-4 w-4 animate-pulse" />}
        <span className="text-xs font-semibold">Isinya {data ? `${data.current.temp}°C` : "…"}</span>
      </button>
      {open && (
        <div className="absolute left-0 top-full z-50 mt-2 w-64 rounded-2xl border bg-card p-3 text-foreground shadow-glow">
          <p className="text-xs font-bold uppercase tracking-wider text-primary">Live weather · Isinya</p>
          {data ? (
            <>
              <p className="mt-1 text-2xl font-bold tabular-nums">{data.current.temp}°C</p>
              <p className="text-xs font-semibold text-muted-foreground">{label(data.current.code)} · feels {data.current.feels}°C</p>
              <div className="mt-2 flex items-center gap-3 text-xs font-semibold">
                <span className="inline-flex items-center gap-1"><Droplets className="h-3.5 w-3.5 text-accent" />{data.current.humidity}%</span>
                <span className="inline-flex items-center gap-1"><Wind className="h-3.5 w-3.5 text-accent" />{data.current.wind} km/h</span>
              </div>
              <div className="mt-3 grid grid-cols-4 gap-1">
                {data.days.slice(0, 4).map((d, i) => (
                  <div key={d.date} className="rounded-lg bg-secondary/60 p-1.5 text-center">
                    <p className="text-[10px] font-bold">{i === 0 ? "Today" : new Date(d.date).toLocaleDateString("en-GB", { weekday: "short" })}</p>
                    <p className="text-[11px] font-bold tabular-nums">{d.max}°</p>
                  </div>
                ))}
              </div>
              <a href="#weather" onClick={() => setOpen(false)} className="mt-3 block rounded-lg bg-primary py-1.5 text-center text-xs font-bold text-primary-foreground">
                Full forecast
              </a>
            </>
          ) : (
            <p className="mt-2 text-xs font-semibold text-muted-foreground">Fetching live conditions…</p>
          )}
        </div>
      )}
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
  { code: "pt", label: "Português", flag: "🇵🇹" },
  { code: "nl", label: "Nederlands", flag: "🇳🇱" },
  { code: "ru", label: "Русский", flag: "🇷🇺" },
  { code: "uk", label: "Українська", flag: "🇺🇦" },
  { code: "pl", label: "Polski", flag: "🇵🇱" },
  { code: "tr", label: "Türkçe", flag: "🇹🇷" },
  { code: "ar", label: "العربية", flag: "🇸🇦" },
  { code: "he", label: "עברית", flag: "🇮🇱" },
  { code: "fa", label: "فارسی", flag: "🇮🇷" },
  { code: "ur", label: "اردو", flag: "🇵🇰" },
  { code: "hi", label: "हिन्दी", flag: "🇮🇳" },
  { code: "bn", label: "বাংলা", flag: "🇧🇩" },
  { code: "ta", label: "தமிழ்", flag: "🇮🇳" },
  { code: "te", label: "తెలుగు", flag: "🇮🇳" },
  { code: "ml", label: "മലയാളം", flag: "🇮🇳" },
  { code: "mr", label: "मराठी", flag: "🇮🇳" },
  { code: "pa", label: "ਪੰਜਾਬੀ", flag: "🇮🇳" },
  { code: "zh-CN", label: "中文 (简体)", flag: "🇨🇳" },
  { code: "zh-TW", label: "中文 (繁體)", flag: "🇹🇼" },
  { code: "ja", label: "日本語", flag: "🇯🇵" },
  { code: "ko", label: "한국어", flag: "🇰🇷" },
  { code: "th", label: "ไทย", flag: "🇹🇭" },
  { code: "vi", label: "Tiếng Việt", flag: "🇻🇳" },
  { code: "id", label: "Bahasa Indonesia", flag: "🇮🇩" },
  { code: "ms", label: "Bahasa Melayu", flag: "🇲🇾" },
  { code: "fil", label: "Filipino", flag: "🇵🇭" },
  { code: "am", label: "አማርኛ", flag: "🇪🇹" },
  { code: "so", label: "Soomaali", flag: "🇸🇴" },
  { code: "yo", label: "Yorùbá", flag: "🇳🇬" },
  { code: "ig", label: "Igbo", flag: "🇳🇬" },
  { code: "ha", label: "Hausa", flag: "🇳🇬" },
  { code: "zu", label: "isiZulu", flag: "🇿🇦" },
  { code: "xh", label: "isiXhosa", flag: "🇿🇦" },
  { code: "st", label: "Sesotho", flag: "🇱🇸" },
  { code: "sn", label: "chiShona", flag: "🇿🇼" },
  { code: "ny", label: "Chichewa", flag: "🇲🇼" },
  { code: "rw", label: "Kinyarwanda", flag: "🇷🇼" },
  { code: "lg", label: "Luganda", flag: "🇺🇬" },
  { code: "mg", label: "Malagasy", flag: "🇲🇬" },
  { code: "af", label: "Afrikaans", flag: "🇿🇦" },
  { code: "el", label: "Ελληνικά", flag: "🇬🇷" },
  { code: "cs", label: "Čeština", flag: "🇨🇿" },
  { code: "sk", label: "Slovenčina", flag: "🇸🇰" },
  { code: "ro", label: "Română", flag: "🇷🇴" },
  { code: "hu", label: "Magyar", flag: "🇭🇺" },
  { code: "bg", label: "Български", flag: "🇧🇬" },
  { code: "sr", label: "Српски", flag: "🇷🇸" },
  { code: "hr", label: "Hrvatski", flag: "🇭🇷" },
  { code: "sv", label: "Svenska", flag: "🇸🇪" },
  { code: "no", label: "Norsk", flag: "🇳🇴" },
  { code: "da", label: "Dansk", flag: "🇩🇰" },
  { code: "fi", label: "Suomi", flag: "🇫🇮" },
  { code: "is", label: "Íslenska", flag: "🇮🇸" },
  { code: "ga", label: "Gaeilge", flag: "🇮🇪" },
  { code: "cy", label: "Cymraeg", flag: "🏴󠁧󠁢󠁷󠁬󠁳󠁿" },
  { code: "ca", label: "Català", flag: "🇪🇸" },
  { code: "eu", label: "Euskara", flag: "🇪🇸" },
  { code: "gl", label: "Galego", flag: "🇪🇸" },
  { code: "lv", label: "Latviešu", flag: "🇱🇻" },
  { code: "lt", label: "Lietuvių", flag: "🇱🇹" },
  { code: "et", label: "Eesti", flag: "🇪🇪" },
  { code: "sq", label: "Shqip", flag: "🇦🇱" },
  { code: "mk", label: "Македонски", flag: "🇲🇰" },
  { code: "sl", label: "Slovenščina", flag: "🇸🇮" },
  { code: "bs", label: "Bosanski", flag: "🇧🇦" },
  { code: "az", label: "Azərbaycan", flag: "🇦🇿" },
  { code: "hy", label: "Հայերեն", flag: "🇦🇲" },
  { code: "ka", label: "ქართული", flag: "🇬🇪" },
  { code: "kk", label: "Қазақша", flag: "🇰🇿" },
  { code: "uz", label: "Oʻzbekcha", flag: "🇺🇿" },
  { code: "mn", label: "Монгол", flag: "🇲🇳" },
  { code: "my", label: "မြန်မာ", flag: "🇲🇲" },
  { code: "km", label: "ខ្មែរ", flag: "🇰🇭" },
  { code: "lo", label: "ລາວ", flag: "🇱🇦" },
  { code: "si", label: "සිංහල", flag: "🇱🇰" },
  { code: "ne", label: "नेपाली", flag: "🇳🇵" },
  { code: "ps", label: "پښتو", flag: "🇦🇫" },
  { code: "eo", label: "Esperanto", flag: "🌍" },
  { code: "la", label: "Latina", flag: "🏛️" },
  { code: "haw", label: "ʻŌlelo Hawaiʻi", flag: "🌺" },
  { code: "mi", label: "Māori", flag: "🇳🇿" },
  { code: "sm", label: "Gagana Sāmoa", flag: "🇼🇸" },
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
  const [ready, setReady] = useState(false);

  // Load Google Translate widget once
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (document.getElementById("google_translate_element")) {
      setReady(true);
      return;
    }
    const container = document.createElement("div");
    container.id = "google_translate_element";
    container.style.cssText = "position:fixed;left:-9999px;top:-9999px;opacity:0;pointer-events:none;";
    document.body.appendChild(container);

    window.googleTranslateElementInit = () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      new (window as any).google.translate.TranslateElement(
        {
          pageLanguage: "en",
          includedLanguages: LANGS.map((l) => l.code).join(","),
          autoDisplay: false,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          layout: (window as any).google.translate.TranslateElement.InlineLayout.SIMPLE,
        },
        "google_translate_element",
      );
      // Poll for the select element to appear
      const check = setInterval(() => {
        if (document.querySelector<HTMLSelectElement>("select.goog-te-combo")) {
          setReady(true);
          clearInterval(check);
        }
      }, 200);
      setTimeout(() => clearInterval(check), 10000);
    };

    if (!document.getElementById("google-translate-script")) {
      const s = document.createElement("script");
      s.id = "google-translate-script";
      s.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      s.async = true;
      document.body.appendChild(s);
    }

    // Restore preferred language
    try {
      const saved = localStorage.getItem("preferredLang");
      if (saved) {
        const found = LANGS.find((l) => l.code === saved);
        if (found) setCurrent(found);
      }
    } catch { /* ignore */ }
  }, []);

  const pick = (l: typeof LANGS[number]) => {
    setCurrent(l);
    setOpen(false);
    if (typeof window === "undefined") return;
    try { localStorage.setItem("preferredLang", l.code); } catch { /* ignore */ }

    const trigger = () => {
      const sel = document.querySelector<HTMLSelectElement>("select.goog-te-combo");
      if (!sel) return false;
      sel.value = l.code === "en" ? "" : l.code;
      sel.dispatchEvent(new Event("change", { bubbles: true }));
      return true;
    };

    // If widget ready, translate live (no reload). Otherwise fall back to cookie + reload.
    if (trigger()) return;

    // Fallback: cookie + hash + reload
    const target = l.code === "en" ? "en" : l.code;
    const val = `/en/${target}`;
    const host = window.location.hostname;
    document.cookie = `googtrans=${val};path=/;max-age=31536000`;
    document.cookie = `googtrans=${val};path=/;domain=${host};max-age=31536000`;
    document.cookie = `googtrans=${val};path=/;domain=.${host};max-age=31536000`;
    window.location.hash = `#googtrans(en|${target})`;
    setTimeout(() => window.location.reload(), 100);
  };


  const [query, setQuery] = useState("");
  const filtered = LANGS.filter((l) => l.label.toLowerCase().includes(query.toLowerCase()) || l.code.includes(query.toLowerCase()));

  return (
    <div className="relative">
      <button onClick={() => setOpen((o) => !o)} className="flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white hover:bg-white/25" title={ready ? "Change language" : "Loading translator…"}>
        <Languages className="h-4 w-4" />
        <span>{current.flag} {current.label}</span>
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-64 rounded-2xl border bg-card p-2 shadow-glow">
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search ${LANGS.length} languages…`}
            className="mb-2 w-full rounded-lg border bg-background px-3 py-1.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/40"
          />
          <div className="max-h-72 overflow-auto">
            {filtered.map((l) => (
              <button key={l.code} onClick={() => pick(l)} className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm hover:bg-secondary ${current.code === l.code ? "bg-secondary font-semibold" : ""}`}>
                <span className="text-lg">{l.flag}</span> {l.label} <span className="ml-auto text-[10px] opacity-50">{l.code}</span>
              </button>
            ))}
            {filtered.length === 0 && <p className="p-3 text-center text-xs text-muted-foreground">No match</p>}
          </div>
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
      <div className="fixed top-0 inset-x-0 z-20 h-9 bg-gradient-to-r from-primary via-leaf to-primary text-white shadow-md">
        <div className="mx-auto flex h-9 max-w-7xl items-center gap-2 overflow-x-auto overflow-y-hidden whitespace-nowrap px-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex shrink-0 items-center gap-2">
            <WeatherWidget />
            <span className="hidden sm:inline text-xs opacity-80">🌿 Karibu Tumaini Gardens</span>
          </div>
          <div className="ml-auto flex shrink-0 items-center gap-2">
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
