# Sensor Brand AI — Testing Strategy

## Current validation record (2026-11-07)

- TypeScript: pass (`npm run typecheck`).
- Production build: pass (`npm run build`), with one Autoprefixer warning.
- Lint: fail; `next lint` is deprecated, interactive, and the generated ESLint 9 configuration fails with a circular configuration error.
- Automated tests: none present.
- Dependency audit: production tree has 1 moderate and 1 high vulnerability; full tree has 9 moderate and 1 high.
- Live smoke checks: landing page 200; invalid Meta verification 403; integration status 200 with all providers false.

## Required test layers

### Unit

- Slug and input validation.
- Provider adapter normalization and pagination.
- Signature verification and constant-time comparison.
- Delivery-key/idempotency derivation.
- Cursor advancement and retry classification.
- Analytics formulas and minimum-sample rules.
- Arabic/English/dialect classification parsing and confidence thresholds.

### Integration

- Supabase RLS matrix across organization/workspace roles.
- Onboarding RPC transaction and uniqueness failures.
- Source/workspace ownership constraints.
- Webhook insert/update lifecycle and duplicate delivery behavior.
- OAuth state, token exchange, encrypted persistence, refresh, and revocation.
- Worker lease, retry, cursor, dead-letter, and failure recovery.

### End-to-end

- Sign-up/sign-in/session refresh/sign-out.
- Create workspace, switch workspace, invite member, and enforce role permissions.
- Connect/disconnect a sandbox provider.
- Receive and normalize a webhook.
- Run incremental sync and inspect activity.
- Review low-confidence classification and approve a response without publishing.
- Verify Arabic RTL and English LTR layouts on mobile and desktop.

### CI gates

1. Deterministic dependency install.
2. Secret scan.
3. TypeScript.
4. ESLint CLI.
5. Unit/integration tests.
6. Production build.
7. Dependency audit with an explicit policy.
8. Migration lint/schema checks.
9. Artifact and route smoke checks.

No test may use real customer data or mutate shared production tables. Use isolated Supabase test projects or transaction-safe fixtures.
