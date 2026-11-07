# Sensor Brand AI

Sensor Brand AI is a bilingual Arabic/English customer-opinion intelligence platform for brands. It is designed around isolated brand workspaces, connected social and review sources, normalized customer mentions, sentiment and topic analysis, recurring-issue detection, and future human-approved AI responses.

## Current state

This repository contains the working Next.js prototype: a product landing page, Supabase email login/signup, internal Dashboard, Workspaces, Sources, Sync Center, Analytics, webhook intake, sync-job enqueue, Supabase migrations, responsive bilingual styling, and deployment documentation. The operational UI intentionally uses empty states until OAuth, source adapters, background workers, and live analytics queries are connected.

The experience layer now includes a mobile off-canvas shell, browser-aware Arabic/English selection, first-party URL attribution (`utm_*`, `gclid`, `fbclid`, and referrer), an allow-listed `/api/track` event endpoint, canonical/social metadata, and generated `robots.txt`/`sitemap.xml`. See [Skill Registry](docs/SKILL_REGISTRY.md) for the reviewed external skill sources and how they map to product code.

The production build has been verified with `npm run build`.

## Start locally

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`. The local UI can render without credentials. API routes that write to Supabase require the server-side environment variables described in `.env.example` and `docs/DEPLOYMENT_HANDOFF.md`.

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Product landing page and prototype entry point |
| `/login` | Supabase email sign-in and signup |
| `/auth/callback` | Email confirmation/session callback |
| `/dashboard` | Workspace overview and operational signals |
| `/workspaces` | Brand workspace management UI |
| `/sources` | Meta, Google Business, and Reddit source setup UI |
| `/sync` | Webhook and background-sync monitoring |
| `/analytics` | Mentions, sentiment, themes, language, and source analytics |
| `/api/webhooks/:provider` | Provider webhook intake and Meta verification |
| `/api/sync/run` | Queue a background sync job |
| `/api/track` | Receive allow-listed first-party product events |

## Project documentation

Start with [AI Project Context](docs/AI_PROJECT_CONTEXT.md) for the full architecture, database state, API behavior, known limitations, and debugging protocol. Use [Deployment Handoff](docs/DEPLOYMENT_HANDOFF.md) and [Vercel Checklist](docs/VERCEL_CHECKLIST.md) when deploying. [Implementation Status](docs/IMPLEMENTATION_STATUS.md) records what is delivered versus what remains. [Contributing](CONTRIBUTING.md) defines safe change and migration rules.

## Stack

The web application uses Next.js 15, React 19, TypeScript, and the App Router. Supabase provides Postgres, Auth, and Row Level Security. Vercel is the intended deployment target. Provider integrations are planned for Meta, Google Business Profile, and Reddit, with a normalized source model that can later support LinkedIn and other providers.

## Supabase project

The current development project is in `eu-west-1`:

```text
Project name: sensor-brand-ai
Project ref: auekojzdfovhuepylsat
```

Applied migrations are `sensor_brand_foundation` and `sync_automation`. The migration files are versioned under `supabase/migrations/`. Never commit service-role keys, OAuth secrets, access tokens, private keys, or real customer data.

## Branches

`dev` is the active implementation/review branch. `main` is the deployment branch. Merge reviewed changes from `dev` to `main` before connecting Production in Vercel.
