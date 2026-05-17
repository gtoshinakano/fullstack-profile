# Project Inventory — fullstack-profile

> Re-extração: 2026-05-17 (inclui Cloudflare Worker — feature 005)
> Confidence scale: 🟢 CONFIRMED | 🟡 INFERRED | 🔴 GAP

---

## Overview

| Field | Value |
|-------|-------|
| Project name | fullstack-profile |
| Purpose | Personal developer portfolio for Gabriel Toshinori Nakano — showcases work history, projects, and the "3-3-3 Principles for a Better UX" article |
| Deploy target | GitHub Pages (static export via `next export`) |
| URL | `https://gtoshinakano.github.io/fullstack-profile/` |
| Primary language | TypeScript |
| Framework | Next.js 14 (Pages Router) |
| Package manager | npm |

---

## Directory Structure

```
fullstack-profile/
├── pages/                         # Next.js file-based routing
│   ├── _app.tsx                   # App shell — global styles, analytics, i18n
│   ├── 404.tsx                    # Custom 404 page
│   ├── index.ts                   # Root redirect → [locale] route
│   └── [locale]/
│       ├── index.ts               # Locale root redirect
│       └── dev/
│           ├── gabriel/index.ts   # Legacy alias → gabriel-toshinori-nakano
│           └── gabriel-toshinori-nakano/
│               ├── index.ts       # Static props / locale redirect
│               └── gabriel.tsx    # Main portfolio page component
├── src/
│   ├── components/
│   │   ├── dom/
│   │   │   ├── Analytics/         # Google Analytics integration
│   │   │   └── ChangeLanguage/    # Language switcher
│   │   ├── layout/
│   │   │   └── Public/            # Page layout wrapper (title/meta)
│   │   └── views/dev/gabriel/
│   │       ├── HeroSection/       # Animated mountain parallax hero (desktop + mobile)
│   │       ├── HeroDark/          # Dark profile section: Jobs, Projects, FuturePartner tabs
│   │       └── MainContent/       # "3-3-3 Principles for a Better UX" article
│   ├── data/                      # Static JSON data
│   │   ├── jobs.json              # Work history
│   │   ├── toshi-projects.json    # Portfolio projects (19 entries)
│   │   ├── stacks.json            # Tech stack metadata/icons
│   │   └── swtools.json           # Software tools metadata/icons
│   ├── helpers/
│   │   ├── customLoader.ts        # Next.js Image custom loader (GitHub Pages basePath)
│   │   └── prefix.ts             # Asset path prefix helper
│   └── lib/
│       ├── ga.ts                  # Google Analytics event/pageview helpers
│       ├── getStatic.js           # getStaticProps/Paths helper for i18n
│       ├── languageDetector.js    # next-language-detector config
│       └── redirect.js            # Client-side locale redirect
├── styles/
│   ├── globals.css                # Global CSS
│   ├── font-trueno.css            # Trueno font-face declarations
│   └── font-wask.css              # Wask New font-face declarations
├── public/
│   ├── locales/                   # i18n translation files
│   │   ├── en/                    # English translations
│   │   ├── ja/                    # Japanese translations
│   │   └── pt-BR/                 # Brazilian Portuguese translations
│   ├── img/dev/gabriel/           # Profile images, screenshots
│   ├── img/stacks/                # Tech stack logos/icons
│   └── fonts/                     # Custom web fonts (Trueno, Wask, etc.)
├── next.config.js                 # Next.js config — static export, basePath
├── next-i18next.config.js         # i18n config — locales: en, ja, pt-BR
├── tailwind.config.js             # Tailwind theme — custom colors, fonts
├── tsconfig.json                  # TypeScript config — path aliases
└── .github/workflows/deploy.yml   # CI/CD — build + deploy to gh-pages branch
```

---

## Languages

| Language | Extensions | File Count |
|----------|-----------|------------|
| TypeScript | `.ts`, `.tsx` | 24 |
| JavaScript | `.js`, `.jsx` | 12 |
| CSS | `.css` | 3 |
| JSON | `.json` | 11 |

**Primary language:** TypeScript 🟢

---

## Sections / Features

