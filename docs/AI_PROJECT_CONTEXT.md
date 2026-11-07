# Sensor Brand AI — AI Project Context

## 1. Project purpose

Sensor Brand AI is a bilingual Arabic/English customer-opinion intelligence platform. Each brand gets an isolated workspace. The system is intended to collect public customer conversations from connected sources, normalize them into mentions, classify sentiment/topics/language, surface recurring issues, and later support human-approved generative-AI replies.

The product language is English by default with Arabic support and RTL layout switching. Egyptian Arabic and slang are first-class future analysis requirements, but the current repository contains the UI and data foundations rather than a production dialect model.

## 2. Current delivery state

The repository is a buildable Next.js App Router application. Delivered screens are the landing shell, Dashboard, Workspaces, Sources, Sync Center, and Analytics. Delivered server routes are the provider webhook intake route and the background sync enqueue route. Supabase contains the foundation schema plus the sync automation tables. There is no production OAuth connection, no real source credential in the repository, and no running worker yet.

The current UI intentionally shows empty states because no organization, workspace, source, or mention data has been seeded. Do not add fake analytics data to make the dashboard appear populated; connect the data layer instead.

## 3. Technology and conventions

- Next.js 15 App Router with React 19 and TypeScript.
- Supabase Postgres/Auth for persistence, identity, and Row Level Security.
- Vercel is the intended web deployment target.
- GitHub repository: `ahmedmokireldinonline/sensor-brand-ai`.
- Main application work has been developed on the `dev` branch and should be merged to `main` before production deployment.
- CSS is currently a single global stylesheet using CSS variables and responsive media queries. Avoid replacing the established calm operational intelligence visual language without a product reason.
- Server-only credentials must remain in environment variables or a secret manager.

## 4. Important paths

- `app/layout.tsx`: document metadata and root layout.
- `app/globals.css`: shared visual system and responsive styles.
- `components/app-shell.tsx`: sidebar, workspace switcher placeholder, language toggle, and navigation.
- `app/dashboard/page.tsx`: overview metrics and operational empty states.
- `app/workspaces/page.tsx`: workspace creation UI placeholder; currently captures form state locally and does not write to Supabase.
- `app/sources/page.tsx`: Meta, Google Business, and Reddit source setup UI; currently captures setup state locally and does not perform OAuth.
- `app/sync/page.tsx`: webhook and background sync monitoring UI.
- `app/analytics/page.tsx`: mention, sentiment, theme, language, and source-performance UI; currently uses empty states and local filters.
- `app/api/webhooks/[provider]/route.ts`: webhook verification for Meta and generic event intake for Meta/Google/Reddit.
- `app/api/sync/run/route.ts`: queues a sync job in Supabase using `source_id`, `workspace_id`, and `trigger_type`.
- `lib/supabase-admin.ts`: minimal server-side Supabase REST insert helper. It requires `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` at runtime.
- `supabase/migrations/0001_sensor_brand_foundation.sql`: actual foundation schema for organizations, workspaces, sources, mentions, membership tables, triggers, and RLS.
- `supabase/migrations/0001_phase2_foundation.sql`: earlier placeholder file; it intentionally creates no tables and should not be treated as the applied schema.
- `supabase/migrations/0002_sync_automation.sql`: webhook events, sync jobs, and source sync cursors.
- `public/manus-routes.json`: route manifest for `/`, `/dashboard`, `/workspaces`, `/sources`, `/sync`, and `/analytics`.

## 5. Supabase state

Current project:

```text
Project name: sensor-brand-ai
Project ref: auekojzdfovhuepylsat
Region: eu-west-1
```

Applied migrations:

```text
sensor_brand_foundation
sync_automation
```

Foundation tables:

- `organizations`
- `organization_members`
- `workspaces`
- `workspace_members`
- `sources`
- `mentions`

Automation tables:

- `webhook_events`
- `sync_jobs`
- `source_sync_cursors`

RLS is enabled on all application tables. The workspace helper functions in the `private` schema are used by policies. Do not bypass RLS from browser code. Service-role access is server-only and must not be exposed as a `NEXT_PUBLIC_` variable.

## 6. API behavior and current limitations

### `GET /api/webhooks/meta`

Implements Meta `hub.mode`, `hub.verify_token`, and `hub.challenge` verification. It returns the challenge only when `META_VERIFY_TOKEN` matches.

### `POST /api/webhooks/:provider`

Accepts `meta`, `google`, or `reddit`. It parses JSON and inserts one row into `webhook_events` with a delivery key. The current delivery key accepts `x-delivery-id`, then `x-fb-webhooks-signature`, then a SHA-256 hash of the body. This is an intake placeholder, not a complete provider signature verifier. Before production, implement each provider’s documented signature verification and map the payload to a `source_id`.

### `POST /api/sync/run`

Validates `source_id`, `workspace_id`, and an allowed trigger type, then inserts a queued row in `sync_jobs`. It does not fetch provider data. A worker must claim queued jobs, call provider adapters, upsert mentions, advance the cursor, and write job results.

## 7. Known gaps to fix next

1. Add Supabase Auth and create the first authenticated organization owner.
2. Replace local workspace/source forms with authenticated Supabase writes.
3. Implement OAuth for Meta, Google Business Profile, and Reddit; store refresh/access tokens in a proper secret store or encrypted server-side store.
4. Implement provider-specific webhook signature validation and event-to-source mapping.
5. Implement background worker execution and a scheduler. Vercel request handlers should only enqueue work; long-running sync should use a durable worker or queue-compatible runtime.
6. Add a classification table and worker for sentiment, topic, urgency, language, and dialect confidence.
7. Connect Analytics to real queries over `mentions` and classification results.
8. Add automated tests for RLS, webhook idempotency, cursor advancement, provider adapters, and Arabic/Egyptian slang classification.
9. Configure production environment variables in Vercel; never commit them.
10. Review Supabase security advisors after each DDL change.

## 8. Debugging protocol for future AI agents

Start by reading this file, `README.md`, `plan.md`, and `TODO.md`. Then inspect the actual failing route or component and run `npm run build`. Do not assume that a UI placeholder is a connected feature. Check the applied Supabase migration list and table definitions before changing schema. For database changes, add a new migration rather than editing an already-applied migration. Preserve workspace scoping and RLS in every query and policy. Reproduce API failures with a sanitized payload and never print tokens. After a fix, run the production build, inspect route generation, and commit the smallest coherent change.

## 9. Security rules

Never commit `.env`, OAuth secrets, access tokens, service-role keys, private keys, or real customer data. Use `.env.example` only as a variable-name contract. Treat provider payloads and customer text as untrusted data. Keep server-only helpers out of client components. Verify signatures before trusting webhook payloads. Add audit logs before enabling automatic replies or moderation.
