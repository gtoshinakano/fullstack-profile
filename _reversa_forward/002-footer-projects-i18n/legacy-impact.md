# Legacy Impact: Footer and Projects Labels i18n

> Identifier: `002-footer-projects-i18n`
> Date: `2026-05-17`

## Summary

This feature touches 3 components and 4 locale files. The changes are additive (new keys, new field) or replacement of one string pattern (`{item.action.label}` → `{t(\`projects-data:...\`)}`). No existing behavior is removed.

## Impacted Legacy Components

| Component | File | Change | Impact |
|-----------|------|--------|---------|
| `Introduction()` | `src/components/views/dev/gabriel/MainContent/Introduction.tsx` | Footer strings wrapped with `t()` | **Low** — only 2 strings in footer area; no impact to article body or other sections |
| `Projects()` | `src/components/views/dev/gabriel/HeroDark/Projects.tsx` | `{item.action.label}` → `{t(\`projects-data:${item.label}.action\`)}`; type def updated | **Low** — same pattern as existing `t()` calls for title/learnings/etc.; `action.label` field was already non-functional for entries with empty string |
| `toshi-projects.json` | `src/data/toshi-projects.json` | `action.label` removed from all entries | **None** — no code reads `action.label` anymore after Projects.tsx update |

## Impacted Locale Files

| File | Change | Impact |
|------|--------|---------|
| `public/locales/en/projects-data.json` | **NEW** file with 19 entries + `action` field | No legacy impact (new file) |
| `public/locales/ja/projects-data.json` | Added `action` field to 19 entries | **None** — additive only |
| `public/locales/pt-BR/projects-data.json` | Added `action` field to 19 entries | **None** — additive only |
| `public/locales/en/common.json` | Added 2 keys: `lets-connect`, `share-this-page` | **None** — additive only |
| `public/locales/ja/common.json` | Added 2 keys: `lets-connect`, `share-this-page` | **None** — additive only |
| `public/locales/pt-BR/common.json` | Added 2 keys: `lets-connect`, `share-this-page` | **None** — additive only |

## Files NOT Touched (Confirmed No Impact)

- `src/components/views/dev/gabriel/HeroDark/Jobs.tsx` — unrelated
- `src/components/views/dev/gabriel/HeroDark/FuturePartner.jsx` — unrelated
- `src/components/views/dev/gabriel/HeroSection/*` — unrelated
- `src/components/layout/Public/index.tsx` — unrelated
- `src/components/dom/ChangeLanguage/index.tsx` — unrelated
- All `pages/` files — unchanged (namespaces already configured in feature 001)
- `next-i18next.config.js` — unchanged (no new namespaces needed)
- `src/data/jobs.json`, `src/data/stacks.json`, `src/data/swtools.json` — untouched

## Risk Assessment

| Risk | Probability | Mitigation |
|------|------------|-------------|
| Missing `action` key in some locale for a project | Low | Build succeeds; i18next shows key as text — visually noticeable |
| Wrong Japanese/Portuguese translation for action labels | Low | Translations were provided by user in `/reversa-clarify`; editable in locale files later |
| TypeScript error from updated `IProject` type | None | Already fixed; `action` now `{ url: string }` without `label` |
| Regression in project accordion behavior | None | `expanded` state logic untouched; only rendering of action button changed |
