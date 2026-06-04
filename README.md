# TalentDash — Career Intelligence Platform

> Structured, comparable, decision-ready career data served at internet scale.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router), TypeScript strict |
| Styling | Tailwind CSS v4 (utility classes only, no ShadCN/MUI) |
| Database | PostgreSQL via Neon + Prisma ORM |
| AI Pipeline | Python + Playwright + Pydantic + Groq LLM |
| Rendering | SSG + ISR (static pages from CDN edge) |

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Set up environment
cp .env.example .env.local
# Edit .env.local with your Neon PostgreSQL connection string

# 3. Generate Prisma client & run migrations
npx prisma generate
npx prisma db push

# 4. Seed the database (62 records across 12 companies)
npx prisma db seed

# 5. Start development server
npm run dev
```

Visit: [http://localhost:3000](http://localhost:3000)

## Project Structure

```
talentdash/
├── app/                        # Next.js App Router
│   ├── layout.tsx              # Root layout (Inter font, nav, footer)
│   ├── page.tsx                # Homepage (ISR revalidate: 3600)
│   ├── salaries/page.tsx       # /salaries (Static RSC)
│   ├── companies/[slug]/page.tsx   # /companies/{slug} (generateStaticParams)
│   ├── compare/page.tsx        # /compare ('use client')
│   ├── not-found.tsx           # Custom 404
│   └── api/
│       ├── ingest-salary/route.ts  # POST validation + normalisation + dedup
│       ├── salaries/route.ts       # GET with filters + pagination
│       ├── companies/[slug]/route.ts   # GET company + median + levels
│       └── compare/route.ts        # GET two records + delta
├── components/
│   ├── ui/                     # Primitive components (Badge, Button, Input, Select)
│   └── features/               # Product components (SalaryTable, Filters, etc.)
├── lib/                        # Shared utilities
│   ├── mock-data.ts            # 65+ seed records
│   ├── format.ts               # Indian lakh/crore formatting
│   ├── currency.ts             # Conversion rates
│   ├── normalise.ts            # Company name normalisation
│   ├── seo.ts                  # JSON-LD + metadata generators
│   └── db.ts                   # Prisma client singleton
├── types/                      # TypeScript interfaces (SalaryRecord, Company)
├── prisma/
│   ├── schema.prisma           # Company + Salary models
│   └── seed.ts                 # 62 records across 12 companies
└── pipeline/                   # Python AI data pipeline
    ├── scraper/                # Playwright scraper for AmbitionBox
    ├── normalise/              # LLM + Pydantic validation
    ├── storage/                # API ingest client
    ├── dedup/                  # Deduplication logic
    └── reports/                # Quality report generator
```

## Architecture Decisions

### Why Static (SSG) vs ISR vs Dynamic for Each Page

| Page | Strategy | Reason |
|---|---|---|
| Homepage | ISR (3600s) | Changes daily — trending companies, stats. |
| `/salaries` | Static RSC | Core SEO asset. Must be fastest. Rebuilt via ISR trigger. |
| `/companies/[slug]` | Static (generateStaticParams) | Changes rarely. Pre-built per company at build time. |
| `/compare` | Client component | User-specific selection. Cannot be prebuilt. |
| API routes | Dynamic | Query-specific. Cached at CDN edge via Cache-Control headers. |

**Rationale**: Static-first is the business model. A page built once can be served a million times at near-zero server cost from Cloudflare CDN.

### Why Page-Based Pagination (not Cursor-Based)

- **SEO**: Page numbers generate distinct URLs that Google can index (`/salaries?page=2`)
- **Shareability**: Users can share a specific page of results
- **Simplicity**: For MVP with ~10K records, page-based is sufficient and simpler to implement
- **Cursor-based trade-off**: Better for infinite scroll and real-time feeds, but salary data is not a feed — it's a table users scan

### Cache-Control TTL Rationale

| Endpoint | TTL | Why |
|---|---|---|
| `GET /api/salaries` | `s-maxage=300, swr=3600` | Salary data changes but not per-second. 5 min fresh + 1h stale is a good balance. |
| `GET /api/companies/:slug` | `s-maxage=3600, swr=86400` | Company metadata rarely changes. 1h fresh + 24h stale. |
| `GET /api/compare` | `no-cache` | Record-specific comparison. Cannot be shared across users. |

### What I Would Build Differently With Another Day

1. **Database-driven pages**: Replace mock-data.ts with live Prisma queries in RSC pages
2. **Full-text search**: Add PostgreSQL tsvector indexes on company + role fields
3. **ISR revalidation**: Wire up POST /api/ingest-salary to trigger revalidatePath
4. **Rate limiting**: Add rate limiting to the API routes via middleware
5. **Error boundaries**: Add React error boundaries for graceful failure

### What I Did NOT Build (Scope Choices)

- **Reviews, Interviews, Community, Workplace Index, Tools pages**: Deprioritised — focused on the salary data core which powers the SEO flywheel
- **Authentication (Clerk/Auth.js)**: Not required for this trial — no login walls
- **BullMQ job queue**: Infrastructure dependency not needed for MVP
- **Cloudflare R2 storage**: No logos or file exports in the trial
- **Typesense search**: PostgreSQL FTS is sufficient for Phase 1

## API Endpoints

### POST /api/ingest-salary
Full validation pipeline: required fields → types → enum → ranges → normalise company → recompute TC → dedup check.

### GET /api/salaries
`?company=amazon&level=L4&location=bengaluru&sort=total_comp_desc&page=1&limit=25`

### GET /api/companies/:slug
Returns company metadata, salary list, median_total_compensation (true median), level_distribution.

### GET /api/compare
`?s1={uuid}&s2={uuid}` — Returns both records + delta object.

## Integration Data Contract

| Field | Type | Notes |
|---|---|---|
| company | string | Normalised lowercase |
| role | string | As submitted |
| level_standardized | enum | L3\|L4\|L5\|L6\|SDE_I\|SDE_II\|SDE_III\|STAFF\|PRINCIPAL\|IC4\|IC5 |
| location | string | City name only |
| currency | enum | INR\|USD\|GBP\|EUR |
| experience_years | integer | 1–50 |
| base_salary | number | Smallest unit (paise/cents) |
| bonus | number | Default 0 |
| stock | number | Default 0 |
| total_compensation | number | **COMPUTED**: base + bonus + stock |
| source | enum | CONTRIBUTOR\|SCRAPED\|AI_INFERRED |
| confidence_score | float | 0.0–1.0 |
