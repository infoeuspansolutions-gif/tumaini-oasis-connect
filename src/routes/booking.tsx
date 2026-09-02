import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { queryOptions, useSuspenseQuery, useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  CalendarDays,
  Users,
  BedDouble,
  Check,
  ArrowRight,
  Phone,
  MessageCircle,
  Loader2,
  Sparkles,
  ChevronLeft,
  MapPin,
  Star,
} from "lucide-react";
import { Navbar } from "@/components/navbar";
import { UtilityBar } from "@/components/utility-bar";
import { SmartImage } from "@/components/smart-image";
import {
  listPublishedRooms,
  checkAvailability,
  createBookingRequest,
} from "@/lib/booking.functions";
import type { Database } from "@/integrations/supabase/types";

const DOMAIN = "https://tumainigardensresortisinya.co.ke";
const CDN = "https://tumainigardensresortisinya.lovable.app";
const heroImg = `${CDN}/__l5e/assets-v1/96471cd7-a8d5-4cda-9d64-101c9841e8e6/tumaini-garden.jpg`;

export const Route = createFileRoute("/booking")({
  head: () => ({
    meta: [
      { title: "Book Your Stay — Tumaini Gardens Isinya Resort" },
      { name: "description", content: "Check availability and book cottages, rooms & event halls at Tumaini Gardens Isinya. Best rates guaranteed. Secure your stay in Kenya's serene garden resort." },
      { property: "og:title", content: "Book Your Stay — Tumaini Gardens Isinya" },
      { property: "og:description", content: "Check live availability and request a reservation at Tumaini Gardens Isinya. Cottages, suites, tents & event spaces." },
      { property: "og:type", content: "website" },
      { property: "og:image", content: heroImg },
      { property: "og:url", content: `${DOMAIN}/booking` },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: heroImg },
    ],
    links: [{ rel: "canonical", href: `${DOMAIN}/booking` }],
  }),
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(
      queryOptions({
        queryKey: ["published-rooms"],
        queryFn: () => listPublishedRooms(),
      }),
    ),
  component: BookingPage,
});

const today = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.toISOString().split("T")[0];
};
const tomorrow = () => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  d.setHours(0, 0, 0, 0);
  return d.toISOString().split("T")[0];
};

const nightsBetween = (a: string, b: string) => {
  const ms = new Date(b).getTime() - new Date(a).getTime();
  return Math.max(1, Math.ceil(ms / (1000 * 60 * 60 * 24)));
};

const formatKes = (n: number) =>
  new Intl.NumberFormat("en-KE", { style: "currency", currency: "KES", maximumFractionDigits: 0 }).format(n);

