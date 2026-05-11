# OpenAnim Cloud — Plan

## Overview

Two repositories, one product:

| Repo | Visibility | Role |
|------|-----------|------|
| `openanim/openanim` | Public (OSS) | Core orchestrator + backends (Manim, Remotion, FFmpeg, ...) |
| `openanim/openanim-cloud` | Private | Commercial website + services built on top of openanim |

OpenAnim the OSS repo is the engine. Anyone can clone it, bring their own LLM key, and generate videos locally via CLI. No dependencies on us.

OpenAnim Cloud wraps that engine with a SaaS layer — web UI, job queuing, cloud rendering, context retrieval, analytics, premium models. The private repo embeds openanim as a **git submodule**, not a pip package. This keeps the OSS CLI fully standalone for local users while letting the cloud fork run ahead of the public release when needed.


## OpenAnim (OSS) — Scope

```
openanim/
├── app.py                       # CLI entry point + orchestrator
├── backend/
│   ├── _config.py               # Reads [tool.openanim] from pyproject.toml
│   ├── base.py                  # Backend ABC (system_prompt, validate, render)
│   ├── manim.py                 # Manim backend
│   └── ...                      # Remotion, FFmpeg, PlantUML (future)
├── retriever/
│   └── bm25.py                  # BM25 keyword-based context retrieval
├── pyproject.toml               # Dependencies + [tool.openanim] config
└── package.json                 # bun convenience scripts
```

**What it does:**
- Takes a natural language prompt via CLI
- Retrieves relevant API docs via BM25 (local, no embedding API needed)
- Calls any OpenAI-compatible LLM (user provides key) to generate code
- Validates, heals (retries on error, max 3 attempts), and renders
- Pluggable backends — adding a new engine means implementing the Backend ABC

**What it does NOT have (moved to cloud):**
- Vector-based RAG / embeddings
- Response caching
- Pipeline logging / analytics
- User accounts
- Job queuing


## OpenAnim Cloud (Private) — Scope

A pnpm monorepo that builds the commercial service on top of the OSS engine.

### Tech Stack

| Layer | Choice | Why |
|-------|--------|-----|
| Package manager | pnpm | Mature, fast, great workspace support |
| Monorepo orchestration | Turborepo | Caching, parallel tasks, well-proven |
| Frontend | Next.js 15 (App Router) | SSR, API routes, dominant React framework |
| Styling | CSS Modules | Vanilla, no vendor lock-in |
| API server | Fastify | Mature (est. 2016), fast, great plugin system, OpenAPI built-in |
| Database | PostgreSQL | Battle-tested, scales |
| ORM | Drizzle ORM | Type-safe, lightweight, good migrations |
| Queue | BullMQ + Redis | Mature job queue, widely used in production |
| Workers | Python subprocess | Calls openanim directly (import, not subprocess) |
| Auth (future) | NextAuth v5 | Open-source, Google OAuth + credentials, no vendor lock-in |
| Email | Resend | Simple API, good free tier |
| Hosting (frontend) | Vercel | Native Next.js support |
| Hosting (backend) | TBD | Railway / Fly.io / VPS — decide later |
| Hosting (workers) | TBD | Needs GPU for Manim rendering |

### Monorepo Structure

```
openanim-cloud/
├── pnpm-workspace.yaml
├── package.json                      # root scripts, dependencies
├── turbo.json                        # Turborepo pipeline config
├── tsconfig.base.json                # shared TS config
├── .env.example
├── .gitignore
├── docker-compose.yml                # postgres + redis (local dev)
│
├── apps/
│   ├── web/                          # Next.js 15 (frontend)
│   │   ├── package.json
│   │   ├── next.config.ts
│   │   ├── tsconfig.json
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── layout.tsx
│   │   │   │   ├── page.tsx          # landing page
│   │   │   │   └── globals.css
│   │   │   └── components/
│   │   │       ├── Hero.tsx
│   │   │       ├── HowItWorks.tsx
│   │   │       ├── Backends.tsx
│   │   │       ├── WhyDeterministic.tsx
│   │   │       ├── Waitlist.tsx
│   │   │       ├── Footer.tsx
│   │   │       └── TerminalDemo.tsx
│   │   └── public/
│   │
│   └── api/                          # Fastify API server
│       ├── package.json
│       ├── tsconfig.json
│       ├── src/
│       │   ├── index.ts             # Fastify app entry
│       │   ├── plugins/
│       │   │   ├── cors.ts
│       │   │   └── db.ts            # Drizzle client plugin
│       │   ├── routes/
│       │   │   └── waitlist.ts      # POST /api/waitlist
│       │   └── schemas/
│       │       └── waitlist.ts      # Zod validation
│       └── drizzle/
│           └── migrations/
│
├── packages/
│   ├── db/                           # Drizzle schema (shared)
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── drizzle.config.ts
│   │   └── src/
│   │       ├── schema.ts            # waitlist table + future tables
│   │       └── index.ts             # db client export
│   │
│   └── shared/                       # Shared types, constants, utils
│       ├── package.json
│       ├── tsconfig.json
│       └── src/
│           └── types.ts
│
├── workers/                          # Python render workers (future)
│   ├── pyproject.toml
│   ├── worker.py                     # from openanim.orchestrator import run
│   └── requirements.txt
│
└── openanim/                         # Git submodule → openanim/openanim
    └── ...                           # The OSS orchestrator code
```

