# Inventory — fullstack-profile

> Re-extraction: 2026-05-20 (includes Feature 006 — Tech Stack Opinions)
> Scout: 2026-05-20
> Confidence: 🟢 CONFIRMED

---

## Summary

- **Language:** TypeScript/JavaScript (100%)
- **Framework:** Next.js 14 (Pages Router, Static Export)
- **Deployment Target:** GitHub Pages (frontend) + Cloudflare Workers (AI proxy)
- **Build System:** Next.js (output: export)
- **Package Manager:** npm
- **Modules Identified:** 8 feature areas
  - Frontend (7): hero-section, hero-dark, main-content, analytics, i18n, layout, data
  - Backend (1): Cloudflare Worker (AI proxy)

---

## Technology Stack

| Category | Technology | Version |
|----------|-----------|---------|
| Runtime | Node.js | ^18 |
| Framework | Next.js | ^14.2.35 |
| Language | TypeScript | 5.4.5 |
| UI Library | React | ^18.3.1 |
| CSS Framework | Tailwind CSS | ^3.4.1 |
| i18n | next-i18next | ^14.2.0 |
| Animation | GSAP | ^3.12.5 |
| Analytics | Google Analytics 4 | (script tag) |
| Edge Runtime | Cloudflare Workers | (custom) |
| Testing | (none) | — |

---

## Data Files

| File | Entries | Purpose |
|------|---------|---------|
| `src/data/jobs.json` | 5 | Work history |
| `src/data/toshi-projects.json` | 19 | Portfolio projects |
| `src/data/stacks.json` | 39 | Tech stack registry **[UPDATED: +opinion field]** |
| `src/data/swtools.json` | (multiple) | Software tools |

---

## Entry Points & Configuration

- **Pages Router:** `pages/[locale]/dev/gabriel.tsx` (main entry)
- **Worker:** `worker/src/index.ts` (Cloudflare Worker)
- **Build:** `npm run build` → static export to `./out/`
- **CI/CD:** `.github/workflows/deploy.yml` (GitHub Actions)
- **i18n Config:** `next-i18next.config.js` (en, ja, pt-BR)

---

## External Integrations

- Google Analytics 4
- OpenRouter API (via Cloudflare Worker)
- Pace.js (page load indicator)
- Unicons (icon font)
