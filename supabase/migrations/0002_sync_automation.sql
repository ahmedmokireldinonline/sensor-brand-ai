-- Sensor Brand AI sync automation foundation
-- Queue records are written by trusted server-side workers or provider webhook handlers.

create table public.webhook_events (
  id uuid primary key default gen_random_uuid(),
  source_id uuid references public.sources(id) on delete set null,
  provider text not null,
  delivery_id text not null,
  event_type text not null default 'unknown',
  payload jsonb not null default '{}'::jsonb,
  status text not null default 'received',
  error_message text,
  received_at timestamptz not null default now(),
  processed_at timestamptz,
  unique (provider, delivery_id),
  constraint webhook_events_provider_check check (provider in ('meta', 'google', 'reddit', 'other')),
  constraint webhook_events_status_check check (status in ('received', 'queued', 'processed', 'failed', 'ignored'))
);

create table public.sync_jobs (
  id uuid primary key default gen_random_uuid(),
  source_id uuid not null references public.sources(id) on delete cascade,
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  trigger_type text not null default 'scheduled',
  status text not null default 'queued',
  requested_by uuid references auth.users(id) on delete set null,
  cursor_before text,
  cursor_after text,
  records_seen integer not null default 0,
  records_imported integer not null default 0,
  error_message text,
  queued_at timestamptz not null default now(),
  started_at timestamptz,
  completed_at timestamptz,
  constraint sync_jobs_trigger_type_check check (trigger_type in ('scheduled', 'manual', 'webhook', 'retry')),
  constraint sync_jobs_status_check check (status in ('queued', 'running', 'completed', 'failed', 'cancelled')),
  constraint sync_jobs_counts_check check (records_seen >= 0 and records_imported >= 0)
);

create table public.source_sync_cursors (
  source_id uuid primary key references public.sources(id) on delete cascade,
  cursor text,
  last_successful_sync_at timestamptz,
  last_successful_external_timestamp timestamptz,
  updated_at timestamptz not null default now()
);

create index webhook_events_source_received_idx on public.webhook_events (source_id, received_at desc);
create index webhook_events_status_received_idx on public.webhook_events (status, received_at desc);
create index sync_jobs_workspace_queued_idx on public.sync_jobs (workspace_id, queued_at desc);
create index sync_jobs_source_status_idx on public.sync_jobs (source_id, status, queued_at desc);

create trigger source_sync_cursors_set_updated_at
before update on public.source_sync_cursors
for each row execute function public.set_updated_at();

alter table public.webhook_events enable row level security;
alter table public.sync_jobs enable row level security;
alter table public.source_sync_cursors enable row level security;

revoke all on table public.webhook_events, public.sync_jobs, public.source_sync_cursors from anon;
revoke all on table public.webhook_events, public.sync_jobs, public.source_sync_cursors from authenticated;
grant select on table public.webhook_events, public.sync_jobs, public.source_sync_cursors to authenticated;

create policy webhook_events_select on public.webhook_events
for select to authenticated
using (source_id is not null and (select private.is_workspace_member((select s.workspace_id from public.sources s where s.id = source_id))));

create policy sync_jobs_select on public.sync_jobs
for select to authenticated
using ((select private.is_workspace_member(workspace_id)));

create policy source_sync_cursors_select on public.source_sync_cursors
for select to authenticated
using ((select private.is_workspace_member((select s.workspace_id from public.sources s where s.id = source_id))));

comment on table public.webhook_events is 'Inbound provider deliveries retained for idempotent processing and auditability.';
comment on table public.sync_jobs is 'Queued and completed background synchronization runs per connected source.';
comment on table public.source_sync_cursors is 'Provider-specific cursor and high-water mark for incremental synchronization.';
