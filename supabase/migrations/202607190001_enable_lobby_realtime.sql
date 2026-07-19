-- Enables Postgres Changes for lobby tables.
-- Without this publication, clients can write/read data but will not receive
-- realtime events when another browser changes ready or connection state.

alter table public.rooms replica identity full;
alter table public.room_players replica identity full;

do $$
begin
  if exists (
    select 1
    from pg_publication
    where pubname = 'supabase_realtime'
  ) then
    if not exists (
      select 1
      from pg_publication_tables
      where pubname = 'supabase_realtime'
        and schemaname = 'public'
        and tablename = 'rooms'
    ) then
      alter publication supabase_realtime add table public.rooms;
    end if;

    if not exists (
      select 1
      from pg_publication_tables
      where pubname = 'supabase_realtime'
        and schemaname = 'public'
        and tablename = 'room_players'
    ) then
      alter publication supabase_realtime add table public.room_players;
    end if;
  end if;
end $$;
