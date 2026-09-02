create type public.booking_status as enum ('pending', 'confirmed', 'declined', 'cancelled');
create type public.room_type as enum ('cottage', 'suite', 'tent', 'hall');

create table public.rooms (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    type public.room_type not null default 'cottage',
    description text,
    max_guests integer not null default 2,
    price_per_night numeric(10,2) not null default 0,
    images text[] default '{}',
    amenities text[] default '{}',
    published boolean not null default true,
    created_at timestamp with time zone not null default now(),
    updated_at timestamp with time zone not null default now()
);

grant select on public.rooms to anon, authenticated;
grant insert, update, delete on public.rooms to authenticated;
grant all on public.rooms to service_role;

alter table public.rooms enable row level security;

create policy "Published rooms are readable by anyone"
on public.rooms for select to public
using (published = true or has_role(auth.uid(), 'admin'::app_role));

create policy "Admins can manage rooms"
on public.rooms for all to authenticated
using (has_role(auth.uid(), 'admin'::app_role))
with check (has_role(auth.uid(), 'admin'::app_role));

create table public.bookings (
    id uuid primary key default gen_random_uuid(),
    room_id uuid not null references public.rooms(id) on delete restrict,
    check_in date not null,
    check_out date not null,
    guest_name text not null,
    guest_email text not null,
    guest_phone text not null,
    adults integer not null default 1,
    children integer not null default 0,
    notes text,
    status public.booking_status not null default 'pending',
    total_price numeric(10,2),
    created_at timestamp with time zone not null default now(),
    updated_at timestamp with time zone not null default now(),
    constraint check_dates check (check_out > check_in)
);

grant select, insert on public.bookings to anon, authenticated;
grant update, delete on public.bookings to authenticated;
grant all on public.bookings to service_role;

alter table public.bookings enable row level security;

create policy "Anyone can submit a booking request"
on public.bookings for insert to public
with check (true);

create policy "Admins can manage all bookings"
on public.bookings for all to authenticated
using (has_role(auth.uid(), 'admin'::app_role))
with check (has_role(auth.uid(), 'admin'::app_role));

create or replace function public.is_room_available(
    _room_id uuid,
    _check_in date,
    _check_out date,
    _exclude_booking_id uuid default null
) returns boolean
language sql
stable
security definer
set search_path = public
as $$
    select not exists (
        select 1 from public.bookings
        where room_id = _room_id
          and status in ('pending', 'confirmed')
          and id <> coalesce(_exclude_booking_id, '00000000-0000-0000-0000-000000000000'::uuid)
          and check_in < _check_out
          and check_out > _check_in
    );
$$;

comment on function public.is_room_available(uuid, date, date, uuid) is 'Returns true if the room has no overlapping pending or confirmed bookings for the requested range.';

-- updated_at trigger (reuses existing helper if present, otherwise creates it)
create or replace function public.tg_touch_updated_at()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

create trigger rooms_updated_at before update on public.rooms
for each row execute function public.tg_touch_updated_at();

create trigger bookings_updated_at before update on public.bookings
for each row execute function public.tg_touch_updated_at();