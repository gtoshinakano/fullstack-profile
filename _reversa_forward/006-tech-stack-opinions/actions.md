# Actions: Tech Stack Opinions

> Identificador: `006-tech-stack-opinions`
> Data: `2026-05-20`
> Roadmap: `_reversa_forward/006-tech-stack-opinions/roadmap.md`

## Resumo

| Métrica | Valor |
|---------|-------|
| Total de ações | 8 |
| Paralelizáveis (`[//]`) | 2 |
| Maior cadeia de dependência | 3 (T001 → T002 → T003) |

---

## Fase 1: Preparação

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|--------------|-------------|--------------|-------------|--------|
| T001 | Validate current `src/data/stacks.json` structure and confirm all 49 stacks exist and have required fields (`name`, `src`, `css`, `url`) | - | `[//]` | `src/data/stacks.json` | 🟢 | `[X]` |
| T002 | Review `worker/src/systemPrompt.ts` and identify the exact location where system prompt is built; note the current structure so opinion section can be inserted naturally | T001 | - | `worker/src/systemPrompt.ts` | 🟢 | `[X]` |

---

## Fase 2: Testes

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|--------------|-------------|--------------|-------------|--------|
| T003 | Create a test stubs: add `opinion` field to 3–5 representative stacks in `stacks.json` (e.g., reactjs, nodejs, typescript, aws, tailwind) with authentic Gabriel opinions for manual testing | T002 | `[//]` | `src/data/stacks.json` | 🟢 | `[X]` |

---

## Fase 3: Núcleo

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|--------------|-------------|--------------|-------------|--------|
| T004 | Edit `src/data/stacks.json`: add `opinion: string` field to all remaining 44 stacks (those without opinions from T003). Opinions should be 1–3 sentences each, authentic to Gabriel's experience with each technology | T003 | - | `src/data/stacks.json` | 🟡 | `[X]` |
| T005 | Update `worker/src/systemPrompt.ts`: import stacks.json and construct a new prose section "## Your Technical Perspective" that iterates over stacks, filters those with non-null `opinion` fields, and formats them as "• [Stack Name]: [opinion text]" joined by newlines | T002 | - | `worker/src/systemPrompt.ts` | 🟢 | `[X]` |
| T006 | Integrate the opinions prose section into the system prompt string in `systemPrompt.ts`, positioned after profile/jobs/projects sections and before closing the prompt | T005 | - | `worker/src/systemPrompt.ts` | 🟢 | `[X]` |

---

## Fase 4: Integração

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|--------------|-------------|--------------|-------------|--------|
| T007 | Test locally: start `wrangler dev` in the worker directory; verify worker loads `stacks.json` without errors; confirm systemPrompt.ts builds successfully with the new opinions section included | T006 | - | `worker/src/systemPrompt.ts` (verify) | 🟢 | `[X]` |
| T008 | Test happy path: with worker running locally, open the portfolio frontend, navigate to ToshiAITerminal, submit a question about a stack WITH an opinion (e.g., "What do you think about React?"), verify the AI response incorporates the documented opinion | T007 | - | Test via `http://localhost:3000` | 🟢 | `[X]` |
| T009 | Test fallback path: ask the terminal about a stack WITHOUT an opinion (e.g., a less common tool), verify AI responds with honest acknowledgement ("I don't have a documented opinion on that yet, but...") rather than hallucinating | T007 | - | Test via `http://localhost:3000` | 🟢 | `[X]` |

---

## Fase 5: Polimento

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|--------------|-------------|--------------|-------------|--------|
| T010 | Validate JSON integrity: run `jq empty src/data/stacks.json` to ensure valid JSON syntax; run `jq 'to_entries \| map(select(.value.opinion == null)) \| length' src/data/stacks.json` to count entries without opinion (should be 0) | T004 | `[//]` | `src/data/stacks.json` | 🟢 | `[X]` |
| T011 | Final sanity check: ensure frontend (`src/components/views/dev/gabriel/HeroDark/`) does NOT import stacks.json directly; grep for `import.*stacks` in src/components/ to confirm opinions are server-side only, never in browser bundle | T010 | `[//]` | `src/` (verify) | 🟢 | `[X]` |

---

## Notas de execução

> Reservado para `/reversa-coding` registrar observações durante a execução.

**Setup pré-requisito para primeiro deploy real:**
- Antes de `wrangler deploy` em CI, confirmem que worker consegue ler stacks.json com novo schema
- Local testing via `wrangler dev` deve ser feito antes de commit

**Ordem de execução recomendada:**
1. T001 (validate current state)
2. T002 (review worker code)
3. T003 (add test opinions to 3–5 stacks em paralelo com T002 se preferir)
4. T004 (populate all 49 stacks)
5. T005 + T006 (update worker systemPrompt)
6. T007 + T008 + T009 (integration testing)
7. T010 + T011 (final validation em paralelo)

---

## Histórico de alterações

| Data | Alteração | Autor |
|------|-----------|-------|
| 2026-05-20 | Versão inicial gerada por `/reversa-to-do` | reversa |
