# Contributing to Sensor Brand AI

Read `docs/AI_PROJECT_CONTEXT.md` before changing the project. Keep changes small, preserve the bilingual experience, and keep all data access workspace-scoped.

Run the following before opening a pull request:

```bash
npm install
npm run build
```

For database changes, add a new file under `supabase/migrations/` and apply it to the intended Supabase project. Never rewrite an already-applied migration. Do not seed fake customer data into the production database.

Keep credentials out of Git. Use `.env.example` for names only. Server secrets belong in Vercel encrypted environment variables or a secret manager. Do not expose Supabase service-role keys, Meta secrets, OAuth tokens, or Google private keys in client components, logs, screenshots, or documentation.
