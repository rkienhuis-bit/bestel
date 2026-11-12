-- i-Snex database schema (Supabase PostgreSQL)
-- Enable Anonymous Sign-Ins in Supabase Auth settings before using the app.
create extension if not exists pgcrypto;

create table if not exists public.restaurants (
  id text primary key,
  name text not null,
  active boolean not null default true,
  menu_source_url text,
  updated_at timestamptz not null default now()
);

create table if not exists public.menu_items (
  id uuid primary key default gen_random_uuid(),
  restaurant_id text not null references public.restaurants(id) on delete cascade,
  category text not null,
  name text not null,
  description text,
  price numeric(10,2) not null check (price >= 0),
  active boolean not null default true,
  sort_order integer not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  restaurant_id text not null references public.restaurants(id),
  employee_name text not null,
  items jsonb not null check (jsonb_typeof(items) = 'array'),
  total numeric(10,2) check (total >= 0),
  note text,
  status text not null default 'new' check (status in ('new','accepted','completed','cancelled','locked')),
  locked_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.user_roles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('manager','admin'))
);

create index if not exists orders_owner_created_idx on public.orders(owner_id, created_at desc);
create index if not exists orders_restaurant_created_idx on public.orders(restaurant_id, created_at desc);
create index if not exists menu_items_restaurant_idx on public.menu_items(restaurant_id, sort_order);

alter table public.restaurants enable row level security;
alter table public.menu_items enable row level security;
alter table public.orders enable row level security;
alter table public.user_roles enable row level security;

-- Public can read active restaurant and menu data.
drop policy if exists "Active restaurants are public" on public.restaurants;
create policy "Active restaurants are public" on public.restaurants for select using (active = true);
drop policy if exists "Active menu is public" on public.menu_items;
create policy "Active menu is public" on public.menu_items for select using (active = true);

-- Employees can only read and create their own orders.
drop policy if exists "Employees read own orders" on public.orders;
create policy "Employees read own orders" on public.orders for select to authenticated using (owner_id = auth.uid());
drop policy if exists "Employees create own orders" on public.orders;
create policy "Employees create own orders" on public.orders for insert to authenticated with check (owner_id = auth.uid());
drop policy if exists "Employees update own unlocked orders" on public.orders;
create policy "Employees update own unlocked orders" on public.orders for update to authenticated using (owner_id = auth.uid() and locked_at is null and status = 'new') with check (owner_id = auth.uid() and locked_at is null and status = 'new');

-- Manager/admin access. Role assignment is performed manually by the project owner.
drop policy if exists "Managers read all orders" on public.orders;
create policy "Managers read all orders" on public.orders for select to authenticated using (exists (select 1 from public.user_roles r where r.user_id = auth.uid() and r.role in ('manager','admin')));
drop policy if exists "Managers update orders" on public.orders;
create policy "Managers update orders" on public.orders for update to authenticated using (exists (select 1 from public.user_roles r where r.user_id = auth.uid() and r.role in ('manager','admin'))) with check (exists (select 1 from public.user_roles r where r.user_id = auth.uid() and r.role in ('manager','admin')));
drop policy if exists "Admins manage menu" on public.menu_items;
create policy "Admins manage menu" on public.menu_items for all to authenticated using (exists (select 1 from public.user_roles r where r.user_id = auth.uid() and r.role = 'admin')) with check (exists (select 1 from public.user_roles r where r.user_id = auth.uid() and r.role = 'admin'));
drop policy if exists "Admins manage restaurants" on public.restaurants;
create policy "Admins manage restaurants" on public.restaurants for all to authenticated using (exists (select 1 from public.user_roles r where r.user_id = auth.uid() and r.role = 'admin')) with check (exists (select 1 from public.user_roles r where r.user_id = auth.uid() and r.role = 'admin'));

insert into public.restaurants (id,name,menu_source_url) values
('specht','Cafetaria De Specht','https://cafetariadespecht.nl/wp-content/uploads/2025/03/Menukaart-Restaurant-2025.pdf'),
('bie','Bie Immink','https://bieimmink.nl/'),
('kebab','Kebab van Erhan','https://www.instagram.com/kebab_van_erhan/')
on conflict (id) do update set name=excluded.name,menu_source_url=excluded.menu_source_url;
