# Booking Engine & Availability Calendar

Add a full reservation flow so guests can check room/unit availability, choose dates, and submit booking requests. Admin can manage rooms, view bookings, and approve/decline requests.

## What will be built

1. **Database schema**
   - `public.rooms` — accommodation units (name, type, description, max_guests, price_per_night, images, published).
   - `public.bookings` — reservation requests (room_id, check_in, check_out, guest_name, email, phone, adults, children, status, notes, total_price).
   - `public.booking_status` enum: `pending`, `confirmed`, `declined`, `cancelled`.
   - `public.room_type` enum: `cottage`, `suite`, `tent`, `hall`.
   - RLS: public reads only published rooms; authenticated users create bookings; admins read/update all bookings and rooms.
   - GRANT statements for `authenticated`, `service_role`, and `anon` where policies allow.

2. **Public booking page** (`/booking`)
   - Date picker for check-in / check-out.
   - Live availability check: list only rooms without overlapping confirmed/pending bookings.
   - Room cards with image, price, capacity, amenities.
   - Guest details form (name, email, phone, adults, children, notes).
   - Quote summary and submit request.
   - Success state with WhatsApp fallback to follow up instantly.
   - Fully responsive; works on mobile.

3. **Admin booking management**
   - New "Bookings" tab in `/admin` alongside Posts.
   - Sub-tabs: Rooms (add/edit/publish/unpublish), Bookings (pending/confirmed/declined filter, approve/decline, view details).
   - Simple room form with image upload to `post-media` bucket.

4. **Server functions**
   - `listPublishedRooms` — public read.
   - `checkAvailability` — public read for date range.
   - `createBookingRequest` — public/guest create.
   - `listBookings` / `updateBookingStatus` / `createRoom` / `updateRoom` — admin-only via `requireSupabaseAuth` + `has_role` check.

5. **Navigation updates**
   - Replace the WhatsApp "Book" button in `Navbar` and `MobileActionBar` with a link to `/booking`.
   - Keep WhatsApp as a secondary option on the booking page and mobile action bar.

6. **SEO**
   - `head()` on `/booking` with title, description, og tags, canonical URL.

## Out of scope for this iteration
- Online payment (M-Pesa/card). Bookings are request-only; admin confirms and payment happens offline/WhatsApp.
- Automated email/SMS confirmations.

## Files to create or modify
- New: `src/routes/booking.tsx`, `src/lib/booking.functions.ts`, `src/components/booking-calendar.tsx`, `src/components/room-card.tsx`, `src/components/booking-form.tsx`.
- Modify: `src/routes/admin.tsx`, `src/components/navbar.tsx`, `src/components/floating-widgets.tsx` (mobile action bar), `src/integrations/supabase/types.ts` (regenerated from migration), `src/routeTree.gen.ts` (auto-generated).
- Migration: new SQL file for rooms, bookings, enums, RLS, grants.

## Verification
- TypeScript build passes.
- Playwright checks the booking page on desktop and mobile.
- Admin can create a room and see a submitted booking.
