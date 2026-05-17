# Roadmap: Toshi AI Chat Terminal

> Identifier: `003-toshi-ai-terminal`
> Date: `2026-05-17`
> Requirements: `_reversa_forward/003-toshi-ai-terminal/requirements.md`
> Confidence: 🟢 CONFIRMED, 🟡 INFERRED, 🔴 GAP

---

## 1. Approach Summary

The feature adds a self-contained React component `ToshiAITerminal` to the existing `HeroDark` section. It is inserted between the profile photo block (`<div className='flex flex-wrap'>`) and the sticky tab `<Menu>` in `src/components/views/dev/gabriel/HeroDark/index.tsx` — exactly one JSX line added to the orchestrator.

The component owns its own state (messages, question counter, streaming flag) and renders only when `NEXT_PUBLIC_GEMINI_API_KEY` is set; if the env var is absent it returns `null` with no DOM footprint. The Gemini SDK (`@google/generative-ai`) is loaded via dynamic `import()` inside the submit handler so visitors who never interact with the terminal pay zero bundle cost for the dependency.

The system prompt is assembled at module scope by importing the four static data JSONs (`jobs.json`, `toshi-projects.json`, `stacks.json`, `swtools.json`) and serialising them into a structured text block. This is done at build time thanks to webpack's static import resolution — no runtime fetch needed.

All UI strings use the existing `useTranslation('common')` hook; new keys are added to the three `common.json` files. The `getStaticProps` / `getStaticPaths` pipeline in `gabriel.tsx` is untouched.

The streaming render loop appends Gemini text chunks to the last message's `content` string via functional `setState`, driving a live character-append effect. A blinking `▋` span (CSS `animate-pulse`) appended to the in-progress message gives the classic terminal streaming cue.

---

## 2. Principles Applied

> No `principles.md` found in `.reversa/`. Documenting observable project conventions inferred from the legado.

| Principle (inferred) | How the feature relates | Status |
|----------------------|------------------------|--------|
| Static export — no server-side logic | Gemini is called client-side; no API route added | respects 🟢 |
| i18n on all user-visible strings | All terminal UI labels added to `common.json` (3 locales) | respects 🟢 |
| Analytics on meaningful interactions | GA4 `ai_terminal_query` event fires on each question | respects 🟡 |
| No breaking changes to existing components | `HeroDark/index.tsx` receives one new JSX line only; zero state changes to existing `selected` / `loading` / `hasEducation` | respects 🟢 |
| Bundle lean for static hosting | SDK loaded via dynamic `import()` (lazy) | respects 🟢 |

---

## 3. Technical Decisions

| ID | Decision | Justification | Discarded alternatives | Confidence |
|----|----------|---------------|------------------------|------------|
| D-01 | Mount `<ToshiAITerminal />` directly in `HeroDark/index.tsx` between photo block and `<Menu>` | Minimal invasive change; Menu's GSAP ScrollTrigger is self-referential (`trigger: containerRef.current`) — adding sibling content before it does not affect pin behaviour | Separate section in `gabriel.tsx` (would require new scroll anchor, more layout changes) | 🟢 |
| D-02 | Dynamic `import('@google/generative-ai')` inside submit handler | Defers 100 KB+ SDK cost to first interaction; non-interacting visitors pay zero | Top-level static import (always bundled), `next/dynamic` component wrapper (not applicable for a plain hook) | 🟢 |
| D-03 | System prompt assembled from static JSON imports at module scope | Data is already webpack-bundled; no runtime fetch; prompt is always in sync with data files | `fetch()` at runtime (adds latency + failure mode), manual copy of data (drift risk) | 🟢 |
| D-04 | `useState` (in-memory) for question counter | Per clarification session: simplest implementation; resets on navigation/refresh which is acceptable | `sessionStorage`, `localStorage` (explicitly ruled out in clarify session) | 🟢 |
| D-05 | New i18n keys in existing `common` namespace | `getStaticProps` already loads `common` for all 3 locales; no code change in `gabriel.tsx` or `getStatic.js` | New `toshi-ai` namespace (requires `getStaticProps` update + `getStatic.js` wrapper change) | 🟢 |
| D-06 | `return null` when API key absent | Per clarification: no DOM element, no reserved space, no placeholder | `display: none` (still occupies DOM), placeholder "coming soon" (ruled out in clarify) | 🟢 |
| D-07 | Blinking cursor via `animate-pulse` on a `▋` span | Tailwind utility available in project; no new CSS file needed; matches terminal aesthetic | Custom `@keyframes blink` in globals.css (works but heavier), cursor hidden entirely | 🟢 |
| D-08 | Auto-scroll output area via `useRef` + `scrollTop = scrollHeight` in `useEffect([messages])` | Standard React pattern; ensures latest message always visible during streaming | `scrollIntoView()` on last message element (works but requires more DOM refs) | 🟢 |
| D-09 | Model: `gemini-2.0-flash` (configurable via constant) | Fast, cost-effective for short Q&A; latest stable Flash model as of 2026 | `gemini-1.5-flash` (older, slightly less capable), `gemini-2.0-pro` (slower, more expensive for short tasks) | 🟡 |
| D-10 | GA4 event `ai_terminal_query` using existing `event()` helper from `src/lib/ga.ts` | Follows established GA pattern (`menu_click` uses same helper); no new infrastructure | Direct `window.gtag()` call (couples component to global, bypasses production guard) | 🟡 |

