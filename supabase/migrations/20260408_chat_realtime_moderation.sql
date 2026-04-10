alter table public.conversations
add column if not exists moderation_status text not null default 'clear';

alter table public.conversations
add column if not exists moderation_reason text;

alter table public.conversations
add column if not exists moderated_by uuid references public.profiles(id) on delete set null;

alter table public.conversations
add column if not exists moderated_at timestamptz;

create table if not exists public.conversation_reads (
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  last_read_at timestamptz not null default timezone('utc', now()),
  last_read_message_id uuid references public.conversation_messages(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  primary key (conversation_id, user_id)
);

create index if not exists conversation_reads_user_updated_idx
on public.conversation_reads(user_id, updated_at desc);

create table if not exists public.admin_audit_logs (
  id uuid primary key default gen_random_uuid(),
  admin_user_id uuid not null references public.profiles(id) on delete cascade,
  entity_type text not null,
  entity_id uuid,
  action text not null,
  reason text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists admin_audit_logs_entity_created_idx
on public.admin_audit_logs(entity_type, created_at desc);

drop trigger if exists conversation_reads_set_updated_at on public.conversation_reads;
create trigger conversation_reads_set_updated_at
before update on public.conversation_reads
for each row
execute function public.handle_updated_at();

alter table public.conversation_reads enable row level security;
alter table public.admin_audit_logs enable row level security;

drop policy if exists "conversation_reads_related_read" on public.conversation_reads;
create policy "conversation_reads_related_read"
on public.conversation_reads
for select
using (
  user_id = auth.uid()
  or public.get_my_role() = 'admin'
);

drop policy if exists "conversation_reads_related_upsert" on public.conversation_reads;
create policy "conversation_reads_related_upsert"
on public.conversation_reads
for insert
with check (
  user_id = auth.uid()
  or public.get_my_role() = 'admin'
);

drop policy if exists "conversation_reads_related_update" on public.conversation_reads;
create policy "conversation_reads_related_update"
on public.conversation_reads
for update
using (
  user_id = auth.uid()
  or public.get_my_role() = 'admin'
)
with check (
  user_id = auth.uid()
  or public.get_my_role() = 'admin'
);

drop policy if exists "admin_audit_logs_admin_read" on public.admin_audit_logs;
create policy "admin_audit_logs_admin_read"
on public.admin_audit_logs
for select
using (
  public.get_my_role() = 'admin'
);

drop policy if exists "admin_audit_logs_admin_insert" on public.admin_audit_logs;
create policy "admin_audit_logs_admin_insert"
on public.admin_audit_logs
for insert
with check (
  public.get_my_role() = 'admin'
  and admin_user_id = auth.uid()
);
