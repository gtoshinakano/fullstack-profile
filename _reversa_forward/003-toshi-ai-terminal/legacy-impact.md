# Legacy Impact: Toshi AI Chat Terminal

> Feature: `003-toshi-ai-terminal`
> Date: `2026-05-17`
> Executed by: `/reversa-coding`

---

## Affected Files

| File | Component (`_reversa_sdd/`) | Change type | Severity | Justification |
|------|-----------------------------|-------------|----------|---------------|
| `src/components/views/dev/gabriel/HeroDark/index.tsx` | `_reversa_sdd/architecture.md#Component Map — HeroDark/index.tsx` | component-altered | LOW | Added one import and one JSX element. No state, no logic, no existing lines modified. |
| `src/components/views/dev/gabriel/HeroDark/ToshiAITerminal/index.tsx` | (new — child of HeroDark) | component-new | LOW | Self-contained component; owns its own state; does not share state with parent `Herodark`. |
| `src/components/views/dev/gabriel/HeroDark/ToshiAITerminal/systemPrompt.ts` | (new) | component-new | LOW | Pure function; reads 4 existing data files statically; no side effects. |
| `src/components/views/dev/gabriel/HeroDark/ToshiAITerminal/useGeminiStream.ts` | (new) | component-new | LOW | Async utility function; isolated; no shared state. |
| `public/locales/en/common.json` | `_reversa_sdd/i18n/design.md#Dependências` | delta-de-dados | LOW | Additive: new `toshi-ai` key group. Existing keys untouched. |
| `public/locales/ja/common.json` | `_reversa_sdd/i18n/design.md#Dependências` | delta-de-dados | LOW | Same as above — Japanese locale. |
| `public/locales/pt-BR/common.json` | `_reversa_sdd/i18n/design.md#Dependências` | delta-de-dados | LOW | Same as above — Brazilian Portuguese locale. |
| `package.json` | `_reversa_sdd/dependencies.md#Runtime Dependencies` | delta-de-dados | LOW | Added `@google/generative-ai ^0.24.1` to dependencies. |
| `.env.local.example` | (new file — not in extraction) | component-new | LOW | Documentation only; not bundled into the build. |
| Gemini API (external) | `_reversa_sdd/architecture.md#External Integrations` | delta-de-contrato-externo | MEDIUM | New browser-initiated external call to Google AI Studio. API key exposed client-side — requires HTTP referrer restriction. |

---

## Conceptual Diff by Component

### `HeroDark/index.tsx`

One import added at the top. One JSX element (`<ToshiAITerminal />`) inserted between the profile photo block and the `<Menu>` component. The existing GSAP ScrollTrigger on the photo carousel (trigger: `#profile-photo`) and the Menu's pin ScrollTrigger (trigger: `containerRef.current`) are both self-referential and are unaffected by the addition of a sibling element. The `selected`, `loading`, and `hasEducation` state variables remain unchanged.

### i18n locale files

New group `"toshi-ai"` added at the end of each `common.json`. All existing keys preserved. The `getStaticProps` pipeline (`getStatic.js`) loads the `common` namespace — no changes to the i18n loading pipeline.

### External integration (Gemini API)

New browser-initiated HTTPS call to `generativelanguage.googleapis.com`. Call is deferred (dynamic import) and only triggered by user interaction. Protected by: (a) `NEXT_PUBLIC_GEMINI_API_KEY` guard — component returns `null` if absent; (b) 3-question session cap; (c) HTTP referrer restriction to be configured by the author in Google AI Studio console.

---

## Preserved Rules (from `_reversa_sdd/domain.md`)

The following confirmed business rules remain intact:

| Rule | Status |
|------|--------|
| BR-01 — Page renders only after Pace.js reports loading complete | ✅ Preserved — ToshiAITerminal is inside HeroDark which renders unconditionally; does not interact with the Pace.js gate |
| BR-02 — Responsive breakpoint is aspect ratio | ✅ Preserved — ToshiAITerminal uses Tailwind responsive classes, does not duplicate the `isWide` logic |
| BR-03 — Tab changes are locked during GSAP animations | ✅ Preserved — ToshiAITerminal has no interaction with the tab state machine |
| BR-04 — Projects display newest-first | ✅ Preserved — `Projects.tsx` unchanged |
| BR-05 — Education entries are hardcoded in JSX | ✅ Preserved — `Jobs.tsx` unchanged; education also hardcoded in `systemPrompt.ts` for AI context |
| BR-08 — Analytics disabled in development | ✅ Preserved — `event()` from `ga.ts` uses `window.gtag` guard |
| BR-09 — Language switcher requires prefix for GitHub Pages | ✅ Preserved — `ChangeLanguage/index.tsx` unchanged |
| BR-13 — GitHub Pages deployment automated on push to `main` | ✅ Preserved — build passes, no CI config changed |

---

## Modified Rules

No existing business rules were modified or removed by this feature. The Gemini API integration is a new rule (RN-01 through RN-07 in `requirements.md`) with no legacy counterpart.
