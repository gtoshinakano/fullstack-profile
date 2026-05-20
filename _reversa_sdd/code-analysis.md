# Code Analysis — fullstack-profile

> Re-extraction: 2026-05-20 (includes Feature 006 — Tech Stack Opinions)
> Confidence: 🟢 CONFIRMED | 🟡 INFERRED | 🔴 GAP
> doc_level: completo

---

## Executive Summary

`fullstack-profile` is a **single-page personal portfolio** for Gabriel Toshinori Nakano, a Full-Stack Developer. Built with **Next.js 14 (Pages Router)** and deployed as **static export to GitHub Pages**, the application comprises **8 distinct feature modules** (7 frontend, 1 backend edge worker).

**Re-extraction (2026-05-20) captures Feature 006 — Tech Stack Opinions:** The `stacks.json` data model now includes an optional `opinion` field documenting Gabriel's perspective on each technology. The Cloudflare Worker's `systemPrompt.ts` was extended to incorporate these opinions into the AI system prompt, enhancing the ToshiAITerminal's responses with authentic technical commentary.

---

## Module 1 — hero-section

**Purpose:** Full-viewport animated mountain landscape serving as the visual entry point.

**Primary Files:**
- `src/components/views/dev/gabriel/HeroSection/WideScreen.tsx` — Desktop/landscape parallax
- `src/components/views/dev/gabriel/HeroSection/Mobile.tsx` — Portrait responsive variant
- `src/components/views/dev/gabriel/HeroSection/HeroSvg.js` — Inline SVG text art

**Key Algorithms:**
- **GSAP Parallax Pipeline** 🟢 — 10+ simultaneous animations with ScrollTrigger, each layer moving at different speeds to create 3D depth illusion
- **Responsive Decision** 🟢 — `isWide = width > height` (aspect ratio, not viewport width)
- **Loading State** 🟢 — Hero hidden until Pace.js fires `done` event

**Business Rules:**
- BR-01: Page renders only after Pace.js done
- BR-02: Responsive breakpoint is aspect ratio, not pixel width

---

## Module 2 — hero-dark

**Purpose:** Dark-themed profile section with 3-tab menu (Profile, Projects, Message) and sticky menu animations.

**Primary Files:**
- `src/components/views/dev/gabriel/HeroDark/index.tsx` — Container, tab state, photo carousel
- `src/components/views/dev/gabriel/HeroDark/Jobs.tsx` — Work history timeline (5 entries) + hardcoded education (2 entries)
- `src/components/views/dev/gabriel/HeroDark/Projects.tsx` — Accordion of 19 portfolio projects
- `src/components/views/dev/gabriel/HeroDark/FuturePartner.jsx` — Recruiter-facing message (i18n)
- `src/components/views/dev/gabriel/HeroDark/ToshiAITerminal/` — AI chat interface (**Feature 003**)

**Key Algorithms:**
- **Tab State Machine** 🟢 — `selected: 'job'|'projects'|'partner'`, locked during GSAP animations
- **Project Expand Toggle** 🟢 — Uses `label` field as key (⚠️ **BUG:** label is not unique, duplicates collapse/expand together)
- **Photo Carousel** 🟢 — GSAP-driven crossfade between 3 images on scroll

**Data Models:**
- Jobs: 5 entries from `jobs.json` + 2 hardcoded education entries
- Projects: 19 entries from `toshi-projects.json` (reversed for newest-first display)
- Stacks: Referenced via stack IDs from `stacks.json` (39 entries, now with `opinion` field **[Feature 006]**)

**Business Rules:**
- BR-03: Tab changes locked during animations
- BR-04: Projects display newest-first
- BR-05: Education hardcoded in JSX (not in jobs.json)
- BR-06: Education visible by default, user-hideable

---

### Sub-feature: ToshiAITerminal (hero-dark child)

**Purpose:** Embedded AI chat terminal for visitors to ask questions about Gabriel.

**Primary Files:**
- `src/components/views/dev/gabriel/HeroDark/ToshiAITerminal/index.tsx` — Terminal UI, question counter, streaming output
- `src/components/views/dev/gabriel/HeroDark/ToshiAITerminal/useOpenRouterStream.ts` — SSE client (calls `NEXT_PUBLIC_TOSHI_AI_WORKER_URL`)
- `src/components/views/dev/gabriel/HeroDark/ToshiAITerminal/MarkdownContent.tsx` — Renders responses with syntax highlighting

