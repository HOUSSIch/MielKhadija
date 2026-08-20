create extension if not exists pgcrypto;

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  subtitle text default '',
  description text default '',
  format text not null default 'Pot de 500 g',
  price numeric(10,2) not null check (price >= 0),
  image_url text not null,
  display_order integer not null default 0,
  is_active boolean not null default true,
  is_new boolean not null default false,
  is_promo boolean not null default false,
  is_featured boolean not null default false,
  promo_price numeric(10,2) check (promo_price is null or promo_price >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.products enable row level security;
drop policy if exists "Public products are readable" on public.products;
create policy "Public products are readable" on public.products for select using (is_active = true or auth.role() = 'authenticated');
drop policy if exists "Authenticated users manage products" on public.products;
create policy "Authenticated users manage products" on public.products for all to authenticated using (true) with check (true);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('product-images','product-images',true,5242880,array['image/jpeg','image/png','image/webp'])
on conflict (id) do update set public=true, file_size_limit=5242880, allowed_mime_types=array['image/jpeg','image/png','image/webp'];

drop policy if exists "Public product images" on storage.objects;
create policy "Public product images" on storage.objects for select using (bucket_id='product-images');
drop policy if exists "Authenticated users upload product images" on storage.objects;
create policy "Authenticated users upload product images" on storage.objects for insert to authenticated with check (bucket_id='product-images');
drop policy if exists "Authenticated users update product images" on storage.objects;
create policy "Authenticated users update product images" on storage.objects for update to authenticated using (bucket_id='product-images');
drop policy if exists "Authenticated users delete product images" on storage.objects;
create policy "Authenticated users delete product images" on storage.objects for delete to authenticated using (bucket_id='product-images');
