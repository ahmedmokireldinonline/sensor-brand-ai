# Sensor Brand AI — Skill registry

This repository keeps external skill sources as implementation references, not as executable application code. Pinning the source and mapping it to a product surface keeps the SaaS maintainable and avoids shipping plugin commands, credentials, or provider secrets to users.

## Registered sources

- [Anthropic skills](https://github.com/anthropics/skills): prompting, document, and agent-workflow references.
- [Vercel agent skills](https://github.com/vercel-labs/agent-skills): Next.js, React, deployment, and performance guidance.
- [n8n skills](https://github.com/czlonkowski/n8n-skills): workflow design patterns and node conventions.
- [n8n templates and node docs](https://github.com/haunchen/n8n-skills): reusable automation references.
- [Agents Inc skills](https://github.com/agents-inc/skills): SaaS patterns for Supabase, Firebase, Clerk, NextAuth, Stripe, and CI/CD.
- [Awesome Claude skills](https://github.com/ComposioHQ/awesome-claude-skills): discovery index only; individual skills must be reviewed before adoption.

## Product mapping

| Skill family | Product location | Current use |
| --- | --- | --- |
| Vercel / React | `app/`, `components/`, `next.config.ts` | App Router structure, responsive UI, metadata, and build checks |
| SaaS / Supabase | `lib/`, `supabase/migrations/`, auth routes | Workspace isolation, auth, RLS, and server-only credentials |
| Automation / n8n | `app/sync/`, `app/api/sync/`, `docs/` | Sync cadence, idempotent webhooks, and future workflow adapters |
| Brand discovery / tracking | `lib/attribution.ts`, `components/analytics.tsx`, `app/api/track/` | UTM, referrer, Google click ID, Meta click ID, page views, and interaction events |
| SEO / discoverability | `app/layout.tsx`, `app/robots.ts`, `app/sitemap.ts`, `public/manus-routes.json` | Canonical metadata, Open Graph, robots policy, and public route discovery |

## Activation rules

1. Never commit API keys, OAuth tokens, service-role keys, n8n credentials, or customer data.
2. Provider skills belong behind server routes and workspace authorization; browser code only receives normalized, non-secret state.
3. A new external skill is activated only after its license, maintenance status, required credentials, and data access are reviewed.
4. Tracking is first-party and privacy-minimal. The current collector records attribution and product events without fingerprinting or exposing authenticated routes to search engines.
5. Integrations that need production credentials remain pending until the corresponding environment variables are configured in Vercel/Supabase.
