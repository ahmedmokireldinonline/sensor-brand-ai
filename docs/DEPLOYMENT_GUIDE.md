# Sensor Brand AI — Deployment Guide

## Current deployment

The live Vercel URL `https://sensor-brand-ai.vercel.app/` served the landing page successfully during the audit. This confirms deployment reachability only; it does not confirm authentication, Supabase writes, OAuth, webhooks, workers, or analytics.

## Required environment contract

Use Vercel Preview and Production secret settings, never Git:

- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (server-only)
- Provider client IDs/secrets, redirect URIs, webhook secrets, and verification tokens
- AI provider credentials only on server/worker runtimes

Never expose service-role keys, OAuth secrets, access tokens, or private credentials with a `NEXT_PUBLIC_` prefix.

## Pre-deployment gates

- Close all Critical and High findings in `TECHNICAL_AUDIT.md`.
- Run typecheck, non-interactive lint, tests, build, dependency audit, and secret scan in CI.
- Apply new migrations only after review; do not edit applied migrations.
- Verify Supabase Auth redirect URLs and review RLS/security advisors.
- Complete one provider in a sandbox with real authorized credentials.
- Confirm worker/queue health, retry policy, observability, and rollback procedure.
- Confirm no real credentials or customer data are present in build artifacts/logs.

## Release sequence

1. Open a reviewed pull request from `dev`.
2. Run all CI gates and database migration checks.
3. Deploy a Vercel Preview.
4. Run authenticated smoke tests against a non-production workspace/provider account.
5. Confirm webhook signature verification and idempotency.
6. Promote to Production only after explicit release approval.
7. Monitor errors, queue health, provider rate limits, and auth failures.

## Rollback

Rollback the application deployment through Vercel to the last verified build. Database changes must be forward-compatible; use a compensating migration rather than rewriting an applied migration. Revoke compromised provider tokens and rotate affected secrets immediately.
