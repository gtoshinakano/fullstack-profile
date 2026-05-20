# Roadmap: Tech Stack Opinions

> Identificador: `006-tech-stack-opinions`
> Data: `2026-05-20`
> Requirements: `_reversa_forward/006-tech-stack-opinions/requirements.md`
> Confidência: 🟢 CONFIRMADO, 🟡 INFERIDO, 🔴 LACUNA

## 1. Resumo da abordagem

Extend `stacks.json` with an optional `opinion` field (string) for each of the 49 tech stacks. The Cloudflare Worker's `systemPrompt.ts` (feature 005) will be updated to read these opinions at deploy time and construct a prose narrative that weaves Gabriel's perspective into the system prompt. When a visitor asks the ToshiAITerminal about a technology, the AI has Gabriel's documented opinion available and can reference it naturally. Stacks without opinions gracefully omit from the prose and the AI falls back to honest acknowledgement ("I don't have a documented opinion on that yet"). The frontend remains unchanged — opinions are a server-side concern only, kept in the worker's deployment.

---

## 2. Princípios aplicados

> No principles file exists at `.reversa/principles.md`. Feature respects legacy conventions: static data, build-time integration, no runtime data fetching.

---

## 3. Decisões técnicas

| ID | Decisão | Justificativa | Alternativas descartadas | Confidência |
|----|---------|----------------|--------------------------|-------------|
| D-01 | Schema extension: add optional `opinion: string \| null` field to `stacks.json` | Backward-compatible, non-breaking change; existing stacks continue to work | Separate file for opinions, GraphQL schema, database table | 🟢 |
| D-02 | Populate all 49 stacks with opinions (vs. subset) | Complete coverage from day one ensures AI can authoritatively discuss all technologies Gabriel has used; matches portfolio's scope of work | Incremental population starting with top 10; lazy loading; dynamic opinions endpoint | 🟢 |
| D-03 | Build prose narrative in `systemPrompt.ts` (not table or list format) | Natural integration into AI voice; avoids rigid structure that might feel like metadata; Gabriel clarified preference for prose | Markdown table, JSON array, prompt template variables | 🟢 |
| D-04 | Format: "You have strong opinions on [stack]. [opinion text]..." (prose flow) | Reads naturally; allows AI to weave opinions into conversational responses without stopping to parse structure | Structured list with labels; code comments; separate prompt section | 🟢 |
| D-05 | Worker redeploys to pick up opinion changes (not live reload) | Aligns with existing feature 005 pattern: system prompt is static per deployment; opinions are configuration, not dynamic runtime data | Hot-reload from GitHub, API endpoint, environment variables | 🟢 |
| D-06 | Missing opinions: AI fallback is honest acknowledgement ("I don't have a documented opinion on that yet") | Maintains authenticity and trust; prevents AI from hallucinating Gabriel's views | Silence (omit stack from response), generic commentary, request for documentation | 🟢 |

---

## 4. Premissas

| Premissa | Origem (`requirements.md` seção) | Risco se errada |
|----------|----------------------------------|-----------------|
| All 49 stacks will have opinions populated during feature implementation | Section 9, Sessão 2026-05-20 (clarified via `/reversa-clarify`) | If only subset is done, AI lacks context for technologies not documented; user must remember which stacks have opinions |
| Prose narrative format is sufficient for AI to weave opinions naturally | Section 9, Sessão 2026-05-20 | If structured format is needed later, requires rewrite of `systemPrompt.ts` and retraining of AI behavior |

---

## 5. Delta arquitetural

| Componente | Arquivo de origem no legado | Tipo de mudança | Resumo |
|------------|------------------------------|-----------------|--------|
| `stacks.json` data file | `_reversa_sdd/data-dictionary.md#stacks.json` | campo-novo | Add optional `opinion: string` field to each stack entry |
| Cloudflare Worker `systemPrompt.ts` | `_reversa_sdd/code-analysis.md#Feature 8 — worker` | regra-alterada | Read `opinion` field from imported stacks; construct prose section; embed in system prompt |
| ToshiAITerminal (no change) | `_reversa_sdd/code-analysis.md#Feature 2 — hero-dark` | nenhuma | Terminal behavior unchanged; AI simply has richer context (opinions in system prompt) |

---

## 6. Delta no modelo de dados

**Summary:** Single optional field added to `stacks.json` schema.

**Details (full specs in `data-delta.md`):**
- Add `opinion?: string | null` to each stack object in `src/data/stacks.json`
- Field is optional; existing entries remain valid without it
- Field format: 1–3 sentences of Gabriel's authentic technical perspective
- No migration needed; JSON is rebuilt at feature deploy time

---

## 7. Delta de contratos externos

| Contrato | Tipo | Arquivo de detalhe |
|----------|------|--------------------|
| n/a | — | `stacks.json` is an internal data file, not an external contract. No API changes. |

---

## 8. Plano de migração

**No data migration required.** `stacks.json` schema is extended with an optional field; the 49 entries in the file are manually updated by Gabriel with opinion text. The worker redeployment (feature 005 CI/CD already in place) picks up the updated schema automatically.

1. Edit `src/data/stacks.json`: add `opinion` field to all 49 stacks (e.g., `"opinion": "React is my go-to for interactive UIs. Excellent DX, huge ecosystem, but steep learning curve for absolute beginners."`)
2. Commit to `main` branch
3. GitHub Actions runs `wrangler deploy` (feature 005 worker deployment step)
4. Worker reloads `stacks.json` at deploy time, includes opinions in system prompt
5. On next visitor question, AI has access to opinions

---

## 9. Riscos e mitigações

| Risco | Impacto | Probabilidade | Mitigação |
|-------|---------|---------------|-----------|
| `opinion` field left as `null` or empty for some stacks | AI lacks context for those stacks; falls back to generic commentary | médio | Decision to populate all 49 stacks reduces surface area; testing validates all entries have text |
| Prose narrative is too long and exceeds token limits | System prompt becomes unwieldy; worker latency increases | baixo | 49 stacks × 2–3 sentences ≈ 500–1000 tokens; system prompt is already ~1000 tokens; acceptable margin |
| Gabriel's opinions contradict each other or seem inconsistent | AI responses may appear hypocritical or confused | baixo | Opinions are Gabriel's authentic voice; consistency is a content quality issue, not a technical one |
| Typos or formatting errors in `opinion` text | System prompt includes garbled text | baixo | Code review + manual testing before worker deployment catches errors |
| Frontend accidentally requests or displays `opinion` field | Opinions leak into browser bundle or network requests | baixo | Frontend does not import/use stacks.json; only worker does. No risk of exposure. |

---

## 10. Critério de pronto

- [ ] `src/data/stacks.json` updated with `opinion` field on all 49 stacks
- [ ] Worker's `worker/src/systemPrompt.ts` updated to read `opinion` field and construct prose section
- [ ] System prompt builds successfully with new prose section
- [ ] Manual testing: visitor asks "What do you think about [stack with opinion]?" → AI response incorporates the documented opinion
- [ ] Manual testing: visitor asks "What do you think about [stack without opinion]?" → AI falls back gracefully with honest acknowledgement
- [ ] GitHub Actions deploys worker successfully with updated code
- [ ] All actions in `actions.md` marked `[X]`
- [ ] `regression-watch.md` generated (from `/reversa-coding`)

---

## 11. Histórico de alterações

| Data | Alteração | Autor |
|------|-----------|-------|
| 2026-05-20 | Versão inicial gerada por `/reversa-plan` | reversa |
