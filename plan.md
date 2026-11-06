# Sensor Brand AI — Phase 2 Plan

## Product foundation

Build a multi-workspace customer-opinion intelligence platform for Arabic and English brands. The first implementation establishes a secure Next.js foundation, workspace-aware data model, source connections, normalized mentions, classification records, and human-review workflows.

## Technical approach

- Next.js App Router and TypeScript for the web application and server routes.
- Supabase Postgres and Auth for persistence, identity, and workspace authorization.
- Vercel for preview and production deployments after the project is authorized.
- Provider adapters for Meta, LinkedIn, Reddit, and Google sources.
- Server-only AI and provider integrations; no secrets in browser code.
- Arabic RTL and English LTR support from the first dashboard screen.

## Design direction

Selected style: calm operational intelligence — a light, high-contrast workspace with deep ink typography, a distinctive teal signal color, restrained status colors, and dense but readable evidence panels. The interface should feel trustworthy and analytical rather than decorative.

Core principles: evidence before explanation; clear separation between signal and action; bilingual by default; safe escalation for uncertainty.

Brand voice: direct, calm, and useful. Example lines: “See what customers are telling you.” and “Turn recurring complaints into owned actions.”

## Project structure

- `app/`: routes, layouts, RTL/LTR shell, and future dashboard pages.
- `components/`: reusable interface components.
- `lib/`: server-only clients, authorization, provider adapters, and domain logic.
- `supabase/migrations/`: versioned database schema and RLS policies.
- `docs/`: operational and integration documentation.
- `.env.example`: variable names only; no secrets.

## Phase 2 outcome

A private GitHub repository with a buildable Next.js shell, environment-variable contract, initial migration location, and deployment configuration ready for Supabase and Vercel authorization.
