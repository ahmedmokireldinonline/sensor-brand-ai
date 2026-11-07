# Deployment Handoff

## Repository

Deploy the `main` branch of:

```text
https://github.com/ahmedmokireldinonline/sensor-brand-ai
```

The `dev` branch contains the current implementation and should be kept as the review branch. The production branch is expected to receive the same commits before the first Vercel deployment.

## Build settings

The repository is a Next.js application. Vercel should detect the framework automatically.

```text
Install command: npm install
Build command: npm run build
Output: Next.js default
Node: use the Vercel project default supported Node version
```

## Required environment variables

Set these in Vercel Preview and Production environments as appropriate. Values are intentionally omitted from this document.

```text
APP_ENV
NEXT_PUBLIC_APP_URL
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
SUPABASE_SERVICE_ROLE_KEY
META_APP_ID
META_APP_SECRET
META_VERIFY_TOKEN
META_WEBHOOK_SECRET
GCP_PROJECT_ID
GCP_REGION
GOOGLE_APPLICATION_CREDENTIALS
```

`SUPABASE_SERVICE_ROLE_KEY`, `META_APP_SECRET`, `META_WEBHOOK_SECRET`, and Google service credentials must never use a `NEXT_PUBLIC_` prefix.

## Supabase

Use project ref `auekojzdfovhuepylsat` in `eu-west-1`. The database already contains the foundation and sync automation migrations. Do not recreate or manually edit applied migrations. New schema changes should be new migration files.

Before production use, configure Supabase Auth, verify redirect URLs, review RLS policies, and run security advisors.

## Webhooks

After deployment, the application URLs are:

```text
https://YOUR_VERCEL_DOMAIN/api/webhooks/meta
https://YOUR_VERCEL_DOMAIN/api/webhooks/google
https://YOUR_VERCEL_DOMAIN/api/webhooks/reddit
```

Meta verification uses `META_VERIFY_TOKEN`. Google and Reddit provider verification and signature logic still need to be implemented before registering their production webhooks.

## Current limitations

The application builds successfully, but source OAuth, authenticated workspace writes, provider fetch adapters, background worker execution, and real analytics queries are not complete. The UI intentionally renders empty states until those features are connected.
