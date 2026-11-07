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

- [x] Add provider connection interfaces for Meta, Google Business, Reddit, LinkedIn, and Custom Webhook.
- [x] Add a bilingual API settings workspace with masked credentials, local prototype persistence, connection test feedback, sync frequency, and callback URLs.
- [ ] Add Meta callback and Webhook route placeholders.
- [ ] Add Google integration configuration placeholders.
- [x] Surface LinkedIn and Custom Webhook in the source connection UI and Sync Center.
- [ ] Keep LinkedIn and Reddit adapters isolated from the normalized data model.
