-- ====================================================================
-- SUPABASE SCHEMA MIGRATION: login_details TABLE & TRIGGER
-- ====================================================================
-- Instructions: Copy and paste this script into your Supabase Dashboard -> SQL Editor and click "Run".

-- 1. Create the login_details table
create table if not exists public.login_details (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null unique,
  full_name text,
  email text not null,
  phone_number text,
  is_email_verified boolean default false,
  is_phone_verified boolean default false,
  is_active boolean default true,
  status text default 'active',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Ensure column exists if table was created previously
alter table public.login_details add column if not exists is_active boolean default true;
alter table public.login_details add column if not exists status text default 'active';

-- 2. Enable Row Level Security (RLS)
alter table public.login_details enable row level security;

-- 3. Row Level Security Policies
drop policy if exists "Users can view own login details" on public.login_details;
create policy "Users can view own login details"
  on public.login_details for select
  using (auth.uid() = user_id);

drop policy if exists "Users can update own login details" on public.login_details;
create policy "Users can update own login details"
  on public.login_details for update
  using (auth.uid() = user_id);

drop policy if exists "Users can insert own login details" on public.login_details;
create policy "Users can insert own login details"
  on public.login_details for insert
  with check (auth.uid() = user_id);

-- 4. Automatic Trigger Function: Syncs auth.users directly with login_details
create or replace function public.handle_new_user_login_details()
returns trigger as $$
begin
  insert into public.login_details (
    user_id,
    email,
    full_name,
    phone_number,
    is_email_verified,
    is_phone_verified,
    is_active,
    status
  )
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.phone, new.raw_user_meta_data->>'phone_number', ''),
    case when new.email_confirmed_at is not null then true else false end,
    case when new.phone_confirmed_at is not null then true else false end,
    true,
    'active'
  )
  on conflict (user_id) do update set
    email = excluded.email,
    full_name = coalesce(excluded.full_name, public.login_details.full_name),
    phone_number = coalesce(excluded.phone_number, public.login_details.phone_number),
    is_email_verified = excluded.is_email_verified,
    is_phone_verified = excluded.is_phone_verified,
    is_active = coalesce(public.login_details.is_active, true),
    status = coalesce(public.login_details.status, 'active'),
    updated_at = now();
  return new;
end;
$$ language plpgsql security definer;

-- 5. Attach trigger to auth.users table
drop trigger if exists on_auth_user_created_login_details on auth.users;
create trigger on_auth_user_created_login_details
  after insert or update on auth.users
  for each row execute function public.handle_new_user_login_details();
