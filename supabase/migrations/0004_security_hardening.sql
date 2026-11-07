-- Security hardening: never edit earlier migrations; apply this migration after 0003.
-- Enforce that a sync job cannot mix a source from one workspace with another.
alter table public.sources add constraint sources_id_workspace_unique unique (id, workspace_id);
alter table public.sync_jobs add constraint sync_jobs_source_workspace_fk
  foreign key (source_id, workspace_id) references public.sources (id, workspace_id) on delete cascade;

-- Manual sync requests are authenticated and inserted through the user-scoped Supabase client.
grant insert on table public.sync_jobs to authenticated;
create policy sync_jobs_insert on public.sync_jobs
for insert to authenticated
with check (
  requested_by = (select auth.uid())
  and (select private.is_workspace_member(workspace_id))
  and exists (
    select 1 from public.workspace_members wm
    where wm.workspace_id = sync_jobs.workspace_id
      and wm.user_id = (select auth.uid())
      and wm.role in ('admin', 'analyst')
  )
  and exists (
    select 1 from public.sources s
    where s.id = sync_jobs.source_id and s.workspace_id = sync_jobs.workspace_id
  )
);

comment on policy sync_jobs_insert on public.sync_jobs is 'Only an authenticated workspace admin/analyst may enqueue a job for a source in that workspace.';
