# Pool Leads Developer Context

## What this project is

Pool Leads is a SaaS platform for pool construction companies to find exclusive leads. Instead of competing on shared lead marketplaces (HomeAdvisor, Angi), builders use this platform to browse pre-identified properties, view AI-generated pool visualizations, manage their sales pipeline via a kanban board, and generate personalized outreach postcards. The MVP uses 30 seeded property records across Sun Belt zip codes, with satellite imagery via Google Maps and AI renderings via Anthropic Claude.

## Architecture

```
app/
  (auth)/          - Login and signup pages (no navbar)
  (app)/           - Authenticated app pages (with navbar)
    dashboard/     - Lead list with stats and filters
    leads/[id]/    - Lead detail: map, rendering, status, notes, postcard
    pipeline/      - Kanban board view
    settings/      - User profile and service area
  api/             - All backend API routes
    auth/          - NextAuth handlers + signup endpoint
    leads/[id]/    - Status, notes, render, postcard endpoints
    pipeline/      - Kanban data endpoint
    settings/      - User settings CRUD
components/
  ui/              - Reusable Radix-based UI primitives (Button, Input, etc.)
  (feature)        - Feature-specific client components
lib/
  prisma.ts        - PrismaClient singleton (Neon adapter)
  utils.ts         - cn(), formatters, STATUS_LABELS, STATUS_COLORS constants
prisma/
  schema.prisma    - DB schema: User, Lead, BuilderLead, Campaign
  config.ts        - Prisma 7 datasource URL config
  seed.ts          - 30 seed leads across 6 zip code areas
auth.ts            - Full NextAuth config (Credentials provider + Prisma)
auth.config.ts     - Edge-compatible auth config (for middleware, no Prisma/bcrypt)
middleware.ts      - Route protection using edge-safe auth config
```

## Key Files

| File | Responsibility |
|---|---|
| auth.ts | Full NextAuth with Credentials provider, bcrypt verification, JWT/session callbacks |
| auth.config.ts | Edge-safe subset for middleware only (no DB imports) |
| middleware.ts | Redirects unauthenticated users from /dashboard, /leads, /pipeline, /settings |
| lib/prisma.ts | Singleton PrismaClient using @prisma/adapter-neon |
| prisma/config.ts | Prisma 7 config: sets datasource.url from env (not in schema.prisma) |
| app/(app)/dashboard/page.tsx | Auto-upserts BuilderLead records, renders stats + filter table |
| app/(app)/leads/[id]/page.tsx | Lead detail with map, pool economics, client sub-components |
| app/api/leads/[id]/render/route.ts | Calls Anthropic for pool description, assigns pool photo URL |
| components/dashboard-filters.tsx | Client: search + status filter for lead table |
| components/lead-status-form.tsx | Client: PATCH /api/leads/[id]/status |
| components/lead-notes-form.tsx | Client: PATCH /api/leads/[id]/notes |
| components/lead-render-button.tsx | Client: triggers AI render, displays result image |

## Data Flow

Sign up: /signup form -> POST /api/auth/signup -> bcrypt -> prisma.user.create -> signIn('credentials') -> /dashboard

Dashboard: server component -> auth() -> user.serviceZips -> leads matching zips -> upsert BuilderLead records -> render stats + pass to DashboardFilters client

Status update: LeadStatusForm -> PATCH /api/leads/[id]/status -> auth() verify ownership -> prisma.builderLead.update -> 200

AI render: LeadRenderButton click -> POST /api/leads/[id]/render -> Anthropic claude-opus-4-6 prompt -> Unsplash pool photo URL -> prisma.builderLead.update({renderedImageUrl}) -> display

## Stack Decisions

- Next.js App Router: server components for data, client only where needed
- Prisma 7 + Neon adapter: required for serverless compatibility; no SQLite support
- Split auth config: Credentials provider needs bcrypt+Prisma which are not edge-compatible; split into auth.config.ts (edge-safe) and auth.ts (full)
- JWT sessions: stateless, serverless-compatible
- Tailwind v4: CSS-first config, no tailwind.config.js

## Environment Variables

| Variable | Purpose |
|---|---|
| DATABASE_URL | Neon PostgreSQL connection string (requires ?sslmode=require) |
| AUTH_SECRET | Signs NextAuth JWT tokens. Generate: openssl rand -base64 32 |
| NEXTAUTH_URL | Base URL for auth callbacks. Required in production. |
| GOOGLE_MAPS_API_KEY | Satellite map imagery on lead pages. Optional - falls back to coordinate display. |
| ANTHROPIC_API_KEY | AI pool rendering via claude-opus-4-6. Optional - falls back to stock photo. |

## How to Run Locally

```bash
npm install
cp .env.example .env.local  # fill in values
npx prisma migrate dev --name init
npm run db:seed
npm run dev
```

Sign up with any email. Use zip codes 85001, 85251, 32801, 75201, 89101 to see seeded leads.

## Known Quirks

- Prisma in middleware: NEVER import auth.ts in middleware.ts. It imports Prisma which is not edge-compatible. Always use auth.config.ts in middleware.
- prisma/config.ts: Prisma 7 reads DATABASE_URL from prisma/config.ts, not schema.prisma. The datasource block has NO url= line intentionally.
- BuilderLead auto-creation: Dashboard upserts BuilderLead records on every load (idempotent via @@unique([userId, leadId])).
- Middleware deprecation: Next.js 16 renamed middleware.ts to proxy.ts. Warning is cosmetic, it still works.

## What is NOT Implemented

- Real satellite scanning (leads are seeded, not discovered)
- Actual AI image generation (Claude writes a description; a stock photo is assigned)
- PDF postcard generation (Campaign record created, pdfUrl is null - stub only)
- Physical mail integration
- Multi-seat teams (single user per account)
- Email verification or password reset
- Subscription/billing (plan field exists but no payment integration)
