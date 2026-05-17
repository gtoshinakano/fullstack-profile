# Actions: Footer and Projects Labels i18n

> Identificador: `002-footer-projects-i18n`
> Data: `2026-05-17`
> Roadmap: `_reversa_forward/002-footer-projects-i18n/roadmap.md`

## Resumo

| Métrica | Valor |
|---------|-------|
| Total de ações | 10 |
| Paralelizáveis (`[//]`) | 4 |
| Maior cadeia de dependência | 6 (T001→T002→T005→T006→T007→T009→T010) |

## Fase 1 — Preparação

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|--------------|-------------|--------------|-------------|--------|
| T001 | Remover `"label"` de dentro de `"action"` em `toshi-projects.json` (19 entradas). O objeto `"action"` fica apenas com `"url": "..."`. Usar script ou edição manual. | - | - | `src/data/toshi-projects.json` | 🟢 | `[X]` |
| T002 | Criar `public/locales/en/projects-data.json` com as 19 entradas existentes (já com `title`, `learnings`, `public`, `problem`, `solution`) e adicionar campo `"action"` com valores em inglês extraídos do JSON original (ex.: `"maplestory": { ..., "action": "" }`, `"bingo": { ..., "action": "Use it for free" }`, etc.) | T001 | - | `public/locales/en/projects-data.json` | 🟢 | `[X]` |
| T003 | Adicionar `"lets-connect": "Let's connect"` e `"share-this-page": "Share this page"` em `public/locales/en/common.json` | - | `[//]` | `public/locales/en/common.json` | 🟢 | `[X]` |
| T004 | Adicionar `"lets-connect": "コネクト"` e `"share-this-page": "このページをシェア"` em `public/locales/ja/common.json` | - | `[//]` | `public/locales/ja/common.json` | 🟢 | `[X]` |
| T005 | Adicionar `"lets-connect": "Vamos conectar"` e `"share-this-page": "Compartilhe esta página"` em `public/locales/pt-BR/common.json` | - | `[//]` | `public/locales/pt-BR/common.json` | 🟢 | `[X]` |

## Fase 2 — Testes

> Omitida. O projeto tem zero arquivos de teste (`_reversa_sdd/inventory.md`: `test_files: 0`). Nenhum framework de teste configurado.

## Fase 3 — Núcleo

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|--------------|-------------|--------------|-------------|--------|
| T006 | Adicionar campo `"action"` em cada uma das 19 entradas de `public/locales/ja/projects-data.json` com valores em japonês (ex.: `"bingo": { ..., "action": "無料で使う" }`, `"ros": { ..., "action": "ガイドを見る" }`, etc.) | T002 | - | `public/locales/ja/projects-data.json` | 🟢 | `[X]` |
| T007 | Adicionar campo `"action"` em cada uma das 19 entradas de `public/locales/pt-BR/projects-data.json` com valores em português brasileiro (ex.: `"bingo": { ..., "action": "Use grátis" }`, `"ros": { ..., "action": "Visite o guia" }`, etc.) | T002 | - | `public/locales/pt-BR/projects-data.json` | 🟢 | `[X]` |

## Fase 4 — Integração

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|--------------|-------------|--------------|-------------|--------|
| T008 | Atualizar `src/components/views/dev/gabriel/MainContent/Introduction.tsx` linhas 185-194: envolver "Let's connect" com `{t('lets-connect')}` e "Share this page" com `{t('share-this-page')}`. O `<a>` deve manter `href` e `target="_blank"`. O `<span>` permanece como elemento visual. | T003, T004, T005 | - | `src/components/views/dev/gabriel/MainContent/Introduction.tsx` | 🟢 | `[X]` |
| T009 | Atualizar `src/components/views/dev/gabriel/HeroDark/Projects.tsx` linha 199: substituir `{item.action.label}` por `{t(\`projects-data:${item.label}.action\`)}`. O `useTranslation` já retorna os namespaces `['common', 'projects-data']`. | T006, T007 | - | `src/components/views/dev/gabriel/HeroDark/Projects.tsx` | 🟢 | `[X]` |

## Fase 5 — Polimento

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|--------------|-------------|--------------|-------------|--------|
| T010 | Executar `npm run build` e confirmar que o build conclui sem erro. Verificar que as pastas `out/en/`, `out/ja/` e `out/pt-BR/` foram geradas. Verificar que strings do rodapé e botões de ação aparecem nos idiomas corretos. | T008, T009 | - | _(build output)_ | 🟢 | `[X]` |

## Notas de execução

<!-- Reservado para /reversa-coding registrar avisos ou observações durante a execução. -->

## Histórico de alterações

| Data | Alteração | Autor |
|------|-----------|-------|
| 2026-05-17 | Versão inicial gerada por `/reversa-to-do` | reversa |
