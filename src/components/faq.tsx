import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle, BedDouble, Utensils, Users, MapPin, CreditCard, Baby } from "lucide-react";

const CATEGORIES = [
  {
    key: "booking",
    label: "Booking & Rates",
    icon: CreditCard,
    faqs: [
      { q: "What are your accommodation rates?", a: "Single: B&B KES 7,500 · Half-board 9,500 · Full-board 11,500. Double: B&B 9,500 · HB 13,000 · FB 16,500. Triple: B&B 11,500 · HB 16,750 · FB 22,000. Special couple & group rates on request." },
      { q: "How do I book a room or event?", a: "Call/WhatsApp +254 759 473 510 or +254 724 715 430, or email warugimccreadie@tumainigardens.com / rose.njoroge@tumainigardens.com." },
      { q: "Do you accept M-Pesa & cards?", a: "Yes — M-Pesa, Visa, Mastercard and bank transfer are all accepted." },
    ],
  },
  {
    key: "stay",
    label: "Rooms & Cottages",
    icon: BedDouble,
    faqs: [
      { q: "How many rooms do you have?", a: "Tumaini Gardens has 64 premium and standard rooms plus a 3-bedroom cottage, all with high-end finishing, en-suite bathrooms and free Wi-Fi." },
      { q: "Do premium rooms have a fireplace?", a: "Yes — our premium rooms feature a fireplace for a cosy Kajiado-evening ambience." },
      { q: "What are check-in / check-out times?", a: "Check-in from 12:00 noon and check-out by 10:00 am. Flexible on request." },
    ],
  },
  {
    key: "dining",
    label: "Dining & Catering",
    icon: Utensils,
    faqs: [
      { q: "Do you offer full-board?", a: "Yes — Bed & Breakfast, Half-board and Full-board packages are available for singles, doubles and triples." },
      { q: "Can you cater off-site events?", a: "Yes, our outside-catering team serves weddings, corporate launches, churches and schools across Kajiado & Nairobi." },
      { q: "Do you cater for special diets?", a: "Vegetarian, vegan, halal and kids' menus are all available — just let us know in advance." },
    ],
  },
  {
    key: "conf",
    label: "Conferences & Team Building",
    icon: Users,
    faqs: [
      { q: "How much is a conference?", a: "Full-day conference KES 4,000 pp · Half-day KES 3,500 pp — includes tea breaks, buffet lunch, projector, flip charts, PA & Wi-Fi." },
      { q: "How much is team building?", a: "Full-day team building KES 4,000 pp · Half-day KES 3,500 pp. Games, facilitation and grounds included." },
      { q: "What's your max capacity?", a: "Halls seat up to 200 pax; outdoor grounds host 500+ for weddings and celebrations." },
    ],
  },
  {
    key: "kids",
    label: "Children & Families",
    icon: Baby,
    faqs: [
      { q: "Are children welcome?", a: "Absolutely — we have a playground, pool, family cottages and a dedicated kids' menu." },
      { q: "Are there children's rates?", a: "Yes, please request our separate children's brochure when booking." },
    ],
  },
  {
    key: "location",
    label: "Location & Directions",
    icon: MapPin,
    faqs: [
      { q: "Where exactly are you?", a: "Isinya, Kajiado County — 60 km from Nairobi along the Nairobi-Namanga Highway. Drive past Kitengela to Isinya town, continue towards Kajiado for 6 km; our signboard is on the left, 2 km off the tarmac." },
      { q: "Is parking secure?", a: "Yes — ample free, secure parking for cars, buses and corporate groups, with 24/7 security." },
      { q: "Do you have Wi-Fi?", a: "Complimentary high-speed Wi-Fi throughout the property, including cottages and conference halls." },
    ],
  },
];

export function Faq() {
  const [active, setActive] = useState<string>(CATEGORIES[0].key);
  const [open, setOpen] = useState<string | null>(null);
  const cat = CATEGORIES.find((c) => c.key === active)!;

  return (
    <section id="faq" className="relative bg-gradient-to-b from-background via-secondary/30 to-background py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">
            <HelpCircle className="h-4 w-4" /> Guest FAQ
          </span>
          <h2 className="mt-4 font-display text-3xl sm:text-4xl md:text-5xl">Everything you need to know</h2>
          <p className="mt-3 text-base sm:text-lg text-foreground/80">Tap a category to see quick answers, or WhatsApp us for anything else.</p>
        </motion.div>

        <div className="mt-10 flex flex-wrap justify-center gap-2 sm:gap-3">
          {CATEGORIES.map((c) => {
            const Icon = c.icon;
            const isOn = active === c.key;
            return (
              <button
                key={c.key}
                onClick={() => { setActive(c.key); setOpen(null); }}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${isOn ? "bg-primary text-primary-foreground shadow-glow" : "bg-card border border-border text-foreground/80 hover:bg-primary/10"}`}
              >
                <Icon className="h-4 w-4" />
                <span>{c.label}</span>
              </button>
            );
          })}
        </div>

        <div className="mx-auto mt-8 max-w-3xl space-y-3">
          {cat.faqs.map((f) => {
            const id = `${cat.key}-${f.q}`;
            const isOpen = open === id;
            return (
              <div key={id} className="overflow-hidden rounded-2xl border bg-card shadow-soft">
                <button
                  onClick={() => setOpen(isOpen ? null : id)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                >
                  <span className="font-display text-base sm:text-lg font-semibold text-foreground">{f.q}</span>
                  <ChevronDown className={`h-5 w-5 shrink-0 text-primary transition-transform ${isOpen ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="border-t"
                    >
                      <p className="px-5 py-4 text-sm sm:text-base text-foreground/85 leading-relaxed">{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
