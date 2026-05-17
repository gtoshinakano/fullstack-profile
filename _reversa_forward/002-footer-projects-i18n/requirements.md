# Requirements: Footer and Projects Labels i18n

> Identifier: `002-footer-projects-i18n`
> Date: `2026-05-17`
> Extraction folder: `_reversa_sdd/`
> Confidence: 🟢 CONFIRMED, 🟡 INFERRED, 🔴 GAP

## 1. Executive Summary

Add internationalization (i18n) support for the footer section at the bottom of `Introduction.tsx` (the "Let's connect" LinkedIn link and "Share this page" placeholder text around lines 185-194) and remaining translatable UI labels in the Projects component. The Projects component already uses `useTranslation` for most labels, but the project action button text (`action.label`) is hardcoded per project in `toshi-projects.json`. The `action.label` field will be moved from `toshi-projects.json` into `projects-data.json` locale files (same pattern as `title`, `learnings`, etc.), removing it from the JSON data entirely.

## 2. Context from Legacy

| Source | Relevant Excerpt | Confidence |
|-------|------------------|-------------|
| `_reversa_sdd/architecture.md#Component Map` | Projects.tsx → accordion of 19 projects; ChangeLanguage → locale switcher fixed top-right | 🟢 |
| `_reversa_sdd/code-analysis.md#Feature 2 — hero-dark` | Projects component uses `useTranslation(['common', 'projects-data'])`; `item.action.label` rendered without `t()` at line 199 | 🟢 |
| `_reversa_sdd/code-analysis.md#Feature 5 — i18n` | Supported locales: en, ja, pt-BR; translation files in `public/locales/<locale>/`; default namespaces: `common`, `future-partner` | 🟢 |
| `_reversa_sdd/code-analysis.md#Feature 6 — layout` | Public/index.tsx provides layout shell with Head, ChangeLanguage, and children — no footer component found | 🟢 |
| `_reversa_sdd/domain.md#BR-10` | Article content (Introduction.tsx) is English-only, not internationalized 🟡 INFERRED | 🟡 |
| `src/components/views/dev/gabriel/HeroDark/Projects.tsx:199` | `{item.action.label}` — action button text not wrapped in `t()` | 🟢 |
| `src/components/views/dev/gabriel/MainContent/Introduction.tsx:185-194` | Footer area: "Let's connect" LinkedIn link + "Share this page" span — static text not wrapped in `t()` | 🟢 |

## 3. Personas and Usage Scenarios

| Persona | Objective | Key Scenario |
|---------|----------|---------------|
| Recruiter (Japanese) | View project details in native language | Switches to Japanese locale, expects project action buttons (e.g., "View Live") to appear in Japanese |
| Portfolio visitor (Brazilian Portuguese) | Navigate projects with localized UI | Accesses site in pt-BR, sees all project UI labels in Portuguese, including action buttons |
| Site owner (Gabriel) | Maintain consistent i18n across all visible UI text | Ensures any "footer" content is translatable before adding it |

## 4. New or Changed Business Rules

1. **RN-01:** Project action button labels must be moved from `toshi-projects.json` to `projects-data.json` locale files 🟢
   - Origin in legacy: `_reversa_sdd/code-analysis.md#Feature 2 — hero-dark` (Projects.tsx line 199: `{item.action.label}` not wrapped in `t()`)
   - Type: new
   - Details: Each project's `action.label` field in `toshi-projects.json` (e.g., "View Live") must be moved entirely to `projects-data.json` locale files (en, ja, pt-BR), following the same pattern as `title`, `learnings`, etc. The `action.label` field will be removed from `toshi-projects.json`. Projects.tsx will use `t(\`projects-data:${item.label}.action\`)` with no fallback to the JSON data.

2. **RN-02:** Footer text in Introduction.tsx must be translatable via i18n keys 🟢
   - Origin in legacy: User request "translate the footer" + `Introduction.tsx:185-194`
   - Type: new
   - Details: The footer area at the bottom of `Introduction.tsx` (lines 185-194) contains a LinkedIn "Let's connect" link and a "Share this page" placeholder. These must be wrapped in `t()` calls with keys in the `common.json` namespace.

3. **RN-03:** All user-visible text in Projects tab must use `t()` translation wrapper 🟢
   - Origin in legacy: `_reversa_sdd/code-analysis.md#Feature 2 — hero-dark`
   - Type: changed (extends existing i18n usage in Projects.tsx)

