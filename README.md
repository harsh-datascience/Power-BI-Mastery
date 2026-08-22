<div align="center">
  <img src="./apps/web/public/logo.svg" alt="Power BI Mastery" width="120" />
  <h1>⚡ Power BI Mastery</h1>
  <p><strong>Enterprise Premium Learning Portal for Power BI Professionals</strong></p>

  <p>
    <a href="https://powerbimastery.com">Live Site</a> •
    <a href="#quick-start">Quick Start</a> •
    <a href="ARCHITECTURE.md">Architecture</a> •
    <a href="#deployment">Deploy</a>
  </p>

  <p>
    <img src="https://img.shields.io/badge/Next.js-14-black?logo=next.js" />
    <img src="https://img.shields.io/badge/TypeScript-5.3-blue?logo=typescript" />
    <img src="https://img.shields.io/badge/Tailwind-3.4-38bdf8?logo=tailwind-css" />
    <img src="https://img.shields.io/badge/Prisma-5.9-2D3748?logo=prisma" />
    <img src="https://img.shields.io/badge/license-MIT-green" />
  </p>
</div>

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 📚 **Complete Docs** | 500+ M functions + 300+ DAX with examples |
| 🎯 **Learning Paths** | Beginner → Expert structured courses |
| 🖥️ **Live Playground** | Write & run DAX/M in the browser |
| 🔍 **Instant Search** | Algolia-powered, typo-tolerant full-text search |
| 🌙 **Dark/Light Theme** | Elegant gold + navy design system |
| 📱 **PWA + Offline** | Installable, works without internet |
| 🔐 **Auth** | GitHub, Google, Microsoft OAuth |
| 📊 **Progress Tracking** | Per-user learning analytics dashboard |
| 🔖 **Bookmarks & Notes** | Save and annotate any doc page |
| ♿ **Accessible** | WCAG 2.1 AA compliant |
| 🚀 **Edge-ready** | Vercel global CDN with 300ms TTFB |
| 🐳 **Docker** | Production multi-stage container |

---

## 🏗️ Tech Stack

```
Next.js 14 (App Router) · TypeScript 5 · Tailwind CSS 3
Shadcn/ui + Radix UI · Framer Motion · MDX Remote
Shiki (syntax highlighting) · NextAuth v5 · Prisma 5
PostgreSQL (Neon) · Redis (Upstash) · Algolia Search
Vercel · Docker · GitHub Actions
```

---

## 🗂️ Project Structure

```
power-bi-mastery/
├── apps/
│   └── web/                  # Next.js 14 Application
│       ├── src/app/           # App Router pages
│       ├── src/components/    # Reusable components
│       └── src/lib/           # Utilities, content loader
├── packages/
│   └── database/              # Prisma schema & client
├── query-languages/           # Source documentation
│   ├── dax/                   # DAX best practices + media
│   └── m/                     # 96 M language docs + spec
├── docker/                    # Dockerfiles + compose
├── .github/workflows/         # CI/CD pipelines
└── ARCHITECTURE.md            # Full architecture doc
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js ≥ 20
- pnpm ≥ 8.15
- PostgreSQL (or use Docker Compose)

### 1. Clone & Install

```bash
git clone https://github.com/your-org/power-bi-mastery.git
cd power-bi-mastery
pnpm install
```

### 2. Environment

```bash
cp .env.example apps/web/.env.local
# Fill in DATABASE_URL and NEXTAUTH_SECRET at minimum
```

### 3. Database

```bash
# Start Postgres + Redis via Docker
docker compose -f docker/docker-compose.yml up -d postgres redis

# Push schema
pnpm db:push
```

### 4. Dev Server

```bash
pnpm dev
# → http://localhost:3000
```

---

## 🐳 Docker

```bash
# Build & run full stack
docker compose -f docker/docker-compose.yml up -d

# Web only
docker build -f docker/Dockerfile.web -t powerbimastery-web .
docker run -p 3000:3000 --env-file .env powerbimastery-web
```

---

## 🚢 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
pnpm add -g vercel

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

Set these environment variables in your Vercel project:

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | ✅ | Neon PostgreSQL connection string |
| `NEXTAUTH_SECRET` | ✅ | 32-char random secret |
| `GITHUB_CLIENT_ID` | OAuth | For GitHub sign-in |
| `GOOGLE_CLIENT_ID` | OAuth | For Google sign-in |
| `ALGOLIA_APP_ID` | Search | Algolia app ID |
| `UPSTASH_REDIS_REST_URL` | Cache | Upstash Redis |

### Cloudflare Pages

```bash
pnpm build:web
# Upload apps/web/out to Cloudflare Pages
```

---

## 🧪 Testing

```bash
# Unit tests
pnpm test

# Unit tests with coverage
pnpm test:coverage

# E2E tests (requires running server)
pnpm test:e2e

# Lint
pnpm lint

# Type check
pnpm typecheck
```

---

## 📖 Content

All documentation is sourced from `query-languages/`:

- **DAX** (`query-languages/dax/`): Best practices, overviews, includes
- **M Language** (`query-languages/m/`): 96 function docs + language spec

The content loader (`apps/web/src/lib/content.ts`) reads these at build time, extracts frontmatter, generates headings, computes reading time, and statically generates all doc pages.

To add new content: simply add a `.md` file to the appropriate folder and rebuild.

---

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch: `git checkout -b feat/my-feature`
3. Commit: `git commit -m 'feat: add my feature'`
4. Push: `git push origin feat/my-feature`
5. Open a Pull Request

All PRs require: passing CI, lint, and typecheck.

---

## 📄 License

MIT © Power BI Mastery — See [LICENSE](./LICENSE)

---

<div align="center">
  <p>Built with ❤️ for the Power BI community</p>
</div>
