\set ON_ERROR_STOP on
\pset tuples_only on
\pset format unaligned

\echo '== Sensor Brand AI / Supabase pre-migration check =='
\echo 'This script is read-only. It does not create, alter, update, or delete data.'

DO $$
DECLARE
  required_table text;
BEGIN
  FOREACH required_table IN ARRAY ARRAY[
    'public.sources',
    'public.sync_jobs',
    'public.workspace_members'
  ] LOOP
    IF to_regclass(required_table) IS NULL THEN
      RAISE EXCEPTION 'Missing required table: %', required_table;
    END IF;
    RAISE NOTICE 'OK required table: %', required_table;
  END LOOP;
END $$;

SELECT 'database=' || current_database(),
       'server=' || COALESCE(inet_server_addr()::text, 'local'),
       'user=' || current_user,
       'version=' || version();

DO $$
DECLARE
  mismatch_count bigint;
  duplicate_count bigint;
BEGIN
  SELECT count(*) INTO mismatch_count
  FROM public.sync_jobs j
  JOIN public.sources s ON s.id = j.source_id
  WHERE j.workspace_id <> s.workspace_id;

  IF mismatch_count > 0 THEN
    RAISE EXCEPTION 'BLOCKED: % sync_jobs rows have a workspace/source mismatch', mismatch_count;
  END IF;
  RAISE NOTICE 'OK no workspace/source mismatches';

  SELECT count(*) INTO duplicate_count
  FROM public.sources
  GROUP BY id, workspace_id
  HAVING count(*) > 1;
  IF duplicate_count > 0 THEN
    RAISE EXCEPTION 'BLOCKED: duplicate source/workspace pairs detected';
  END IF;
  RAISE NOTICE 'OK no duplicate source/workspace pairs';
END $$;

SELECT 'existing_constraint.sources_id_workspace_unique=' || EXISTS (
  SELECT 1 FROM pg_constraint WHERE conname = 'sources_id_workspace_unique'
),
'existing_constraint.sync_jobs_source_workspace_fk=' || EXISTS (
  SELECT 1 FROM pg_constraint WHERE conname = 'sync_jobs_source_workspace_fk'
),
'existing_policy.sync_jobs_insert=' || EXISTS (
  SELECT 1 FROM pg_policies
  WHERE schemaname = 'public'
    AND tablename = 'sync_jobs'
    AND policyname = 'sync_jobs_insert'
);

SELECT 'sync_jobs_total=' || count(*) FROM public.sync_jobs;
SELECT 'sources_total=' || count(*) FROM public.sources;

\echo 'PRE-MIGRATION CHECK PASSED: no blocking data integrity issue was found.'
\echo 'Existing migration objects are reported above; do not re-run 0004 blindly if they already exist.'
