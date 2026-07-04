-- CueUp initial multiplayer schema.
-- This migration creates the minimum database surface for auth profiles,
-- lobbies, 1v1 rooms, matches and game events.

create extension if not exists pgcrypto;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'room_status') then
    create type public.room_status as enum (
      'waiting',
      'ready',
      'playing',
      'finished',
      'cancelled'
    );
  end if;

  if not exists (select 1 from pg_type where typname = 'player_seat') then
    create type public.player_seat as enum ('player_1', 'player_2');
  end if;

  if not exists (select 1 from pg_type where typname = 'match_status') then
    create type public.match_status as enum (
      'playing',
      'finished',
      'abandoned'
    );
  end if;

  if not exists (select 1 from pg_type where typname = 'game_event_type') then
    create type public.game_event_type as enum (
      'shot',
      'turn_change',
      'scratch',
      'ball_pocketed',
      'game_over'
    );
  end if;
end
$$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text not null unique,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_username_length check (char_length(username) between 3 and 24)
);

create table if not exists public.rooms (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  status public.room_status not null default 'waiting',
  host_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint rooms_code_format check (code ~ '^[A-Z0-9-]{4,16}$')
);

create table if not exists public.room_players (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.rooms(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  seat public.player_seat not null,
  ready boolean not null default false,
  connected boolean not null default true,
  joined_at timestamptz not null default now(),
  unique (room_id, user_id),
  unique (room_id, seat)
);

create table if not exists public.matches (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null unique references public.rooms(id) on delete cascade,
  player_1_id uuid not null references public.profiles(id) on delete restrict,
  player_2_id uuid not null references public.profiles(id) on delete restrict,
  status public.match_status not null default 'playing',
  winner_id uuid references public.profiles(id) on delete restrict,
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  constraint matches_distinct_players check (player_1_id <> player_2_id),
  constraint matches_winner_is_player check (
    winner_id is null
    or winner_id = player_1_id
    or winner_id = player_2_id
  )
);

create table if not exists public.game_events (
  id uuid primary key default gen_random_uuid(),
  match_id uuid not null references public.matches(id) on delete cascade,
  player_id uuid not null references public.profiles(id) on delete restrict,
  type public.game_event_type not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists rooms_status_created_at_idx
  on public.rooms (status, created_at desc);

create index if not exists room_players_room_id_idx
  on public.room_players (room_id);

create index if not exists room_players_user_id_idx
  on public.room_players (user_id);

create index if not exists matches_room_id_idx
  on public.matches (room_id);

create index if not exists game_events_match_created_at_idx
  on public.game_events (match_id, created_at);

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists rooms_set_updated_at on public.rooms;
create trigger rooms_set_updated_at
before update on public.rooms
for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.rooms enable row level security;
alter table public.room_players enable row level security;
alter table public.matches enable row level security;
alter table public.game_events enable row level security;

drop policy if exists "Profiles are readable" on public.profiles;
create policy "Profiles are readable"
on public.profiles
for select
using (true);

drop policy if exists "Users can create their own profile" on public.profiles;
create policy "Users can create their own profile"
on public.profiles
for insert
with check (auth.uid() = id);

drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile"
on public.profiles
for update
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "Rooms are readable" on public.rooms;
create policy "Rooms are readable"
on public.rooms
for select
using (true);

drop policy if exists "Authenticated users can create rooms" on public.rooms;
create policy "Authenticated users can create rooms"
on public.rooms
for insert
with check (auth.uid() = host_id);

drop policy if exists "Hosts can update their rooms" on public.rooms;
create policy "Hosts can update their rooms"
on public.rooms
for update
using (auth.uid() = host_id)
with check (auth.uid() = host_id);

drop policy if exists "Hosts can delete their rooms" on public.rooms;
create policy "Hosts can delete their rooms"
on public.rooms
for delete
using (auth.uid() = host_id);

drop policy if exists "Room players are readable" on public.room_players;
create policy "Room players are readable"
on public.room_players
for select
using (true);

drop policy if exists "Users can join rooms as themselves" on public.room_players;
create policy "Users can join rooms as themselves"
on public.room_players
for insert
with check (auth.uid() = user_id);

drop policy if exists "Users can update their room player state" on public.room_players;
create policy "Users can update their room player state"
on public.room_players
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can leave rooms" on public.room_players;
create policy "Users can leave rooms"
on public.room_players
for delete
using (auth.uid() = user_id);

drop policy if exists "Matches are readable" on public.matches;
create policy "Matches are readable"
on public.matches
for select
using (true);

drop policy if exists "Room hosts can create matches" on public.matches;
create policy "Room hosts can create matches"
on public.matches
for insert
with check (
  exists (
    select 1
    from public.rooms
    where rooms.id = matches.room_id
      and rooms.host_id = auth.uid()
  )
);

drop policy if exists "Match players can update matches" on public.matches;
create policy "Match players can update matches"
on public.matches
for update
using (auth.uid() in (player_1_id, player_2_id))
with check (auth.uid() in (player_1_id, player_2_id));

drop policy if exists "Game events are readable" on public.game_events;
create policy "Game events are readable"
on public.game_events
for select
using (true);

drop policy if exists "Match players can create game events" on public.game_events;
create policy "Match players can create game events"
on public.game_events
for insert
with check (
  auth.uid() = player_id
  and exists (
    select 1
    from public.matches
    where matches.id = game_events.match_id
      and auth.uid() in (matches.player_1_id, matches.player_2_id)
  )
);
