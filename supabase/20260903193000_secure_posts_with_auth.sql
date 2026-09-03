-- Fieldnotes: secure posts with Supabase Auth
-- Public readers may SELECT. Only authenticated users may INSERT/UPDATE/DELETE.

create extension if not exists pgcrypto;

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null,
  date date not null default current_date,
  excerpt text not null,
  body jsonb not null default '[]'::jsonb,
  image text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists posts_date_idx on public.posts (date desc);
create index if not exists posts_category_idx on public.posts (category);

create or replace function public.set_posts_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists posts_set_updated_at on public.posts;
create trigger posts_set_updated_at
before update on public.posts
for each row execute function public.set_posts_updated_at();

alter table public.posts enable row level security;

-- Remove the old broad policies if this migration is being applied over the
-- earlier insecure version.
drop policy if exists "Public can read posts" on public.posts;
drop policy if exists "Anyone can insert posts" on public.posts;
drop policy if exists "Anyone can update posts" on public.posts;
drop policy if exists "Anyone can delete posts" on public.posts;
drop policy if exists "Authenticated users can insert posts" on public.posts;
drop policy if exists "Authenticated users can update posts" on public.posts;
drop policy if exists "Authenticated users can delete posts" on public.posts;

create policy "Public can read posts"
on public.posts
for select
to anon, authenticated
using (true);

create policy "Authenticated users can insert posts"
on public.posts
for insert
to authenticated
with check (true);

create policy "Authenticated users can update posts"
on public.posts
for update
to authenticated
using (true)
with check (true);

create policy "Authenticated users can delete posts"
on public.posts
for delete
to authenticated
using (true);

grant select on public.posts to anon, authenticated;
grant insert, update, delete on public.posts to authenticated;
