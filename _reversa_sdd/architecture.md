# Architecture — fullstack-profile

> Re-extração: 2026-05-17 (inclui Cloudflare Worker — feature 005)
> Confidence: 🟢 CONFIRMED | 🟡 INFERRED | 🔴 GAP

---

## System Summary

**fullstack-profile** is a statically exported Next.js 14 single-page portfolio with a Cloudflare Worker AI proxy. The frontend has no server, no database, and no authentication. Content is baked at build time and served via GitHub Pages. The Cloudflare Worker (`fullstack-profile-ai`) is a separate edge service handling AI API proxying with server-side secrets.

| Property | Value |
|----------|-------|
| Architecture style | Static Site / JAMstack + Edge Worker |
| Deployment target | GitHub Pages (frontend) + Cloudflare Workers (AI proxy) |
| Runtime | Browser + Cloudflare edge (worker) |
| Data layer | JSON files bundled at build time (shared frontend ↔ worker) |
| Rendering | Client-side React (hydration of static HTML) |
| i18n | Client-side, route-based (`/[locale]/...`) |
| Animations | GSAP 3.12 (ScrollTrigger, ScrollToPlugin) |
| Styling | Tailwind CSS 3.4 + custom design tokens |
| AI Proxy | Cloudflare Worker `fullstack-profile-ai` — OpenRouter SSE |

---

## High-Level Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                       GitHub Actions                         │
│  push to main/dev:                                           │
│  1. wrangler deploy → Cloudflare Worker                      │
│  2. npm run build → deploy to gh-pages                       │
└───────────────┬──────────────────────────┬───────────────────┘
                │ static files             │ wrangler deploy
                ▼                          ▼
┌───────────────────────┐  ┌──────────────────────────────────┐
│  GitHub Pages         │  │  Cloudflare Workers              │
│  gtoshinakano.github  │  │  fullstack-profile-ai.workers.dev│
│  .io/fullstack-profile│  │  (edge, 0 cold start)            │
└──────────┬────────────┘  └───────────────┬──────────────────┘
           │ HTTPS                         │ SSE stream
           ▼                               │
┌──────────────────────────────────────────────────────────────┐
│                       Browser (Client)                       │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  Next.js React App (Pages Router, hydrated)         │    │
│  │  ┌──────────┐  ┌─────────────────────────────────┐ │    │
│  │  │ Hero     │  │ HeroDark (tabs)                 │ │    │
│  │  │ Section  │  │ ├─ Jobs, Projects, FuturePartner│ │    │
│  │  └──────────┘  │ └─ ToshiAITerminal ─────────────┼─┼──→ Cloudflare Worker
│  │                └─────────────────────────────────┘ │    │
│  │  ┌─────────────────────────────────────────────┐   │    │
│  │  │ MainContent (3-3-3 article)                 │   │    │
│  │  └─────────────────────────────────────────────┘   │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                              │
│  External calls (browser-initiated):                         │
│  ├── Google Analytics 4 (production only)                   │
│  ├── Pace.js CDN (UMD script tag)                           │
│  ├── Unicons CDN (CSS icon font)                            │
│  └── Cloudflare Worker (ToshiAITerminal only) ──────────────┘
└──────────────────────────────────────────────────────────────┘

Cloudflare Worker internal flow:
  POST { question } ──→ CORS check ──→ buildSystemPrompt()
  ──→ OpenRouter API (Bearer env.OPENROUTER_API_KEY, stream:true)
  ──→ pipe upstream.body ──→ SSE back to browser
```

---

## Key Architectural Decisions

| # | Decision | Consequence |
|---|---------|-------------|
| ADR-001 | Static export + GitHub Pages | No SSR, no API routes, no server-side image optimization |
| ADR-002 | Client-side i18n (route-based) | Multiple redirect hops on first visit; `reloadOnPrerender` dead option |
| ADR-003 | Partial TypeScript | `FuturePartner.jsx` is the only JS file; `strict: false` limits type safety |
| ADR-004 | Custom image loader (identity fn) | No WebP conversion, no responsive srcset; OK for portfolio scale |
| ADR-005 | Rebranding uiux-profile→fullstack-profile | basePath is `/fullstack-profile/`; old URLs broke |

---

## Component Map

```
pages/
  index.ts                    → redirect to /[locale]/dev/gabriel-toshinori-nakano/
  [locale]/dev/gabriel.tsx    → main page: orchestrates all sections

