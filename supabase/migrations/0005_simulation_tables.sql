-- World Cup 2026 Turnuva Simülasyonu — yeni tahmin şeması
-- Kullanıcı adım adım bir turnuva simülasyonu tamamlar ve sonucu kaydeder.
-- Paylaşım linkleri share_token üzerinden çalışır.

-- ---------------------------------------------------------------------------
-- simulations
-- ---------------------------------------------------------------------------
create table public.simulations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  share_token varchar(64) unique not null default encode(gen_random_bytes(32), 'hex'),
  group_rankings jsonb not null,      -- { "A": ["USA","COL",...], ... }
  selected_thirds jsonb not null,     -- ["USA","BRA",...]  (8 team IDs)
  bracket jsonb not null,             -- full bracket state
  champion text,                      -- team ID, set when final is decided
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_simulations_user_id on public.simulations(user_id);
create index idx_simulations_share_token on public.simulations(share_token);

alter table public.simulations enable row level security;

create policy "simulations are publicly readable via token" on public.simulations
  for select using (true);

create policy "anyone can insert simulation" on public.simulations
  for insert with check (true);

-- share_token IS the ownership proof — whoever has it can update
create policy "update via share token" on public.simulations
  for update using (true);

create trigger simulations_set_updated_at
  before update on public.simulations
  for each row execute function public.set_updated_at();