### How OpenAnim Integrates

The `openanim/` directory is a **git submodule** pointing to `openanim/openanim`.

**For local users (OSS):**
```
git clone https://github.com/openanim/openanim
cd openanim
uv run python app.py "draw a red circle" -q h
```
Standalone. No cloud dependency. Works offline.

**For the cloud:**
```
# Worker (Python) directly imports openanim
# workers/worker.py
from pathlib import Path
import sys
sys.path.insert(0, str(Path(__file__).parent.parent / "openanim"))
from app import generate_code, self_healing_loop, clean_code
from backend import get_backend

def render_job(prompt, backend="manim", quality="l"):
    be = get_backend(backend)
    code, _ = generate_code(prompt, be)
    code = clean_code(code)
    success = self_healing_loop(code, prompt, be, quality, max_attempts=3)
    # upload result to S3/R2, update job status in DB
```

**Staying ahead of OSS:**
- Point the submodule at a branch or commit, not `main`
- Develop new backends/features in a private branch
- Test with the full cloud stack
- Merge upstream to OSS when stable
- Bump the submodule ref when ready

### Database Schema (initial)

```sql
-- packages/db/src/schema.ts

waitlist:
  id          uuid        primary key, default gen_random_uuid()
  email       text        unique, not null
  status      enum        'pending' | 'invited' | 'active', default 'pending'
  created_at  timestamp   default now()
```

Future tables: users, projects, jobs, render_outputs, api_keys.

### API Routes (initial)

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/waitlist` | Accept email, insert into waitlist table |
| GET | `/api/health` | Health check |

### Landing Page — Design Brief

- **Aesthetic**: Dark terminal (background #0a0a0f, accent #00ff88 green)
- **Fonts**: JetBrains Mono (code), Inter (body)
- **Sections**: Hero → How It Works → Backend Engines → Why Deterministic → Waitlist → Footer
- **Core message**: "Video generation that doesn't hallucinate. Describe your video, get real, editable code. Rendered deterministically through Manim, Remotion, and FFmpeg."
- **CTA**: Join waitlist (email form) + Star on GitHub
- The waitlist form POSTs to the Fastify API. If API isn't running locally, show a mock success state.
- No frameworks, no Tailwind, no UI kits — just CSS Modules


## Phases

### Phase 1 — Now (Landing + Waitlist)
- [ ] Scaffold pnpm monorepo with Turborepo
- [ ] Set up Docker Compose (PostgreSQL)
- [ ] `packages/db`: Drizzle schema + client
- [ ] `apps/api`: Fastify server with POST /api/waitlist
- [ ] `apps/web`: Next.js landing page (all sections, dark terminal design)
- [ ] Add openanim as git submodule (placeholder)
- [ ] Deploy frontend to Vercel

### Phase 2 — Auth + Dashboard
- [ ] NextAuth v5 (Google OAuth + email magic link)
- [ ] User table + sessions in DB
- [ ] Basic dashboard (empty shell, shows nothing yet)
- [ ] Protected API routes

### Phase 3 — Rendering Pipeline
- [ ] BullMQ + Redis job queue
- [ ] Python render workers (import openanim, call orchestrator)
- [ ] Job status tracking (pending → rendering → done/failed)
- [ ] Upload rendered videos to S3/R2
- [ ] Dashboard: submit prompts, view job history, download videos

### Phase 4 — Enhanced Services
- [ ] BM25 context retrieval service
- [ ] LLM caching layer (Redis)
- [ ] Pipeline analytics dashboard
- [ ] Model routing (free vs premium LLM)
- [ ] Prompt template library
- [ ] Concurrent rendering (multiple workers)

### Phase 5 — Scale
- [ ] GPU worker pool for Manim rendering
- [ ] Usage-based pricing / billing
- [ ] Team accounts
- [ ] API for third-party integrations
- [ ] Embeddable video player


## Open Questions

1. **Worker hosting**: Railway? Fly.io GPU? AWS Batch? Needs to run Python + Manim + FFmpeg.
2. **Video storage**: S3? Cloudflare R2? Bunny CDN?
3. **Email provider**: Resend works for transactional email. What about marketing drip?
4. **LLM for cloud users**: Which model is the paid default? Do users bring their own key or use ours?
5. **Rendering timeouts**: Manim renders can take minutes. What's the max job duration?
6. **Remotion worker**: Remotion is Node.js, so it would need a separate TypeScript worker (not Python). How does that fit into the worker pool?
