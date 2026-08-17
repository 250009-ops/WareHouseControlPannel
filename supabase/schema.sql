-- Ombor Nazorati — run this in the Supabase SQL editor.

create extension if not exists "pgcrypto";

create table if not exists public.products (
  id text primary key,
  name text not null,
  brand text not null,
  size text not null,
  color text not null,
  "chinaUsd" numeric not null default 0,
  "cargoUsd" numeric not null default 0,
  "costUzs" integer not null default 0,
  "sellUzs" integer not null default 0,
  "soldUzs" integer,
  status text not null default 'Sotilmagan',
  debt text not null default 'To''lanmagan',
  image text,
  "imageName" text,
  created_at timestamptz not null default now()
);

create table if not exists public.sales (
  id text primary key,
  date text not null,
  "productId" text not null references public.products(id) on delete cascade,
  quantity integer not null default 1,
  "sellPrice" integer not null default 0,
  "soldPrice" integer not null default 0,
  "paymentType" text not null,
  customer text not null,
  status text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.debts (
  id text primary key,
  debtor text not null,
  phone text not null,
  "productId" text not null references public.products(id) on delete cascade,
  amount integer not null default 0,
  "issuedAt" text not null,
  "dueAt" text not null,
  paid integer not null default 0,
  status text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.admins (
  id text primary key,
  "firstName" text not null,
  "lastName" text not null,
  email text not null unique,
  phone text,
  role text not null,
  status text not null,
  "joinedAt" text not null,
  avatar text,
  created_at timestamptz not null default now()
);

create table if not exists public.settings (
  id integer primary key default 1,
  "firstName" text,
  "lastName" text,
  email text,
  phone text,
  role text,
  avatar text,
  "companyName" text,
  "companyAddress" text,
  "usdRate" integer not null default 12700,
  "rateUpdatedAt" text,
  "notifySales" boolean default true,
  "notifyDebts" boolean default true,
  "notifyLowStock" boolean default false
);

alter table public.products enable row level security;
alter table public.sales enable row level security;
alter table public.debts enable row level security;
alter table public.admins enable row level security;
alter table public.settings enable row level security;

create policy "authenticated read products" on public.products for select to authenticated using (true);
create policy "authenticated write products" on public.products for all to authenticated using (true) with check (true);
create policy "authenticated read sales" on public.sales for select to authenticated using (true);
create policy "authenticated write sales" on public.sales for all to authenticated using (true) with check (true);
create policy "authenticated read debts" on public.debts for select to authenticated using (true);
create policy "authenticated write debts" on public.debts for all to authenticated using (true) with check (true);
create policy "authenticated read admins" on public.admins for select to authenticated using (true);
create policy "authenticated write admins" on public.admins for all to authenticated using (true) with check (true);
create policy "authenticated read settings" on public.settings for select to authenticated using (true);
create policy "authenticated write settings" on public.settings for all to authenticated using (true) with check (true);

-- After Auth is enabled, create the panel user in Authentication > Users:
-- email: makatbcounselor@gmail.com
-- password: 13-makatbcounselor
-- Confirm the email so sign-in works immediately.