function BookingPage() {
  const roomsQuery = useSuspenseQuery(
    queryOptions({
      queryKey: ["published-rooms"],
      queryFn: () => listPublishedRooms(),
    }),
  );

  const [checkIn, setCheckIn] = useState(today());
  const [checkOut, setCheckOut] = useState(tomorrow());
  const [step, setStep] = useState<"dates" | "rooms" | "details" | "success">("dates");
  const [selected, setSelected] = useState<Database["public"]["Tables"]["rooms"]["Row"] | null>(null);

  const checkFn = useServerFn(checkAvailability);
  const availQuery = useQuery({
    queryKey: ["availability", checkIn, checkOut],
    queryFn: () => checkFn({ data: { check_in: checkIn, check_out: checkOut } }),
    enabled: step === "rooms" && checkIn < checkOut,
  });

  const nights = nightsBetween(checkIn, checkOut);

  const showRooms = () => {
    if (checkIn >= checkOut) {
      alert("Please choose a check-out date after check-in.");
      return;
    }
    setStep("rooms");
    setSelected(null);
  };

  return (
    <div className="min-h-screen overflow-x-hidden pt-9 pb-20 md:pb-0">
      <UtilityBar />
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/90 via-leaf to-primary py-16 pt-28 text-white md:py-24">
        <div className="absolute inset-0 opacity-20">
          <SmartImage src={heroImg} alt="Tumaini Gardens lush gardens" className="h-full w-full object-cover" />
        </div>
        <div className="relative mx-auto max-w-7xl px-5 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <p className="text-xs font-bold uppercase tracking-widest text-white/80">Reservations</p>
            <h1 className="mt-2 font-display text-3xl font-bold md:text-5xl">Book Your Stay at Tumaini Gardens</h1>
            <p className="mx-auto mt-4 max-w-2xl text-sm md:text-base text-white/90">
              Choose your dates, pick the perfect cottage or room, and send a reservation request. We'll confirm via WhatsApp or phone.
            </p>
          </motion.div>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-4 py-10 md:px-6">
        {/* Progress */}
        <div className="mb-8 flex items-center justify-center gap-2 text-sm font-medium">
          <StepDot active={step === "dates" || step === "rooms" || step === "details" || step === "success"} label="Dates" />
          <span className="h-px w-6 bg-border" />
          <StepDot active={step === "rooms" || step === "details" || step === "success"} label="Rooms" />
          <span className="h-px w-6 bg-border" />
          <StepDot active={step === "details" || step === "success"} label="Details" />
        </div>

        {step === "dates" && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto max-w-xl rounded-3xl border bg-card p-6 shadow-soft md:p-8"
          >
            <h2 className="font-display text-xl font-bold md:text-2xl">When would you like to visit?</h2>
            <p className="mt-2 text-sm text-muted-foreground">Select your check-in and check-out dates to see live availability.</p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold">Check-in</span>
                <input
                  type="date"
                  min={today()}
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="w-full rounded-xl border bg-background px-4 py-3 text-base outline-none focus:ring-2 focus:ring-primary/40"
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold">Check-out</span>
                <input
                  type="date"
                  min={checkIn}
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="w-full rounded-xl border bg-background px-4 py-3 text-base outline-none focus:ring-2 focus:ring-primary/40"
                />
              </label>
            </div>

            <div className="mt-6 rounded-2xl bg-secondary/60 p-4">
              <p className="text-sm font-semibold">Stay summary</p>
              <p className="mt-1 text-2xl font-bold tabular-nums">{nights} night{nights > 1 ? "s" : ""}</p>
              <p className="text-xs text-muted-foreground">{new Date(checkIn).toDateString()} → {new Date(checkOut).toDateString()}</p>
            </div>

            <button
              onClick={showRooms}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-base font-bold text-primary-foreground shadow-soft hover:bg-primary/90"
            >
              Check availability <ArrowRight className="h-4 w-4" />
            </button>
          </motion.div>
        )}

        {step === "rooms" && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-display text-xl font-bold md:text-2xl">Available rooms & cottages</h2>
                <p className="text-sm text-muted-foreground">{new Date(checkIn).toLocaleDateString()} – {new Date(checkOut).toLocaleDateString()} · {nights} night{nights > 1 ? "s" : ""}</p>
              </div>
              <button onClick={() => setStep("dates")} className="inline-flex items-center gap-1 rounded-full border px-4 py-2 text-sm font-semibold hover:bg-accent">
                <ChevronLeft className="h-4 w-4" /> Change dates
              </button>
            </div>

            {availQuery.isLoading ? (
              <div className="grid place-items-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="mt-2 text-sm text-muted-foreground">Checking availability…</p>
              </div>
            ) : availQuery.error ? (
              <div className="rounded-2xl border bg-destructive/10 p-6 text-destructive">
                <p>Something went wrong checking availability. Please try again or WhatsApp us.</p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {(availQuery.data ?? roomsQuery.data ?? []).map((room) => (
                  <RoomCard
                    key={room.id}
                    room={room}
                    nights={nights}
                    selected={selected?.id === room.id}
                    onSelect={() => setSelected(room)}
                  />
                ))}
              </div>
            )}

            {selected && (
              <div className="mt-8 flex justify-end">
                <button
                  onClick={() => setStep("details")}
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-base font-bold text-primary-foreground shadow-soft hover:bg-primary/90"
                >
                  Continue with {selected.name} <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </motion.div>
        )}

        {step === "details" && selected && (
          <BookingDetails
            room={selected}
            checkIn={checkIn}
            checkOut={checkOut}
            nights={nights}
            onBack={() => setStep("rooms")}
            onSuccess={() => setStep("success")}
          />
        )}

        {step === "success" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mx-auto max-w-xl rounded-3xl border bg-card p-8 text-center shadow-soft"
          >
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-primary/10 text-primary">
              <Check className="h-8 w-8" />
            </div>
            <h2 className="mt-4 font-display text-2xl font-bold">Request received!</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              We've sent your reservation request to our reservations team. You'll receive a confirmation via WhatsApp or phone shortly.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <a
                href="https://wa.me/254759473510?text=Hello%20Tumaini%20Gardens%2C%20I%20just%20submitted%20a%20booking%20request%20on%20your%20website.%20Please%20confirm%20my%20reservation."
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-5 py-3 font-bold text-white"
              >
                <MessageCircle className="h-5 w-5" /> Follow up on WhatsApp
              </a>
              <a href="tel:+254759473510" className="inline-flex items-center justify-center gap-2 rounded-full border px-5 py-3 font-bold">
                <Phone className="h-5 w-5" /> Call reservations
              </a>
            </div>
            <Link to="/" className="mt-6 inline-block text-sm font-semibold text-primary hover:underline">
              Back to homepage
            </Link>
          </motion.div>
        )}
      </main>
    </div>
  );
}

