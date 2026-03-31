create extension if not exists "pgcrypto";

do $$
begin
  if not exists (
    select 1
    from pg_type
    where typname = 'user_role'
  ) then
    create type public.user_role as enum ('admin', 'provider', 'client');
  end if;

  if not exists (
    select 1
    from pg_type
    where typname = 'booking_status'
  ) then
    create type public.booking_status as enum (
      'pending',
      'confirmed',
      'completed',
      'cancelled'
    );
  end if;

  if not exists (
    select 1
    from pg_type
    where typname = 'subscription_plan'
  ) then
    create type public.subscription_plan as enum ('basic', 'pro', 'premium');
  end if;

  if not exists (
    select 1
    from pg_type
    where typname = 'conversation_status'
  ) then
    create type public.conversation_status as enum ('open', 'closed');
  end if;

  if not exists (
    select 1
    from pg_type
    where typname = 'conversation_message_kind'
  ) then
    create type public.conversation_message_kind as enum ('text', 'system', 'whatsapp_request', 'whatsapp_share');
  end if;

  if not exists (
    select 1
    from pg_type
    where typname = 'job_status'
  ) then
    create type public.job_status as enum (
      'open',
      'has_bids',
      'in_progress',
      'completed',
      'cancelled',
      'expired'
    );
  end if;

  if not exists (
    select 1
    from pg_type
    where typname = 'job_bid_status'
  ) then
    create type public.job_bid_status as enum (
      'submitted',
      'accepted',
      'rejected',
      'withdrawn'
    );
  end if;
end $$;

create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create or replace function public.slugify(input text)
returns text
language sql
immutable
as $$
  select trim(both '-' from regexp_replace(
    lower(
      translate(
        coalesce(input, ''),
        'áàãâäéèêëíìîïóòõôöúùûüçÁÀÃÂÄÉÈÊËÍÌÎÏÓÒÕÔÖÚÙÛÜÇ',
        'aaaaaeeeeiiiiooooouuuucaaaaaeeeeiiiiooooouuuuc'
      )
    ),
    '[^a-z0-9]+',
    '-',
    'g'
  ));
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  new_role public.user_role;
  new_display_name text;
begin
  new_role := coalesce((new.raw_user_meta_data ->> 'role')::public.user_role, 'client');
  new_display_name := coalesce(
    nullif(new.raw_user_meta_data ->> 'display_name', ''),
    nullif(new.raw_user_meta_data ->> 'full_name', ''),
    split_part(new.email, '@', 1)
  );

  insert into public.profiles (
    id,
    full_name,
    email,
    phone,
    role
  )
  values (
    new.id,
    coalesce(nullif(new.raw_user_meta_data ->> 'full_name', ''), new.email),
    new.email,
    nullif(new.raw_user_meta_data ->> 'phone', ''),
    new_role
  )
  on conflict (id) do update
  set
    full_name = excluded.full_name,
    email = excluded.email,
    phone = excluded.phone,
    role = excluded.role;

  if new_role = 'provider' then
    insert into public.provider_profiles (
      profile_id,
      display_name
    )
    values (
      new.id,
      new_display_name
    )
    on conflict (profile_id) do update
    set display_name = excluded.display_name;
  end if;

  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null unique,
  phone text,
  avatar_url text,
  role public.user_role not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create or replace function public.get_my_role()
returns public.user_role
language sql
stable
security definer
set search_path = public
as $$
  select p.role
  from public.profiles p
  where p.id = auth.uid()
  limit 1
$$;

create or replace function public.is_job_bid_provider(job_uuid uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.job_bids jb
    join public.provider_profiles pp on pp.id = jb.provider_profile_id
    where jb.job_id = job_uuid
      and pp.profile_id = auth.uid()
  )
$$;

