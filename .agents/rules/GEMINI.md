# Power BI Mastery — Project Rules

## Project Overview

Turborepo + pnpm monorepo running a Next.js 14 (App Router) enterprise learning portal for Power BI DAX & M Language documentation.

| Component | Technology | Purpose |
|-----------|-----------|---------|
| `apps/web` | Next.js 14 | Main web app — docs, playground, learning paths, auth |
| `packages/database` | Prisma 5 + PostgreSQL (Neon) | User data, progress, bookmarks, notes, snippets |
| `query-languages/` | 1,305 Markdown files | DAX (540) and M Language (765) reference documentation |

## Non-Negotiable Constraints

- Database is **PostgreSQL (Neon serverless) + Prisma 5**. Do not introduce Mongoose, MongoDB, or any other ORM/DB.
- Auth is **NextAuth v5 (beta)** with JWT session strategy. Do not replace with custom JWT auth.
- Package manager is **pnpm ≥ 8.15**. Always `pnpm install` from the root — never inside individual apps/packages.
- UI components use **shadcn/ui + Radix UI + Framer Motion**. Do not introduce a different component library.
- Styling: **Tailwind CSS 3.4** with custom theme (brand gold, deep navy). Icons: `lucide-react`.
- Content source is `query-languages/` directory — raw Microsoft docs in Markdown + DocFX YAML. Do not move or restructure these files.
- Content is ingested at **build time** via `apps/web/src/lib/content.ts` — no runtime content fetching.
- Syntax highlighting uses **Shiki** (WASM, VS Code themes). Do not switch to Prism or highlight.js.
- Use Next.js 14 App Router conventions (Server Components by default, `'use client'` only where interactivity requires it).
- All new env vars must be added to `.env.example` and kept in sync.

## Auth Architecture

- Provider: NextAuth v5 beta with GitHub, Google, and Microsoft (Azure AD) OAuth.
- Session strategy: JWT.
- Roles: `LEARNER` | `CONTRIBUTOR` | `EXPERT` | `ADMIN`.
- Auth config in `apps/web/src/lib/auth.ts`.
- API handler at `apps/web/src/app/api/auth/[...nextauth]/`.

## Database Schema (Prisma)

Schema at `packages/database/prisma/schema.prisma`. Key models:

- **User**: id, name, email, role (LEARNER/CONTRIBUTOR/EXPERT/ADMIN)
- **Account/Session/VerificationToken**: NextAuth adapter tables
- **UserProgress**: pathId, moduleId, status (NOT_STARTED/IN_PROGRESS/COMPLETED), timeSpent, score
- **Bookmark**: docSlug, title, category
- **Note**: docSlug, content
- **Snippet**: language (DAX/M), code, isPublic, views
- **DocFeedback**: docSlug, helpful (boolean), comment

## Content Pipeline

- Source: `query-languages/dax/` (540 files) and `query-languages/m/` (765 files)
- Ingestion: `apps/web/src/lib/content.ts` reads files, parses frontmatter, extracts headings & reading time
- Rendering: `apps/web/src/lib/markdown.ts` — Unified pipeline (remark-parse → remark-gfm → rehype-slug → rehype-highlight)
- Static generation: `apps/web/src/app/(docs)/docs/[...slug]/page.tsx` with `generateStaticParams`

## Key File Locations

| What | Where |
|------|-------|
| NextAuth config | `apps/web/src/lib/auth.ts` |
| Content loader | `apps/web/src/lib/content.ts` |
| Markdown pipeline | `apps/web/src/lib/markdown.ts` |
| Prisma schema | `packages/database/prisma/schema.prisma` |
| Doc page renderer | `apps/web/src/app/(docs)/docs/[...slug]/page.tsx` |
| Playground | `apps/web/src/app/playground/page.tsx` |
| Learning paths | `apps/web/src/app/learn/paths/page.tsx` |
| Landing page | `apps/web/src/app/page.tsx` |
| Docs layout | `apps/web/src/app/(docs)/layout.tsx` |
| Docker config | `docker/Dockerfile.web`, `docker/docker-compose.yml` |
| CI/CD workflows | `.github/workflows/ci.yml`, `cd.yml`, `deploy-pages.yml` |

## Deployment

- **Vercel** (primary): Deploys on push to `main` or version tags via `.github/workflows/cd.yml`
- **GitHub Pages** (static fallback): via `.github/workflows/deploy-pages.yml`
- **Docker**: Multi-stage build in `docker/Dockerfile.web`, compose with PostgreSQL + Redis
- Post-deploy smoke tests hit `/`, `/docs`, `/api/health`
