import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  MapPin, Phone, Users, Calendar, Wifi, Car, Utensils, Waves,
  Trees, Building2, Heart, Star, ChevronRight, Sparkles, Download, Play,
} from "lucide-react";
import { Navbar } from "@/components/navbar";
import { AiChatWidget, WhatsAppButton } from "@/components/floating-widgets";

const logo = { url: "/__l5e/assets-v1/661a7015-8b99-493f-af5d-6a372bc792c2/tumaini-logo.png" };
const img1 = { url: "/__l5e/assets-v1/69123ad3-dccf-473d-8d2b-3e22c66b245c/tumaini1.jpg" };
const img2 = { url: "/__l5e/assets-v1/c30c5df9-2f91-4d48-b171-228316c0156d/tumaini-2.jpg" };
const img3 = { url: "/__l5e/assets-v1/058c1814-74f6-4099-bdfd-1b3b51f1daaa/tumaini-3.jpg" };
const img4 = { url: "/__l5e/assets-v1/ed0bf124-d13d-41f9-8613-78b01b8b9b4e/tumaini-4.jpg" };
const img5 = { url: "/__l5e/assets-v1/f2c1729e-9e37-46db-a643-e142da5cdd33/tumaini-5.jpg" };
const img6 = { url: "/__l5e/assets-v1/fb01be86-51cc-4381-aae4-9d1e54644ff4/tumaini-6.jpg" };
const img7 = { url: "/__l5e/assets-v1/de1ad3c7-fce9-4f24-a96c-2b427f1cf6fb/tumaini-7.jpg" };
const img8 = { url: "/__l5e/assets-v1/6a1ce9bc-bfac-4eef-b159-8bf6b7ee12f0/tumaini-8.jpg" };
const img9 = { url: "/__l5e/assets-v1/f3fe79d8-ea9e-48fc-922d-59408b8bb2d1/tumaini-9.jpg" };
void img8;
// New uploads
const imgEntrance = { url: "/__l5e/assets-v1/" };


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Tumaini Gardens Isinya — Lodge, Pool & Event Gardens, Kajiado" },
      { name: "description", content: "Tumaini Gardens Isinya is a serene lodge & event venue along the Nairobi-Namanga Highway. Cottages, pool, conferences, weddings & team-building, just 67km from Nairobi." },
      { property: "og:title", content: "Tumaini Gardens Isinya — Serene Getaway & Event Venue" },
      { property: "og:description", content: "Cottages, pool, gardens & conference space along Nairobi-Namanga Highway. Book your getaway today." },
      { property: "og:type", content: "website" },
      { property: "og:image", content: img4.url },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: img4.url },
    ],
    links: [
      { rel: "canonical", href: "/" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" },
    ],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Lodging",
        name: "Tumaini Gardens Isinya",
        image: [img4.url, img2.url, img6.url],
        telephone: "+254759473510",
        address: { "@type": "PostalAddress", addressLocality: "Isinya", addressRegion: "Kajiado", addressCountry: "KE" },
        amenityFeature: ["Swimming Pool", "Restaurant", "Conference Hall", "Free Parking", "Wi-Fi", "Gardens"],
      }),
    }],
  }),
  component: Home,
});

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.7, ease: "easeOut" as const },
};

function Home() {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <Navbar />
      <Hero />
      <Stats />
      <About />
      <Stay />
      <Facilities />
      <Events />
      <Gallery />
      <Testimonials />
      <Contact />
      <Footer />
      <WhatsAppButton />
      <AiChatWidget />
    </div>
  );
}

