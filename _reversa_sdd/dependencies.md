# Dependencies — fullstack-profile

> Re-extraction: 2026-05-20
> Scout: 2026-05-20

---

## Frontend (package.json)

### Production Dependencies (15)

| Package | Version | Purpose |
|---------|---------|---------|
| `react` | ^18.3.1 | UI components |
| `react-dom` | ^18.3.1 | DOM rendering |
| `next` | ^14.2.35 | SSG framework |
| `typescript` | 5.4.5 | Type safety |
| `tailwindcss` | ^3.4.1 | Utility-first CSS |
| `next-i18next` | ^14.2.0 | Internationalization |
| `i18next` | ^23.7.6 | i18n core |
| `i18next-browser-languagedetector` | ^8.0.0 | Locale detection |
| `gsap` | ^3.12.5 | Scroll animations |
| `react-markdown` | ^9.0.1 | Markdown rendering (AI responses) |
| `highlight.js` | ^11.9.0 | Code syntax highlighting |
| `lodash` | ^4.17.21 | Utility functions |
| `react-query` | ^3.39.3 | Data fetching (if used) |
| `@hookform/resolvers` | (version not shown) | Form validation |
| Other | (minor) | Various |

### Dev Dependencies

- `@types/react`, `@types/node`: TypeScript definitions
- `autoprefixer`, `postcss`: CSS processing

---

## Worker (worker/package.json)

### Production Dependencies (2)

| Package | Version | Purpose |
|---------|---------|---------|
| `@cloudflare/workers-types` | 4.20260517.1 | Cloudflare Workers types |
| `wrangler` | 3.114.17 | Worker CLI & bundler |

---

## Build & Deployment

| Tool | Version | Purpose |
|------|---------|---------|
| npm | (default) | Package manager |
| Node.js | ^18 | Runtime |
| GitHub Actions | (via workflows) | CI/CD |
| Cloudflare Wrangler | 3.x | Worker deployment |

---

## No Test Framework Configured

- **Jest, Vitest, etc.:** Not installed
- **Test files:** 0
- **Coverage:** 0%

---

## External Services (No npm deps, loaded via CDN or API)

- **Google Analytics 4:** Script tag (UMD)
- **Pace.js:** Script tag (UMD)
- **Unicons:** CSS font (CDN)
- **OpenRouter API:** Called via Cloudflare Worker

---

## Summary

**Frontend:** React + Next.js + Tailwind + GSAP + next-i18next  
**Worker:** Cloudflare Workers + TypeScript  
**Total direct npm dependencies:** 15 (frontend) + 2 (worker) = 17  
**Transitive dependencies:** (not counted, but significant due to Next.js ecosystem)

