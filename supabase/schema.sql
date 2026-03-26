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
as $$
  select role
  from public.profiles
  where id = auth.uid()
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
