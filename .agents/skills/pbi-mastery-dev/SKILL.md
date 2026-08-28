---
name: pbi-mastery-dev
description: >-
  Use this skill when working on the Power BI Mastery learning portal.
  Covers development setup, content management (1,305 DAX/M docs), Prisma
  database, Docker, CI/CD, and extending the platform with new features.
---

# Power BI Mastery — Development Skill

## Quick Commands

| Task | Command |
|------|---------|
| Install all deps (from root) | `pnpm install` |
| Start dev server | `pnpm dev` |
| Build all | `pnpm build` |
| Build web only | `pnpm build:web` |
| Lint | `pnpm lint` |
| Lint fix | `pnpm lint:fix` |
| Type check | `pnpm typecheck` |
| Format | `pnpm format` |
| Unit tests | `pnpm test` |
| E2E tests | `pnpm test:e2e` |
| Generate Prisma client | `pnpm db:generate` |
| Push schema to DB | `pnpm db:push` |
| Run migrations | `pnpm db:migrate` |
| Open Prisma Studio | `pnpm db:studio` |
| Process content | `pnpm content:process` |
| Validate content | `pnpm content:validate` |
| Docker full stack | `pnpm docker:up` |
| Docker down | `pnpm docker:down` |

## Content Management

### Source Structure
- DAX docs: `query-languages/dax/` (540 files — functions, operators, best practices)
- M docs: `query-languages/m/` (765 files — functions, spec, connectors)
- Navigation: `toc.yml` in each directory defines the Table of Contents
- Assets: `media/` subdirectories in each language folder

### Adding New Content
1. Add a `.md` file to the appropriate folder (`query-languages/dax/` or `query-languages/m/`)
2. Include YAML frontmatter with title, description, and metadata
3. The content loader (`apps/web/src/lib/content.ts`) auto-discovers files at build time
4. Run `pnpm build:web` to regenerate static pages
5. Update `toc.yml` if the doc should appear in sidebar navigation

### Content Pipeline Flow
```
Raw .md → content.ts (frontmatter + heading extraction) → markdown.ts (Unified/Rehype)
→ [...slug]/page.tsx (generateStaticParams → SSG) → Static HTML
```

## Database (Prisma)

### Modifying the Schema
1. Edit `packages/database/prisma/schema.prisma`
2. Run `pnpm db:generate` to regenerate the Prisma client
3. Run `pnpm db:push` for dev (direct push) or `pnpm db:migrate` for production (migration)
4. Import Prisma client from `packages/database`

### Key Models
- User, Account, Session, VerificationToken (auth)
- UserProgress, Bookmark, Note, Snippet, DocFeedback (learning)

## Adding New Pages

### Doc Category Page
1. Create `apps/web/src/app/(docs)/docs/<category>/page.tsx`
2. Use the `(docs)` layout which provides the 3-column layout (sidebar, content, TOC)
3. Fetch content via the content loader functions in `apps/web/src/lib/content.ts`

### Protected Route
1. Create under `apps/web/src/app/(dashboard)/`
2. NextAuth session check is built into the layout
3. Check user role via the session object

### API Route
1. Create `apps/web/src/app/api/<feature>/route.ts`
2. Use NextAuth's `auth()` helper for authentication
3. Validate input with Zod schemas

## Adding UI Components

1. Use shadcn/ui CLI: `npx shadcn-ui add <component>` (inside `apps/web/`)
2. Or create manually in `apps/web/src/components/`
3. Follow the existing pattern: Radix primitives + Tailwind + `cn()` utility
4. Animations: Framer Motion (`motion.div`, `AnimatePresence`)
5. Icons: `lucide-react` only

## Docker Development

```bash
# Start full stack (web + postgres + redis)
docker compose -f docker/docker-compose.yml up -d

# Rebuild after changes
docker compose -f docker/docker-compose.yml up -d --build web

# View logs
docker compose -f docker/docker-compose.yml logs -f web
```

Health check: `GET /api/health`

## CI/CD

### PR Checks (ci.yml)
Lint → Typecheck → Unit tests → Build → E2E tests → Security scan (CodeQL)

### Deployment (cd.yml)
Push to `main` → Vercel deploy → Smoke tests (`/`, `/docs`, `/api/health`) → Slack notification

### GitHub Pages (deploy-pages.yml)
Push to `main` → Static export → Deploy to GitHub Pages

## Environment Variables

When adding new env vars:
1. Add to root `.env.example` with a descriptive comment
2. If client-side, prefix with `NEXT_PUBLIC_`
3. Add to `turbo.json` `globalEnv` if it affects build output
4. Update Vercel/Docker environment settings

## Verification Checklist

Before considering any change complete:
- [ ] `pnpm typecheck` passes
- [ ] `pnpm lint` passes
- [ ] `pnpm build` succeeds
- [ ] `pnpm test` passes
- [ ] New env vars added to `.env.example`
- [ ] Prisma schema changes have a migration
- [ ] Content changes generate correct static pages
- [ ] Docker build still works (`docker compose build web`)