**Key Algorithms:**
- **Session Limit** 🟢 — `MAX_QUESTIONS = 3` enforced via React state counter
- **Input Validation** 🟢 — `MAX_CHARS = 200` per question
- **Streaming SSE Parser** 🟢 — Parses OpenRouter SSE format (`data:` lines, `[DONE]` terminator)
- **System Prompt Builder** (server-side in worker, not here)

**Feature 006 Integration:**
- Frontend no longer imports `opinion` field (server-side only)
- Calls Cloudflare Worker which includes opinions in system prompt
- Worker's `buildTechPerspective()` function formats stacks + opinions

**Business Rules:**
- User cannot ask about sensitive personal topics (declined gracefully)
- Terminal hidden if `NEXT_PUBLIC_TOSHI_AI_WORKER_URL` not set

---

## Module 3 — main-content

**Purpose:** Article section presenting Gabriel's "3-3-3 Principles for a Better UX."

**Primary Files:**
- `src/components/views/dev/gabriel/MainContent/index.tsx` — Article layout
- `src/components/views/dev/gabriel/MainContent/Introduction.tsx` — Article content (3 communication goals, 3 design principles, 3 life principles)

**Content Structure:**
- **3 Communication Goals** — clarity, authenticity, respect
- **3 Design Principles** — AIA Composition (Attract/Intrigue/Action), 60-30-10 color rule, "hypnotic gift"
- **3 Life Principles** — balance, growth, kindness

**Business Rules:**
- Article is static HTML (no dynamic content)
- Fully i18n via next-i18next

---

## Module 4 — analytics

**Purpose:** Google Analytics 4 integration for tracking portfolio usage.

**Primary Files:**
- `src/lib/ga.ts` — GA event wrapper

**Events Tracked:**
- `hero_cta` (category: "3-3-3 Principle", label: "widescreen" or "mobile screen")
- `menu_click` (category: selected tab, label: implicit)

**Business Rules:**
- GA only fires in production (checks environment)
- User can opt-out if privacy settings enabled

---

## Module 5 — i18n

**Purpose:** Internationalization for 3 languages: English (default), Japanese, Portuguese-BR.

**Primary Files:**
- `src/lib/i18next.ts` — i18n config
- `next-i18next.config.js` — Next.js integration
- `public/locales/[locale]/` — Translation JSON files

**Locales:**
- `en` (English) — default
- `ja` (日本語)
- `pt-BR` (Português Brasileiro)

**Key Algorithms:**
- **Route-based locale detection** 🟢 — URL pattern `[locale]/dev/gabriel`
- **Language detector** 🟢 — `i18next-browser-languagedetector` for browser preference fallback
- **Namespace strategy** 🟢 — Separate namespaces per feature (`future-partner`, `hero-dark`, etc.)

**Business Rules:**
- Redirect from `/` to `/[locale]/dev/gabriel/` based on detected locale
- Fallback to English if locale not supported

---

## Module 6 — layout

**Purpose:** Shared page shell and structural layout.

**Primary Files:**
- `src/components/dom/Layout.tsx` — Main layout wrapper
- `src/helpers/prefix.ts` — GitHub Pages basePath helper

**Key Algorithms:**
- **basePath insertion** 🟢 — Prepends `/fullstack-profile` to all internal links (GitHub Pages subdirectory)

---

## Module 7 — data

**Purpose:** Static data source for portfolio content.

**Primary Files:**
- `src/data/jobs.json` — 5 work history entries
- `src/data/toshi-projects.json` — 19 portfolio projects
- `src/data/stacks.json` — 39 tech stack registry **[UPDATED — Feature 006]**
- `src/data/swtools.json` — Software tools registry

**Data Models:**

### jobs.json
- Fields: `company`, `job_name`, `period`, `description`, `image`, `stacks`, `tools`
- Chronological order (oldest → newest)
- Education hardcoded in Jobs.tsx (not in JSON)

### toshi-projects.json
- Fields: `period`, `type`, `title`, `subtitle`, `learnings`, `country`, `where`, `public`, `problem`, `solution`, `stacks`, `cover`, `action`, `label`
- **BUG 🔴:** `label` field is not unique (e.g., `"requirement"` appears 5 times), causing accordion to expand all duplicates simultaneously

