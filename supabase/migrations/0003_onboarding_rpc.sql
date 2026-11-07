-- Authenticated onboarding transaction for the first organization/workspace.
-- The caller is always taken from auth.uid(); client-provided user IDs are not accepted.

create or replace function public.create_organization_with_workspace(
  p_organization_name text,
  p_organization_slug text,
  p_workspace_name text,
  p_workspace_slug text,
  p_description text default null,
  p_default_language text default 'both'
)
returns jsonb
language plpgsql
security definer
set search_path = public, private, pg_temp
as $$
declare
  v_user_id uuid := (select auth.uid());
  v_organization_id uuid;
  v_workspace_id uuid;
begin
  if v_user_id is null then
    raise exception 'authentication required';
  end if;

  if length(trim(p_organization_name)) = 0 or length(trim(p_workspace_name)) = 0 then
    raise exception 'organization and workspace names are required';
  end if;

  insert into public.organizations (name, slug, created_by)
  values (trim(p_organization_name), lower(trim(p_organization_slug)), v_user_id)
  returning id into v_organization_id;

  insert into public.organization_members (organization_id, user_id, role)
  values (v_organization_id, v_user_id, 'owner');

  insert into public.workspaces (
    organization_id,
    name,
    slug,
    description,
    default_language,
    created_by
  )
  values (
    v_organization_id,
    trim(p_workspace_name),
    lower(trim(p_workspace_slug)),
    nullif(trim(p_description), ''),
    p_default_language,
    v_user_id
  )
  returning id into v_workspace_id;

  insert into public.workspace_members (workspace_id, user_id, role)
  values (v_workspace_id, v_user_id, 'admin');

  return jsonb_build_object(
    'organization_id', v_organization_id,
    'workspace_id', v_workspace_id
  );
exception
  when unique_violation then
    raise exception 'organization or workspace slug already exists';
end;
$$;

revoke all on function public.create_organization_with_workspace(text, text, text, text, text, text) from public, anon, authenticated;
grant execute on function public.create_organization_with_workspace(text, text, text, text, text, text) to authenticated;
