# Vercel Checklist

1. Import `ahmedmokireldinonline/sensor-brand-ai`.
2. Use the `main` branch for Production and `dev` for Preview review.
3. Confirm the framework is Next.js.
4. Add the environment variables listed in `docs/DEPLOYMENT_HANDOFF.md`.
5. Deploy a Preview first.
6. Confirm `/`, `/dashboard`, `/workspaces`, `/sources`, `/sync`, and `/analytics` render.
7. Confirm `/manus-routes.json` returns JSON.
8. Confirm `/api/webhooks/meta` does not expose secrets and returns verification failure without a valid token.
9. Configure provider callback URLs only after OAuth and signature validation are implemented.
10. Promote to Production only after Supabase Auth, RLS, and provider integration checks are complete.
