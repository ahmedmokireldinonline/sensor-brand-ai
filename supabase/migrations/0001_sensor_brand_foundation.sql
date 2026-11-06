-- Sensor Brand AI foundation schema
-- Workspace-scoped customer opinion intelligence for Arabic and English brands.
-- No seed data and no secrets.

create extension if not exists pgcrypto;

create schema if not exists private;

create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint organizations_name_not_blank check (length(trim(name)) > 0),
  constraint organizations_slug_format check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$')
);

create table public.organization_members (
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'member',
  created_at timestamptz not null default now(),
  primary key (organization_id, user_id),
  constraint organization_members_role_check check (role in ('owner', 'admin', 'member', 'viewer'))
);

create table public.workspaces (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  slug text not null,
  description text,
  default_language text not null default 'en',
  timezone text not null default 'Africa/Cairo',
  status text not null default 'active',
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, slug),
  constraint workspaces_name_not_blank check (length(trim(name)) > 0),
  constraint workspaces_slug_format check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  constraint workspaces_default_language_check check (default_language in ('ar', 'en', 'both')),
  constraint workspaces_status_check check (status in ('active', 'paused', 'archived'))
);

create table public.workspace_members (
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'viewer',
  created_at timestamptz not null default now(),
  primary key (workspace_id, user_id),
  constraint workspace_members_role_check check (role in ('admin', 'analyst', 'responder', 'viewer'))
);

create table public.sources (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  platform text not null,
  account_ref text not null,
  account_name text,
  status text not null default 'pending',
  capabilities jsonb not null default '{}'::jsonb,
  last_synced_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (workspace_id, platform, account_ref),
  constraint sources_platform_check check (platform in ('meta_facebook', 'meta_instagram', 'google_business', 'linkedin', 'reddit', 'brand24', 'mention', 'other')),
  constraint sources_status_check check (status in ('pending', 'active', 'paused', 'error', 'revoked')),
  constraint sources_account_ref_not_blank check (length(trim(account_ref)) > 0)
);

create table public.mentions (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  source_id uuid not null references public.sources(id) on delete cascade,
  external_id text not null,
  content_type text not null default 'comment',
  author_hash text,
  author_display_name text,
  text text not null,
  language text,
  dialect text,
  url text,
  source_created_at timestamptz,
  fetched_at timestamptz not null default now(),
  deleted_at timestamptz,
  source_metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (source_id, external_id),
  constraint mentions_content_type_check check (content_type in ('post', 'comment', 'review', 'reply', 'mention', 'message', 'other')),
  constraint mentions_text_not_blank check (length(trim(text)) > 0)
);

create index organizations_created_by_idx on public.organizations (created_by);
create index organization_members_user_idx on public.organization_members (user_id);
create index workspaces_organization_idx on public.workspaces (organization_id);
create index workspace_members_user_idx on public.workspace_members (user_id);
create index sources_workspace_status_idx on public.sources (workspace_id, status);
create index mentions_workspace_created_idx on public.mentions (workspace_id, source_created_at desc);
create index mentions_source_created_idx on public.mentions (source_id, source_created_at desc);
create index mentions_workspace_content_type_idx on public.mentions (workspace_id, content_type);
create index mentions_author_hash_idx on public.mentions (workspace_id, author_hash) where author_hash is not null;

