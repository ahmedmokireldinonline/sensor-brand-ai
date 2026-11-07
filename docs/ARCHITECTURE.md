# Sensor Brand AI — Architecture

## Current architecture (verified)

- **Web:** Next.js 15 App Router, React 19, TypeScript, Vercel.
- **UI:** `app/` routes, `components/app-shell.tsx`, one global CSS system, Chakra provider on selected resource controls.
- **Auth/data client:** Supabase browser client via `@supabase/ssr`; browser queries rely on Supabase Auth and RLS.
- **Server data helper:** `lib/supabase-admin.ts` performs REST inserts with `SUPABASE_SERVICE_ROLE_KEY`.
- **Database:** Supabase PostgreSQL migrations for organizations, memberships, workspaces, sources, mentions, webhook events, sync jobs, and source cursors.
- **Server routes:** Supabase auth callback, OAuth redirect/state placeholder, OAuth callback placeholder, integration status, sync enqueue placeholder, webhook intake placeholder.

## Intended production boundaries

1. **Presentation:** bilingual, responsive Next.js UI; no provider secrets and no direct service-role use.
2. **Identity and authorization:** Supabase Auth plus server-side session checks; organization/workspace membership and role checks enforced in route handlers and RLS.
3. **Tenant/domain model:** organizations → brands/workspaces → sources → normalized mentions → classifications/cases/reports.
4. **Credential vault:** encrypted server-side provider credentials with key rotation, redaction, access audit, and revocation.
5. **Provider adapters:** one adapter contract per provider for OAuth, refresh, rate limits, pagination, webhooks, historical/incremental sync, and capability checks.
6. **Ingestion:** verify authenticity, resolve source/workspace, normalize payloads, deduplicate on provider identity, and enqueue processing idempotently.
7. **Durable jobs:** queue/worker claims jobs with leases, retries, backoff, idempotency keys, cursor advancement, dead-letter handling, and metrics.
8. **AI pipeline:** untrusted text isolation, schema-validated structured outputs, model-independent adapter, confidence/review thresholds, Arabic/English/dialect metadata.
9. **Analytics:** SQL views/materialized aggregates or traceable query services; every metric must link to source records and data sufficiency rules.
10. **Customer care:** cases, assignments, SLA, notes, response suggestions, approval gate, publish adapter, immutable audit history.
11. **Operations:** notifications, automation rules, billing/usage, audit logs, export/deletion/retention.

## Data integrity rules to add via new migrations

- Composite source/workspace ownership enforcement for jobs and mentions.
- Provider-specific source identifiers and unique delivery keys.
- Credential references separate from ordinary source metadata.
- Classification provenance, model/version, confidence, and human-review status.
- Audit records for auth, credentials, source changes, case changes, and publish attempts.

Applied migrations must not be edited; all changes require new migration files and verification against the target Supabase project.
