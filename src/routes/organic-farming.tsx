import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Leaf, Sprout, Sun, Droplets, Users, ChevronRight, ArrowLeft } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { UtilityBar } from "@/components/utility-bar";
import { WhatsAppButton } from "@/components/floating-widgets";
import farm23 from "@/assets/farm-23.jpg.asset.json";
import farm24 from "@/assets/farm-24.jpg.asset.json";
import farm25 from "@/assets/farm-25.jpg.asset.json";
import farm26 from "@/assets/farm-26.jpg.asset.json";

const DOMAIN = "https://tumainigardensresortisinya.co.ke";

export const Route = createFileRoute("/organic-farming")({
  head: () => ({
    meta: [
      { title: "Organic Farming — Farm-to-Table at Tumaini Gardens Resort, Kenya" },
      { name: "description", content: "Tumaini Gardens Resort grows its own organic vegetables, fruits and herbs on-site — from bananas and citrus to leafy greens. Farm-to-table dining in Isinya, Kajiado." },
      { name: "keywords", content: "organic farming Kenya, farm to table resort, Tumaini Gardens organic, permaculture Kajiado, Isinya farm resort" },
      { property: "og:title", content: "Organic Farming — Tumaini Gardens Resort" },
      { property: "og:description", content: "See how Tumaini Gardens grows fresh organic produce used in every meal we serve." },
      { property: "og:type", content: "article" },
      { property: "og:image", content: `${farm23.url}` },
      { property: "og:url", content: `${DOMAIN}/organic-farming` },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: `${farm23.url}` },
    ],
    links: [{ rel: "canonical", href: `${DOMAIN}/organic-farming` }],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Article",
        headline: "Organic Farming at Tumaini Gardens Resort",
        image: [`${farm23.url}`, `${farm24.url}`, `${farm25.url}`],
        author: { "@type": "Organization", name: "Tumaini Gardens Resort" },
        publisher: { "@type": "Organization", name: "Tumaini Gardens Resort" },
      }),
    }],
  }),
  component: OrganicPage,
});

function OrganicPage() {
  const pillars = [
    { icon: Sprout, t: "Grown On-Site", d: "Kale, spinach, cabbages, herbs — harvested the morning of service." },
    { icon: Sun, t: "Chemical-Free", d: "Compost, mulching and companion planting instead of synthetic sprays." },
    { icon: Droplets, t: "Drip-Irrigated", d: "Efficient water use so our gardens stay green year-round." },
    { icon: Users, t: "Community Training", d: "We host farmer visits, schools and permaculture tour groups." },
  ];
  const gallery = [
    { src: farm26.url, alt: "Landscaped organic garden with edible plants and flowers at Tumaini Gardens" },
    { src: farm23.url, alt: "Farmer training tour walking through Tumaini Gardens organic vegetable beds" },
    { src: farm24.url, alt: "Bunch of organic bananas ripening on the tree at Tumaini Gardens Resort" },
    { src: farm25.url, alt: "Organic oranges growing on a tree in Tumaini Gardens Resort orchard" },
  ];
  return (
    <div className="min-h-screen pt-9">
      <UtilityBar />
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden pt-24 pb-16">
        <img src={farm26.url} alt="Organic gardens at Tumaini" loading="eager" fetchPriority="high" decoding="async" className="absolute inset-0 h-full w-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/10 to-accent/20" />
        <div className="relative mx-auto max-w-5xl px-5 text-center">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-primary hover:underline mb-6"><ArrowLeft className="h-4 w-4" /> Back to home</Link>
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">
            <Leaf className="h-4 w-4" /> Farm to Table
          </span>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-5 font-display text-4xl sm:text-5xl md:text-6xl">
            Organic Farming at <span className="text-gradient-leaf">Tumaini Gardens</span>
          </motion.h1>
          <p className="mx-auto mt-5 max-w-2xl text-base sm:text-lg text-foreground/85 leading-relaxed">
            Almost everything on your Tumaini plate is grown right here. From ripening bananas
            and sun-warmed oranges to crisp kale, spinach and fresh herbs — our chefs cook with
            produce harvested from our own organic farm the same morning.
          </p>
        </div>
      </section>

      {/* Pillars */}
      <section className="mx-auto max-w-7xl px-5 py-14">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map((p, i) => (
            <motion.div key={p.t} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="rounded-3xl border bg-card p-6 shadow-soft">
              <p.icon className="h-8 w-8 text-primary" />
              <h2 className="mt-4 font-display text-xl font-bold">{p.t}</h2>
              <p className="mt-2 text-sm text-foreground/80 leading-relaxed">{p.d}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Gallery */}
      <section className="mx-auto max-w-7xl px-5 pb-16">
        <h2 className="font-display text-3xl sm:text-4xl mb-6">From our farm</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {gallery.map((g, i) => (
            <motion.figure key={i} initial={{ opacity: 0, scale: 0.96 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="overflow-hidden rounded-3xl shadow-soft">
              <img src={g.src} alt={g.alt} loading="lazy" decoding="async" className="h-72 w-full object-cover transition duration-700 hover:scale-105" />
              <figcaption className="bg-card p-4 text-sm text-foreground/80">{g.alt}</figcaption>
            </motion.figure>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-leaf py-16 text-primary-foreground">
        <div className="mx-auto max-w-4xl px-5 text-center">
          <h2 className="font-display text-3xl sm:text-4xl">Taste the difference — book a farm-to-table stay</h2>
          <p className="mt-4 opacity-90">Ask about our farm tour when you check in. Groups, schools and farmer co-ops welcome.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <a href="https://wa.me/254759473510?text=Hi%20Tumaini%2C%20I%27d%20like%20to%20book%20a%20farm-to-table%20experience." target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-semibold text-primary shadow-soft hover:opacity-95">
              Book on WhatsApp <ChevronRight className="h-4 w-4" />
            </a>
            <Link to="/" className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/10 px-6 py-3 font-semibold hover:bg-white/20">
              Back to home
            </Link>
          </div>
        </div>
      </section>

      <WhatsAppButton />
    </div>
  );
}
