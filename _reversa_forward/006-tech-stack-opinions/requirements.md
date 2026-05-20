# Requirements: Tech Stack Opinions

> Identificador: `006-tech-stack-opinions`
> Data: `2026-05-20`
> Pasta da extração reversa: `_reversa_sdd/`
> Confidência: 🟢 CONFIRMADO, 🟡 INFERIDO, 🔴 LACUNA / DÚVIDA

## 1. Resumo executivo

Extend the `stacks.json` data structure to include Gabriel's personal opinion on each technology stack. When a visitor asks the ToshiAITerminal about a specific tech stack (e.g., "What do you think about React?"), the Cloudflare Worker incorporates these opinions into the system prompt, enabling the AI to answer with Gabriel's authentic technical perspective. Opinions are maintained manually in the JSON and require no code changes to take effect after worker redeployment.

---

## 2. Contexto a partir do legado

| Fonte | Trecho relevante | Confidência |
|-------|------------------|-------------|
| `_reversa_sdd/data-dictionary.md#stacks.json` | Registry of tech stacks keyed by identifier; currently contains `name`, `src`, `css`, `url` fields; 49 stacks referenced across `jobs.json` and `toshi-projects.json` | 🟢 |
| `_reversa_sdd/architecture.md#System Summary` | Cloudflare Worker `fullstack-profile-ai` generates system prompt at deploy time by importing `jobs.json`, `toshi-projects.json`, and `stacks.json`; shared data source for frontend ↔ worker | 🟢 |
| `_reversa_forward/005-cloudflare-worker-ai-proxy/requirements.md#RN-02` | System prompt includes Gabriel's profile, work history (from jobs.json), skills (from stacks.json), projects (from toshi-projects.json); worker builds it server-side from these canonical data files | 🟢 |
| `_reversa_sdd/code-analysis.md#Feature 8 — worker` | Worker's `systemPrompt.ts` imports all three JSON files at build time; rebuilding the prompt string requires adding opinion fields and concatenating them into the prompt text | 🟡 |
| `_reversa_sdd/domain.md#Business Rules#BR-04` | Projects and jobs are stored with technology references via `stacks` array keys | 🟢 |

---

## 3. Personas e cenários de uso

| Persona | Objetivo | Cenário-chave |
|---------|----------|---------------|
| Gabriel (Author) | Codify his authentic technical perspective on each stack for AI responses | Opens the `stacks.json` file, manually adds an `opinion` field describing his thoughts on React, Vue, AWS, etc.; redeploys the worker; visitor asks "What's your take on React?" and receives an answer grounded in Gabriel's documented opinion |
| Recruiter / Visitor | Understand Gabriel's nuanced view on technologies he has used | Asks the terminal "Do you prefer Node.js or Python?"; AI includes Gabriel's opinion in the response, demonstrating thoughtful technology choices |
| CI/CD Pipeline | Deploy updated opinions without rebuilding the entire frontend | Gabriel edits `stacks.json`, commits to main; GitHub Actions redeploys the worker with new opinions; frontend remains unchanged |

---

## 4. Regras de negócio novas ou alteradas

1. **RN-01:** Each entry in `stacks.json` MAY contain an optional `opinion` field (string). This field is Gabriel's personal technical opinion on that stack. 🟢
   - Tipo: nova
   - Format: free-form text, 1–3 sentences, examples: "React is my go-to for interactive frontends—excellent DX, huge ecosystem." or "AWS is powerful but the pricing model is a bear."

2. **RN-02:** The Cloudflare Worker's `systemPrompt.ts` reads the `opinion` field from EVERY stack in `stacks.json` (all 49 entries) and incorporates it into the system prompt as a prose section. 🟢
   - Tipo: nova
   - Rationale: Complete coverage ensures the AI can respond authoritatively about all technologies Gabriel has used
   - Format: prose narrative (e.g., "You have strong opinions on React, considering it your go-to for interactive frontends. You find AWS powerful but expensive...") inserted into the system prompt
   - Stacks without an opinion field are omitted from the prose (backward-compatible)

3. **RN-03:** Adding or modifying an `opinion` field in `stacks.json` takes effect only after the Cloudflare Worker is redeployed. The frontend does not reference the opinion field; it remains invisible to the browser. 🟢
   - Tipo: nova
   - Rationale: Opinions are server-side secrets, not part of the client bundle

4. **RN-04:** The system prompt includes a prose section that naturally weaves Gabriel's documented opinions into the AI's voice. If a visitor asks about a stack WITHOUT a documented opinion, the AI falls back to saying "I don't have a documented opinion on that yet, but it's a solid technology" or similar acknowledgement. 🟢
   - Tipo: nova
   - Rationale: Honest fallback behavior maintains authenticity while gracefully handling incomplete coverage
   - Note: This behavior is achieved through AI instruction in the system prompt, not code logic

---

## 5. Requisitos Funcionais

