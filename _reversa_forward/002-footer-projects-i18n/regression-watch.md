# Regression Watch: Footer and Projects Labels i18n

> Identifier: `002-footer-projects-i18n`
> Date: `2026-05-17`

## Files Changed

| File | Type of Change | Risk Level |
|------|-----------------|------------|
| `src/data/toshi-projects.json` | Removed `action.label` from all 19 entries | 🟡 Low — field was unused by any logic after change |
| `public/locales/en/projects-data.json` | **NEW** — created with 19 entries + `action` field | 🟢 None — new file, no existing code reads it yet |
| `public/locales/ja/projects-data.json` | Added `action` field to all 19 entries | 🟢 None — extends existing structure |
| `public/locales/pt-BR/projects-data.json` | Added `action` field to all 19 entries | 🟢 None — extends existing structure |
| `public/locales/en/common.json` | Added `lets-connect` and `share-this-page` keys | 🟢 None — new keys, no overwrites |
| `public/locales/ja/common.json` | Added `lets-connect` and `share-this-page` keys | 🟢 None — new keys, no overwrites |
| `public/locales/pt-BR/common.json` | Added `lets-connect` and `share-this-page` keys | 🟢 None — new keys, no overwrites |
| `src/components/views/dev/gabriel/MainContent/Introduction.tsx` | Wrapped footer strings with `t('lets-connect')` and `t('share-this-page')` | 🟡 Low — only affects footer area |
| `src/components/views/dev/gabriel/HeroDark/Projects.tsx` | Changed `{item.action.label}` to `{t(\`projects-data:${item.label}.action\`)}`, fixed type def | 🟢 None — consistent with existing `t()` pattern |

## Regression Checks

| Check | How to Verify | Expected Result |
|-------|-------------------|-------------------|
| Projects accordion still expands/collapses | Click any project header | Expand/collapse works, no console errors |
| Action buttons render with correct labels per locale | Switch to ja/pt-BR, check Bingo/ROS/ASEBASE action buttons | Shows Japanese/Portuguese labels |
| Action URLs still work | Click any action button (e.g., Bingo "Use it for free") | Opens correct URL in new tab |
| Footer links work in all locales | Switch locale, check "Let's connect" link | Link points to LinkedIn, text is localized |
| No TypeScript errors | `npm run build` | Build succeeds with 0 type errors |
| No missing translation warnings | Check browser console in dev mode | No `i18next` missing key warnings |

## Red Lines (Do NOT Merge if...)

- Build fails with TypeScript error
- Any project action button shows raw key like `projects-data:bingo.action`
- Footer shows raw key `lets-connect` or `share-this-page` instead of translated text
- `toshi-projects.json` still contains `action.label` in any entry
