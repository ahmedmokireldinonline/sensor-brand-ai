# Sensor Brand AI — Technical Audit

**Audit date:** 2026-11-07  
**Repository:** `ahmedmokireldinonline/sensor-brand-ai`  
**Audited revision:** `f3f8f27` (`Fix sidebar navigation visibility`)  
**Deployment checked:** `https://sensor-brand-ai.vercel.app/`

## Executive summary

The repository is a functioning Next.js prototype with a coherent visual shell, Supabase browser client, initial multi-tenant schema, workspace/source screens, a webhook intake placeholder, and a sync-job enqueue placeholder. It is **not yet a production SaaS platform** and must not be represented as having live social integrations, live analytics, background workers, AI classification, billing, or customer-care publishing.

The most urgent issue is a trust-boundary failure in `POST /api/sync/run`: the route accepts unauthenticated, user-controlled `source_id`, `workspace_id`, and `requested_by` values and inserts through a service-role helper. The webhook route also accepts unsigned payloads for multiple providers and stores raw payloads without mapping them to a source. OAuth authorization creates state but the callback does not exchange the authorization code or persist tokens. Integration “credentials” are stored in browser localStorage, and the connection test is a timer-based prototype response.

## Verified baseline

- Public landing page responds HTTP 200 from Vercel.
- `/api/integrations/status` responds HTTP 200 and currently reports all provider environment flags as false.
- Invalid Meta webhook verification responds HTTP 403.
- TypeScript check passes: `npm run typecheck` exit 0.
- Production build passes: `npm run build` exit 0, with an Autoprefixer warning.
- Lint is not operational: `npm run lint` invokes deprecated `next lint`, auto-generates an ESLint 9 setup, and fails during the build’s ESLint phase with a circular-configuration error. The audit environment added `.eslintrc.json`; this generated file is not an intentional product change.
- `npm audit --omit=dev` reports 1 moderate and 1 high vulnerability; the full tree reports 9 moderate and 1 high.
- No test files were present in the repository at audit time.
- No authenticated Supabase or provider integration test was performed because no credentials were supplied.

## Findings by severity

### Critical

1. **Unauthenticated service-role sync enqueue** — `app/api/sync/run/route.ts`, `lib/supabase-admin.ts`. The route has no session check, no workspace membership check, no source/workspace consistency query, and trusts a client-supplied `requested_by`. It uses the service-role key to insert. An attacker can enqueue jobs for arbitrary identifiers and potentially create operational load or cross-tenant records. Fix before exposing the route.
2. **Unsigned webhook ingestion** — `app/api/webhooks/[provider]/route.ts`. Except for Meta’s separate verification GET, POST requests are accepted without provider signature verification, timestamp/replay protection, or source authorization. The fallback SHA-256 is only a body hash and is not authenticity. Fix before registering any webhook.
3. **Secrets are stored in browser localStorage** — `app/settings/integrations/page.tsx`. The UI accepts API keys, client secrets, and webhook secrets, then persists them to `localStorage`. Any XSS, compromised extension, shared browser profile, or local inspection can expose them. Remove secret fields from browser persistence and implement server-side encrypted storage/secret-manager integration.

### High

1. **OAuth is only a redirect/state placeholder** — `app/api/integrations/[provider]/authorize/route.ts` and `callback/route.ts`. The callback validates a cookie value but never exchanges `code`, validates provider-specific issuer/redirect details, stores tokens, refreshes tokens, revokes tokens, or links a source/workspace. No provider integration is active.
2. **No authentication middleware or route protection** — internal pages render without a server-side session gate. Client-side Supabase calls correctly fail or return empty data when unauthenticated, but the server routes do not consistently enforce identity.
3. **Webhook provider/schema mismatch** — the route accepts `linkedin` and `custom`, but migration `0002_sync_automation.sql` permits only `meta`, `google`, `reddit`, and `other`; LinkedIn/custom inserts will fail against the declared schema.
4. **No provider-specific payload mapping** — webhook events are stored without resolving `source_id`, validating event shape, normalizing mentions, or checking workspace ownership. Raw external content is retained without a processing pipeline.
5. **No background worker** — `sync_jobs` is only an insert target. There is no claimant, lock strategy, retry/backoff worker, provider adapter, cursor advancement, or dead-letter handling.
6. **No live analytics or AI pipeline** — dashboard and analytics screens are static/empty-state presentation layers. There is no classification table, model adapter, structured output validation, confidence review flow, or database-backed metric query implementation.
7. **Open redirect risk in auth callback** — `app/auth/callback/route.ts` uses a client-controlled `next` parameter directly in `new URL(next, url.origin)`. Constrain redirects to an allowlisted internal path.
8. **CI does not validate the application** — the only workflow is a Datadog synthetic placeholder and does not install dependencies, run typecheck, lint, tests, build, or dependency scanning. No test suite exists.

### Medium

1. **Database tenant integrity is incomplete** — `sync_jobs` does not enforce that `source_id` belongs to `workspace_id`; `webhook_events.source_id` is nullable and has no provider/source consistency constraint.
2. **RLS coverage is read-only for automation tables** — `webhook_events`, `sync_jobs`, and `source_sync_cursors` grant only `select` to authenticated. This is acceptable for browser read-only access but requires a documented, audited server-worker path and least-privilege service access.
3. **Role model does not match product requirements** — schema roles are `owner/admin/member/viewer` and `admin/analyst/responder/viewer`, while the requested product calls for Owner, Admin, Manager, Analyst, and Viewer. Invitations, role management, audit logs, billing, quotas, and usage tracking are absent.
4. **Duplicate migration numbering and placeholder migration** — `0001_phase2_foundation.sql` is an intentionally empty placeholder alongside the actual `0001_sensor_brand_foundation.sql`. This can confuse migration tooling and reviewers.
5. **Dependency health is unresolved** — audit reports production and development vulnerabilities. No policy or remediation record is committed.
6. **Bilingual support is partial** — the shell toggles language and direction, but many pages remain English-only and do not provide complete Arabic translations or locale-aware date/number formatting.
7. **Public integration status endpoint reveals configuration presence** — `/api/integrations/status` exposes whether server-side provider client IDs are configured. This is low sensitivity but unnecessary reconnaissance surface; protect or return a generic capability state.
8. **No rate limiting or payload-size control** — webhook and sync routes lack explicit body-size limits, rate limits, replay windows, and abuse controls.

### Low

1. `next lint` is deprecated for the selected Next.js line and should be migrated to the ESLint CLI with a committed, compatible configuration.
2. Build emits an Autoprefixer warning for a mixed-support flex-end value in `app/globals.css`.
3. Several UI controls are explicitly prototype behavior (timers/local state) and should be labeled or replaced as production behavior is implemented.
4. Required audit documents were incomplete before this report: `BUG_REPORT.md`, `SECURITY_AUDIT.md`, `TESTING_STRATEGY.md`, `API_INTEGRATIONS.md`, `ARCHITECTURE.md`, `IMPLEMENTATION_ROADMAP.md`, and `DEPLOYMENT_GUIDE.md` were not present.

## Recommended order

1. Lock down authentication, authorization, sync enqueue, webhook authenticity, payload limits, and safe error logging.
2. Establish a clean migration ledger and add tenant integrity constraints without editing applied migrations.
3. Replace browser secret storage with server-side encrypted credentials and complete one provider end-to-end.
4. Add a durable worker/queue and normalized ingestion with idempotency.
5. Add classification, live analytics, tests, and CI gates.
6. Only then implement customer-care publishing, automation, billing, and production deployment controls.
