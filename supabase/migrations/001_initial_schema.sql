-- ============================================================
-- PRERNA HUMAN EXPERIMENT
-- Migration 001: Initial database foundation
-- Supabase Mumbai project
-- ============================================================

begin;

-- 1. EXTENSIONS
create extension if not exists pgcrypto;

-- 2. PARTICIPANT ID SEQUENCE
-- Existing IDs HE-001 through HE-035 are reserved.
-- New automatic allocation starts at HE-036.
-- There is no maximum of 70.

create sequence public.participant_id_seq
  start with 36
  increment by 1;

-- 3. ADMIN USERS

create table public.admin_users (
  user_id uuid primary key
    references auth.users(id) on delete cascade,

  role text not null default 'admin'
    check (role in ('admin', 'super_admin')),

  created_at timestamptz not null default now(),

  created_by uuid
    references auth.users(id) on delete set null
);

-- 4. PERMANENT PARTICIPANT IDENTITIES

create table public.participants (
  participant_key text primary key
    default (
      'HE-' || lpad(
        nextval('public.participant_id_seq')::text,
        3,
        '0'
      )
    ),

  full_name text,
  display_name text,
  congregation text,
  age integer check (age between 1 and 120),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

grant usage, select
on sequence public.participant_id_seq
to authenticated;

-- 5. EXPERIMENT SESSIONS

create table public.experiment_sessions (
  id uuid primary key default gen_random_uuid(),

  room_code text not null unique
    check (room_code ~ '^[0-9]{6}$'),

  status text not null default 'LOBBY'
    check (status in (
      'LOBBY',
      'RUNNING',
      'PAUSED',
      'COMPLETED',
      'CLOSED'
    )),

  current_experiment integer not null default 1
    check (current_experiment between 1 and 6),

  current_stage text not null default 'INTRO'
    check (current_stage in (
      'INTRO',
      'START',
      'QUESTION',
      'WAIT',
      'QUESTION_1',
      'WAIT_1',
      'REVEAL_1',
      'QUESTION_2',
      'WAIT_2',
      'REVEAL_2',
      'REVEAL',
      'DISCUSSION',
      'COMPLETE'
    )),

  timer_started_at timestamptz,
  timer_duration integer not null default 300
    check (timer_duration >= 0),

  reveal boolean not null default false,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index experiment_sessions_status_idx
  on public.experiment_sessions(status);

-- 6. PARTICIPANTS JOINING EXPERIMENT SESSIONS
-- Permanent identity is stored separately in participants.
-- Group, representative and answers are session-specific.

create table public.experiment_participants (
  id uuid primary key default gen_random_uuid(),

  session_id uuid not null
    references public.experiment_sessions(id)
    on delete cascade,

  participant_key text not null
    references public.participants(participant_key)
    on delete restrict,

  full_name text not null,
  display_name text not null,
  congregation text,
  age integer check (age between 1 and 120),

  group_name text,

  is_representative boolean not null default false,

  connected boolean not null default false,

  status text not null default 'READY'
    check (status in (
      'LOCKED',
      'READY',
      'ACTIVE',
      'ANSWERED',
      'WAITING',
      'COMPLETED',
      'MISSED',
      'CURRENT'
    )),

  current_experiment integer not null default 1
    check (current_experiment between 1 and 6),

  answer jsonb not null default '{}'::jsonb,

  submitted_at timestamptz,
  last_seen_at timestamptz,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint one_participation_per_session
    unique (session_id, participant_key)
);

create index experiment_participants_session_idx
  on public.experiment_participants(session_id);

create index experiment_participants_group_idx
  on public.experiment_participants(session_id, group_name);

create unique index one_representative_per_group_idx
  on public.experiment_participants(session_id, group_name)
  where is_representative = true
    and group_name is not null;

-- 7. SECURE PARTICIPANT PASSES
-- Store SHA-256 token hashes, never plaintext tokens.

create table public.participant_passes (
  id uuid primary key default gen_random_uuid(),

  participant_key text not null
    references public.participants(participant_key)
    on delete cascade,

  token_hash text not null unique
    check (token_hash ~ '^[a-f0-9]{64}$'),

  created_at timestamptz not null default now(),

  created_by uuid
    references auth.users(id) on delete set null,

  revoked_at timestamptz,

  revoked_by uuid
    references auth.users(id) on delete set null,

  replaced_by uuid
    references public.participant_passes(id)
    on delete set null
);

create index participant_passes_participant_idx
  on public.participant_passes(participant_key);

create unique index one_active_pass_per_participant_idx
  on public.participant_passes(participant_key)
  where revoked_at is null;

-- 8. UPDATED_AT TRIGGER

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger participants_updated_at
before update on public.participants
for each row execute function public.set_updated_at();

create trigger experiment_sessions_updated_at
before update on public.experiment_sessions
for each row execute function public.set_updated_at();

create trigger experiment_participants_updated_at
before update on public.experiment_participants
for each row execute function public.set_updated_at();

-- 9. ADMIN AUTHORIZATION

create or replace function public.is_prerna_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.admin_users
    where user_id = (select auth.uid())
  );
$$;

revoke all on function public.is_prerna_admin() from public;

grant execute on function public.is_prerna_admin()
to authenticated;

-- 10. ENABLE ROW LEVEL SECURITY

alter table public.admin_users enable row level security;
alter table public.participants enable row level security;
alter table public.experiment_sessions enable row level security;
alter table public.experiment_participants enable row level security;
alter table public.participant_passes enable row level security;

-- 11. ADMIN POLICIES

create policy "Admins can view admin users"
on public.admin_users
for select
to authenticated
using (public.is_prerna_admin());

create policy "Admins can view participants"
on public.participants
for select
to authenticated
using (public.is_prerna_admin());

create policy "Admins can create participants"
on public.participants
for insert
to authenticated
with check (public.is_prerna_admin());

create policy "Admins can update participants"
on public.participants
for update
to authenticated
using (public.is_prerna_admin())
with check (public.is_prerna_admin());

create policy "Admins can delete participants"
on public.participants
for delete
to authenticated
using (public.is_prerna_admin());

create policy "Admins can view sessions"
on public.experiment_sessions
for select
to authenticated
using (public.is_prerna_admin());

create policy "Admins can create sessions"
on public.experiment_sessions
for insert
to authenticated
with check (public.is_prerna_admin());

create policy "Admins can update sessions"
on public.experiment_sessions
for update
to authenticated
using (public.is_prerna_admin())
with check (public.is_prerna_admin());

create policy "Admins can delete sessions"
on public.experiment_sessions
for delete
to authenticated
using (public.is_prerna_admin());

create policy "Admins can view session participants"
on public.experiment_participants
for select
to authenticated
using (public.is_prerna_admin());

create policy "Admins can create session participants"
on public.experiment_participants
for insert
to authenticated
with check (public.is_prerna_admin());

create policy "Admins can update session participants"
on public.experiment_participants
for update
to authenticated
using (public.is_prerna_admin())
with check (public.is_prerna_admin());

create policy "Admins can delete session participants"
on public.experiment_participants
for delete
to authenticated
using (public.is_prerna_admin());

create policy "Admins can view participant passes"
on public.participant_passes
for select
to authenticated
using (public.is_prerna_admin());

create policy "Admins can create participant passes"
on public.participant_passes
for insert
to authenticated
with check (public.is_prerna_admin());

create policy "Admins can update participant passes"
on public.participant_passes
for update
to authenticated
using (public.is_prerna_admin())
with check (public.is_prerna_admin());

-- 12. TABLE PRIVILEGES

revoke all on public.admin_users
from anon, authenticated;

revoke all on public.participants
from anon, authenticated;

revoke all on public.experiment_sessions
from anon, authenticated;

revoke all on public.experiment_participants
from anon, authenticated;

revoke all on public.participant_passes
from anon, authenticated;

grant select on public.admin_users
to authenticated;

grant select, insert, update, delete
on public.participants
to authenticated;

grant select, insert, update, delete
on public.experiment_sessions
to authenticated;

grant select, insert, update, delete
on public.experiment_participants
to authenticated;

grant select, insert, update
on public.participant_passes
to authenticated;

-- 13. REALTIME PUBLICATION

do $$
begin
  if exists (
    select 1
    from pg_publication
    where pubname = 'supabase_realtime'
  ) then

    if not exists (
      select 1
      from pg_publication_tables
      where pubname = 'supabase_realtime'
        and schemaname = 'public'
        and tablename = 'experiment_sessions'
    ) then
      alter publication supabase_realtime
        add table public.experiment_sessions;
    end if;

    if not exists (
      select 1
      from pg_publication_tables
      where pubname = 'supabase_realtime'
        and schemaname = 'public'
        and tablename = 'experiment_participants'
    ) then
      alter publication supabase_realtime
        add table public.experiment_participants;
    end if;

  end if;
end;
$$;

-- 14. BOOTSTRAP FIRST ADMIN

insert into public.admin_users (
  user_id,
  role
)
values (
  'f634a267-37ff-45b9-a6be-1c6ec1104e52',
  'super_admin'
)
on conflict (user_id) do nothing;

commit;

-- ============================================================
-- END MIGRATION 001
-- ============================================================