### stacks.json (39 entries)
- Fields: `name`, `src`, `css`, `url`, **`opinion` (NEW — Feature 006)**
- Stack identifiers: `aws`, `reactjs`, `nodejs`, `typescript`, `nextjs`, `tailwind`, etc.
- **Feature 006 addition:** Each stack now has an optional `opinion` field (1–3 sentences of Gabriel's authentic technical perspective)
- Consumed by frontend (display) and worker (system prompt building)

### swtools.json
- Similar structure to stacks.json
- Software tools (editors, version control, etc.)

---

## Module 8 — worker (Cloudflare Workers, Feature 005)

**Purpose:** Edge-runtime server proxy for OpenRouter API calls, eliminating client-side API key exposure.

**Primary Files:**
- `worker/src/index.ts` — Worker fetch handler
- `worker/src/systemPrompt.ts` — System prompt builder **[UPDATED — Feature 006]**

**Key Algorithms:**

### CORS Check 🟢
- Validates `Origin` header against `https://gtoshinakano.github.io`
- Rejects all other origins with `403 Forbidden`

### Preflight Handling 🟢
- Responds to `OPTIONS` with `204 No Content` and CORS headers
- Allows browser to proceed with actual `POST` request

### System Prompt Building 🟢
- Imports `jobs.json`, `toshi-projects.json`, `stacks.json`, `swtools.json` at build time
- **Feature 006 new function `buildTechPerspective()`:** Filters stacks with non-null `opinion` fields, formats them as prose, integrates into system prompt
- Sections (in order): About Gabriel, Work History, Education, Projects, Technical Skills, **Your Technical Perspective** (new), Hobbies, Dislikes

### OpenRouter Integration 🟢
- Forwards user's question to OpenRouter SSE endpoint
- Uses securely stored API key (never exposed to browser)
- Passes through `Authorization: Bearer env.OPENROUTER_API_KEY`
- Streams SSE response directly back to browser

**Data Models:**
- System prompt is a plain string (no structured model)
- Request body: `{ question: string }`
- Response: Server-Sent Events (SSE) format

**Feature 006 Integration:**
- New `buildTechPerspective()` function iterates over stacks
- Filters: `stack.opinion && stack.opinion.trim().length > 0`
- Formats: `"Stack Name: [opinion text]"` → joined with newlines
- Section inserted after "Technical Skills" in prompt
- Backward-compatible: missing `opinion` field gracefully omitted

**Business Rules:**
- Worker name: `fullstack-profile-ai`
- Single instance serves both `main` and `dev` deployments
- No rate limiting (relies on client-side MAX_QUESTIONS)
- No persistent state (stateless worker)

---

## Summary Statistics

| Metric | Value |
|--------|-------|
| **Frontend modules** | 7 (hero-section, hero-dark, main-content, analytics, i18n, layout, data) |
| **Backend modules** | 1 (Cloudflare Worker) |
| **Total modules** | 8 |
| **Data entries** | 5 jobs + 19 projects + 39 stacks + (n) tools |
| **TypeScript files** | 20 |
| **Algorithms (non-trivial)** | 15+ |
| **Business rules** | 10+ |
| **Known bugs** | 1 (duplicate project labels) |
| **Feature 006 changes** | Stacks schema extended, Worker system prompt extended |

---

## Known Issues & Gaps 🔴

1. **Project Label Uniqueness** 🔴 — `label` field in `toshi-projects.json` is not unique; 5 projects share `label: "requirement"`, causing accordion to expand/collapse all simultaneously when one is clicked.
2. **Introduction.tsx Not Internationalized** 🟡 — Article content is hardcoded in JSX, missing i18n wrapper for some text blocks.
3. **No Test Coverage** 🔴 — Project has zero test files; no Jest, Vitest, or other test framework configured.
4. **useRedirect Missing Dependency Array** 🟡 — If such a hook exists, it may re-run unnecessarily on every render.

---

## Technology Patterns Observed

| Pattern | Implementation |
|---------|----------------|
| **SSG** | Next.js Pages Router with `output: export` |
| **i18n** | next-i18next with route-based locale detection |
| **Animation** | GSAP ScrollTrigger for parallax and scroll-driven effects |
| **Styling** | Tailwind CSS + CSS modules (component-scoped) |
| **Data Fetching** | Static JSON imports (no fetch/API calls in frontend, except ToshiAITerminal → Worker) |
| **Edge Computing** | Cloudflare Workers for server-side logic |
| **CI/CD** | GitHub Actions → GitHub Pages + Wrangler deploy |

---

## Confidence Assessment

- 🟢 **CONFIRMED:** All module structures, primary files, algorithms, data models
- 🟡 **INFERRED:** Some edge cases, error handling assumptions, performance optimizations
- 🔴 **GAPS:** Test coverage details, some undocumented helper functions