function Hero() {
  return (
    <section id="home" className="relative min-h-[100svh] w-full overflow-hidden">
      <div className="absolute inset-0">
        <img src={img4.url} alt="Tumaini Gardens cottages with green roofs" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-hero" />
      </div>

      <div className="relative z-10 mx-auto flex max-w-7xl flex-col justify-center px-5 pt-32 pb-20 min-h-[100svh]">
        <motion.span
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="inline-flex w-fit items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-sm text-white backdrop-blur"
        >
          <Sparkles className="h-4 w-4" /> Just 67 km from Nairobi · Isinya, Kajiado
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.8 }}
          className="mt-6 max-w-3xl font-display text-5xl leading-[1.05] text-white md:text-7xl"
        >
          Where the gardens whisper <em className="italic text-[oklch(0.92_0.12_85)]">hope</em>.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.8 }}
          className="mt-6 max-w-xl text-lg text-white/90"
        >
          A serene nature-inspired lodge and event sanctuary along the Nairobi-Namanga Highway —
          cottages, a sparkling pool, lush event grounds and warm Kenyan hospitality.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65, duration: 0.8 }}
          className="mt-8 flex flex-wrap gap-4"
        >
          <a href="https://wa.me/254759473510?text=Hello%20Tumaini%20Gardens%2C%20I%27d%20like%20to%20book."
             target="_blank" rel="noreferrer"
             className="group inline-flex items-center gap-2 rounded-full bg-gradient-warm px-7 py-3.5 font-medium text-accent-foreground shadow-glow hover:opacity-95">
            Book your escape <ChevronRight className="h-4 w-4 transition group-hover:translate-x-1" />
          </a>
          <a href="#stay" className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/10 px-7 py-3.5 text-white backdrop-blur hover:bg-white/20">
            Explore the lodge
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
          className="absolute bottom-8 left-5 right-5 hidden md:flex max-w-7xl mx-auto items-center justify-between text-white/80 text-xs uppercase tracking-[0.3em]"
        >
          <span>Est. Kajiado</span>
          <span>Cottages · Pool · Events · Conferences</span>
          <span>+254 759 473 510</span>
        </motion.div>
      </div>
    </section>
  );
}