---

## 4. Premises

> No unresolved `[DÚVIDA]` markers — all doubts were closed in the clarify session of 2026-05-17. No premises apply.

---

## 5. Architectural Delta

| Component | Legacy source | Change type | Summary |
|-----------|--------------|-------------|---------|
| `ToshiAITerminal` | (new) | component-new | New self-contained terminal component; owns messages, question counter, streaming state |
| `ToshiAITerminal/systemPrompt.ts` | (new) | component-new | Module that imports 4 data JSONs and returns assembled system prompt string |
| `ToshiAITerminal/useGeminiStream.ts` | (new) | component-new | Custom hook encapsulating Gemini streaming logic and error handling |
| `HeroDark/index.tsx` | `_reversa_sdd/architecture.md#Component Map` | component-altered | One `<ToshiAITerminal />` JSX line inserted between photo block and `<Menu>` |
| `public/locales/*/common.json` | `_reversa_sdd/i18n/design.md#Dependências` | contrato-alterado | New `toshi-ai` key group added to all 3 locale files |
| `package.json` | `_reversa_sdd/dependencies.md#Runtime Dependencies` | component-altered | `@google/generative-ai` added as production dependency |
| Gemini API | (new external) | contrato-novo | Browser → Gemini REST endpoint for streaming inference; see `interfaces/gemini-api.md` |

---

## 6. Data Model Delta

No database exists in this project (static JSON files only). This feature does not modify any data JSON.

- `jobs.json`, `toshi-projects.json`, `stacks.json`, `swtools.json` — **read-only**: consumed as context for the system prompt, never written to.
- i18n locale files — **additive only**: new keys under `"toshi-ai"` group in all 3 `common.json` files.

Detail: `_reversa_forward/003-toshi-ai-terminal/data-delta.md`

---

## 7. External Contract Delta

| Contract | Type | Detail file |
|----------|------|-------------|
| Gemini API — `generateContent` (streaming) | HTTP/REST (browser-initiated) | `_reversa_forward/003-toshi-ai-terminal/interfaces/gemini-api.md` |

---

## 8. Migration Plan

No migration needed. This is a purely additive feature:
1. Add `@google/generative-ai` to `package.json` and run `npm install`
2. Add i18n keys to the 3 `common.json` files
3. Create `ToshiAITerminal/` component directory and files
4. Add `<ToshiAITerminal />` to `HeroDark/index.tsx`
5. Set `NEXT_PUBLIC_GEMINI_API_KEY` in `.env.local` when credentials are ready

Without step 5, the component returns `null` silently — no visual change, no error.

---

## 9. Risks and Mitigations

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| `NEXT_PUBLIC_GEMINI_API_KEY` exposed in client bundle; key abused | Medium (API quota exhausted) | Medium | HTTP referrer restriction in Google AI Studio console: allow only `gtoshinakano.github.io/fullstack-profile/*` |
| Gemini API rate limit hit by many simultaneous visitors | Low (portfolio traffic is low) | Low | Input disabled during streaming (RF-12) prevents rapid successive calls; 3-question session cap (RF-08) limits total volume |
| Menu GSAP ScrollTrigger broken by new content height | High (breaks existing UX) | Low | Menu ScrollTrigger triggers on `containerRef.current` (self), not on a page position; adding sibling before it is safe. Verify in browser after implementation. |
| `@google/generative-ai` bundle footprint affects Lighthouse score | Medium | Medium | Dynamic `import()` defers load (D-02); component is below the fold; impact should be negligible |
| Gemini model deprecation | Low | Low | Model name isolated in a single constant in `useGeminiStream.ts`; easy to update |
| Questions on locale change: should history clear? | Low (UX minor) | — | Spec (Gherkin scenario "Locale change"): history stays; locale only changes UI labels. No risk. |

---

## 10. Definition of Done

- [ ] All actions in `actions.md` marked `[X]`
- [ ] `ToshiAITerminal` renders correctly between photo and menu on desktop and mobile
- [ ] Terminal hides completely when `NEXT_PUBLIC_GEMINI_API_KEY` is absent
- [ ] Welcome message appears on mount in correct locale
- [ ] 3-question counter enforced; input disabled after 3rd question
- [ ] 200-character limit enforced; submit blocked when exceeded
- [ ] Streaming response visible with `▋` cursor during generation
- [ ] All 3 locale files updated with `toshi-ai` keys
- [ ] Existing HeroDark GSAP animations (photo carousel, menu sticky) unaffected
- [ ] No TypeScript errors introduced (`npm run build` passes)
- [ ] `regression-watch.md` generated

---

## 11. Change History

| Date | Change | Author |
|------|--------|--------|
| 2026-05-17 | Initial version generated by `/reversa-plan` | reversa |
