-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- BRANDS TABLE
-- Stores sources like "Terra Pro", "Selfie", or specific Telegram channels
create table public.brands (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  type text check (type in ('telegram', 'website', 'instagram')) not null,
  source_url text not null, -- e.g., https://t.me/terrapro
  logo_url text, -- optional logo for the brand
  is_active boolean default true
);

-- PRODUCTS TABLE
-- Stores individual items scraped from brands
create table public.products (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  brand_id uuid references public.brands(id) on delete cascade not null,
  
  title text, -- "Erkaklar ko'ylagi" (might be auto-generated)
  price text, -- "$50" or "500.000 so'm" (kept as text to handle currencies)
  
  image_url text not null, -- The core asset for VTON
  original_url text, -- Link back to the original post/product page
  
  category text check (category in ('upper_body', 'lower_body', 'dresses', 'shoes', 'accessory')),
  
  metadata jsonb default '{}'::jsonb, -- Store extra scraped info: sizes, colors, raw text
  
  embedding vector(1536) -- Future proofing for semantic search (AI Search)
);

-- Enable Row Level Security (RLS)
alter table public.brands enable row level security;
alter table public.products enable row level security;

-- Policies (Public Read, Authenticated Write)
create policy "Public brands are viewable by everyone." on public.brands for select using (true);
create policy "Public products are viewable by everyone." on public.products for select using (true);