create table if not exists public.provider_profiles (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null unique references public.profiles(id) on delete cascade,
  display_name text not null,
  public_slug text,
  bio text,
  city text,
  state text,
  whatsapp_number text,
  is_verified boolean not null default false,
  plan public.subscription_plan not null default 'basic',
  stripe_customer_id text,
  stripe_subscription_id text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.subscription_limits (
  plan public.subscription_plan primary key,
  max_services integer not null check (max_services > 0),
  max_quote_requests_per_month integer check (
    max_quote_requests_per_month is null
    or max_quote_requests_per_month > 0
  )
);

alter table public.subscription_limits
add column if not exists max_quote_requests_per_month integer check (
  max_quote_requests_per_month is null
  or max_quote_requests_per_month > 0
);

insert into public.subscription_limits (plan, max_services, max_quote_requests_per_month)
values
  ('basic', 3, 50),
  ('pro', 10, 150),
  ('premium', 999, null)
on conflict (plan) do update
set
  max_services = excluded.max_services,
  max_quote_requests_per_month = excluded.max_quote_requests_per_month;

create table if not exists public.service_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  provider_profile_id uuid not null references public.provider_profiles(id) on delete cascade,
  category_id uuid references public.service_categories(id) on delete set null,
  title text not null,
  slug text not null unique,
  description text not null,
  cover_image_url text,
  price_cents integer not null check (price_cents >= 0),
  duration_minutes integer not null check (duration_minutes > 0),
  is_active boolean not null default true,
  featured_rank integer,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.service_availability (
  id uuid primary key default gen_random_uuid(),
  service_id uuid not null references public.services(id) on delete cascade,
  start_at timestamptz not null,
  end_at timestamptz not null,
  is_available boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  check (end_at > start_at)
);

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  service_id uuid not null references public.services(id) on delete cascade,
  client_id uuid not null references public.profiles(id) on delete cascade,
  provider_profile_id uuid not null references public.provider_profiles(id) on delete cascade,
  status public.booking_status not null default 'pending',
  scheduled_start timestamptz not null,
  scheduled_end timestamptz not null,
  total_price_cents integer not null check (total_price_cents >= 0),
  notes text,
  stripe_payment_intent_id text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  check (scheduled_end > scheduled_start)
);

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null unique references public.bookings(id) on delete cascade,
  service_id uuid not null references public.services(id) on delete cascade,
  client_id uuid not null references public.profiles(id) on delete cascade,
  provider_profile_id uuid not null references public.provider_profiles(id) on delete cascade,
  rating integer not null check (rating between 1 and 5),
  comment text,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.client_reviews (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null unique references public.bookings(id) on delete cascade,
  client_id uuid not null references public.profiles(id) on delete cascade,
  provider_profile_id uuid not null references public.provider_profiles(id) on delete cascade,
  rating integer not null check (rating between 1 and 5),
  comment text,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  service_id uuid not null references public.services(id) on delete cascade,
  booking_id uuid references public.bookings(id) on delete set null,
  client_id uuid not null references public.profiles(id) on delete cascade,
  provider_profile_id uuid not null references public.provider_profiles(id) on delete cascade,
  status public.conversation_status not null default 'open',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.jobs (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.profiles(id) on delete cascade,
  category_id uuid references public.service_categories(id) on delete set null,
  title text not null,
  slug text not null unique,
  description text not null,
  city text not null,
  neighborhood text,
  budget_min_cents integer check (budget_min_cents is null or budget_min_cents >= 0),
  budget_max_cents integer check (budget_max_cents is null or budget_max_cents >= 0),
  desired_deadline_at timestamptz,
  status public.job_status not null default 'open',
  expires_at timestamptz not null default (timezone('utc', now()) + interval '72 hours'),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  check (budget_max_cents is null or budget_min_cents is null or budget_max_cents >= budget_min_cents)
);

create table if not exists public.job_bids (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references public.jobs(id) on delete cascade,
  provider_profile_id uuid not null references public.provider_profiles(id) on delete cascade,
  amount_cents integer not null check (amount_cents >= 0),
  estimated_days integer check (estimated_days is null or estimated_days > 0),
  message text not null,
  status public.job_bid_status not null default 'submitted',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (job_id, provider_profile_id)
);

create table if not exists public.job_bid_credit_purchases (
  id uuid primary key default gen_random_uuid(),
  provider_profile_id uuid not null references public.provider_profiles(id) on delete cascade,
  credits_total integer not null check (credits_total > 0),
  credits_used integer not null default 0 check (
    credits_used >= 0
    and credits_used <= credits_total
  ),
  amount_cents integer not null check (amount_cents > 0),
  status text not null default 'prototype_paid',
  payment_reference text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create or replace function public.get_provider_job_bid_allowance(provider_profile_uuid uuid)
returns table (
  free_daily_limit integer,
  free_used_today integer,
  free_remaining_today integer,
  paid_pack_size integer,
  paid_pack_price_cents integer,
  paid_credits_available integer
)
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  provider_owner_id uuid;
  viewer_role public.user_role;
begin
  viewer_role := public.get_my_role();

  select pp.profile_id
  into provider_owner_id
  from public.provider_profiles pp
  where pp.id = provider_profile_uuid;

  if provider_owner_id is null then
    raise exception 'provider_profile_not_found';
  end if;

  if viewer_role <> 'admin' and provider_owner_id <> auth.uid() then
    raise exception 'provider_not_allowed';
  end if;

  return query
  with pricing as (
    select
      5::integer as free_daily_limit,
      20::integer as paid_pack_size,
      1000::integer as paid_pack_price_cents
  ),
  daily_usage as (
    select count(*)::integer as free_used_today
    from public.job_bids jb
    where jb.provider_profile_id = provider_profile_uuid
      and (jb.created_at at time zone 'America/Sao_Paulo')::date
        = timezone('America/Sao_Paulo', now())::date
  ),
  paid_balance as (
    select coalesce(sum(jbcp.credits_total - jbcp.credits_used), 0)::integer
      as paid_credits_available
    from public.job_bid_credit_purchases jbcp
    where jbcp.provider_profile_id = provider_profile_uuid
      and jbcp.status in ('paid', 'prototype_paid')
  )
  select
    pricing.free_daily_limit,
    daily_usage.free_used_today,
    greatest(pricing.free_daily_limit - daily_usage.free_used_today, 0)::integer
      as free_remaining_today,
    pricing.paid_pack_size,
    pricing.paid_pack_price_cents,
    paid_balance.paid_credits_available
  from pricing
  cross join daily_usage
  cross join paid_balance;
end;
$$;

create or replace function public.submit_provider_job_bid(
  job_uuid uuid,
  provider_profile_uuid uuid,
  amount_cents_input integer,
  estimated_days_input integer,
  message_input text
)
returns table (
  bid_id uuid,
  job_slug text,
  was_existing_bid boolean,
  used_free_allowance boolean,
  free_remaining_today integer,
  paid_credits_remaining integer,
  purchased_new_pack boolean,
  pack_price_cents integer
)
language plpgsql
security definer
set search_path = public
as $$
declare
  free_limit constant integer := 5;
  paid_pack_size_value constant integer := 20;
  paid_pack_price_value constant integer := 1000;
  provider_owner_id uuid;
  viewer_role public.user_role;
  job_record public.jobs%rowtype;
  existing_bid_id uuid;
  consumed_free_today integer := 0;
  paid_pack_record public.job_bid_credit_purchases%rowtype;
  allowance_record record;
  trimmed_message text;
begin
  viewer_role := public.get_my_role();
  trimmed_message := trim(coalesce(message_input, ''));

  if amount_cents_input is null or amount_cents_input < 0 then
    raise exception 'invalid_amount';
  end if;

  if estimated_days_input is not null and estimated_days_input <= 0 then
    raise exception 'invalid_estimated_days';
  end if;

  if trimmed_message = '' then
    raise exception 'invalid_message';
  end if;

  select pp.profile_id
  into provider_owner_id
  from public.provider_profiles pp
  where pp.id = provider_profile_uuid
  for update;

  if provider_owner_id is null then
    raise exception 'provider_profile_not_found';
  end if;

  if viewer_role <> 'admin' and provider_owner_id <> auth.uid() then
    raise exception 'provider_not_allowed';
  end if;

  select *
  into job_record
  from public.jobs j
  where j.id = job_uuid
  for update;

  if job_record.id is null then
    raise exception 'job_not_found';
  end if;

  if viewer_role <> 'admin' and job_record.client_id = auth.uid() then
    raise exception 'own_job_bid_not_allowed';
  end if;

  if job_record.status not in ('open', 'has_bids')
    or job_record.expires_at <= timezone('utc', now()) then
    raise exception 'job_closed';
  end if;

  select jb.id
  into existing_bid_id
  from public.job_bids jb
  where jb.job_id = job_uuid
    and jb.provider_profile_id = provider_profile_uuid
  for update;

  if existing_bid_id is not null then
    update public.job_bids
    set
      amount_cents = amount_cents_input,
      estimated_days = estimated_days_input,
      message = trimmed_message,
      status = 'submitted',
      updated_at = timezone('utc', now())
    where id = existing_bid_id;

    select *
    into allowance_record
    from public.get_provider_job_bid_allowance(provider_profile_uuid);

    return query
    select
      existing_bid_id,
      job_record.slug,
      true,
      false,
      allowance_record.free_remaining_today,
      allowance_record.paid_credits_available,
      false,
      paid_pack_price_value;
    return;
  end if;

  select count(*)::integer
  into consumed_free_today
  from public.job_bids jb
  where jb.provider_profile_id = provider_profile_uuid
    and (jb.created_at at time zone 'America/Sao_Paulo')::date
      = timezone('America/Sao_Paulo', now())::date;

  if consumed_free_today < free_limit then
    used_free_allowance := true;
    purchased_new_pack := false;
  else
    used_free_allowance := false;

    select *
    into paid_pack_record
    from public.job_bid_credit_purchases jbcp
    where jbcp.provider_profile_id = provider_profile_uuid
      and jbcp.status in ('paid', 'prototype_paid')
      and jbcp.credits_used < jbcp.credits_total
    order by jbcp.created_at asc
    limit 1
    for update;

    if paid_pack_record.id is null then
      insert into public.job_bid_credit_purchases (
        provider_profile_id,
        credits_total,
        credits_used,
        amount_cents,
        status
      )
      values (
        provider_profile_uuid,
        paid_pack_size_value,
        0,
        paid_pack_price_value,
        'prototype_paid'
      )
      returning *
      into paid_pack_record;

      purchased_new_pack := true;
    else
      purchased_new_pack := false;
    end if;

    update public.job_bid_credit_purchases
    set
      credits_used = credits_used + 1,
      updated_at = timezone('utc', now())
    where id = paid_pack_record.id;
  end if;

  insert into public.job_bids (
    job_id,
    provider_profile_id,
    amount_cents,
    estimated_days,
    message,
    status
  )
  values (
    job_uuid,
    provider_profile_uuid,
    amount_cents_input,
    estimated_days_input,
    trimmed_message,
    'submitted'
  )
  returning id
  into bid_id;

  select *
  into allowance_record
  from public.get_provider_job_bid_allowance(provider_profile_uuid);

  return query
  select
    bid_id,
    job_record.slug,
    false,
    used_free_allowance,
    allowance_record.free_remaining_today,
    allowance_record.paid_credits_available,
    purchased_new_pack,
    paid_pack_price_value;
end;
$$;

alter table public.jobs
add column if not exists hired_bid_id uuid references public.job_bids(id) on delete set null;

create table if not exists public.conversation_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  kind public.conversation_message_kind not null default 'text',
  body text,
  created_at timestamptz not null default timezone('utc', now()),
  check (kind <> 'text' or body is not null)
);

create index if not exists conversations_updated_at_idx
on public.conversations(updated_at desc);

create index if not exists conversation_messages_conversation_created_idx
on public.conversation_messages(conversation_id, created_at);

create index if not exists jobs_status_expires_at_idx
on public.jobs(status, expires_at desc);

create index if not exists jobs_client_created_at_idx
on public.jobs(client_id, created_at desc);

create index if not exists job_bids_job_created_at_idx
on public.job_bids(job_id, created_at desc);

create index if not exists job_bids_provider_created_at_idx
on public.job_bids(provider_profile_id, created_at desc);

create index if not exists job_bid_credit_purchases_provider_created_at_idx
on public.job_bid_credit_purchases(provider_profile_id, created_at desc);

create table if not exists public.whatsapp_request_charges (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  client_id uuid not null references public.profiles(id) on delete cascade,
  amount_cents integer not null check (amount_cents > 0),
  status text not null default 'paid',
  payment_reference text,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.email_logs (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid references public.bookings(id) on delete set null,
  recipient_email text not null,
  template_key text not null,
  provider text not null default 'sendgrid',
  status text not null default 'queued',
  created_at timestamptz not null default timezone('utc', now())
);

insert into storage.buckets (id, name, public)
values ('service-images', 'service-images', true)
on conflict (id) do nothing;

alter table public.provider_profiles add column if not exists public_slug text;
alter table public.provider_profiles add column if not exists whatsapp_number text;

update public.provider_profiles
set
  public_slug = coalesce(
    nullif(public_slug, ''),
    public.slugify(display_name || '-' || left(id::text, 8))
  ),
  whatsapp_number = coalesce(whatsapp_number, null)
where public_slug is null
   or public_slug = '';

create unique index if not exists provider_profiles_public_slug_key
on public.provider_profiles(public_slug)
where public_slug is not null;

create or replace function public.enforce_service_limit()
returns trigger
language plpgsql
as $$
declare
  active_services_count integer;
  allowed_services integer;
begin
  select count(*)
  into active_services_count
  from public.services
  where provider_profile_id = new.provider_profile_id
    and is_active = true
    and (tg_op = 'INSERT' or id <> new.id);

  select sl.max_services
  into allowed_services
  from public.provider_profiles pp
  join public.subscription_limits sl on sl.plan = pp.plan
  where pp.id = new.provider_profile_id;

  if new.is_active = true and active_services_count >= allowed_services then
    raise exception 'Service limit reached for provider plan';
  end if;

  return new;
end;
$$;

drop trigger if exists services_limit_trigger on public.services;
create trigger services_limit_trigger
before insert or update on public.services
for each row
execute function public.enforce_service_limit();

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row
execute function public.handle_updated_at();

drop trigger if exists provider_profiles_set_updated_at on public.provider_profiles;
create trigger provider_profiles_set_updated_at
before update on public.provider_profiles
for each row
execute function public.handle_updated_at();

drop trigger if exists services_set_updated_at on public.services;
create trigger services_set_updated_at
before update on public.services
for each row
execute function public.handle_updated_at();

drop trigger if exists bookings_set_updated_at on public.bookings;
create trigger bookings_set_updated_at
before update on public.bookings
for each row
execute function public.handle_updated_at();

drop trigger if exists conversations_set_updated_at on public.conversations;
create trigger conversations_set_updated_at
before update on public.conversations
for each row
execute function public.handle_updated_at();

drop trigger if exists jobs_set_updated_at on public.jobs;
create trigger jobs_set_updated_at
before update on public.jobs
for each row
execute function public.handle_updated_at();

drop trigger if exists job_bids_set_updated_at on public.job_bids;
create trigger job_bids_set_updated_at
before update on public.job_bids
for each row
execute function public.handle_updated_at();

drop trigger if exists job_bid_credit_purchases_set_updated_at on public.job_bid_credit_purchases;
create trigger job_bid_credit_purchases_set_updated_at
before update on public.job_bid_credit_purchases
for each row
execute function public.handle_updated_at();

create or replace function public.touch_conversation_on_message()
returns trigger
language plpgsql
as $$
begin
  update public.conversations
  set updated_at = timezone('utc', now())
  where id = new.conversation_id;

  return new;
end;
$$;

drop trigger if exists conversation_messages_touch_conversation on public.conversation_messages;
create trigger conversation_messages_touch_conversation
after insert on public.conversation_messages
for each row
execute function public.touch_conversation_on_message();

create or replace function public.touch_job_on_bid()
returns trigger
language plpgsql
as $$
begin
  update public.jobs
  set
    status = case
      when status = 'open' then 'has_bids'::public.job_status
      else status
    end,
    updated_at = timezone('utc', now())
  where id = new.job_id;

  return new;
end;
$$;

drop trigger if exists job_bids_touch_job on public.job_bids;
create trigger job_bids_touch_job
after insert on public.job_bids
for each row
execute function public.touch_job_on_bid();

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.provider_profiles enable row level security;
alter table public.services enable row level security;
alter table public.service_categories enable row level security;
alter table public.service_availability enable row level security;
alter table public.bookings enable row level security;
alter table public.reviews enable row level security;
alter table public.client_reviews enable row level security;
alter table public.conversations enable row level security;
alter table public.conversation_messages enable row level security;
alter table public.jobs enable row level security;
alter table public.job_bids enable row level security;
alter table public.job_bid_credit_purchases enable row level security;
alter table public.whatsapp_request_charges enable row level security;
alter table public.email_logs enable row level security;
alter table public.subscription_limits enable row level security;

drop policy if exists "profiles_select_own_or_admin" on public.profiles;
create policy "profiles_select_own_or_admin"
on public.profiles
for select
using (id = auth.uid() or public.get_my_role() = 'admin');

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
on public.profiles
for insert
with check (id = auth.uid());

drop policy if exists "profiles_update_own_or_admin" on public.profiles;
create policy "profiles_update_own_or_admin"
on public.profiles
for update
using (id = auth.uid() or public.get_my_role() = 'admin')
with check (id = auth.uid() or public.get_my_role() = 'admin');

drop policy if exists "provider_profiles_public_read" on public.provider_profiles;
create policy "provider_profiles_public_read"
on public.provider_profiles
for select
using (true);

drop policy if exists "provider_profiles_manage_own_or_admin" on public.provider_profiles;
create policy "provider_profiles_manage_own_or_admin"
on public.provider_profiles
for all
using (
  profile_id = auth.uid()
  or public.get_my_role() = 'admin'
)
with check (
  profile_id = auth.uid()
  or public.get_my_role() = 'admin'
);

drop policy if exists "subscription_limits_public_read" on public.subscription_limits;
create policy "subscription_limits_public_read"
on public.subscription_limits
for select
using (true);

drop policy if exists "service_categories_public_read" on public.service_categories;
create policy "service_categories_public_read"
on public.service_categories
for select
using (true);

drop policy if exists "service_categories_admin_write" on public.service_categories;
create policy "service_categories_admin_write"
on public.service_categories
for all
using (public.get_my_role() = 'admin')
with check (public.get_my_role() = 'admin');

drop policy if exists "services_public_read_active" on public.services;
create policy "services_public_read_active"
on public.services
for select
using (
  is_active = true
  or public.get_my_role() = 'admin'
  or exists (
    select 1
    from public.provider_profiles pp
    where pp.id = provider_profile_id
      and pp.profile_id = auth.uid()
  )
);

drop policy if exists "services_provider_insert" on public.services;
create policy "services_provider_insert"
on public.services
for insert
with check (
  public.get_my_role() in ('provider', 'admin')
  and exists (
    select 1
    from public.provider_profiles pp
    where pp.id = provider_profile_id
      and (pp.profile_id = auth.uid() or public.get_my_role() = 'admin')
  )
);

drop policy if exists "services_provider_update" on public.services;
create policy "services_provider_update"
on public.services
for update
using (
  exists (
    select 1
    from public.provider_profiles pp
    where pp.id = provider_profile_id
      and (pp.profile_id = auth.uid() or public.get_my_role() = 'admin')
  )
)
with check (
  exists (
    select 1
    from public.provider_profiles pp
    where pp.id = provider_profile_id
      and (pp.profile_id = auth.uid() or public.get_my_role() = 'admin')
  )
);

drop policy if exists "service_availability_public_read" on public.service_availability;
create policy "service_availability_public_read"
on public.service_availability
for select
using (true);

drop policy if exists "service_availability_provider_manage" on public.service_availability;
create policy "service_availability_provider_manage"
on public.service_availability
for all
using (
  exists (
    select 1
    from public.services s
    join public.provider_profiles pp on pp.id = s.provider_profile_id
    where s.id = service_id
      and (pp.profile_id = auth.uid() or public.get_my_role() = 'admin')
  )
)
with check (
  exists (
    select 1
    from public.services s
    join public.provider_profiles pp on pp.id = s.provider_profile_id
    where s.id = service_id
      and (pp.profile_id = auth.uid() or public.get_my_role() = 'admin')
  )
);

drop policy if exists "bookings_client_provider_admin_read" on public.bookings;
create policy "bookings_client_provider_admin_read"
on public.bookings
for select
using (
  client_id = auth.uid()
  or public.get_my_role() = 'admin'
  or exists (
    select 1
    from public.provider_profiles pp
    where pp.id = provider_profile_id
      and pp.profile_id = auth.uid()
  )
);

drop policy if exists "bookings_client_insert" on public.bookings;
create policy "bookings_client_insert"
on public.bookings
for insert
with check (
  client_id = auth.uid()
  and public.get_my_role() in ('client', 'admin')
);

drop policy if exists "bookings_client_provider_update" on public.bookings;
create policy "bookings_client_provider_update"
on public.bookings
for update
using (
  client_id = auth.uid()
  or public.get_my_role() = 'admin'
  or exists (
    select 1
    from public.provider_profiles pp
    where pp.id = provider_profile_id
      and pp.profile_id = auth.uid()
  )
)
with check (
  client_id = auth.uid()
  or public.get_my_role() = 'admin'
  or exists (
    select 1
    from public.provider_profiles pp
    where pp.id = provider_profile_id
      and pp.profile_id = auth.uid()
  )
);

drop policy if exists "reviews_public_read" on public.reviews;
create policy "reviews_public_read"
on public.reviews
for select
using (true);

drop policy if exists "reviews_client_insert_own" on public.reviews;
create policy "reviews_client_insert_own"
on public.reviews
for insert
with check (
  client_id = auth.uid()
  and exists (
    select 1
    from public.bookings b
    where b.id = booking_id
      and b.client_id = auth.uid()
      and b.status = 'completed'
  )
);

drop policy if exists "client_reviews_related_read" on public.client_reviews;
create policy "client_reviews_related_read"
on public.client_reviews
for select
using (
  public.get_my_role() = 'admin'
  or client_id = auth.uid()
  or exists (
    select 1
    from public.provider_profiles pp
    where pp.id = provider_profile_id
      and pp.profile_id = auth.uid()
  )
);

drop policy if exists "client_reviews_provider_insert_own" on public.client_reviews;
create policy "client_reviews_provider_insert_own"
on public.client_reviews
for insert
with check (
  exists (
    select 1
    from public.provider_profiles pp
    join public.bookings b on b.provider_profile_id = pp.id
    where pp.profile_id = auth.uid()
      and b.id = booking_id
      and b.client_id = client_id
      and b.status = 'completed'
      and b.provider_profile_id = provider_profile_id
  )
);

drop policy if exists "client_reviews_provider_update_own" on public.client_reviews;
create policy "client_reviews_provider_update_own"
on public.client_reviews
for update
using (
  exists (
    select 1
    from public.provider_profiles pp
    where pp.id = provider_profile_id
      and pp.profile_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.provider_profiles pp
    where pp.id = provider_profile_id
      and pp.profile_id = auth.uid()
  )
);

drop policy if exists "conversations_related_read" on public.conversations;
create policy "conversations_related_read"
on public.conversations
for select
using (
  public.get_my_role() = 'admin'
  or client_id = auth.uid()
  or exists (
    select 1
    from public.provider_profiles pp
    where pp.id = provider_profile_id
      and pp.profile_id = auth.uid()
  )
);

drop policy if exists "conversations_client_or_provider_insert" on public.conversations;
create policy "conversations_client_or_provider_insert"
on public.conversations
for insert
with check (
  public.get_my_role() = 'admin'
  or client_id = auth.uid()
  or exists (
    select 1
    from public.provider_profiles pp
    where pp.id = provider_profile_id
      and pp.profile_id = auth.uid()
  )
);

drop policy if exists "conversations_related_update" on public.conversations;
create policy "conversations_related_update"
on public.conversations
for update
using (
  public.get_my_role() = 'admin'
  or client_id = auth.uid()
  or exists (
    select 1
    from public.provider_profiles pp
    where pp.id = provider_profile_id
      and pp.profile_id = auth.uid()
  )
)
with check (
  public.get_my_role() = 'admin'
  or client_id = auth.uid()
  or exists (
    select 1
    from public.provider_profiles pp
    where pp.id = provider_profile_id
      and pp.profile_id = auth.uid()
  )
);

drop policy if exists "jobs_public_or_owner_read" on public.jobs;
create policy "jobs_public_or_owner_read"
on public.jobs
for select
using (
  status in ('open', 'has_bids')
  or client_id = auth.uid()
  or public.get_my_role() = 'admin'
  or public.is_job_bid_provider(id)
);

drop policy if exists "jobs_client_insert" on public.jobs;
create policy "jobs_client_insert"
on public.jobs
for insert
with check (
  client_id = auth.uid()
  and public.get_my_role() in ('client', 'admin')
);

drop policy if exists "jobs_client_update" on public.jobs;
create policy "jobs_client_update"
on public.jobs
for update
using (
  client_id = auth.uid()
  or public.get_my_role() = 'admin'
)
with check (
  client_id = auth.uid()
  or public.get_my_role() = 'admin'
);

drop policy if exists "job_bids_related_read" on public.job_bids;
create policy "job_bids_related_read"
on public.job_bids
for select
using (
  public.get_my_role() = 'admin'
  or exists (
    select 1
    from public.jobs j
    where j.id = job_id
      and j.client_id = auth.uid()
  )
  or exists (
    select 1
    from public.provider_profiles pp
    where pp.id = provider_profile_id
      and pp.profile_id = auth.uid()
  )
);

drop policy if exists "job_bids_provider_insert" on public.job_bids;
create policy "job_bids_provider_insert"
on public.job_bids
for insert
with check (
  public.get_my_role() in ('provider', 'admin')
  and exists (
    select 1
    from public.provider_profiles pp
    where pp.id = provider_profile_id
      and (pp.profile_id = auth.uid() or public.get_my_role() = 'admin')
  )
  and exists (
    select 1
    from public.jobs j
    where j.id = job_id
      and j.client_id <> auth.uid()
      and j.status in ('open', 'has_bids')
      and j.expires_at > timezone('utc', now())
  )
);

drop policy if exists "job_bids_related_update" on public.job_bids;
create policy "job_bids_related_update"
on public.job_bids
for update
using (
  public.get_my_role() = 'admin'
  or exists (
    select 1
    from public.provider_profiles pp
    where pp.id = provider_profile_id
      and pp.profile_id = auth.uid()
  )
  or exists (
    select 1
    from public.jobs j
    where j.id = job_id
      and j.client_id = auth.uid()
  )
)
with check (
  public.get_my_role() = 'admin'
  or exists (
    select 1
    from public.provider_profiles pp
    where pp.id = provider_profile_id
      and pp.profile_id = auth.uid()
  )
  or exists (
    select 1
    from public.jobs j
    where j.id = job_id
      and j.client_id = auth.uid()
  )
);

drop policy if exists "job_bid_credit_purchases_provider_or_admin_read" on public.job_bid_credit_purchases;
create policy "job_bid_credit_purchases_provider_or_admin_read"
on public.job_bid_credit_purchases
for select
using (
  public.get_my_role() = 'admin'
  or exists (
    select 1
    from public.provider_profiles pp
    where pp.id = provider_profile_id
      and pp.profile_id = auth.uid()
  )
);

drop policy if exists "conversation_messages_related_read" on public.conversation_messages;
create policy "conversation_messages_related_read"
on public.conversation_messages
for select
using (
  public.get_my_role() = 'admin'
  or exists (
    select 1
    from public.conversations c
    left join public.provider_profiles pp on pp.id = c.provider_profile_id
    where c.id = conversation_id
      and (c.client_id = auth.uid() or pp.profile_id = auth.uid())
  )
);

drop policy if exists "conversation_messages_related_insert" on public.conversation_messages;
create policy "conversation_messages_related_insert"
on public.conversation_messages
for insert
with check (
  sender_id = auth.uid()
  and (
    public.get_my_role() = 'admin'
    or exists (
      select 1
      from public.conversations c
      left join public.provider_profiles pp on pp.id = c.provider_profile_id
      where c.id = conversation_id
        and (c.client_id = auth.uid() or pp.profile_id = auth.uid())
    )
  )
);

drop policy if exists "whatsapp_request_charges_client_insert" on public.whatsapp_request_charges;
create policy "whatsapp_request_charges_client_insert"
on public.whatsapp_request_charges
for insert
with check (
  client_id = auth.uid()
  and amount_cents > 0
  and exists (
    select 1
    from public.conversations c
    where c.id = conversation_id
      and c.client_id = auth.uid()
  )
);

drop policy if exists "whatsapp_request_charges_read_client_or_admin" on public.whatsapp_request_charges;
create policy "whatsapp_request_charges_read_client_or_admin"
on public.whatsapp_request_charges
for select
using (
  client_id = auth.uid()
  or public.get_my_role() = 'admin'
);

drop policy if exists "email_logs_admin_or_related_read" on public.email_logs;
create policy "email_logs_admin_or_related_read"
on public.email_logs
for select
using (
  public.get_my_role() = 'admin'
  or exists (
    select 1
    from public.bookings b
    left join public.provider_profiles pp on pp.id = b.provider_profile_id
    where b.id = booking_id
      and (b.client_id = auth.uid() or pp.profile_id = auth.uid())
  )
);

drop policy if exists "service_images_public_read" on storage.objects;
create policy "service_images_public_read"
on storage.objects
for select
using (bucket_id = 'service-images');

drop policy if exists "service_images_provider_insert" on storage.objects;
create policy "service_images_provider_insert"
on storage.objects
for insert
with check (
  bucket_id = 'service-images'
  and auth.uid()::text = (storage.foldername(name))[1]
);

drop policy if exists "service_images_provider_update" on storage.objects;
create policy "service_images_provider_update"
on storage.objects
for update
using (
  bucket_id = 'service-images'
  and auth.uid()::text = (storage.foldername(name))[1]
)
with check (
  bucket_id = 'service-images'
  and auth.uid()::text = (storage.foldername(name))[1]
);

drop policy if exists "service_images_provider_delete" on storage.objects;
create policy "service_images_provider_delete"
on storage.objects
for delete
using (
  bucket_id = 'service-images'
  and auth.uid()::text = (storage.foldername(name))[1]
);
