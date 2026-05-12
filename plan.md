## Overview

OpenAnim is split into two separate systems:

| System | Visibility | Role |
|---|---|---|
| `openanim/openanim` | Public (OSS) | Deterministic orchestration engine + rendering providers |
| `openanim/openanim-cloud` | Private | Commercial SaaS platform built around the OSS engine |

The OSS repository is the core execution engine. Users can clone it, bring their own LLM key, and generate videos locally through the CLI without any dependency on OpenAnim Cloud.

The cloud platform adds:
- hosted rendering
- queues
- distributed workers
- accounts
- analytics
- storage
- premium orchestration features
- API access

The private cloud repo should NOT embed the OSS repo as a git submodule.

Instead:
- the OSS engine is versioned and installable
- workers depend on it as a package
- boundaries are maintained through APIs and schemas rather than Git linkage

---

# Core Philosophy

OpenAnim is not just "AI video generation".

Architecturally, it is closer to:

> deterministic multimodal compilation

Meaning:

| Concept | Equivalent |
|---|---|
| Prompt | Source input |
| Planning | Compilation stage |
| Providers | Execution runtimes |
| Execution graph | Build pipeline |
| Render artifact | Binary/output |
| Orchestrator | Compiler/runtime coordinator |

This framing helps define cleaner system boundaries.

---

# High-Level Architecture

```text
                    +-------------------+
                    | Next.js Frontend  |
                    +-------------------+
                              |
                              v
                    +-------------------+
                    | Hono API Gateway  |
                    | auth/jobs/routes  |
                    +-------------------+
                              |
               +--------------+-------------+
               |                            |
               v                            v
     +------------------+        +------------------+
     | Queue (Redis)    |        | PostgreSQL       |
     +------------------+        +------------------+
               |
               v
     +----------------------+
     | Render Workers       |
     | Python / Node        |
     +----------------------+
               |
               v
     +----------------------+
     | openanim OSS Engine  |
     +----------------------+
```

---

## OpenAnim should use:
- versioned packages
- stable APIs
- typed contracts
- isolated services

---

# Tentative Repository Structure

## OSS Repository

```text
openanim/
├── orchestrator/
├── planner/
├── providers/
│   ├── manim/
│   ├── remotion/
│   ├── plantuml/
│   └── mermaid/
├── execution/
├── artifacts/
├── retrieval/
├── llm/
├── schemas/
├── cli/
├── pyproject.toml
└── README.md
```

---

## Tentative Cloud Repository

```text
openanim-cloud/
├── pnpm-workspace.yaml
├── turbo.json
├── package.json
├── tsconfig.base.json
├── docker-compose.yml
├── .env.example
│
├── apps/
│   ├── web/                  # Next.js frontend
│   └── api/                  # Hono API server
│
├── packages/
│   ├── db/                   # Drizzle schema
│   ├── shared/               # Shared TS utilities/types
│   └── sdk/                  # Internal cloud SDK
│
├── workers/
│   ├── python/
│   └── remotion/
│
└── infra/
    ├── docker/
    ├── deployment/
    └── monitoring/
```

---

# Technology Stack

| Layer | Choice |
|---|---|
| Frontend | Next.js |
| API Layer | Hono |
| Runtime | Bun |
| Monorepo | pnpm + Turborepo |
| Database | PostgreSQL |
| ORM | Drizzle ORM |
| Queue | BullMQ |
| Cache | Redis |
| Storage | S3 / Cloudflare R2 / TBD |
| OSS Engine | Python |
| Infra | Docker |
| Workers | Python + Node.js |
| Auth | NextAuth v5 / TBD |
| Email | Resend / TBD |

---

# Provider-Based Architecture

Do NOT think of:
- Manim
- Remotion
- Mermaid
- PlantUML

as "backends".

They are actually:

> execution providers

This distinction matters because eventually one video may involve multiple providers.

Example future pipeline:

```text
Prompt
↓
Scene Planning
↓
Execution Graph
↓
Provider Dispatch
↓
Composition
↓
Encoding
↓
Artifact Output
```

Meaning:
- one scene may use Manim
- another may use Remotion
- another may generate diagrams
- another may composite assets

The abstraction should therefore evolve toward:

```python
provider.execute(task)
```

rather than:

```python
backend.render()
```

---

# OSS Engine Design

this is still being researched as to what is the best approach.

The OSS engine should expose a stable SDK surface.

Avoid:

```python
from app import generate_code
```

Instead:

```python
from openanim import Orchestrator
```

Example:

```python
orc = Orchestrator()

result = await orc.generate(
    prompt="Explain Fourier transforms visually",
    provider="manim"
)
```

This creates:
- stable interfaces
- easier testing
- package compatibility
- future plugin support

---

# Package-Based Integration

This is a very critical integration design decision. Still needs a lot of research.

```toml
[project.dependencies]
openanim = { git = "ssh://git@github.com/openanim/openanim.git" }
```

Workers consume released versions of the OSS engine.

Benefits:
- version pinning
- rollback support
- cleaner CI/CD
- independent deployments
- stable dependency management

---

# Worker Architecture _still needs a lot of research_

The actual hard problem in OpenAnim is NOT orchestration.

It is:
- deterministic reproducibility
- rendering isolation
- dependency stability
- execution safety

Especially because:
- FFmpeg
- LaTeX
- Cairo
- Chromium
- Node
- Python
- fonts
- GPU rendering

all interact in fragile ways.

---

# Container Strategy - Tentative

One Docker image per provider.

Example:

```text
openanim-provider-manim
openanim-provider-remotion
openanim-provider-diagram
```

Execution flow:

```text
Job
→ Queue
→ Provider Container
→ Artifact
→ Storage
```

This architecture scales much better operationally.

---

# Worker Types - Tentative structure

## Python Workers

Responsible for:
- Manim
- PlantUML
- Mermaid
- orchestration logic
- planning
- retrieval
- execution graphs

---

## Node.js Workers

Responsible for:
- Remotion
- browser rendering
- composition pipelines
- web-native rendering tasks

---

# Initial Database Schema

```sql
waitlist:
  id          uuid primary key
  email       text unique not null
  status      enum('pending', 'invited', 'active')
  created_at  timestamp default now()
```

Highly Tentative Future tables:

- users
- sessions
- projects
- jobs
- render_outputs
- artifacts
- provider_logs
- api_keys
- billing
- usage

---

# Initial API Routes

| Method | Route | Purpose |
|---|---|---|
| POST | `/api/waitlist` | Join waitlist |
| GET | `/api/health` | Health check |
| POST | `/api/jobs` | Submit render job |
| GET | `/api/jobs/:id` | Get job status |
| GET | `/api/artifacts/:id` | Download render output |

---

# Landing Page Design

## Aesthetic

- dark terminal-inspired UI
- minimal futuristic style
- emphasis on deterministic generation

## Colors

I want to go with full black and white theme 

## Fonts

| Usage | Font |
|---|---|
| Code | JetBrains Mono |
| UI/Text | Inter |

## Sections

```text
Hero
↓
How It Works
↓
Providers
↓
Why Deterministic
↓
Examples
↓
Waitlist
↓
Footer
```

## Core Messaging

> "Video generation that doesn't hallucinate. Describe your video and receive deterministic, editable rendering pipelines powered by Manim, Remotion, and programmable visual systems."
