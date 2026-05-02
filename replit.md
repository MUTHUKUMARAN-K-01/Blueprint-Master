# Workspace

## Overview

Project Omnisense — a multi-agent Market Intelligence Engine for B2B sales teams. Accepts a company name and category, then deploys a simulated AI agent swarm to produce 10 structured intelligence outputs.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **Frontend**: React + Vite (artifacts/omnisense), wouter routing, framer-motion, dark-mode terminal aesthetic
- **API framework**: Express 5 (artifacts/api-server)
- **Database**: PostgreSQL + Drizzle ORM (`reports` table stores generated intelligence reports)
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **AI**: OpenAI via Replit AI Integrations (gpt-5.4 for intelligence synthesis)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

## Architecture

### Frontend (artifacts/omnisense — previewPath: /)
- `/` — Command Input page ("INITIATE RECON" dark landing)
- `/generating` — Agent Terminal live log view (animated terminal logs during API call)
- `/report/:id` — Intelligence Dashboard (10-output card grid)
- `/history` — Past Reports list

### Backend (artifacts/api-server — previewPath: /api)
- `POST /api/intelligence/generate` — runs multi-agent workflow: mock scraper → knowledge graph → AI synthesis → zero-hallucination contact lookup → outreach generation
- `GET /api/reports` — list all saved reports
- `GET /api/reports/:id` — get a specific report

### Intelligence Outputs
1. Company Overview
2. Market Position
3. Competitor Mapping (3-4 competitors with strengths/gaps)
4. Brand Activity (last 12-24 months)
5. Experiential Footprint
6. Strategic Watchouts (GraphRAG-style knowledge graph traversal)
7. Decision-Maker Roles
8. Contact Intelligence (verified or "Data Unavailable" — zero-hallucination guardrail)
9. Personalized Outreach (LinkedIn + Email with campaign references)
10. Tracking Pixel Logic (live HTML pixel + webhook architecture explanation)

## Key Files

- `lib/api-spec/openapi.yaml` — API contract (single source of truth)
- `lib/db/src/schema/reports.ts` — Reports table schema
- `artifacts/api-server/src/routes/intelligence.ts` — Core agent orchestration logic
- `artifacts/api-server/src/routes/reports.ts` — Report CRUD routes
- `artifacts/omnisense/src/pages/home.tsx` — Command input
- `artifacts/omnisense/src/pages/generating.tsx` — Agent terminal
- `artifacts/omnisense/src/pages/report.tsx` — Intelligence dashboard
- `artifacts/omnisense/src/pages/history.tsx` — Reports history

## Environment Variables

- `DATABASE_URL` — PostgreSQL connection string (auto-provisioned)
- `AI_INTEGRATIONS_OPENAI_BASE_URL` — Replit AI proxy URL (auto-provisioned)
- `AI_INTEGRATIONS_OPENAI_API_KEY` — Replit AI key (auto-provisioned)
- `SESSION_SECRET` — Session secret

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
