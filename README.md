# Pool Leads

AI-powered lead generation platform for pool construction companies. Find high-quality, exclusive leads by identifying homes with pool-ready backyards, generate AI pool visualizations, and automate personalized outreach.

## What it does

- **Lead Dashboard** - Browse and filter property leads in your service area by home value, lot size, and status
- **AI Pool Renderings** - Generate AI-visualized pool renderings for each property using Anthropic Claude
- **Lead Pipeline** - Visual kanban board tracking New, Contacted, Interested, Quoted, Won, Lost
- **Outreach Postcards** - Generate downloadable postcard campaigns with before/after imagery
- **Service Area Filtering** - Builders set their zip codes and only see relevant leads
- **30 Pre-seeded Leads** - Realistic property data across Phoenix AZ, Orlando FL, Dallas TX, Las Vegas NV

## Running locally

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env.local
```

Fill in at minimum DATABASE_URL, AUTH_SECRET, and NEXTAUTH_URL.

### 3. Set up the database

Create a free PostgreSQL database at neon.tech, then:

```bash
npx prisma migrate dev --name init
npm run db:seed
```

### 4. Start the dev server

```bash
npm run dev
```

Visit http://localhost:3000

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| DATABASE_URL | Yes | Neon PostgreSQL connection string |
| AUTH_SECRET | Yes | Random JWT secret (openssl rand -base64 32) |
| NEXTAUTH_URL | Yes | App URL (http://localhost:3000 locally) |
| GOOGLE_MAPS_API_KEY | Optional | Satellite map images on lead detail pages |
| ANTHROPIC_API_KEY | Optional | AI pool rendering descriptions via Claude |

## Deploying to Vercel

1. Push to GitHub, connect to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy (postinstall auto-runs prisma generate)
4. Run: npx prisma migrate deploy
5. Run: npm run db:seed

## Tech Stack

- Next.js 16 App Router, TypeScript
- PostgreSQL via Neon, Prisma 7 with Neon adapter
- NextAuth.js v5 with JWT strategy
- Tailwind CSS v4, Radix UI
- Anthropic Claude (claude-opus-4-6) for AI features

## License

MIT (c) 2026 Riku Kenju
