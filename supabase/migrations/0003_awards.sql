-- Awards & achievements (admin: Awards). Same pattern as the other content tables.
create table if not exists public.awards (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  issuer text not null default '',
  year text not null default '',
  icon text not null default '',
  description text not null default '',
  url text,
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists awards_touch on public.awards;
create trigger awards_touch before update on public.awards
  for each row execute function public.touch_updated_at();

alter table public.awards enable row level security;
drop policy if exists "admin write" on public.awards;
create policy "admin write" on public.awards
  for all using (public.is_admin()) with check (public.is_admin());
drop policy if exists "public read" on public.awards;
create policy "public read" on public.awards for select using (published);
