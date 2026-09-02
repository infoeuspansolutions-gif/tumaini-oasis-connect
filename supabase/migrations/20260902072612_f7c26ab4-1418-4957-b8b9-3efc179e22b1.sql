-- Remove public/authenticated direct execute on the SECURITY DEFINER helper
revoke execute on function public.is_room_available(uuid, date, date, uuid) from public, anon, authenticated;

-- Public-facing wrapper: SECURITY INVOKER, callable by anyone,
-- delegates to the locked-down definer helper.
create or replace function public.check_room_availability(
    _room_id uuid,
    _check_in date,
    _check_out date,
    _exclude_booking_id uuid default null
) returns boolean
language sql
stable
security invoker
set search_path = public
as $$
    select public.is_room_available(_room_id, _check_in, _check_out, _exclude_booking_id);
$$;

grant execute on function public.check_room_availability(uuid, date, date, uuid) to anon, authenticated;

-- service_role already has execute via default privileges; no extra grant needed