function Stats() {
  const items = [
    { n: "67km", l: "from Nairobi" },
    { n: "1.5hr", l: "scenic drive" },
    { n: "10+", l: "garden cottages" },
    { n: "500+", l: "event capacity" },
  ];
  return (
    <section className="border-y bg-card">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-y-8 px-5 py-10 md:grid-cols-4">
        {items.map((s, i) => (
          <motion.div key={s.l} {...fadeUp} transition={{ duration: 0.6, delay: i * 0.08 }} className="text-center">
            <p className="font-display text-4xl text-primary">{s.n}</p>
            <p className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">{s.l}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="mx-auto max-w-7xl px-5 py-24">
      <div className="grid items-center gap-12 md:grid-cols-2">
        <motion.div {...fadeUp} className="relative">
          <img src={img1.url} alt="Tumaini Gardens landscaping" className="rounded-3xl shadow-soft" />
          <img src={img3.url} alt="Tumaini Gardens sign" className="absolute -bottom-10 -right-4 hidden w-1/2 rounded-3xl border-8 border-background shadow-glow md:block" />
        </motion.div>
        <motion.div {...fadeUp}>
          <p className="text-sm uppercase tracking-[0.3em] text-accent">About Tumaini</p>
          <h2 className="mt-3 font-display text-4xl md:text-5xl">A garden of <span className="text-gradient-leaf">hope</span>, designed for memorable moments.</h2>
          <p className="mt-6 text-muted-foreground leading-relaxed">
            Nestled just off the Nairobi-Namanga Highway, immediately after Merishaw School in Isinya,
            Tumaini Gardens is a 1.5-hour escape from the city — yet a world away. Think manicured lawns,
            blossoming flower beds, a glistening pool framed by palms, and warm cottages built for rest.
          </p>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Whether you're planning an intimate getaway, a corporate retreat, a wedding under the trees,
            or a Sunday picnic with family — Tumaini is built to host life's celebrations.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {["Weddings", "Team Building", "Conferences", "Honeymoons", "Picnics", "Day Trips"].map((t) => (
              <span key={t} className="rounded-full border bg-secondary px-4 py-1.5 text-sm text-secondary-foreground">{t}</span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Stay() {
  const rooms = [
    { img: img4.url, name: "Garden Cottage", desc: "Standalone cottage with private verandah opening to the lawns.", price: "From KES 7,500 / night" },
    { img: img5.url, name: "Deluxe Suite", desc: "Spacious suite with king bed, en-suite bathroom and garden views.", price: "From KES 9,500 / night" },
    { img: img2.url, name: "Twin Cottage", desc: "Perfect for friends or family — two beds, shared verandah, peace.", price: "From KES 8,500 / night" },
  ];
  return (
    <section id="stay" className="bg-secondary/40 py-24">
      <div className="mx-auto max-w-7xl px-5">
        <motion.div {...fadeUp} className="max-w-2xl">
          <p className="text-sm uppercase tracking-[0.3em] text-accent">Where you'll stay</p>
          <h2 className="mt-3 font-display text-4xl md:text-5xl">Cottages built for slow mornings.</h2>
        </motion.div>
        <div className="mt-14 grid gap-7 md:grid-cols-3">
          {rooms.map((r, i) => (
            <motion.article key={r.name} {...fadeUp} transition={{ duration: 0.6, delay: i * 0.1 }}
              className="group overflow-hidden rounded-3xl bg-card shadow-soft transition hover:shadow-glow hover:-translate-y-1">
              <div className="aspect-[4/3] overflow-hidden">
                <img src={r.img} alt={r.name} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
              </div>
              <div className="p-6">
                <h3 className="font-display text-2xl">{r.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{r.desc}</p>
                <div className="mt-5 flex items-center justify-between">
                  <span className="text-sm font-medium text-primary">{r.price}</span>
                  <a href="https://wa.me/254759473510" target="_blank" rel="noreferrer"
                     className="inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline">
                    Reserve <ChevronRight className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Facilities() {
  const list = [
    { icon: Waves, t: "Swimming Pool", d: "Sparkling pool surrounded by palms — perfect to unwind after the highway drive." },
    { icon: Utensils, t: "Restaurant", d: "Local Kenyan & continental cuisine served on a sunlit verandah." },
    { icon: Building2, t: "Conference Halls", d: "Spacious halls for board meetings, trainings & full-day workshops." },
    { icon: Trees, t: "Manicured Gardens", d: "Acres of green lawns, flower beds & shaded picnic corners." },
    { icon: Car, t: "Free Parking", d: "Ample, secure parking for guests, buses & corporate groups." },
    { icon: Wifi, t: "Wi-Fi", d: "Stay connected throughout your stay — work, share, post." },
  ];
  return (
    <section className="mx-auto max-w-7xl px-5 py-24">
      <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto">
        <p className="text-sm uppercase tracking-[0.3em] text-accent">What you'll love</p>
        <h2 className="mt-3 font-display text-4xl md:text-5xl">Everything you need to relax & celebrate.</h2>
      </motion.div>
      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((f, i) => (
          <motion.div key={f.t} {...fadeUp} transition={{ duration: 0.5, delay: i * 0.07 }}
            className="group rounded-3xl border bg-card p-7 shadow-soft transition hover:bg-gradient-leaf hover:text-primary-foreground">
            <f.icon className="h-9 w-9 text-primary transition group-hover:text-primary-foreground" />
            <h3 className="mt-5 font-display text-xl">{f.t}</h3>
            <p className="mt-2 text-sm text-muted-foreground transition group-hover:text-primary-foreground/85">{f.d}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function Events() {
  return (
    <section id="events" className="relative overflow-hidden bg-primary text-primary-foreground py-24">
      <div className="absolute inset-0 opacity-30">
        <img src={img7.url} alt="" className="h-full w-full object-cover" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-transparent" />
      <div className="relative mx-auto grid max-w-7xl gap-12 px-5 md:grid-cols-2 md:items-center">
        <motion.div {...fadeUp}>
          <p className="text-sm uppercase tracking-[0.3em] text-[oklch(0.85_0.15_75)]">Host with us</p>
          <h2 className="mt-3 font-display text-4xl md:text-5xl">Weddings, retreats & celebrations under the open sky.</h2>
          <p className="mt-6 max-w-lg opacity-90">
            From garden weddings and birthdays to corporate team-building and conferences,
            our grounds transform to fit your dream. Tailored menus, décor support, and dedicated
            event coordination — done the Tumaini way.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-4 max-w-md">
            {[
              { i: Heart, l: "Weddings" }, { i: Users, l: "Team Building" },
              { i: Calendar, l: "Conferences" }, { i: Trees, l: "Picnics" },
            ].map((x) => (
              <div key={x.l} className="flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-3 backdrop-blur">
                <x.i className="h-5 w-5" /> <span>{x.l}</span>
              </div>
            ))}
          </div>
          <a href="https://wa.me/254759473510?text=Hi%20Tumaini%2C%20I%27d%20like%20to%20plan%20an%20event."
             target="_blank" rel="noreferrer"
             className="mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-warm px-7 py-3.5 font-medium text-accent-foreground shadow-glow">
            Plan your event <ChevronRight className="h-4 w-4" />
          </a>
        </motion.div>
        <motion.div {...fadeUp} className="relative">
          <img src={img7.url} alt="Event setup poolside" className="rounded-3xl shadow-glow" />
          <img src={img6.url} alt="Pool area" className="absolute -bottom-8 -left-8 hidden w-1/2 rounded-3xl border-8 border-primary shadow-glow md:block animate-float" />
        </motion.div>
      </div>
    </section>
  );
}

function Gallery() {
  const photos = [img4, img2, img6, img7, img5, img9, img1, img3];
  return (
    <section id="gallery" className="mx-auto max-w-7xl px-5 py-24">
      <motion.div {...fadeUp} className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-accent">Moments</p>
          <h2 className="mt-3 font-display text-4xl md:text-5xl">A peek into Tumaini.</h2>
        </div>
        <a href="https://www.tiktok.com/@tumainigardensresort" target="_blank" rel="noreferrer"
           className="text-sm font-medium text-primary hover:underline">Follow us on TikTok →</a>
      </motion.div>
      <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4 md:grid-rows-2 md:gap-4">
        {photos.map((p, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.05 }}
            className={`overflow-hidden rounded-2xl shadow-soft ${i === 0 ? "md:col-span-2 md:row-span-2" : ""}`}
          >
            <img src={p.url} alt="Tumaini Gardens" className="h-full w-full object-cover aspect-square transition duration-700 hover:scale-110" />
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function Testimonials() {
  const list = [
    { n: "Naomi K.", t: "Honestly the most peaceful weekend we've had in months. The gardens, the pool, the food — all 10/10." },
    { n: "James M.", t: "Hosted our company retreat here. Staff went above and beyond. The conference hall was perfect." },
    { n: "Achieng' & David", t: "We had our wedding under the trees. Magical. Tumaini made it effortless and beautiful." },
  ];
  return (
    <section className="bg-secondary/40 py-24">
      <div className="mx-auto max-w-7xl px-5">
        <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto">
          <p className="text-sm uppercase tracking-[0.3em] text-accent">Guest stories</p>
          <h2 className="mt-3 font-display text-4xl md:text-5xl">Loved by every guest.</h2>
        </motion.div>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {list.map((r, i) => (
            <motion.figure key={r.n} {...fadeUp} transition={{ duration: 0.6, delay: i * 0.1 }}
              className="rounded-3xl bg-card p-7 shadow-soft">
              <div className="flex gap-1 text-accent">{[...Array(5)].map((_, j) => <Star key={j} className="h-4 w-4 fill-current" />)}</div>
              <blockquote className="mt-4 text-lg leading-relaxed">"{r.t}"</blockquote>
              <figcaption className="mt-5 text-sm text-muted-foreground">— {r.n}</figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" className="mx-auto max-w-7xl px-5 py-24">
      <div className="grid gap-12 md:grid-cols-2">
        <motion.div {...fadeUp}>
          <p className="text-sm uppercase tracking-[0.3em] text-accent">Visit us</p>
          <h2 className="mt-3 font-display text-4xl md:text-5xl">Plan your visit to Tumaini.</h2>
          <p className="mt-6 text-muted-foreground">
            Just off the Nairobi-Namanga Highway, immediately after Merishaw School in Isinya, Kajiado County.
            Approx. 60–67 km — a relaxing 1.5-hour drive from Nairobi.
          </p>
          <div className="mt-8 space-y-4">
            <a href="tel:+254759473510" className="flex items-center gap-4 group">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary text-primary-foreground"><Phone className="h-5 w-5" /></span>
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground">Reservations</p>
                <p className="font-medium group-hover:text-primary">+254 759 473 510</p>
              </div>
            </a>
            <a href="https://wa.me/254759473510" target="_blank" rel="noreferrer" className="flex items-center gap-4 group">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#25D366] text-white"><MessageIcon /></span>
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground">WhatsApp</p>
                <p className="font-medium group-hover:text-primary">Chat with us instantly</p>
              </div>
            </a>
            <div className="flex items-center gap-4">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-accent text-accent-foreground"><MapPin className="h-5 w-5" /></span>
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground">Location</p>
                <p className="font-medium">Nairobi-Namanga Hwy, Isinya · Kajiado</p>
              </div>
            </div>
            <a href="/tumaini-brochure.html" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 mt-2 text-sm font-medium text-primary hover:underline">
              <Download className="h-4 w-4" /> Download our full brochure (printable)
            </a>
          </div>
        </motion.div>
        <motion.div {...fadeUp} className="overflow-hidden rounded-3xl shadow-glow">
          <iframe
            title="Tumaini Gardens map"
            src="https://www.google.com/maps?q=Tumaini+Gardens+Isinya&output=embed"
            className="h-full min-h-[420px] w-full"
            loading="lazy"
          />
        </motion.div>
      </div>
    </section>
  );
}

function MessageIcon() {
  return <svg viewBox="0 0 32 32" className="h-5 w-5" fill="currentColor"><path d="M16 3C9 3 3 8 3 14c0 3 1 5 3 7v6l5-3c2 1 3 1 5 1 7 0 13-5 13-11S23 3 16 3z"/></svg>;
}

function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-full bg-gradient-warm font-display text-xl">T</div>
            <div>
              <p className="font-display text-2xl">Tumaini Gardens</p>
              <p className="text-xs uppercase tracking-widest opacity-80">Isinya · Kajiado · Kenya</p>
            </div>
          </div>
          <p className="mt-5 max-w-md opacity-90">Where the gardens whisper hope. A serene lodge & event venue along the Nairobi-Namanga Highway.</p>
        </div>
        <div>
          <p className="text-sm uppercase tracking-widest opacity-70">Explore</p>
          <ul className="mt-4 space-y-2">
            <li><a href="#about" className="hover:underline">About</a></li>
            <li><a href="#stay" className="hover:underline">Stay</a></li>
            <li><a href="#events" className="hover:underline">Events</a></li>
            <li><a href="#gallery" className="hover:underline">Gallery</a></li>
          </ul>
        </div>
        <div>
          <p className="text-sm uppercase tracking-widest opacity-70">Reach us</p>
          <ul className="mt-4 space-y-2">
            <li><a href="tel:+254759473510" className="hover:underline">+254 759 473 510</a></li>
            <li><a href="https://wa.me/254759473510" target="_blank" rel="noreferrer" className="hover:underline">WhatsApp</a></li>
            <li><a href="https://www.tiktok.com/@tumainigardensresort" target="_blank" rel="noreferrer" className="hover:underline">TikTok</a></li>
            <li><a href="https://www.tripadvisor.com/Hotel_Review-g7753813-d9786821-Reviews-Tumaini_Gardens-Kajiado_Rift_Valley_Province.html" target="_blank" rel="noreferrer" className="hover:underline">TripAdvisor</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-5 py-6 text-sm md:flex-row">
          <p className="opacity-80">© {new Date().getFullYear()} Tumaini Gardens Isinya. All rights reserved.</p>
          <p className="rounded-full bg-gradient-warm px-5 py-2 text-accent-foreground font-medium">
            Website by <strong>Emmanuel Ndunda</strong> · <a href="tel:+254769722940" className="underline">0769 722 940</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
