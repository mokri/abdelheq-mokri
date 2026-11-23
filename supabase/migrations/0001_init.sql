-- Portfolio schema: content tables, admin check, RLS, storage bucket.
-- Run with `npx supabase db push` or paste into the Supabase SQL editor.

create extension if not exists pgcrypto;

-- ─── Admins ─────────────────────────────────────────────────────────────
create table if not exists public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.admins enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

create policy "admins read self" on public.admins
  for select using (user_id = auth.uid());

-- ─── updated_at trigger ─────────────────────────────────────────────────
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ─── Profile (single row, id = 1) ───────────────────────────────────────
create table if not exists public.profile (
  id int primary key default 1 check (id = 1),
  name_first text not null default '',
  name_last text not null default '',
  initials text not null default '',
  hero_label text not null default '',
  typewriter_lines text[] not null default '{}',
  hero_stats jsonb not null default '[]',
  about_role text not null default '',
  about_tags text[] not null default '{}',
  about_stats jsonb not null default '[]',
  bio_md text not null default '',
  timeline jsonb not null default '[]',
  research_keywords text[] not null default '{}',
  startups_footnote text not null default '',
  contact_heading text not null default '',
  contact_sub text not null default '',
  contact_links jsonb not null default '[]',
  avatar_url text,
  seo_title text not null default '',
  seo_description text not null default '',
  updated_at timestamptz not null default now()
);

-- ─── Experiences ────────────────────────────────────────────────────────
create table if not exists public.experiences (
  id uuid primary key default gen_random_uuid(),
  company text not null,
  role text not null default '',
  dates text not null default '',
  employment_type text not null default '',
  description text not null default '',
  tags text[] not null default '{}',
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ─── Projects (flagship / client / archive) ─────────────────────────────
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  kind text not null default 'archive' check (kind in ('flagship', 'client', 'archive')),
  experience_id uuid references public.experiences (id) on delete set null,
  year text not null default '',
  label text not null default '',
  role text not null default '',
  country text not null default '',
  description text not null default '',
  highlight text not null default '',
  icon text not null default '',
  cover_image text,
  gallery text[] not null default '{}',
  tags text[] not null default '{}',
  url text,
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists projects_experience_idx on public.projects (experience_id);

-- ─── Publications ───────────────────────────────────────────────────────
create table if not exists public.publications (
  id uuid primary key default gen_random_uuid(),
  venue text not null default '',
  title text not null,
  abstract text not null default '',
  authors text not null default '',
  year text not null default '',
  pdf_url text,
  doi_url text,
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ─── Certifications ─────────────────────────────────────────────────────
create table if not exists public.certifications (
  id uuid primary key default gen_random_uuid(),
  issuer text not null default '',
  title text not null,
  description text not null default '',
  date_label text not null default '',
  pdf_url text,
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ─── Startups ───────────────────────────────────────────────────────────
create table if not exists public.startups (
  id uuid primary key default gen_random_uuid(),
  year text not null default '',
  emoji text not null default '',
  name text not null,
  domain text not null default '',
  description text not null default '',
  note text not null default '',
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ─── Skills ─────────────────────────────────────────────────────────────
create table if not exists public.skill_groups (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.skills (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.skill_groups (id) on delete cascade,
  name text not null,
  level_label text not null default '',
  percent int not null default 80 check (percent between 0 and 100),
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ─── Blog posts ─────────────────────────────────────────────────────────
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text not null default '',
  content_md text not null default '',
  cover_image text,
  tags text[] not null default '{}',
  status text not null default 'draft' check (status in ('draft', 'published')),
  published_at timestamptz,
  reading_minutes int not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists posts_status_published_idx on public.posts (status, published_at desc);

-- ─── Triggers + RLS for every content table ─────────────────────────────
do $$
declare
  t text;
begin
  foreach t in array array[
    'profile', 'experiences', 'projects', 'publications', 'certifications',
    'startups', 'skill_groups', 'skills', 'posts'
  ] loop
    execute format('drop trigger if exists %I_touch on public.%I', t, t);
    execute format(
      'create trigger %I_touch before update on public.%I for each row execute function public.touch_updated_at()',
      t, t
    );
    execute format('alter table public.%I enable row level security', t);
    execute format('drop policy if exists "admin write" on public.%I', t);
    execute format(
      'create policy "admin write" on public.%I for all using (public.is_admin()) with check (public.is_admin())',
      t
    );
  end loop;
end;
$$;

-- Public read: published rows only (admins see everything via "admin write").
create policy "public read" on public.profile for select using (true);
create policy "public read" on public.experiences for select using (published);
create policy "public read" on public.projects for select using (published);
create policy "public read" on public.publications for select using (published);
create policy "public read" on public.certifications for select using (published);
create policy "public read" on public.startups for select using (published);
create policy "public read" on public.skill_groups for select using (published);
create policy "public read" on public.skills for select using (published);
create policy "public read" on public.posts for select using (status = 'published');

-- ─── Storage: public "media" bucket, admin-only writes ──────────────────
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do update set public = true;

create policy "media public read" on storage.objects
  for select using (bucket_id = 'media');
create policy "media admin insert" on storage.objects
  for insert with check (bucket_id = 'media' and public.is_admin());
create policy "media admin update" on storage.objects
  for update using (bucket_id = 'media' and public.is_admin());
create policy "media admin delete" on storage.objects
  for delete using (bucket_id = 'media' and public.is_admin());
