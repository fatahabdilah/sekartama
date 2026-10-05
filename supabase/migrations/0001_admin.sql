-- Schema for the Sekar Tama admin panel.
-- Run this once in Supabase → SQL Editor, then run supabase/seed.sql to import the current site content.

-- Admins ---------------------------------------------------------------------
-- Only users listed here can write content. Add one after creating the user in
-- Authentication → Users:  insert into public.admins (user_id) values ('<user uuid>');
create table if not exists public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

-- Content --------------------------------------------------------------------
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  date date not null default current_date,
  excerpt text not null default '',
  content text not null default '',
  image_url text not null default '',
  image_width int not null default 1200,
  image_height int not null default 800,
  comments int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.product_categories (
  slug text primary key,
  title text not null,
  meta_description text not null default '',
  sort_order int not null default 0
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  category_slug text not null references public.product_categories (slug) on update cascade,
  name text not null,
  description text not null default '',
  price text not null default '',
  price_size text not null default '',
  images text[] not null default '{}',
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  location text not null default '',
  image text not null default '',
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- Key/value settings: 'contact' and 'chat'. Never store secrets here — it is publicly readable.
create table if not exists public.settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

-- Row level security ---------------------------------------------------------
alter table public.admins enable row level security;
alter table public.posts enable row level security;
alter table public.product_categories enable row level security;
alter table public.products enable row level security;
alter table public.projects enable row level security;
alter table public.settings enable row level security;

drop policy if exists "admins read self" on public.admins;
create policy "admins read self" on public.admins for select using (user_id = auth.uid());

drop policy if exists "public read published posts" on public.posts;
create policy "public read published posts" on public.posts for select using (published or public.is_admin());
drop policy if exists "admin write posts" on public.posts;
create policy "admin write posts" on public.posts for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "public read categories" on public.product_categories;
create policy "public read categories" on public.product_categories for select using (true);
drop policy if exists "admin write categories" on public.product_categories;
create policy "admin write categories" on public.product_categories for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "public read products" on public.products;
create policy "public read products" on public.products for select using (true);
drop policy if exists "admin write products" on public.products;
create policy "admin write products" on public.products for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "public read projects" on public.projects;
create policy "public read projects" on public.projects for select using (true);
drop policy if exists "admin write projects" on public.projects;
create policy "admin write projects" on public.projects for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "public read settings" on public.settings;
create policy "public read settings" on public.settings for select using (true);
drop policy if exists "admin write settings" on public.settings;
create policy "admin write settings" on public.settings for all using (public.is_admin()) with check (public.is_admin());

-- Storage: public "media" bucket for uploaded images -------------------------
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do update set public = true;

drop policy if exists "admin upload media" on storage.objects;
create policy "admin upload media" on storage.objects for insert
  with check (bucket_id = 'media' and public.is_admin());
drop policy if exists "admin update media" on storage.objects;
create policy "admin update media" on storage.objects for update
  using (bucket_id = 'media' and public.is_admin());
drop policy if exists "admin delete media" on storage.objects;
create policy "admin delete media" on storage.objects for delete
  using (bucket_id = 'media' and public.is_admin());
