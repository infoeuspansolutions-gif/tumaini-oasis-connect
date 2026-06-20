import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import robotImg from "@/assets/tumaini-robot.png";

const GREETINGS = [
  "Karibu Tumaini Gardens! 🌿 I'm Tumi, your virtual host.",
  "Hungry? Ask me about our nyama choma & wedding menus! 🍖",
  "Planning a conference? We host up to 200 guests. 💼",
  "Need a quick getaway? Our cottages await. 🏡",
  "Tap me anytime — or chat on WhatsApp +254 759 473 510 📞",
];

export function WelcomeRobot() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 1800);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!visible) return;
    const i = setInterval(() => setIdx((n) => (n + 1) % GREETINGS.length), 5000);
    return () => clearInterval(i);
  }, [visible]);

  if (dismissed) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.6 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 60, scale: 0.6 }}
          transition={{ type: "spring", damping: 14, stiffness: 180 }}
          className="pointer-events-none fixed bottom-24 left-1/2 z-30 flex w-[min(92vw,28rem)] -translate-x-1/2 items-end gap-3 md:bottom-6 md:left-24 md:translate-x-0"
        >
          {/* Robot */}
          <motion.div
            animate={{ y: [0, -10, 0], rotate: [-2, 2, -2] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
            className="pointer-events-auto relative shrink-0"
            style={{ filter: "drop-shadow(0 18px 22px rgba(0,0,0,0.28))" }}
          >
            <motion.div
              animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.9, 0.5] }}
              transition={{ duration: 2.4, repeat: Infinity }}
              className="absolute -inset-2 -z-10 rounded-full bg-gradient-leaf blur-2xl"
            />
            <img
              src={robotImg}
              alt="Tumi — Tumaini virtual host"
              width={1024}
              height={1024}
              loading="lazy"
              className="h-28 w-28 select-none object-contain md:h-36 md:w-36"
              draggable={false}
            />
          </motion.div>

          {/* Speech bubble */}
          <div className="pointer-events-auto relative mb-3 flex-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.96 }}
                transition={{ duration: 0.35 }}
                className="relative rounded-2xl rounded-bl-sm border-2 border-primary/30 bg-card px-4 py-3 text-sm font-medium text-foreground shadow-glow md:text-base"
              >
                <button
                  onClick={() => setDismissed(true)}
                  aria-label="Dismiss"
                  className="absolute -right-2 -top-2 grid h-6 w-6 place-items-center rounded-full bg-foreground text-background shadow-soft hover:scale-110 transition"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
                <p className="leading-snug">{GREETINGS[idx]}</p>
                <div className="absolute -bottom-2 left-3 h-4 w-4 rotate-45 border-b-2 border-l-2 border-primary/30 bg-card" />
              </motion.div>
            </AnimatePresence>
            <div className="mt-2 flex justify-center gap-1">
              {GREETINGS.map((_, i) => (
                <span key={i} className={`h-1.5 w-1.5 rounded-full transition ${i === idx ? "bg-primary w-4" : "bg-primary/30"}`} />
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