## 5. Functional Requirements

| ID | Requirement | Priority | Acceptance Criteria | Confidence |
|----|-----------|------------|--------------------|-------------|
| RF-01 | Make `item.action.label` translatable by adding project action keys to `projects-data.json` locale files | Must | Action labels render in current locale; fallback to `item.action.label` when translation missing | 🟢 |
| RF-02 | Project action button text must use locale-specific translation keys via the existing i18n namespace | Must | `projects-data:<label>.action` translation is used for action button text | 🟢 |
| RF-03 | Add i18n keys for footer content in `Introduction.tsx` (lines 185-194) in all 3 locales | Must | "Let's connect" and "Share this page" render in current locale | 🟢 |
| RF-04 | Wrap footer text in `Introduction.tsx` with `t()` calls using `common.json` namespace keys | Must | Footer area uses `t('lets-connect')`, `t('share-this-page')` etc. | 🟢 |

## 6. Non-Functional Requirements

| Type | Requirement | Evidence or Justification | Confidence |
|------|-----------|----------------------------|-------------|
| Performance | Adding translation keys must not increase bundle size significantly | Static JSON files are already loaded per locale via next-i18next | 🟢 |
| Compatibility | Must work with existing static export + GitHub Pages deployment | Current i18n setup already supports 3 locales in static export mode | 🟢 |
| Maintainability | Translation keys must follow existing naming convention (`projects-data:<label>.<field>`) | Consistent with keys added in feature 001-projects-tab-i18n | 🟢 |

## 7. Acceptance Criteria

```gherkin
Scenario: Project action label renders in current locale
  Given the user is viewing the Projects tab
  And the current locale is "ja"
  When the project "portfolio" has action label translated in `public/locales/ja/projects-data.json`
  Then the action button displays the Japanese translation "詳しく見る" (example)

Scenario: Project action label falls back to default
  Given the user is viewing the Projects tab
  And the current locale is "pt-BR"
  And the project "anki-web" has no action translation in `pt-BR/projects-data.json`
  Then the action button displays the original `item.action.label` value

Scenario: Footer content renders in current locale
  Given the user is viewing the article in Introduction.tsx
  And the current locale is "ja"
  And the footer area (lines 185-194) has i18n keys in `common.json`
  Then "Let's connect" displays in Japanese
  And "Share this page" displays in Japanese

Scenario: Footer link remains functional after i18n
  Given the footer area has a LinkedIn link
  When the locale is switched to "pt-BR"
  Then the link text displays in Portuguese
  And the href still points to the LinkedIn profile
```

## 8. MoSCoW Priority

| Item | MoSCoW | Justification |
|------|--------|---------------|
| RF-01 + RF-02 (action labels i18n) | Must | Core request: "translatable labels in projects" — the action label is the only untranslated UI label in Projects |
| RF-03 (identify footer) | Must | Core request: "translate the footer" — cannot implement without knowing what it is |
| RF-04 (footer i18n keys) | Must (if footer exists) | Core request: "translate the footer" |
| NFR maintainability | Should | Ensures consistency with existing i18n patterns |

## 9. Clarifications

### Session 2026-05-17

- **Q:** What does "footer" refer to in your request?
  **R:** The bottom section of the article in `Introduction.tsx` (the "Let's connect", "Share this page" placeholders around lines 185-194)

- **Q:** How should the project action button text (`item.action.label` in `toshi-projects.json`, e.g., "View Live") be handled?
  **R:** Move the `action.label` field from `toshi-projects.json` into `projects-data.json` locale files (en, ja, pt-BR), removing it from the JSON data entirely. Follow same pattern as `title`, `learnings`, etc.

- **Q:** If a footer section does not yet exist (which is the current state), what should be done?
  **R:** The footer I mentioned ARE the answered in the first question — meaning the footer refers to the bottom section of `Introduction.tsx` (lines 185-194).

## 10. Gaps

- 🔴 The Introduction.tsx footer area (lines 185-194) currently has a non-functional "Share this page" `<span>` — user confirmed it should be translated, but functionality (actual share action) was not requested.
- 🔴 The "Buy me a Coffee" placeholder mentioned in archaeology issues (`domain.md#BR-11`) does not exist in the current `Introduction.tsx` — may have been removed.

## 11. Change History

| Date | Change | Author |
|------|-----------|-------|
| 2026-05-17 | Initial version generated by `/reversa-requirements` | reversa |
