import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

// Server publishable client for public reads (rooms, availability, create booking request).
function getPublicClient() {
  const url = process.env["SUPABASE_URL"];
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"];
  if (!url || !key) throw new Error("Supabase configuration missing");
  return createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false, storage: undefined },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) {
          h.delete("Authorization");
        }
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}

function assertAdmin(context: { supabase: any; userId: string }) {
  return context.supabase.rpc("has_role", {
    _user_id: context.userId,
    _role: "admin",
  });
}

// ---------- Public ----------

export const listPublishedRooms = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await getPublicClient()
    .from("rooms")
    .select("*")
    .eq("published", true)
    .order("price_per_night", { ascending: true });
  if (error) throw error;
  return data ?? [];
});

export const checkAvailability = createServerFn({ method: "POST" })
  .inputValidator((data: { check_in: string; check_out: string }) => data)
  .handler(async ({ data }) => {
    const supabase = getPublicClient();
    const { data: rooms, error } = await supabase
      .from("rooms")
      .select("*")
      .eq("published", true)
      .order("price_per_night", { ascending: true });
    if (error) throw error;

    const available = await Promise.all(
      (rooms ?? []).map(async (room) => {
        const { data: free, error: rpcError } = await supabase.rpc("check_room_availability", {
          _room_id: room.id,
          _check_in: data.check_in,
          _check_out: data.check_out,
        });
        if (rpcError) throw rpcError;
        return { ...room, available: !!free };
      }),
    );
    return available;
  });

export const createBookingRequest = createServerFn({ method: "POST" })
  .inputValidator(
    (data: {
      room_id: string;
      check_in: string;
      check_out: string;
      guest_name: string;
      guest_email: string;
      guest_phone: string;
      adults?: number;
      children?: number;
      notes?: string;
      total_price?: number;
    }) => data,
  )
  .handler(async ({ data }) => {
    const { error } = await getPublicClient().from("bookings").insert({
      room_id: data.room_id,
      check_in: data.check_in,
      check_out: data.check_out,
      guest_name: data.guest_name,
      guest_email: data.guest_email,
      guest_phone: data.guest_phone,
      adults: data.adults ?? 1,
      children: data.children ?? 0,
      notes: data.notes ?? null,
      total_price: data.total_price ?? null,
      status: "pending",
    });
    if (error) throw error;
    return { ok: true };
  });

// ---------- Admin ----------

export const listRooms = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: isAdmin } = await assertAdmin(context);
    if (!isAdmin) throw new Error("Forbidden");
    const { data, error } = await context.supabase
      .from("rooms")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data ?? [];
  });

export const createRoom = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(
    (data: {
      name: string;
      type: Database["public"]["Enums"]["room_type"];
      description: string;
      max_guests: number;
      price_per_night: number;
      amenities: string[];
      images: string[];
      published: boolean;
    }) => data,
  )
  .handler(async ({ data, context }) => {
    const { data: isAdmin } = await assertAdmin(context);
    if (!isAdmin) throw new Error("Forbidden");
    const { error } = await context.supabase.from("rooms").insert({
      name: data.name,
      type: data.type,
      description: data.description,
      max_guests: data.max_guests,
      price_per_night: data.price_per_night,
      amenities: data.amenities,
      images: data.images,
      published: data.published,
    });
    if (error) throw error;
    return { ok: true };
  });

export const updateRoom = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(
    (data: {
      id: string;
      name: string;
      type: Database["public"]["Enums"]["room_type"];
      description: string;
      max_guests: number;
      price_per_night: number;
      amenities: string[];
      images: string[];
      published: boolean;
    }) => data,
  )
  .handler(async ({ data, context }) => {
    const { data: isAdmin } = await assertAdmin(context);
    if (!isAdmin) throw new Error("Forbidden");
    const { error } = await context.supabase
      .from("rooms")
      .update({
        name: data.name,
        type: data.type,
        description: data.description,
        max_guests: data.max_guests,
        price_per_night: data.price_per_night,
        amenities: data.amenities,
        images: data.images,
        published: data.published,
      })
      .eq("id", data.id);
    if (error) throw error;
    return { ok: true };
  });

export const deleteRoom = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data, context }) => {
    const { data: isAdmin } = await assertAdmin(context);
    if (!isAdmin) throw new Error("Forbidden");
    const { error } = await context.supabase.from("rooms").delete().eq("id", data.id);
    if (error) throw error;
    return { ok: true };
  });

export const listBookings = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: isAdmin } = await assertAdmin(context);
    if (!isAdmin) throw new Error("Forbidden");
    const { data, error } = await context.supabase
      .from("bookings")
      .select("*, rooms(name)")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data ?? [];
  });

export const updateBookingStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(
    (data: { id: string; status: Database["public"]["Enums"]["booking_status"] }) => data,
  )
  .handler(async ({ data, context }) => {
    const { data: isAdmin } = await assertAdmin(context);
    if (!isAdmin) throw new Error("Forbidden");
    const { error } = await context.supabase.from("bookings").update({ status: data.status }).eq("id", data.id);
    if (error) throw error;
    return { ok: true };
  });
