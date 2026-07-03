import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { Menu, X, ArrowLeft, ArrowRight, Home, Search } from "lucide-react";
import { useState } from "react";

const NAV = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#stay", label: "Stay" },
  { href: "#catering", label: "Dining" },
  { href: "#events", label: "Events" },
  { href: "#gallery", label: "Gallery" },
  { href: "#faq", label: "FAQ" },
  { href: "#contact", label: "Contact" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [q, setQ] = useState("");

  const goBack = () => typeof window !== "undefined" && window.history.back();
  const goForward = () => typeof window !== "undefined" && window.history.forward();
  const goHome = () => {
    if (typeof window === "undefined") return;
    if (window.location.pathname !== "/") window.location.href = "/";
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const runSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!q.trim()) return;
    window.open(`https://www.google.com/search?q=${encodeURIComponent(q + " site:tumainigardens.co.ke OR Tumaini Gardens Isinya")}`, "_blank");
    setSearchOpen(false);
    setQ("");
  };

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="fixed inset-x-0 top-9 z-30 backdrop-blur-md bg-background/85 border-b border-border/60 shadow-sm"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-3 py-2 sm:px-5 sm:py-3">
        {/* Left: history + logo */}
        <div className="flex min-w-0 items-center gap-1 sm:gap-3">
          <div className="flex items-center gap-0.5">
            <button onClick={goBack} aria-label="Go back" className="grid h-9 w-9 place-items-center rounded-full text-foreground/70 hover:bg-primary/10 hover:text-primary active:scale-95 transition">
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button onClick={goForward} aria-label="Go forward" className="hidden sm:grid h-9 w-9 place-items-center rounded-full text-foreground/70 hover:bg-primary/10 hover:text-primary active:scale-95 transition">
              <ArrowRight className="h-4 w-4" />
            </button>
            <button onClick={goHome} aria-label="Home" className="grid h-9 w-9 place-items-center rounded-full text-foreground/70 hover:bg-primary/10 hover:text-primary active:scale-95 transition">
              <Home className="h-4 w-4" />
            </button>
          </div>
          <Link to="/" className="flex min-w-0 items-center gap-2">
            <img src="/__l5e/assets-v1/661a7015-8b99-493f-af5d-6a372bc792c2/tumaini-logo.png" alt="Tumaini Gardens logo" className="h-10 w-10 shrink-0 rounded-full bg-black object-contain p-1 ring-2 ring-primary/30" />
            <div className="min-w-0 leading-tight">
              <p className="truncate font-display text-base sm:text-lg font-bold text-foreground">Tumaini Gardens</p>
              <p className="hidden sm:block text-[10px] uppercase tracking-widest text-primary font-semibold">Isinya · Kajiado</p>
            </div>
          </Link>
        </div>

        {/* Center: desktop nav */}
        <nav className="hidden lg:flex items-center gap-5 text-sm">
          {NAV.map((n) => (
            <a key={n.href} href={n.href} className="text-foreground/80 hover:text-primary transition-colors">{n.label}</a>
          ))}
        </nav>

        {/* Right: search + book + hamburger */}
        <div className="flex items-center gap-1 sm:gap-2">
          <button onClick={() => setSearchOpen((s) => !s)} aria-label="Search" className="grid h-9 w-9 place-items-center rounded-full text-foreground/70 hover:bg-primary/10 hover:text-primary transition">
            <Search className="h-4 w-4" />
          </button>
          <a href="https://wa.me/254759473510" target="_blank" rel="noreferrer"
             className="hidden sm:inline-flex rounded-full bg-gradient-warm px-4 py-2 text-sm text-accent-foreground font-semibold shadow-soft hover:opacity-90">
            Book Now
          </a>
          <button className="lg:hidden grid h-9 w-9 place-items-center rounded-full hover:bg-primary/10" onClick={() => setOpen(!open)} aria-label="Menu" aria-expanded={open}>
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {searchOpen && (
        <form onSubmit={runSearch} className="border-t bg-background/95 backdrop-blur px-4 py-3">
          <div className="mx-auto flex max-w-4xl items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search Tumaini Gardens…" className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground" />
            <button type="submit" className="rounded-full bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground">Search</button>
          </div>
        </form>
      )}

      {open && (
        <div className="lg:hidden border-t bg-background/95 backdrop-blur">
          <div className="flex flex-col p-4 gap-1 max-h-[70vh] overflow-y-auto">
            {NAV.map((n) => (
              <a key={n.href} href={n.href} onClick={() => setOpen(false)} className="rounded-xl px-4 py-3 text-foreground/85 hover:bg-primary/10 hover:text-primary text-base font-medium">{n.label}</a>
            ))}
            <a href="https://wa.me/254759473510" target="_blank" rel="noreferrer"
               className="mt-2 rounded-full bg-gradient-warm px-5 py-3 text-center text-accent-foreground font-semibold">Book on WhatsApp</a>
          </div>
        </div>
      )}
    </motion.header>
  );
}
