# Sensor Brand AI — Implementation Roadmap

## Phase 0 — Release hygiene

- Remove the generated local `.eslintrc.json` unless deliberately adopting it.
- Migrate from deprecated `next lint` to a committed ESLint CLI configuration that runs non-interactively.
- Add CI for install, typecheck, lint, tests, production build, secret scanning, and dependency audit.
- Resolve or document dependency vulnerabilities.
- Rename/retire the empty duplicate `0001_phase2_foundation.sql` through a safe migration-ledger cleanup process.

## Phase 1 — Security foundation (highest priority)

- Add server-side Supabase session validation to every protected route.
- Derive user identity from the session; never accept `requested_by` as authority.
- Verify source/workspace ownership before enqueueing jobs.
- Add rate limiting, body-size limits, request IDs, safe error handling, and replay windows.
- Implement provider-specific webhook signatures and reject unsigned requests.
- Store only sanitized event metadata in logs; isolate raw external text from instructions.
- Replace `next` redirect handling with a same-origin allowlist.
- Add security regression tests for auth, tenant isolation, webhook signatures, replay, and malformed payloads.

## Phase 2 — Credential and provider foundation

- Create a server-side credential reference/encryption design with rotation and revocation.
- Complete one Tier 1 provider end-to-end, recommended: Meta Pages/Instagram.
- Implement OAuth code exchange, state/PKCE as applicable, token refresh, permissions validation, source linking, and disconnect.
- Define a provider adapter interface and contract tests.
- Resolve supported-provider values consistently across route, database, and UI.

## Phase 3 — Ingestion and durable jobs

- Introduce worker/queue runtime appropriate for long-running sync; Vercel handlers should enqueue only.
- Implement job leases, retry/backoff, idempotency, dead-letter handling, cursor persistence, and health metrics.
- Normalize posts/comments/reviews into mentions with source provenance and stable provider keys.
- Add historical and incremental synchronization where supported.

## Phase 4 — AI intelligence

- Add classification schema and model-independent service interface.
- Implement Arabic/English language detection, sentiment, emotion, topic, complaint, urgency, spam, competitor, relevance, and confidence.
- Add prompt-injection defenses and human review for low confidence.
- Create fixtures for MSA, Egyptian, Gulf, Saudi, Levantine, Arabizi, mixed-language, slang, and sarcasm.

## Phase 5 — Analytics and reporting

- Replace hard-coded cards with traceable queries.
- Add filters by date, workspace, brand, source, language, and provider.
- Define and document reputation/share-of-voice formulas and minimum sample rules.
- Add export, report generation, and scheduled report execution only after data lineage exists.

## Phase 6 — Customer care and automation

- Build unified inbox, cases, assignments, SLA, internal notes, templates, and response suggestions.
- Keep public publishing disabled by default; require explicit human approval and provider permission.
- Add event-driven notifications with retries, idempotency, delivery history, and audit records.

## Phase 7 — Commercialization and production readiness

- Implement organizations, invitations, role matrix, usage metering, plans, trials, billing, retention, export, and deletion.
- Perform load, security, RLS, OAuth, webhook, worker, and disaster-recovery testing.
- Deploy Preview first, verify with real authorized sandbox accounts, then promote to Production.

Every phase must end with typecheck, lint, automated tests, build, security review, documentation update, and an explicit completed/remaining report.