| ID | Requisito | Prioridade | Critério de aceite | Confidência |
|----|-----------|------------|--------------------|-------------|
| RF-01 | Add an optional `opinion` field to the `stacks.json` schema; this field is a string (or null if absent) | Must | `stacks.json` can be parsed with the new schema; existing entries without `opinion` remain valid | 🟢 |
| RF-02 | Populate the `opinion` field for all 49 stacks in `stacks.json` with authentic Gabriel opinions | Must | All 49 stacks have documented opinions; opinions read as authentic technical commentary and comprehensively cover Gabriel's experience | 🟢 |
| RF-03 | Update `worker/src/systemPrompt.ts` to read the `opinion` field from imported `stacks.json` and construct a "## Your Technical Perspective" section in the system prompt | Must | System prompt includes a formatted list of stacks with opinions; missing opinions are omitted gracefully | 🟢 |
| RF-04 | When the ToshiAITerminal receives an answer from the worker, the AI's response reflects Gabriel's documented opinions when the user asks about a specific technology | Must | Visitor asks "What do you think of React?" and the AI response incorporates the opinion from `stacks.json` | 🟡 |
| RF-05 | Opinions are never exposed in the browser (no bundle bloat, no XSS surface). Browser can only access stacks' `name`, `src`, `css`, `url` fields as before | Must | Browser DevTools network inspection shows the frontend requesting only the subset of stack data it needs; no opinion field in the bundle | 🟢 |
| RF-06 | Updating an opinion and redeploying the worker results in the new opinion being used by the AI on the next visitor question | Must | Edit `stacks.json` opinion for React, redeploy worker, visitor asks a new question, AI uses the updated opinion | 🟢 |

---

## 6. Requisitos Não Funcionais

| Tipo | Requisito | Evidência ou justificativa | Confidência |
|------|-----------|----------------------------|-------------|
| Segurança | Opinions must not be embedded in the frontend bundle | RN-03 — worker-side secrets not exposed to browser | 🟢 |
| Manutenibilidade | Opinions are plain JSON text in a canonical file (`stacks.json`), editable without code changes | Author manages opinions via version control; no custom admin UI required | 🟢 |
| Performance | System prompt length grows by ~500–1000 characters with opinions; no measurable impact on worker response time | Opinions are concatenated at deploy time (already done for jobs/projects) | 🟡 |
| Backward Compatibility | Existing `stacks.json` entries without an `opinion` field remain valid and render without error | RN-03 — missing opinion is a valid state | 🟢 |
| Observability | Worker deployment logs show successful parsing of `opinion` field (if logging is enabled) | Standard CI/CD visibility | 🟡 |

---

## 7. Critérios de Aceitação

```gherkin
Cenário: Gabriel adiciona opinião a um stack
  Dado que Gabriel edita stacks.json e adiciona campo "opinion": "React é my go-to framework"
  Quando Gabriel redeploya o worker via GitHub Actions
  Então o worker successfully imports o updated stacks.json
  E a nova opinião fica disponível para o system prompt

Cenário: Visitor pergunta sobre um stack com opinião
  Dado que o ToshiAITerminal é ativo
  E o stack React tem uma opinião codificada em stacks.json
  Quando o visitor pergunta "What do you think about React?"
  Então o worker incorpora a opinião no system prompt
  E a resposta da IA reflete a perspectiva documentada de Gabriel

Cenário: Stack sem opinião é tratado gracefully
  Dado que um stack (ex: "ros") não tem campo "opinion" documentada
  Quando um visitor pergunta "What do you think about ROS?"
  Então o AI responde com um fallback honesto
  E diz algo como "I don't have a documented opinion on that yet, but it's a solid technology"
  E mantém tom autêntico sem parecer evasivo

Cenário: Frontend não acessa o campo opinion
  Dado que um visitor abre o portfolio no navegador
  Quando o JavaScript bundle é inspecionado
  Então nenhuma string contendo opiniões técnicas aparece no código
  E nenhuma requisição busca o campo "opinion" do stacks.json

Cenário: Re-deployment atualiza opiniões
  Dado que Gabriel muda a opinião sobre AWS em stacks.json
  Quando GitHub Actions redeploya o worker
  E um novo visitor faz uma pergunta sobre AWS
  Então a IA usa a opinião atualizada na resposta
```

---

## 8. Prioridade MoSCoW

| Item | MoSCoW | Justificativa |
|------|--------|---------------|
| RF-01 (schema extension) | Must | Foundation for the feature |
| RF-02 (populate opinions) | Must | Feature is useless without actual content |
| RF-03 (worker prompt building) | Must | Core requirement |
| RF-04 (AI uses opinions) | Must | End-to-end validation |
| RF-05 (frontend isolation) | Must | Security and performance requirement |
| RF-06 (live updates via redeployment) | Should | Nice-to-have convenience; opinions can be static if needed |

---

## 9. Esclarecimentos

### Sessão 2026-05-20

- **Q:** Como você quer formatar a seção de perspectiva técnica no system prompt?
  **R:** Lista simples em prosa — "You have strong opinions on React, considering it your go-to for interactive frontends. You find AWS powerful but expensive..." integrada naturalmente no system prompt.

- **Q:** Quantos stacks você quer que tenham opinião inicialmente?
  **R:** Todos os 49 stacks — cobertura completa desde o início, sem lacunas. Opiniões podem ser adicionadas incrementalmente conforme Gabriel refine seu pensamento, mas o objetivo é todas as 49.

- **Q:** Se um visitor perguntar sobre um stack SEM opinião registrada, como o AI deve responder?
  **R:** AI informa honestamente que não tem opinião documentada ainda: "I don't have a documented opinion on that yet, but it's a solid technology" ou similar. Mantém tom autêntico e gracioso.

---

## 10. Lacunas

> Todas as dúvidas foram resolvidas na sessão de esclarecimentos de 2026-05-20. Nenhuma lacuna pendente.

---

## 11. Histórico de alterações

| Data | Alteração | Autor |
|------|-----------|-------|
| 2026-05-20 | Versão inicial gerada por `/reversa-requirements` | reversa |
| 2026-05-20 | Sessão de esclarecimentos: 3 dúvidas resolvidas (formato prosa, todos os 49 stacks, fallback honesto); RN-02 e RN-04 atualizadas | reversa |