function StepDot({ active, label }: { active: boolean; label: string }) {
  return (
    <div className={`flex items-center gap-1.5 ${active ? "text-primary" : "text-muted-foreground"}`}>
      <span className={`grid h-6 w-6 place-items-center rounded-full text-xs font-bold ${active ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
        {active ? <Check className="h-3.5 w-3.5" /> : "•"}
      </span>
      {label}
    </div>
  );
}

function RoomCard({
  room,
  nights,
  selected,
  onSelect,
}: {
  room: Database["public"]["Tables"]["rooms"]["Row"] & { available?: boolean };
  nights: number;
  selected: boolean;
  onSelect: () => void;
}) {
  const image = room.images?.[0] || "https://placehold.co/600x400?text=Tumaini+Gardens";
  const total = (room.price_per_night || 0) * nights;
  const unavailable = room.available === false;

  return (
    <motion.div
      whileHover={!unavailable ? { y: -4 } : undefined}
      className={`flex flex-col overflow-hidden rounded-3xl border bg-card shadow-soft transition ${unavailable ? "opacity-60" : ""} ${selected ? "ring-2 ring-primary" : ""}`}
    >
      <div className="relative h-48">
        <SmartImage src={image} alt={room.name} className="h-full w-full object-cover" />
        <div className="absolute left-3 top-3 rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
          {room.type}
        </div>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-lg font-bold">{room.name}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{room.description}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-1 text-xs font-semibold">
            <Users className="h-3 w-3" /> Up to {room.max_guests}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-1 text-xs font-semibold">
            <BedDouble className="h-3 w-3" /> {room.type}
          </span>
          {room.amenities?.slice(0, 2).map((a) => (
            <span key={a} className="inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-1 text-xs font-semibold">
              <Star className="h-3 w-3" /> {a}
            </span>
          ))}
        </div>

        <div className="mt-auto pt-5">
          <p className="text-xs text-muted-foreground">{nights} night{nights > 1 ? "s" : ""}</p>
          <p className="text-xl font-bold text-primary">{formatKes(total)}</p>
          <p className="text-xs text-muted-foreground">{formatKes(room.price_per_night || 0)} / night</p>

          {unavailable ? (
            <div className="mt-3 rounded-xl bg-destructive/10 py-2 text-center text-sm font-semibold text-destructive">
              Not available for selected dates
            </div>
          ) : (
            <button
              onClick={onSelect}
              className={`mt-3 w-full rounded-xl py-2.5 text-sm font-bold transition ${selected ? "bg-primary text-primary-foreground" : "border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground"}`}
            >
              {selected ? "Selected" : "Select room"}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function BookingDetails({
  room,
  checkIn,
  checkOut,
  nights,
  onBack,
  onSuccess,
}: {
  room: Database["public"]["Tables"]["rooms"]["Row"];
  checkIn: string;
  checkOut: string;
  nights: number;
  onBack: () => void;
  onSuccess: () => void;
}) {
  const submitFn = useServerFn(createBookingRequest);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    guest_name: "";
    guest_email: "";
    guest_phone: "";
    adults: 1;
    children: 0;
    notes: "";
  });

  const total = (room.price_per_night || 0) * nights;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.guest_name.trim() || !form.guest_email.trim() || !form.guest_phone.trim()) {
      alert("Please fill in your name, email and phone number.");
      return;
    }
    setSaving(true);
    try {
      await submitFn({
        data: {
          room_id: room.id,
          check_in: checkIn,
          check_out: checkOut,
          guest_name: form.guest_name,
          guest_email: form.guest_email,
          guest_phone: form.guest_phone,
          adults: form.adults,
          children: form.children,
          notes: form.notes,
          total_price: total,
        },
      });
      onSuccess();
    } catch (err) {
      console.error(err);
      alert("Failed to submit request. Please try again or WhatsApp us.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="grid gap-8 lg:grid-cols-3">
      <form onSubmit={submit} className="space-y-5 lg:col-span-2">
        <div className="flex items-center gap-2">
          <button type="button" onClick={onBack} className="inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-sm font-semibold hover:bg-accent">
            <ChevronLeft className="h-4 w-4" /> Back
          </button>
        </div>
        <h2 className="font-display text-xl font-bold md:text-2xl">Guest details</h2>

        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold">Full name *</span>
            <input
              required
              value={form.guest_name}
              onChange={(e) => setForm((f) => ({ ...f, guest_name: e.target.value }))}
              className="w-full rounded-xl border bg-background px-4 py-3 text-base outline-none focus:ring-2 focus:ring-primary/40"
              placeholder="e.g. John Kamau"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold">Email *</span>
            <input
              type="email"
              required
              value={form.guest_email}
              onChange={(e) => setForm((f) => ({ ...f, guest_email: e.target.value }))}
              className="w-full rounded-xl border bg-background px-4 py-3 text-base outline-none focus:ring-2 focus:ring-primary/40"
              placeholder="john@example.com"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold">Phone *</span>
            <input
              type="tel"
              required
              value={form.guest_phone}
              onChange={(e) => setForm((f) => ({ ...f, guest_phone: e.target.value }))}
              className="w-full rounded-xl border bg-background px-4 py-3 text-base outline-none focus:ring-2 focus:ring-primary/40"
              placeholder="+254 7XX XXX XXX"
            />
          </label>
          <div className="grid grid-cols-2 gap-4">
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold">Adults</span>
              <input
                type="number"
                min={1}
                max={room.max_guests}
                value={form.adults}
                onChange={(e) => setForm((f) => ({ ...f, adults: Math.max(1, parseInt(e.target.value || "1")) }))}
                className="w-full rounded-xl border bg-background px-4 py-3 text-base outline-none focus:ring-2 focus:ring-primary/40"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold">Children</span>
              <input
                type="number"
                min={0}
                value={form.children}
                onChange={(e) => setForm((f) => ({ ...f, children: Math.max(0, parseInt(e.target.value || "0")) }))}
                className="w-full rounded-xl border bg-background px-4 py-3 text-base outline-none focus:ring-2 focus:ring-primary/40"
              />
            </label>
          </div>
        </div>

        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold">Special requests / notes</span>
          <textarea
            rows={4}
            value={form.notes}
            onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
            className="w-full rounded-xl border bg-background px-4 py-3 text-base outline-none focus:ring-2 focus:ring-primary/40"
            placeholder="Dietary needs, late check-in, celebration setup, etc."
          />
        </label>

        <button
          type="submit"
          disabled={saving}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-base font-bold text-primary-foreground shadow-soft hover:bg-primary/90 disabled:opacity-60 sm:w-auto"
        >
          {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5" />}
          Submit booking request
        </button>
      </form>

      <aside className="h-fit rounded-3xl border bg-card p-6 shadow-soft">
        <h3 className="font-display text-lg font-bold">Booking summary</h3>
        <div className="mt-4 space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Room</span>
            <span className="font-semibold">{room.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Check-in</span>
            <span className="font-semibold">{new Date(checkIn).toDateString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Check-out</span>
            <span className="font-semibold">{new Date(checkOut).toDateString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Guests</span>
            <span className="font-semibold">{form.adults} adult{form.adults > 1 ? "s" : ""}{form.children ? `, ${form.children} child${form.children > 1 ? "ren" : ""}` : ""}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Nights</span>
            <span className="font-semibold">{nights}</span>
          </div>
          <div className="border-t pt-3">
            <div className="flex justify-between text-base font-bold">
              <span>Estimated total</span>
              <span className="text-primary">{formatKes(total)}</span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">Final rate confirmed by reservations team.</p>
          </div>
        </div>
        <div className="mt-5 rounded-2xl bg-secondary/60 p-4 text-xs text-muted-foreground">
          <p className="flex items-start gap-2">
            <MapPin className="h-4 w-4 shrink-0 text-primary" />
            Tumaini Gardens Isinya, Nairobi-Namanga Highway, Kajiado County, Kenya
          </p>
        </div>
      </aside>
    </motion.div>
  );
}
