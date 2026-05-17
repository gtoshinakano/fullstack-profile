# Legacy Impact Report
Feature: 001-projects-tab-i18n
Date: 2026-05-17

## Arquivo afetado | Componente | Tipo | Severidade | Justificativa
src/data/toshi-projects.json | data | regra-alterada | HIGH | Fixed duplicate label "portfolio" -> "anki-web" to resolve grouped accordion behavior (BR-07).
public/locales/ja/projects-data.json | i18n (Japanese) | regra-nova | MEDIUM | Added Japanese translations for all 21 project entries to enable i18n for project details.
public/locales/pt-BR/projects-data.json | i18n (Portuguese) | regra-nova | MEDIUM | Added Portuguese translations for all 21 project entries.
public/locales/en/common.json | i18n (English) | regra-nova | LOW | Added project-types translations to enable i18n for project type field.
public/locales/ja/common.json | i18n (Japanese) | regra-nova | LOW | Added project-types translations in Japanese.
public/locales/pt-BR/common.json | i18n (Portuguese) | regra-nova | LOW | Added project-types translations in Portuguese.
pages/[locale]/index.ts | page (locale) | regra-alterada | MEDIUM | Added 'projects-data' to the namespaces in getStaticProps to enable i18n for project data.
src/components/views/dev/gabriel/HeroDark/Projects.tsx | Projects (HeroDark) | regra-alterada | HIGH | Wrapped title, learnings, public, problem, solution, and type with i18n t() calls to enable translation, and changed useTranslation to load projects-data namespace.

## Diff conceitual por componente
### data
Corrigido o rótulo duplicado em `toshi-projects.json`: alterado `"label": "portfolio"` para `"label": "anki-web"` na entrada da "Japanese Kanji Memorization Application". Isso resolve o comportamento de acordeon agrupado onde múltiplos projetos com o mesmo rótulo se expandiam simultaneamente (BR-07).

### i18n
Adicionados arquivos de tradução para o conteúdo dos projetos em japonês (`public/locales/ja/projects-data.json`) e português (`public/locales/pt-BR/projects-data.json`), contendo as traduções dos campos title, learnings, public, problem e solution para cada um dos 21 projetos.
Adicionada a sub-chave `project-types` aos arquivos de tradução comum (`public/locales/en/common.json`, `public/locales/ja/common.json`, `public/locales/pt-BR/common.json`) com as traduções dos 5 tipos de projetos (personal, job, volunteer, freelance, open source) em cada idioma.

### page (locale)
Atualizado `pages/[locale]/index.ts` para incluir `'projects-data'` no array de namespaces passado a `makeStaticProps`, permitindo que os dados dos projetos sejam carregados estaticamente para cada localidade.

### Projects (HeroDark)
Modificado `src/components/views/dev/gabriel/HeroDark/Projects.tsx` para:
- Carregar o namespace `projects-data` além de `common` no hook `useTranslation`.
- Envolver os campos dinâmicos dos projetos com chamadas de tradução:
  - `item.title` → `t('projects-data:${item.label}.title', { defaultValue: item.title })`
  - `item.learnings` → `t('projects-data:${item.label}.learnings', { defaultValue: item.learnings })`
  - `item.public` → `t('projects-data:${item.label}.public', { defaultValue: item.public })`
  - `item.problem` → `t('projects-data:${item.label}.problem', { defaultValue: item.problem })`
  - `item.solution` → `t('projects-data:${item.label}.solution', { defaultValue: item.solution })`
  - `item.type` → `t('project-types.${item.type}', { defaultValue: item.type })`
Manter `item.subtitle` sem tradução, conforme especificação.

## Preservadas
Todas as regras de negócio 🟢 do `domain.md` continuam intactas, pois nenhuma foi alterada ou removida:
- BR-01: Page renders only after Pace.js reports loading complete
- BR-02: Responsive breakpoint is aspect ratio, not viewport width
- BR-03: Tab changes are locked during animations
- BR-04: Projects always display newest-first
- BR-05: Education entries are hardcoded in JSX
- BR-06: Education is visible by default but user-hideable
- BR-07: Duplicate `label` field causes grouped accordion behavior (note: the duplicate foi corrigido, mas a regra permanece válida)
- BR-08: Analytics disabled completely in development
- BR-09: Language switcher requires prefix for GitHub Pages
- BR-10: Article content (Introduction) is English-only
- BR-11: Social links at article bottom are decorative placeholders
- BR-12: `reloadOnPrerender: true` has no effect in static export
- BR-13: GitHub Pages deployment is fully automated on push to `main`
- Objetivos implícitos de produto (1-4) relacionados à atração de recrutadores, demonstração de habilidade UI/UX, prática de escrita em inglês/japonês e rastreamento de comportamento.

## Modificadas
Nenhuma regra de negócio 🟢 do `domain.md` foi alterada ou removida como resultado dessas mudanças.