alter table public.products add column if not exists is_new boolean not null default false;
alter table public.products add column if not exists is_promo boolean not null default false;
alter table public.products add column if not exists is_featured boolean not null default false;
alter table public.products add column if not exists promo_price numeric(10,2);
alter table public.products drop constraint if exists products_promo_price_check;
alter table public.products add constraint products_promo_price_check check (promo_price is null or promo_price >= 0);
