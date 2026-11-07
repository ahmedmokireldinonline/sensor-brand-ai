# Sensor Brand AI — Bug Report

## Reproduction and evidence

| ID | Severity | Area | Evidence | Impact | Status |
|---|---|---|---|---|---|
| BUG-001 | Critical | Sync API authorization | `app/api/sync/run/route.ts` has no `auth.getUser()`/session validation and calls `insertSupabaseRow()` with service-role credentials. | Unauthenticated callers can enqueue arbitrary tenant jobs and spoof `requested_by`. | Open |
| BUG-002 | Critical | Webhook authenticity | `app/api/webhooks/[provider]/route.ts` accepts JSON for `meta`, `google`, `reddit`, `linkedin`, and `custom` without HMAC/provider signature validation. | Forged events can enter the processing queue; replay and abuse are possible. | Open |
| BUG-003 | Critical | Credential handling | `app/settings/integrations/page.tsx` saves API keys, client secrets, and webhook secrets to `localStorage`. | Browser compromise exposes provider credentials. | Open |
| BUG-004 | High | OAuth completion | `app/api/integrations/[provider]/callback/route.ts` validates state but does not exchange the code or persist a token. | “Connected” state is misleading; no source can sync. | Open |
| BUG-005 | High | Auth callback redirect | `app/auth/callback/route.ts` redirects to a raw `next` query value. | Potential open redirect/phishing path. | Open |
| BUG-006 | High | Webhook schema compatibility | Route accepts `linkedin`/`custom`; migration provider check excludes both. | Inserts fail for supported route values. | Open |
| BUG-007 | High | CI | `.github/workflows/datadog-synthetics.yml` contains only a Datadog action. | Broken code can merge/deploy without type, lint, test, build, or audit gates. | Open |
| BUG-008 | High | Lint | `npm run lint` invokes deprecated `next lint`; generated ESLint 9 config fails with circular structure error. | Lint cannot run unattended or gate releases. | Open |
| BUG-009 | High | Worker | No code claims or executes `sync_jobs`. | Sync Center cannot perform a real synchronization. | Open |
| BUG-010 | High | Analytics/AI | Dashboard/analytics use static empty-state values and no classification schema/worker exists. | Product metrics are not connected to underlying records. | Open |
| BUG-011 | Medium | Tenant integrity | `sync_jobs` has independent `source_id` and `workspace_id` foreign keys but no composite ownership constraint. | A malformed or privileged insert can cross-link source and workspace. | Open |
| BUG-012 | Medium | Rate limiting | Webhook and sync routes have no explicit rate/body/replay controls. | Abuse can create storage/load spikes. | Open |
| BUG-013 | Medium | Role coverage | DB roles omit Manager and Owner semantics at workspace level; invites/audit/billing absent. | Required SaaS authorization model is incomplete. | Open |
| BUG-014 | Low | CSS warning | Build reports Autoprefixer mixed flex-end value at `app/globals.css` line 266. | Non-blocking build warning. | Open |

## Validation results

- `npm run typecheck`: **pass**.
- `npm run build`: **pass**, with CSS warning.
- `npm run lint`: **fail** due to deprecated interactive `next lint` setup and ESLint circular configuration error.
- `npm audit --omit=dev`: **1 moderate, 1 high**.
- Tests: **none found**.
- Live `GET /api/integrations/status`: **200**, all provider flags false.
- Live invalid Meta verification: **403**, expected failure behavior.
- Live `GET /api/webhooks/linkedin`: **404**, verification not configured.

No credentials, database writes, provider API calls, or customer data were used during this audit.
