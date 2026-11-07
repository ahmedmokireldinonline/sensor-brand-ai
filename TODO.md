# Sensor Brand AI — Phase 2 TODO

## Repository foundation

- [x] Create a private GitHub repository named `sensor-brand-ai`.
- [x] Add a secure `.gitignore` and `.env.example` without secrets.
- [x] Add the Next.js App Router shell and bilingual layout.
- [x] Add `main` and `dev` branches.

## Hosting and data

- [x] Create the new Supabase project `sensor-brand-ai` in `eu-west-1`.
- [x] Add the first workspace-aware migration after the target project is confirmed.
- [ ] Create the Vercel project in the authorized team.
- [ ] Connect Vercel to the GitHub repository.
- [ ] Configure Preview and Production environment variables without committing secrets.

## Security baseline

- [x] Add workspace-scoped authorization and RLS policies.
- [ ] Add secret scanning to CI.
- [ ] Add dependency and type checks to CI.
- [ ] Document token rotation and deletion handling.

## Integration preparation

- [ ] Add provider connection interfaces.
- [ ] Add Meta callback and Webhook route placeholders.
- [ ] Add Google integration configuration placeholders.
- [ ] Keep LinkedIn and Reddit adapters isolated from the normalized data model.

## Product experience and discoverability

- [x] Make the application shell usable on mobile with an off-canvas navigation, explicit close/open states, keyboard focus styles, touch-sized controls, and RTL-aware placement.
- [x] Improve bilingual behavior by respecting a saved language, falling back to the browser language, updating `lang` and `dir`, and exposing accessible language choices.
- [x] Add first-party attribution capture for landing path, referrer, UTM parameters, Google click ID, and Meta click ID without putting secrets in the browser.
- [x] Add a server endpoint for allow-listed page-view and interaction events, with authenticated routes excluded from indexing.
- [x] Add canonical metadata, Open Graph/Twitter metadata, robots rules, sitemap output, and a skill registry that maps external references to safe product locations.
- [ ] Replace console-only event ingestion with a workspace-scoped analytics table and retention policy after the production data model is approved.
- [ ] Add provider-owned OAuth callbacks and verified API clients for Google Business Profile, Meta, and Reddit.
