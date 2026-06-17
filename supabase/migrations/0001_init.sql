-- World Cup Tahminator — initial schema
-- Tables: teams, profiles, matches, predictions, match_injuries
-- All tables have RLS enabled. Writes to denormalized/sensitive columns are
-- restricted to the service role (used only by cron/server routes), never the
-- `authenticated` role directly.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- teams
-- ---------------------------------------------------------------------------
create table public.teams (
  id int primary key, -- API-Football team id, reused directly
  name text not null,
  short_name text,
  logo_url text,
  country text
);

alter table public.teams enable row level security;

create policy "teams are publicly readable"
  on public.teams for select
  using (true);

-- ---------------------------------------------------------------------------
-- profiles
-- ---------------------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text not null unique,
  avatar_url text,
  total_points numeric(10, 2) not null default 0,
  current_streak int not null default 0,
  best_streak int not null default 0,
  last_scored_kickoff_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles are publicly readable"
  on public.profiles for select
  using (true);

-- Users may update their own row, but column-level grants below prevent them
-- from touching the score-related columns directly (only service_role can).
create policy "users can update own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

revoke update on public.profiles from authenticated;
grant update (username, avatar_url, updated_at) on public.profiles to authenticated;

-- Auto-create a profile row whenever a new auth user signs up.
create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, username)
  values (new.id, 'user_' || substr(new.id::text, 1, 8));
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- matches
-- ---------------------------------------------------------------------------
create table public.matches (
  id uuid primary key default gen_random_uuid(),
  api_fixture_id bigint not null unique,
  home_team_id int not null references public.teams(id),
  away_team_id int not null references public.teams(id),
  kickoff_at timestamptz not null,
  matchday_key date not null,
  venue text,
  round text,
  status text not null default 'NS',
  home_goals int,
  away_goals int,
  scoring_status text not null default 'pending'
    check (scoring_status in ('pending', 'scored', 'not_applicable')),
  scored_at timestamptz,
  last_synced_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_matches_matchday_key on public.matches(matchday_key);
create index idx_matches_kickoff_at on public.matches(kickoff_at);
create index idx_matches_scoring_status on public.matches(status, scoring_status);

alter table public.matches enable row level security;

create policy "matches are publicly readable"
  on public.matches for select
  using (true);

create trigger matches_set_updated_at
  before update on public.matches
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- predictions
-- ---------------------------------------------------------------------------
create table public.predictions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  match_id uuid not null references public.matches(id) on delete cascade,
  predicted_home int not null check (predicted_home >= 0 and predicted_home <= 20),
  predicted_away int not null check (predicted_away >= 0 and predicted_away <= 20),
  submitted_at timestamptz not null default now(),
  points_awarded numeric(6, 2),
  outcome_correct boolean,
  scored_at timestamptz,
  unique (user_id, match_id)
);

create index idx_predictions_match_id on public.predictions(match_id);
create index idx_predictions_user_id on public.predictions(user_id);

alter table public.predictions enable row level security;

-- Predictions are private to their owner — leaderboard reads from `profiles`,
-- never from this table directly, so other users' picks stay hidden pre-match.
create policy "users can read own predictions"
  on public.predictions for select
  using (auth.uid() = user_id);

create policy "users can insert own predictions before kickoff"
  on public.predictions for insert
  with check (
    auth.uid() = user_id
    and now() < (select kickoff_at from public.matches where id = match_id)
  );

create policy "users can update own predictions before kickoff"
  on public.predictions for update
  using (auth.uid() = user_id)
  with check (
    auth.uid() = user_id
    and now() < (select kickoff_at from public.matches where id = match_id)
  );

-- ---------------------------------------------------------------------------
-- match_injuries
-- ---------------------------------------------------------------------------
create table public.match_injuries (
  id uuid primary key default gen_random_uuid(),
  match_id uuid not null references public.matches(id) on delete cascade,
  team_id int not null references public.teams(id),
  player_name text not null,
  player_photo text,
  type text,
  reason text,
  fetched_at timestamptz not null default now(),
  unique (match_id, team_id, player_name, reason)
);

create index idx_match_injuries_match_id on public.match_injuries(match_id);

alter table public.match_injuries enable row level security;

create policy "match injuries are publicly readable"
  on public.match_injuries for select
  using (true);
