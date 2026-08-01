import { motion, AnimatePresence } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Home, Search, Leaf, Phone } from "lucide-react";
import { useEffect, useState } from "react";

const NAV = [
  { href: "/#home", label: "Home" },
  { href: "/#about", label: "About" },
  { href: "/#stay", label: "Stay" },
  { href: "/#catering", label: "Dining" },
  { href: "/#events", label: "Events" },
  { href: "/organic-farming", label: "Organic Farm", internal: true, icon: Leaf },
  { href: "/#gallery", label: "Gallery" },
  { href: "/#faq", label: "FAQ" },
  { href: "/#contact", label: "Contact" },
];

const LOGO =
  "https://tumainigardensresortisinya.lovable.app/__l5e/assets-v1/661a7015-8b99-493f-af5d-6a372bc792c2/tumaini-logo.png";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [q, setQ] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

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
    window.open(
      `https://www.google.com/search?q=${encodeURIComponent(`${q} Tumaini Gardens Resort Isinya`)}`,
      "_blank",
      "noopener",
    );
    setSearchOpen(false);
    setQ("");
  };

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className={`fixed inset-x-0 top-9 z-30 transition-all duration-300 ${
        scrolled
          ? "bg-background/95 backdrop-blur-md border-b border-border/60 shadow-soft"
          : "bg-background/70 backdrop-blur-sm border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-3 py-2 sm:px-5 sm:py-3">
        {/* Left: history + logo */}
        <div className="flex min-w-0 items-center gap-1 sm:gap-3">
          <div className="hidden sm:flex items-center gap-0.5">
            <button onClick={goBack} aria-label="Go back" className="grid h-11 w-11 place-items-center rounded-full text-foreground/70 hover:bg-primary/10 hover:text-primary active:scale-95 transition">
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button onClick={goForward} aria-label="Go forward" className="grid h-11 w-11 place-items-center rounded-full text-foreground/70 hover:bg-primary/10 hover:text-primary active:scale-95 transition">
              <ArrowRight className="h-4 w-4" />
            </button>
            <button onClick={goHome} aria-label="Home" className="grid h-11 w-11 place-items-center rounded-full text-foreground/70 hover:bg-primary/10 hover:text-primary active:scale-95 transition">
              <Home className="h-4 w-4" />
            </button>
          </div>
          <Link to="/" className="flex min-w-0 items-center gap-2">
            <img src={LOGO} alt="Tumaini Gardens Resort logo" className="h-10 w-10 shrink-0 rounded-full bg-black object-contain p-1 ring-2 ring-primary/30" />
            <div className="min-w-0 leading-tight">
              <p className="truncate font-display text-base sm:text-lg font-bold text-foreground">Tumaini Gardens</p>
              <p className="hidden sm:block text-[10px] uppercase tracking-widest text-primary font-semibold">Isinya · Kajiado</p>
            </div>
          </Link>
        </div>

        {/* Center: desktop nav */}
        <nav className="hidden lg:flex items-center gap-4 text-sm" aria-label="Primary">
          {NAV.map((n) =>
            n.internal ? (
              <Link key={n.href} to={n.href} className="flex items-center gap-1 text-foreground/85 hover:text-primary transition-colors font-medium">
                {n.icon ? <n.icon className="h-4 w-4" /> : null}
                {n.label}
              </Link>
            ) : (
              <a key={n.href} href={n.href} className="text-foreground/85 hover:text-primary transition-colors font-medium">{n.label}</a>
            ),
          )}
        </nav>

        {/* Right: search + book + hamburger */}
        <div className="flex items-center gap-1 sm:gap-2">
          <button onClick={() => setSearchOpen((s) => !s)} aria-label="Search the site" aria-expanded={searchOpen} className="grid h-11 w-11 place-items-center rounded-full text-foreground/70 hover:bg-primary/10 hover:text-primary transition">
            <Search className="h-5 w-5" />
          </button>
          <a href="https://wa.me/254759473510" target="_blank" rel="noreferrer"
             className="inline-flex min-h-11 items-center rounded-full bg-gradient-warm px-3 sm:px-4 text-xs sm:text-sm text-accent-foreground font-semibold shadow-soft hover:opacity-90 whitespace-nowrap">
            Book
          </a>

          <button
            className="lg:hidden grid h-11 w-11 place-items-center rounded-full hover:bg-primary/10"
            onClick={() => setOpen(!open)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            <span className="relative block h-4 w-6" aria-hidden="true">
              <motion.span animate={open ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }} transition={{ duration: 0.25 }} className="absolute left-0 top-0 h-0.5 w-6 rounded bg-foreground" />
              <motion.span animate={open ? { opacity: 0, x: 8 } : { opacity: 1, x: 0 }} transition={{ duration: 0.2 }} className="absolute left-0 top-[7px] h-0.5 w-6 rounded bg-foreground" />
              <motion.span animate={open ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }} transition={{ duration: 0.25 }} className="absolute left-0 top-[14px] h-0.5 w-6 rounded bg-foreground" />
            </span>
          </button>
        </div>
      </div>

      {searchOpen && (
        <form onSubmit={runSearch} className="border-t bg-background/98 backdrop-blur px-4 py-3">
          <div className="mx-auto flex max-w-4xl items-center gap-2">
            <Search className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
            <label htmlFor="site-search" className="sr-only">Search Tumaini Gardens</label>
            <input id="site-search" autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search Tumaini Gardens…" className="min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground" />
            <button type="submit" className="shrink-0 rounded-full bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground">Search</button>
          </div>
        </form>
      )}

      {/* Mobile slide-in drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.button
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="lg:hidden fixed inset-0 top-0 z-40 bg-black/50 backdrop-blur-sm"
            />
            <motion.nav
              key="drawer"
              aria-label="Mobile"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              className="lg:hidden fixed right-0 top-0 z-50 h-dvh w-[80%] max-w-xs overflow-y-auto bg-background p-5 pt-6 shadow-glow"
            >
              <div className="flex items-center gap-2">
                <img src={LOGO} alt="" className="h-10 w-10 rounded-full bg-black object-contain p-1" />
                <p className="font-display text-lg font-bold">Tumaini Gardens</p>
              </div>
              <div className="mt-5 flex flex-col gap-1">
                {NAV.map((n) =>
                  n.internal ? (
                    <Link key={n.href} to={n.href} onClick={() => setOpen(false)} className="flex min-h-12 items-center gap-2 rounded-xl px-4 text-foreground/90 hover:bg-primary/10 hover:text-primary text-base font-medium">
                      {n.icon ? <n.icon className="h-4 w-4" /> : null}
                      {n.label}
                    </Link>
                  ) : (
                    <a key={n.href} href={n.href} onClick={() => setOpen(false)} className="flex min-h-12 items-center rounded-xl px-4 text-foreground/90 hover:bg-primary/10 hover:text-primary text-base font-medium">{n.label}</a>
                  ),
                )}
              </div>
              <a href="tel:+254759473510" className="mt-4 flex min-h-12 items-center justify-center gap-2 rounded-full border-2 border-primary/40 font-semibold text-primary">
                <Phone className="h-4 w-4" /> Call reservations
              </a>
              <a href="https://wa.me/254759473510" target="_blank" rel="noreferrer"
                 className="mt-2 flex min-h-12 items-center justify-center rounded-full bg-gradient-warm text-accent-foreground font-semibold">
                Book on WhatsApp
              </a>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
