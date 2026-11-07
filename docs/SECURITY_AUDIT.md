# Sensor Brand AI — Security Audit

## Scope

Repository revision `f3f8f27`, Supabase migrations under `supabase/migrations/`, Next.js API routes, browser integration settings, and the live Vercel deployment. No credentials or production database writes were used.

## Controls observed

- Supabase application tables enable RLS.
- Browser client uses the publishable key rather than a service-role key.
- Service-role helper is kept in a server-only library path.
- Meta verification GET requires `META_VERIFY_TOKEN`.
- OAuth state is generated with random bytes and stored as an HttpOnly cookie.
- Source and mention tables have workspace-aware policies and a mention/source workspace trigger.
- `.env.example` contains names rather than values.

## Blocking risks

1. Sync enqueue has no authenticated session or tenant authorization before service-role insertion.
2. Webhook POST has no authenticity verification, source mapping, anti-replay control, or rate limit.
3. Integration secrets are persisted in browser localStorage.
4. OAuth callback does not exchange or store tokens and lacks provider-specific validation.
5. Auth callback accepts an unvalidated redirect target.
6. External customer text is not yet isolated in an AI processing boundary because no AI pipeline exists.

## Database/RLS review

RLS is enabled on the declared application tables and organization/workspace helper functions use `security definer` with an explicit search path. However, automation tables have only authenticated SELECT policies, while service-role routes bypass RLS entirely. That makes route-level authorization mandatory. `sync_jobs` lacks a composite source/workspace integrity constraint, and the provider check conflicts with supported route values.

## Required security test set

- Anonymous and cross-tenant sync enqueue rejection.
- Role matrix tests for owner/admin/manager/analyst/viewer behavior.
- Meta/Google/Reddit/custom signature verification, stale timestamp, replay, malformed body, and duplicate delivery tests.
- OAuth state mismatch, reuse, provider mismatch, callback error, code exchange failure, and redirect allowlist tests.
- Secret redaction and localStorage absence tests.
- Rate-limit and payload-size tests.
- Prompt-injection fixtures in Arabic, English, Arabizi, and mixed-language content.
- Account export/deletion and retention tests before production data use.

**Disposition:** Not production ready. Do not register production webhooks or accept real provider credentials until the blocking risks are closed and verified.
