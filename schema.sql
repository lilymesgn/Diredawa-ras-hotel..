-- SQL Schema for Dire Dawa Ras Hotel Supabase Database
-- Run this script in your Supabase SQL Editor to create and populate the necessary tables.

-- ==========================================================
-- 1. Create Tables
-- ==========================================================

-- A. Categories Table
create table if not exists public.categories (
    id text primary key,
    name text not null,
    description text,
    slug text unique not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- B. Products (Services / Offerings / Rooms) Table
create table if not exists public.products (
    id text primary key,
    title text not null,
    description text,
    price numeric not null,
    image text,
    category_id text references public.categories(id) on delete set null,
    stock integer not null default 0,
    status text not null default 'In Stock',
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- C. Users (Internal Portal Personnel) Table
create table if not exists public.users (
    id text primary key,
    name text not null,
    email text unique not null,
    role text not null check (role in ('Admin', 'Editor', 'Viewer')),
    status text not null check (status in ('Active', 'Inactive')),
    avatar text,
    last_active text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- D. Settings (Storefront & Brand Metadata Configurations) Table
create table if not exists public.settings (
    id text primary key default 'site_config',
    site_name text not null,
    support_email text,
    banner_text text,
    maintenance_mode boolean default false,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    constraint only_one_config_row check (id = 'site_config') -- guarantees singleton config row
);

-- ==========================================================
-- 2. Indexes for High-Speed Queries
-- ==========================================================
create index if not exists idx_products_category on public.products(category_id);
create index if not exists idx_categories_slug on public.categories(slug);
create index if not exists idx_users_email on public.users(email);

-- ==========================================================
-- 3. Row Level Security (RLS) Configuration & Policies
-- ==========================================================

-- Enable Row Level Security (RLS) on all tables to keep data secure
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.users enable row level security;
alter table public.settings enable row level security;

-- Categories RLS Policies:
-- 1. Public user read: Allows both unauthenticated (anonymous) public visitors and admin readers.
create policy "Allow public read access for categories"
on public.categories for select
using (true);

-- 2. Temporary policy: Allow both selection and writes for admin client testing while setting up
create policy "Temp check development full access for categories"
on public.categories for all
using (true)
with check (true);


-- Products RLS Policies:
-- 1. Public user read
create policy "Allow public read access for products"
on public.products for select
using (true);

-- 2. Temporary Admin check
create policy "Temp check development full access for products"
on public.products for all
using (true)
with check (true);


-- Users RLS Policies:
-- 1. Selection for authorized users (allows admin panel listings)
create policy "Allow select access for users"
on public.users for select
using (true);

-- 2. Temporary development write
create policy "Temp check development full access for users"
on public.users for all
using (true)
with check (true);


-- Settings RLS Policies:
-- 1. Public storefront read access
create policy "Allow public select for settings"
on public.settings for select
using (true);

-- 2. Temporary Admin updates
create policy "Temp check development full access for settings"
on public.settings for all
using (true)
with check (true);


-- ==========================================================
-- 4. Seed Data Code for Dire Dawa Ras Hotel Experience
-- ==========================================================

-- Seed Categories
insert into public.categories (id, name, description, slug) values
('cat_1', 'Room Bookings', 'Coordinated suites and standard rooms optimized for business and leisure travelers alike.', 'room-bookings'),
('cat_2', 'Food & Beverage', 'Historic Ras Restaurant traditional dining, banqueting plans, and authentic hospitality.', 'food-beverage'),
('cat_3', 'Event Venues', 'Spacious corporate meeting chambers and reception halls with convenient city access.', 'event-venues'),
('cat_4', 'Wellness & Leisure', 'Restorative therapeutic steam baths, standard massage services, and local tours.', 'wellness-leisure')
on conflict (id) do nothing;

-- Seed Products (Offerings)
insert into public.products (id, title, description, price, image, category_id, stock, status) values
('prod_1', 'Executive Suite Booking', 'Generous executive suite in Kezira with king bed, luxury bath, writing desk, high-speed internet, and elegant city-center views.', 145.00, 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600&auto=format&fit=crop&q=60', 'cat_1', 6, 'In Stock'),
('prod_2', 'Standard Double Room', 'Comfortable twin beds room combining convenient access to Kezira city center with traditional Ethiopian hospitality and modern amenities.', 95.00, 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=600&auto=format&fit=crop&q=60', 'cat_1', 14, 'In Stock'),
('prod_3', 'Main Conference Ballroom', 'High-tech corporate meeting and events venue in Kezira District. Fully equipped with smart projectors, high-density audio, and banquet logistics.', 380.00, 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&auto=format&fit=crop&q=60', 'cat_3', 2, 'In Stock'),
('prod_4', 'Grand Ethiopian Dinner Buffet', 'Traditional daytime and dinner buffet service for resident guests and visitors at Ras Restaurant. Curated local organic recipes.', 30.00, 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=60', 'cat_2', 75, 'In Stock'),
('prod_5', 'Kezira Steam & Wellness Package', 'Restorative session at the spa including traditional steam bath, professional massage therapy, and natural oils.', 50.00, 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&auto=format&fit=crop&q=60', 'cat_4', 12, 'In Stock')
on conflict (id) do nothing;

-- Seed Portal Staff Users
insert into public.users (id, name, email, role, status, avatar, last_active) values
('user_1', 'Ermias Tadesse', 'ermias.t@diredawarashotel.com', 'Admin', 'Active', 'ET', 'Just now'),
('user_2', 'Selamawit Kebede', 'selamawit.k@diredawarashotel.com', 'Editor', 'Active', 'SK', '15 mins ago'),
('user_3', 'Yonas Tesfaye', 'yonas.t@diredawarashotel.com', 'Viewer', 'Inactive', 'YT', '3 days ago')
on conflict (id) do nothing;

-- Seed Settings Config Row
insert into public.settings (id, site_name, support_email, banner_text, maintenance_mode) values
('site_config', 'Dire Dawa Ras Hotel', 'ddrashotel1@gmail.com', 'Welcome to Dire Dawa Ras Hotel! Enjoy coordinate suites & traditional hospitality since 1964 EC in Kezira, Ethiopia. "Stay a cool place in warmer city".', false)
on conflict (id) do nothing;