src/components/dom/
  HeroSection/
    WideScreen.tsx            → GSAP parallax (10-layer mountain + animations)
    Mobile.tsx                → simplified hero for portrait orientation
    HeroSvg.js                → SVG title text "FULL STACK DEV."
  HeroDark/
    index.tsx                 → tab state machine + photo carousel
    Jobs.tsx                  → work history timeline + education toggle
    Projects.tsx              → accordion of 19 projects
    FuturePartner.jsx         → recruiter message panel (i18n'd)
  MainContent/
    MainContent.tsx           → article layout wrapper
    Introduction.tsx          → "3-3-3 Principles" article body (English only)
  Analytics/
    index.tsx                 → production gate for GA
    GoogleAnalytics.tsx       → GA script injection

src/components/layout/
  Public/index.tsx            → page shell (head, fonts, CDN scripts)

src/components/dom/
  ChangeLanguage/index.tsx    → locale switcher (router.push + prefix)

src/lib/
  redirect.js                 → useRedirect hook (browser locale detection)
  languageDetector.js         → next-language-detector wrapper
  ga.ts                       → GA event helpers
  getStatic.js                → serverSideTranslations wrapper

src/helpers/
  prefix.ts                   → basePath helper (NEXT_PUBLIC_BASE_PATH)
  customLoader.ts             → Next.js image bypass (identity function)

src/data/
  jobs.json                   → 5 professional entries
  toshi-projects.json         → 19 project entries (⚠️ duplicate label bug)
  stacks.json                 → tech stack icons registry
  swtools.json                → software tools registry
```

---

## External Integrations

| System | Protocol | Direction | Purpose | Env |
|--------|---------|-----------|---------|-----|
| GitHub Pages | HTTPS static hosting | outbound (deploy) | Serve the static site | prod |
| Google Analytics 4 | HTTPS / gtag.js | outbound (events) | Track menu_click, hero_cta, pageview | prod only |
| Pace.js CDN | `<script>` tag | inbound (event) | Page load indicator; `done` event gates hero render | all |
| Unicons CDN | `<link>` CSS | inbound | Icon font (language switcher, social icons) | all |
| Google Fonts (Syne) | `<link>` CSS | inbound | Typography | all |

---

## Technical Debt Summary

| Severity | Item | Location |
|----------|------|----------|
| 🔴 High | Duplicate `label: "requirement"` in projects data — 5 entries share key, accordion collapses together | `src/data/toshi-projects.json` |
| 🟡 Medium | `useRedirect` missing dependency array — runs on every render | `src/lib/redirect.js` |
| 🟡 Medium | `FuturePartner.jsx` not migrated to TypeScript | `src/components/dom/HeroDark/FuturePartner.jsx` |
| 🟡 Medium | `Introduction.tsx` article not i18n'd — English only regardless of locale | `src/components/dom/MainContent/Introduction.tsx` |
| 🟡 Medium | Social links at bottom of article are non-functional `<span>` elements | `Introduction.tsx:621` |
| 🟡 Medium | `strict: false` in tsconfig — TypeScript adoption is shallow | `tsconfig.json` |
| 🟡 Low | `reloadOnPrerender: true` in next-i18next.config.js is silently ignored in static export | `next-i18next.config.js:5` |
| 🟡 Low | Potentially unused dependencies: headlessui, recharts, react-markdown, react-syntax-highlighter | `package.json` |
| 🟡 Low | Zero automated test coverage | entire codebase |
| 🟡 Low | `src/config.jsx` — legacy unused header component still in codebase | `src/config.jsx` |
