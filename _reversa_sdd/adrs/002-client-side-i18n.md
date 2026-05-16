# ADR-002 — Client-Side i18n with Route-Based Locale

> Status: **Accepted** (active)
> Date: 2022-08-04 (after turbulent initial attempt)
> Detected by: Reversa Detective · 2026-05-17
> Confidence: 🟢 CONFIRMED (evidenced by commit `63139d7` "Removed serverside translation" and 9 subsequent redirect-fix commits)

---

## Context

The portfolio needed multi-language support for English, Japanese, and Brazilian Portuguese — primarily to appeal to recruiters in Japan and Brazil. The initial approach used Next.js built-in i18n + server-side locale detection.

## Problem with First Approach

Next.js built-in i18n (`next.config.js > i18n:`) requires a running server for locale detection and cannot be used with `output: 'export'`. This caused build failures and runtime errors on GitHub Pages.

## Decision

Replace server-side i18n with a fully client-side approach:

1. Route-based locale: `pages/[locale]/...` dynamic segment
2. Browser language detection via `next-language-detector` library
3. Client-side redirect in `src/lib/redirect.js` that detects the browser locale and redirects
4. `next-i18next` + `react-i18next` for translation loading via `serverSideTranslations` (used at build time, not runtime)

## Rationale

- Compatible with static export (no server required at runtime)
- Locale is part of the URL — SEO-friendly
- `serverSideTranslations` runs at `next build` time, not at request time

## Consequences

- **Multiple redirect hops on first visit:** `/` → `/<locale>` → `/<locale>/dev/gabriel-toshinori-nakano/`
- **`reloadOnPrerender: true` is a dead option:** This flag was added to `next-i18next.config.js` during the transition and has no effect in static export — it is silently ignored
- **Redirect loop risk on 404:** Required a guard in `useRedirect` to detect when the route is `/404` and handle accordingly
- **`useRedirect` missing dependency array:** The redirect logic runs on every render due to missing deps, not just on mount — a subtle bug inherited from the rushed implementation

## Evidence from Git

Commits (Aug 4–10, 2022) showing the struggle:
- `71ac58b` Configured i18n
- `1b0148a` Add i18n config
- `63139d7` **Removed serverside translation** ← pivot point
- `47a0224` changed i18n config
- `2a65ca3` Changed redirect
- `623020b` Adjusted redirection
- `5a40a99` Change redirect logic
- `d7c5fe6` change redirect path
- `e33d3e7` Add prefix on router push ← basePath bug on language switcher