create or replace function private.is_org_member(target_org_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public, private, pg_temp
as $$
  select exists (
    select 1
    from public.organization_members om
    where om.organization_id = target_org_id
      and om.user_id = (select auth.uid())
  );
$$;

create or replace function private.is_org_admin(target_org_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public, private, pg_temp
as $$
  select exists (
    select 1
    from public.organization_members om
    where om.organization_id = target_org_id
      and om.user_id = (select auth.uid())
      and om.role in ('owner', 'admin')
  );
$$;

create or replace function private.is_workspace_member(target_workspace_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public, private, pg_temp
as $$
  select exists (
    select 1
    from public.workspace_members wm
    where wm.workspace_id = target_workspace_id
      and wm.user_id = (select auth.uid())
  );
$$;

create or replace function private.is_workspace_admin(target_workspace_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public, private, pg_temp
as $$
  select exists (
    select 1
    from public.workspace_members wm
    where wm.workspace_id = target_workspace_id
      and wm.user_id = (select auth.uid())
      and wm.role = 'admin'
  );
$$;

create or replace function private.is_workspace_editor(target_workspace_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public, private, pg_temp
as $$
  select exists (
    select 1
    from public.workspace_members wm
    where wm.workspace_id = target_workspace_id
      and wm.user_id = (select auth.uid())
      and wm.role in ('admin', 'analyst', 'responder')
  );
$$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger organizations_set_updated_at
before update on public.organizations
for each row execute function public.set_updated_at();

create trigger workspaces_set_updated_at
before update on public.workspaces
for each row execute function public.set_updated_at();

create trigger sources_set_updated_at
before update on public.sources
for each row execute function public.set_updated_at();

create trigger mentions_set_updated_at
before update on public.mentions
for each row execute function public.set_updated_at();

create or replace function public.validate_mention_workspace()
returns trigger
language plpgsql
as $$
declare
  source_workspace_id uuid;
begin
  select s.workspace_id into source_workspace_id
  from public.sources s
  where s.id = new.source_id;

  if source_workspace_id is null or source_workspace_id <> new.workspace_id then
    raise exception 'mention workspace_id must match its source workspace_id';
  end if;

  return new;
end;
$$;

create trigger mentions_validate_workspace
before insert or update on public.mentions
for each row execute function public.validate_mention_workspace();

alter table public.organizations enable row level security;
alter table public.organization_members enable row level security;
alter table public.workspaces enable row level security;
alter table public.workspace_members enable row level security;
alter table public.sources enable row level security;
alter table public.mentions enable row level security;

revoke all on table public.organizations, public.organization_members, public.workspaces, public.workspace_members, public.sources, public.mentions from anon;
revoke all on table public.organizations, public.organization_members, public.workspaces, public.workspace_members, public.sources, public.mentions from authenticated;
grant select, insert, update, delete on table public.organizations, public.organization_members, public.workspaces, public.workspace_members, public.sources, public.mentions to authenticated;

create policy organizations_select on public.organizations
for select to authenticated
using ((select private.is_org_member(id)));

create policy organizations_insert on public.organizations
for insert to authenticated
with check (created_by = (select auth.uid()));

create policy organizations_update on public.organizations
for update to authenticated
using ((select private.is_org_admin(id)))
with check ((select private.is_org_admin(id)));

create policy organizations_delete on public.organizations
for delete to authenticated
using ((select private.is_org_admin(id)));

create policy organization_members_select on public.organization_members
for select to authenticated
using (user_id = (select auth.uid()) or (select private.is_org_member(organization_id)));

create policy organization_members_insert on public.organization_members
for insert to authenticated
with check ((select private.is_org_admin(organization_id)));

create policy organization_members_update on public.organization_members
for update to authenticated
using ((select private.is_org_admin(organization_id)))
with check ((select private.is_org_admin(organization_id)));

create policy organization_members_delete on public.organization_members
for delete to authenticated
using ((select private.is_org_admin(organization_id)));

create policy workspaces_select on public.workspaces
for select to authenticated
using ((select private.is_org_member(organization_id)) or (select private.is_workspace_member(id)));

create policy workspaces_insert on public.workspaces
for insert to authenticated
with check ((select private.is_org_admin(organization_id)) and created_by = (select auth.uid()));

create policy workspaces_update on public.workspaces
for update to authenticated
using ((select private.is_workspace_admin(id)))
with check ((select private.is_workspace_admin(id)));

create policy workspaces_delete on public.workspaces
for delete to authenticated
using ((select private.is_workspace_admin(id)));

create policy workspace_members_select on public.workspace_members
for select to authenticated
using (user_id = (select auth.uid()) or (select private.is_workspace_admin(workspace_id)));

create policy workspace_members_insert on public.workspace_members
for insert to authenticated
with check ((select private.is_workspace_admin(workspace_id)));

create policy workspace_members_update on public.workspace_members
for update to authenticated
using ((select private.is_workspace_admin(workspace_id)))
with check ((select private.is_workspace_admin(workspace_id)));

create policy workspace_members_delete on public.workspace_members
for delete to authenticated
using ((select private.is_workspace_admin(workspace_id)));

create policy sources_select on public.sources
for select to authenticated
using ((select private.is_workspace_member(workspace_id)));

create policy sources_insert on public.sources
for insert to authenticated
with check ((select private.is_workspace_admin(workspace_id)));

create policy sources_update on public.sources
for update to authenticated
using ((select private.is_workspace_admin(workspace_id)))
with check ((select private.is_workspace_admin(workspace_id)));

create policy sources_delete on public.sources
for delete to authenticated
using ((select private.is_workspace_admin(workspace_id)));

create policy mentions_select on public.mentions
for select to authenticated
using ((select private.is_workspace_member(workspace_id)));

create policy mentions_insert on public.mentions
for insert to authenticated
with check ((select private.is_workspace_editor(workspace_id)));

create policy mentions_update on public.mentions
for update to authenticated
using ((select private.is_workspace_editor(workspace_id)))
with check ((select private.is_workspace_editor(workspace_id)));

create policy mentions_delete on public.mentions
for delete to authenticated
using ((select private.is_workspace_admin(workspace_id)));

comment on table public.organizations is 'Top-level tenant boundary for one or more brand workspaces.';
comment on table public.workspaces is 'Isolated brand workspace containing sources, opinions, reports, and AI configuration.';
comment on table public.sources is 'Provider/account connection metadata. Credentials are stored outside ordinary rows.';
comment on table public.mentions is 'Normalized customer posts, comments, reviews, and mentions from connected sources.';