| Section | Path | Description |
|---------|------|-------------|
| **hero-section** | `src/components/views/dev/gabriel/HeroSection/` | Animated parallax mountain landscape with GSAP — responsive (WideScreen / Mobile) |
| **hero-dark** | `src/components/views/dev/gabriel/HeroDark/` | Dark themed profile section with 3-tab menu: Profile (Jobs), Projects, Message (FuturePartner) |
| **main-content** | `src/components/views/dev/gabriel/MainContent/` | "The 3-3-3 Principles for a Better UX" long-form article |
| **analytics** | `src/components/dom/Analytics/` | Google Analytics 4 integration (production-only) |
| **i18n** | `src/lib/languageDetector.js`, `src/lib/getStatic.js` | Internationalization — 3 locales: en, ja, pt-BR |
| **layout** | `src/components/layout/Public/` | Public page layout shell (meta/title) |
| **data** | `src/data/` | Static JSON data: jobs, projects, stacks, tools |
| **worker** | `worker/` | **NEW** — Cloudflare Worker AI proxy (`fullstack-profile-ai`): CORS, SSE proxy para OpenRouter, system prompt server-side |

---

## Entry Points

| File | Type | Description |
|------|------|-------------|
| `pages/_app.tsx` | App shell | Global providers: i18n, styles, analytics |
| `pages/index.ts` | Root redirect | Redirects to locale-prefixed route |
| `pages/[locale]/index.ts` | Locale root | Redirects to gabriel profile page |
| `pages/[locale]/dev/gabriel-toshinori-nakano/gabriel.tsx` | Main page | Portfolio page — orchestrates all view sections |

---

## Configuration Files

| File | Purpose |
|------|---------|
| `next.config.js` | Static export (`output: 'export'`), basePath for GitHub Pages |
| `next-i18next.config.js` | Default locale `en`, locales: `en`, `ja`, `pt-BR` |
| `tailwind.config.js` | Custom colors (`heroGray`, `primary`, `secondary`, `ternary`, `figmaBlue`), custom fonts |
| `tsconfig.json` | Path aliases: `@/*`, `@Components/*`, `@Views/*`, `@Styles/*`, `@Lib/*` |
| `.eslintrc` | ESLint config |
| `.prettierrc` | Prettier config |
| `.env` | Environment variables (local only) |

---

## CI/CD

| File | Description |
|------|-------------|
| `.github/workflows/deploy.yml` | GitHub Actions: (1) deploy Cloudflare Worker via `cloudflare/wrangler-action@v3`, (2) build Next.js + deploy a `gh-pages` via `JamesIves/github-pages-deploy-action` |

**Env vars injetadas no build:**
- `NEXT_PUBLIC_BASE_PATH=/fullstack-profile` (ou `/fullstack-profile/dev` na branch `dev`)
- `NEXT_PUBLIC_GOOGLE_ANALYTICS=G-RH74DXLKZL`
- `NEXT_PUBLIC_TOSHI_AI_WORKER_URL` (de `secrets.NEXT_PUBLIC_TOSHI_AI_WORKER_URL`)

**GitHub Secrets necessários:**
- `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID` — deploy do worker
- `OPENROUTER_API_KEY`, `OPENROUTER_MODEL` — injetados como worker secrets via Wrangler
- `NEXT_PUBLIC_TOSHI_AI_WORKER_URL` — URL do worker (baked no frontend)

---

## Database

No database. All data is stored as static JSON files in `src/data/`:
- `jobs.json` — professional work history
- `toshi-projects.json` — 19 portfolio projects spanning 2011–2025
- `stacks.json` — technology stack icon/metadata registry
- `swtools.json` — software tools icon/metadata registry

---

## Internationalization

3 locales supported: **English** (default), **Japanese**, **Brazilian Portuguese**

Translation files live in `public/locales/<locale>/`:
- `common.json` — shared UI strings
- `future-partner.json` — "Message" tab content

Language detection via `next-language-detector`, route-based locale switching via `[locale]` dynamic segment.

---

## Test Coverage

| Framework | Files Found |
|-----------|------------|
| None detected | 0 test files |

🔴 **GAP:** No test files found. Zero automated test coverage.

---

## External Integrations

| Integration | Type | Usage |
|------------|------|-------|
| Google Analytics 4 | Analytics | Pageview tracking + menu/CTA events. GA ID: `G-RH74DXLKZL` |
| Pace.js (CDN) | UI | Page load progress bar (loaded from CDN in `_app.tsx`) |
| GitHub Pages | Hosting | Static site deployment via `gh-pages` branch |
| Cloudflare Workers | Edge compute | AI proxy `fullstack-profile-ai` — CORS, SSE passthrough para OpenRouter |
| OpenRouter | AI API | Acesso a LLMs via worker (chave nunca exposta no frontend) |

---

## Custom Fonts

| Font | Usage |
|------|-------|
| Trueno | Primary body/UI font |
| Wask New | Decorative headings |
| Big Noodle | Display font |
| Morganite | Display font |
| Futura (via Tailwind class) | Headings |
| Pacifico | Greeting accent |
