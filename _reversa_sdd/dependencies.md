# Dependencies — fullstack-profile

> Re-extração: 2026-05-17 (inclui worker/package.json)
> Source: `package.json` + `worker/package.json`

---

## Package Manager

**npm** (lockfile: `package-lock.json`)

---

## Runtime Dependencies

| Package | Version | Role |
|---------|---------|------|
| `next` | ^14.2.35 | Core framework — SSG/Pages Router, static export |
| `react` | ^18.3.1 | UI library |
| `react-dom` | ^18.3.1 | React DOM renderer |
| `next-i18next` | ^15.4.3 | i18n integration for Next.js |
| `i18next` | ^23.11.5 | i18n core library |
| `react-i18next` | ^14.1.2 | React bindings for i18next |
| `next-language-detector` | ^1.1.0 | Browser language auto-detection |
| `gsap` | ^3.12.5 | Animation library — parallax, scroll triggers, timeline animations |
| `dayjs` | ^1.11.11 | Date/time formatting (age display, experience years) |
| `lodash` | ^4.18.1 | Utility functions (array reversal in Jobs component) |
| `@headlessui/react` | ^2.0.4 | Accessible UI primitives (referenced but may be unused currently) |
| `react-loading-skeleton` | ^3.4.0 | Loading state skeletons |
| `react-markdown` | ^9.0.1 | Markdown rendering (referenced, may be unused currently) |
| `react-syntax-highlighter` | ^15.5.0 | Code syntax highlighting (referenced, may be unused currently) |
| `recharts` | ^2.12.7 | Charting library (referenced, may be unused currently) |

---

## Dev Dependencies

| Package | Version | Role |
|---------|---------|------|
| `typescript` | 5.4.5 | TypeScript compiler |
| `tailwindcss` | ^3.4.4 | Utility-first CSS framework |
| `postcss` | ^8.4.38 | CSS post-processor (required by Tailwind) |
| `autoprefixer` | ^10.4.19 | CSS vendor prefixing |
| `eslint` | ^9.5.0 | JavaScript/TypeScript linter |
| `@types/node` | 25.8.0 | Node.js type definitions |
| `@types/lodash` | ^4.17.5 | Lodash type definitions |

---

## Overrides

| Package | Forced Version | Reason |
|---------|---------------|--------|
| `i18next-fs-backend` | `>=2.3.2` | Security vulnerability fix (referenced in `next-i18next`) |

---

## CDN Dependencies (not in package.json)

| Library | Source | Usage |
|---------|--------|-------|
| Pace.js | `cdn.jsdelivr.net/npm/pace-js@latest` | Page load progress bar |
| Pace.js CSS | `cdn.jsdelivr.net/npm/pace-js@latest/pace-theme-default.min.css` | Progress bar styles |
| Unicons | Referenced via `uil uil-*` CSS classes in JSX — origin unclear 🔴 GAP | Icon set used in Jobs component |

---

## Key Version Notes

- **Next.js 14** uses the Pages Router (not App Router). Static export configured via `output: 'export'` in `next.config.js`.
- **GSAP 3.12** — ScrollTrigger and ScrollToPlugin are used explicitly.
- **TypeScript 5.4.5** — strict mode enabled.
- **Tailwind 3.4** — JIT mode, custom theme with brand colors.

---

## Potentially Unused Dependencies

The following packages are declared in `package.json` but no usage was found in the current source files:

| Package | Status |
|---------|--------|
| `@headlessui/react` | 🟡 INFERRED — possibly used in an unreachable route or planned feature |
| `react-markdown` | 🟢 CONFIRMADO — usado em `ToshiAITerminal/MarkdownContent.tsx` |
| `react-syntax-highlighter` | 🟢 CONFIRMADO — usado em `ToshiAITerminal/MarkdownContent.tsx` |
| `recharts` | 🟡 INFERRED — not found in active components |

---

## Worker Dependencies (worker/package.json)

**Sub-projeto independente** com seu próprio `package.json`. Não compartilha node_modules com o frontend.

### Dev Dependencies do Worker

| Package | Version | Role |
|---------|---------|------|
| `wrangler` | ^3 | CLI do Cloudflare Workers — `wrangler dev`, `wrangler deploy`, `wrangler secret put` |
| `@cloudflare/workers-types` | ^4 | TypeScript types para Cloudflare Workers runtime (`Request`, `Response`, `Env`, etc.) |

### Runtime do Worker

Nenhuma dependência runtime — o worker usa apenas APIs nativas do Cloudflare Workers runtime (fetch, ReadableStream, TextDecoder) e importa JSONs de `../../src/data/` via esbuild bundling em tempo de deploy.
