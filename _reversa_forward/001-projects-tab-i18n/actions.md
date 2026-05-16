# Actions: Projects Tab — i18n for Project Content

> Identificador: `001-projects-tab-i18n`
> Data: `2026-05-17`
> Roadmap: `_reversa_forward/001-projects-tab-i18n/roadmap.md`

## Resumo

| Métrica | Valor |
|---------|-------|
| Total de ações | 15 |
| Paralelizáveis (`[//]`) | 8 |
| Maior cadeia de dependência | 8 (T001→T002→T007→T008→T009→T013→T014→T015) |

## Fase 1 — Preparação

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|--------------|-------------|--------------|-------------|--------|
| T001 | Corrigir label duplicado em `toshi-projects.json`: alterar `"label": "portfolio"` para `"label": "anki-web"` na entrada da "Japanese Kanji Memorization Application" (linha ~339 — verificar pelo campo `"subtitle": "https://anki.web.app/"`) | - | - | `src/data/toshi-projects.json` | 🟢 | `[ ]` |
| T002 | Criar `public/locales/ja/projects-data.json` com scaffold de 21 entradas — todas as chaves presentes, valores como string vazia `""` (a ser preenchido nas ações T007-T009). Labels em ordem: `maplestory, sigup, bingo, mailer, cashier, noli, aliber, jpn-utils, ros, ecoid, ishikari, asebase, gustavo-amaral, onoda, portfolio, axa-requirement, anki-web, nbwf-requirement, local-file-uploader, web-template-string, underwriting-improvement` | T001 | `[//]` | `public/locales/ja/projects-data.json` | 🟢 | `[ ]` |
| T003 | Criar `public/locales/pt-BR/projects-data.json` com scaffold de 21 entradas — mesma estrutura e mesmas chaves do T002, valores como string vazia `""` | T001 | `[//]` | `public/locales/pt-BR/projects-data.json` | 🟢 | `[ ]` |
| T004 | Adicionar sub-chave `"project-types"` ao `public/locales/en/common.json` com os 5 tipos em inglês: `personal→"Personal"`, `job→"Job"`, `volunteer→"Volunteer"`, `freelance→"Freelance"`, `open source→"Open Source"` | - | `[//]` | `public/locales/en/common.json` | 🟢 | `[ ]` |
| T005 | Adicionar sub-chave `"project-types"` ao `public/locales/ja/common.json` com os 5 tipos em japonês: `personal→"個人"`, `job→"仕事"`, `volunteer→"ボランティア"`, `freelance→"フリーランス"`, `open source→"オープンソース"` | - | `[//]` | `public/locales/ja/common.json` | 🟢 | `[ ]` |
| T006 | Adicionar sub-chave `"project-types"` ao `public/locales/pt-BR/common.json` com os 5 tipos em português: `personal→"Pessoal"`, `job→"Emprego"`, `volunteer→"Voluntário"`, `freelance→"Freelance"`, `open source→"Open Source"` | - | `[//]` | `public/locales/pt-BR/common.json` | 🟢 | `[ ]` |

## Fase 2 — Testes

> Omitida. O projeto tem zero arquivos de teste (`_reversa_sdd/inventory.md`: `test_files: 0`). Nenhum framework de teste configurado.

## Fase 3 — Núcleo

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|--------------|-------------|--------------|-------------|--------|
| T007 | Preencher `ja/projects-data.json` — Lote A (7 projetos mais antigos): `maplestory`, `sigup`, `bingo`, `mailer`, `cashier`, `noli`, `aliber`. Para cada um, escrever os campos `title`, `learnings`, `public`, `problem`, `solution` em japonês natural e correto | T002 | `[//]` | `public/locales/ja/projects-data.json` | 🟢 | `[ ]` |
| T008 | Preencher `ja/projects-data.json` — Lote B (7 projetos médios): `jpn-utils`, `ros`, `ecoid`, `ishikari`, `asebase`, `gustavo-amaral`, `onoda`. Para cada um, escrever os 5 campos em japonês | T007 | - | `public/locales/ja/projects-data.json` | 🟢 | `[ ]` |
| T009 | Preencher `ja/projects-data.json` — Lote C (7 projetos mais recentes): `portfolio`, `axa-requirement`, `anki-web`, `nbwf-requirement`, `local-file-uploader`, `web-template-string`, `underwriting-improvement`. Para cada um, escrever os 5 campos em japonês | T008 | - | `public/locales/ja/projects-data.json` | 🟢 | `[ ]` |
| T010 | Preencher `pt-BR/projects-data.json` — Lote A (mesmos 7 projetos do T007): `maplestory`, `sigup`, `bingo`, `mailer`, `cashier`, `noli`, `aliber`. Para cada um, escrever os 5 campos em português brasileiro natural | T003 | `[//]` | `public/locales/pt-BR/projects-data.json` | 🟢 | `[ ]` |
| T011 | Preencher `pt-BR/projects-data.json` — Lote B (mesmos 7 projetos do T008): `jpn-utils`, `ros`, `ecoid`, `ishikari`, `asebase`, `gustavo-amaral`, `onoda`. Para cada um, escrever os 5 campos em português | T010 | - | `public/locales/pt-BR/projects-data.json` | 🟢 | `[ ]` |
| T012 | Preencher `pt-BR/projects-data.json` — Lote C (mesmos 7 projetos do T009): `portfolio`, `axa-requirement`, `anki-web`, `nbwf-requirement`, `local-file-uploader`, `web-template-string`, `underwriting-improvement`. Para cada um, escrever os 5 campos em português | T011 | - | `public/locales/pt-BR/projects-data.json` | 🟢 | `[ ]` |

## Fase 4 — Integração

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|--------------|-------------|--------------|-------------|--------|
| T013 | Atualizar `pages/[locale]/index.ts`: adicionar `'projects-data'` ao array de namespaces em `makeStaticProps(['common', 'future-partner'])` → `makeStaticProps(['common', 'future-partner', 'projects-data'])` | T002, T003 | - | `pages/[locale]/index.ts` | 🟢 | `[ ]` |
| T014 | Atualizar `Projects.tsx`: (1) trocar `useTranslation()` por `useTranslation(['common', 'projects-data'])`; (2) envolver `item.title`, `item.learnings`, `item.public`, `item.problem`, `item.solution` com `t('projects-data:${item.label}.<campo>', { defaultValue: item.<campo> })`; (3) envolver `item.type` com `t('project-types.${item.type}', { defaultValue: item.type })`. Manter `item.subtitle` sem `t()` | T013 | - | `src/components/views/dev/gabriel/HeroDark/Projects.tsx` | 🟢 | `[ ]` |

## Fase 5 — Polimento

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|--------------|-------------|--------------|-------------|--------|
| T015 | Executar `npm run build` e confirmar que o build conclui sem erro. Verificar que as pastas `out/en/`, `out/ja/` e `out/pt-BR/` foram geradas. Registrar qualquer warning de i18n no log como nota de execução | T014, T009, T012 | - | _(build output)_ | 🟢 | `[ ]` |

## Notas de execução

<!-- Reservado para /reversa-coding registrar avisos ou observações durante a execução. -->

## Histórico de alterações

| Data | Alteração | Autor |
|------|-----------|-------|
| 2026-05-17 | Versão inicial gerada por `/reversa-to-do` | reversa |
