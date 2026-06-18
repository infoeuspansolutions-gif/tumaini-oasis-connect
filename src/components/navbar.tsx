import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const NAV = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#stay", label: "Stay" },
  { href: "#events", label: "Events" },
  { href: "#gallery", label: "Gallery" },
  { href: "#contact", label: "Contact" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="fixed inset-x-0 top-0 z-30 backdrop-blur-md bg-background/70 border-b border-border/60"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3">
        <Link to="/" className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-leaf text-primary-foreground font-display text-lg">T</div>
          <div className="leading-tight">
            <p className="font-display text-lg">Tumaini Gardens</p>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Isinya · Kajiado</p>
          </div>
        </Link>
        <nav className="hidden md:flex items-center gap-7 text-sm">
          {NAV.map((n) => (
            <a key={n.href} href={n.href} className="text-foreground/80 hover:text-primary transition-colors">{n.label}</a>
          ))}
          <a href="https://wa.me/254759473510" target="_blank" rel="noreferrer"
             className="rounded-full bg-gradient-warm px-5 py-2 text-accent-foreground font-medium shadow-soft hover:opacity-90">
            Book Now
          </a>
        </nav>
        <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t bg-background/95 backdrop-blur">
          <div className="flex flex-col p-5 gap-4">
            {NAV.map((n) => (
              <a key={n.href} href={n.href} onClick={() => setOpen(false)} className="text-foreground/80">{n.label}</a>
            ))}
            <a href="https://wa.me/254759473510" target="_blank" rel="noreferrer"
               className="rounded-full bg-gradient-warm px-5 py-2 text-center text-accent-foreground font-medium">Book Now</a>
          </div>
        </div>
      )}
    </motion.header>
  );
}
