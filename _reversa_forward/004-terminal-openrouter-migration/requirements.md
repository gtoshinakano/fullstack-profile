# Requirements: Terminal AI — OpenRouter Provider Migration

> Identifier: `004-terminal-openrouter-migration`
> Date: `2026-05-17`
> Extraction folder: `_reversa_sdd/`
> Confidence: 🟢 CONFIRMED, 🟡 INFERRED, 🔴 GAP / DOUBT

## 1. Executive Summary

Migrate the Toshi AI Terminal's inference backend from Google Gemini (`@google/generative-ai`) to the OpenRouter API, while preserving all existing UX behavior: macOS-style terminal UI, streaming responses, 3-question session limit, 200-character input cap, i18n support, system prompt built from portfolio data files, and graceful handling when the API key is absent. The API key will be provided at a later stage via a new environment variable. The `@google/generative-ai` dependency is removed from the project.

---

## 2. Legacy Context

| Source | Relevant excerpt | Confidence |
|--------|------------------|------------|
| `_reversa_sdd/architecture.md#System Summary` | Static export (GitHub Pages) — no server, no API routes. All runtime logic must run client-side in the browser. | 🟢 |
| `_reversa_sdd/architecture.md#Key Architectural Decisions` | ADR-001: `output: 'export'` — no SSR, no API routes. External API calls must originate from the browser. | 🟢 |
| `_reversa_sdd/architecture.md#External Integrations` | Existing external calls: GA4, Pace.js CDN, Unicons CDN, Google Fonts. New integration: OpenRouter API (browser-initiated, same pattern as current Gemini call). | 🟢 |
| `_reversa_sdd/domain.md#BR-01` | Page renders only after Pace.js reports loading complete. Terminal component is inside HeroDark and follows the same loading gate. | 🟢 |
| `_reversa_sdd/domain.md#BR-08` | Analytics disabled completely in development. GA event for terminal queries (`ai_terminal_query`) follows the same pattern. | 🟢 |
| `_reversa_sdd/i18n/design.md` | i18n pattern: `useTranslation('common')`, keys in `public/locales/{en,ja,pt-BR}/common.json`. No new i18n keys needed — all UI strings remain identical. | 🟢 |
| `_reversa_sdd/data/requirements.md` | Developer context available from: `src/data/jobs.json`, `src/data/toshi-projects.json`, `src/data/stacks.json`, `src/data/swtools.json`. System prompt assembly logic is unchanged. | 🟢 |
| `_reversa_forward/003-toshi-ai-terminal/requirements.md` | Full requirements for the existing terminal feature (RF-01 through RF-16, RN-01 through RN-07). This migration preserves all functional and non-functional requirements except the AI provider and env var name. | 🟢 |

---

## 3. Personas and Use Cases

| Persona | Goal | Key scenario |
|---------|------|--------------|
| Recruiter | Quickly understand the developer's skills and experience | Opens the terminal, types "What technologies does Gabriel know?", receives a streamed summary — now served via OpenRouter |
| Technical partner | Assess past project work | Types "Tell me about Gabriel's most challenging project", receives context from project data — provider changed, UX identical |
| Casual visitor | Learn about the person behind the portfolio | Types "Where does Gabriel live?", receives a friendly answer — no visible change |
| Author (Gabriel) | Switch AI provider to reduce cost / use free models | Deploys with a free OpenRouter model; terminal behavior is functionally identical to the Gemini version |

---

## 4. New or Changed Business Rules

1. **RN-01:** The AI inference API is called directly from the browser via the OpenRouter REST API (`https://openrouter.ai/api/v1/chat/completions`). There is no server-side proxy. 🟢
   - Origin: `_reversa_sdd/architecture.md#Key Architectural Decisions` → ADR-001 (static export)
   - Type: altered (was Gemini REST API, now OpenRouter REST API)
   - Consequence: The API key must be accessible client-side via a `NEXT_PUBLIC_*` environment variable.

2. **RN-02:** The API key is stored as `NEXT_PUBLIC_OPENROUTER_API_KEY` in the `.env.local` file and is bundled into the client. 🟡
   - Type: altered (was `NEXT_PUBLIC_GEMINI_API_KEY`)
   - Risk: Key is visible in the browser bundle. Mitigation: HTTP referrer restriction via OpenRouter's console (only the portfolio domain may use the key).
   - Note: The old `NEXT_PUBLIC_GEMINI_API_KEY` variable is no longer needed and should be removed from `.env.local` and `.env.local.example`.

3. **RN-03:** The system prompt logic (`systemPrompt.ts`) is unchanged. The AI is still instructed to answer only questions about Gabriel Toshinori Nakano, using the same data files as context. 🟢
   - Type: preserved
   - Source: `_reversa_forward/003-toshi-ai-terminal/requirements.md#RN-03`

4. **RN-04:** The streaming response uses the OpenRouter SSE (Server-Sent Events) streaming endpoint. The `stream: true` flag must be set in the request body. 🟢
   - Type: altered (was Gemini `generateContentStream`, now OpenRouter `stream: true`)
   - Each streamed chunk is delivered as a `delta.content` field in the SSE data, following the OpenAI-compatible format that OpenRouter implements.

5. **RN-05:** A free model is used on OpenRouter. The model identifier is stored in the environment variable `NEXT_PUBLIC_OPENROUTER_MODEL` (e.g., `openrouter/free`). 🟢
   - Type: new
   - Rationale: The user explicitly stated "I will use a free model" and chose to configure it as an environment variable (`openrouter/free`).
   - The env var name follows the existing `NEXT_PUBLIC_*` convention for client-side access.
   - When `NEXT_PUBLIC_OPENROUTER_MODEL` is absent or empty, the terminal component is not rendered in the DOM (same behavior as absent API key — see RF-07).

6. **RN-06:** All other business rules from the original terminal feature (session limit, character limit, graceful absent-key handling, error handling, welcome message, disable during streaming) remain unchanged. 🟢
   - Type: preserved
   - Source: `_reversa_forward/003-toshi-ai-terminal/requirements.md#RN-01` through `#RN-07`

---

## 5. Functional Requirements

| ID | Requirement | Priority | Acceptance Criterion | Confidence |
|----|-------------|----------|----------------------|------------|
| RF-01 | Replace the `@google/generative-ai` SDK import in `useGeminiStream.ts` with a direct `fetch` call to the OpenRouter API endpoint | Must | No import of `@google/generative-ai` remains in the codebase; network request goes to `https://openrouter.ai/v1/chat/completions` | 🟢 |
| RF-02 | The OpenRouter request body follows the OpenAI Chat Completions format: `{ model: process.env.NEXT_PUBLIC_OPENROUTER_MODEL, messages: [...], stream: true }` | Must | Request body inspected in browser DevTools matches the OpenAI Chat Completions schema with `stream: true`; model value matches the env var | 🟢 |
| RF-03 | The system prompt from `systemPrompt.ts` is sent as the first `system` role message in the `messages` array | Must | AI responses reflect the developer's portfolio data (jobs, projects, skills) and decline off-topic questions | 🟢 |
| RF-04 | The user's question is sent as a `user` role message in the `messages` array | Must | AI responds to the specific question asked | 🟢 |
| RF-05 | Streaming chunks from OpenRouter's SSE response are parsed and delivered to the UI callback (`onChunk`) incrementally | Must | Response text appears incrementally in the terminal as tokens arrive, not as a single block | 🟢 |
| RF-06 | The `NEXT_PUBLIC_OPENROUTER_API_KEY` env var is used for the `Authorization: Bearer <key>` header. Only `Content-Type: application/json` and `Authorization` headers are sent — no optional OpenRouter ranking headers (`HTTP-Referer`, `X-Title`) | Must | Request headers contain only Content-Type and Authorization; no `NEXT_PUBLIC_GEMINI_API_KEY` references remain | 🟢 |
| RF-07 | When `NEXT_PUBLIC_OPENROUTER_API_KEY` is absent or empty, the terminal component is not rendered in the DOM (same behavior as before) | Must | Terminal element is absent from the page when the env var is not set; no crash | 🟢 |
| RF-08 | The `@google/generative-ai` package is removed from `package.json` dependencies | Must | `npm ls @google/generative-ai` returns empty; bundle no longer includes the Gemini SDK | 🟢 |
| RF-09 | The `.env.local.example` file is updated: `NEXT_PUBLIC_GEMINI_API_KEY` is replaced with `NEXT_PUBLIC_OPENROUTER_API_KEY` and a new `NEXT_PUBLIC_OPENROUTER_MODEL` entry is added | Must | Example env file contains both new variables; no reference to `NEXT_PUBLIC_GEMINI_API_KEY` remains | 🟢 |
| RF-10 | All existing terminal UX behavior is preserved: macOS-style UI, 3-question limit, 200-char limit, blinking cursor during streaming, i18n strings, GA event, error handling with retry, welcome message | Must | No visual or behavioral regression in the terminal component compared to the Gemini version | 🟢 |
| RF-11 | The file `useGeminiStream.ts` is renamed to `useOpenRouterStream.ts`; the `sendMessage` function signature `(question: string, onChunk: (text: string) => void) => Promise<void>` is preserved, so `index.tsx` requires only an import path update | Must | `index.tsx` imports from the new filename; `sendMessage` is called identically; no behavioral change | 🟢 |

---

## 6. Non-Functional Requirements

| Type | Requirement | Evidence or rationale | Confidence |
|------|-------------|----------------------|------------|
| Performance | First streaming token must appear within 3 seconds of submission (excluding network latency) | Same UX expectation as Gemini version; OpenRouter free models may have higher latency but UX target is unchanged | 🟡 |
| Security | API key must have HTTP referrer restriction configured in OpenRouter's console to the portfolio domain | RN-02 — client-side key exposure mitigation | 🟢 |
| Bundle size | Removing `@google/generative-ai` (~150KB minified) and replacing with a native `fetch` call must reduce the client bundle size | The Gemini SDK is no longer needed; `fetch` is built into the browser | 🟢 |
| Accessibility | All existing ARIA attributes (`role="log"`, `aria-live="polite"`, `aria-label`) are preserved | No changes to the UI component | 🟢 |
| UX / Non-interference | Component must not trigger or interfere with existing GSAP ScrollTrigger instances (photo carousel, menu sticky) | Same as original feature — terminal is independent of GSAP | 🟢 |
| Observability | GA4 event `ai_terminal_query` continues to fire on each question submission | No change to analytics behavior | 🟢 |

---

## 7. Acceptance Criteria

```gherkin
Scenario: Visitor submits a valid question via OpenRouter
  Given the terminal is loaded with a valid NEXT_PUBLIC_OPENROUTER_API_KEY
  And the visitor has 3 questions remaining
  When the visitor types a question about Gabriel (≤ 200 characters) and submits
  Then the question appears in the terminal output
  And the AI response streams into the terminal character-by-character from OpenRouter
  And the questions-remaining counter decrements by 1

Scenario: OpenRouter request uses correct format
  Given the terminal is active with a valid API key
  When a question is submitted
  Then the network request in browser DevTools shows:
    - URL: https://openrouter.ai/api/v1/chat/completions
    - Method: POST
    - Headers: Content-Type: application/json, Authorization: Bearer <NEXT_PUBLIC_OPENROUTER_API_KEY> (no other headers)
    - Body contains: model (from NEXT_PUBLIC_OPENROUTER_MODEL), messages (with system + user roles), stream: true

Scenario: No Gemini SDK in bundle
  Given the application is built for production
  When the bundle is analyzed
  Then @google/generative-ai is not present in any chunk
  And the terminal functionality still works

Scenario: API key is absent
  Given the environment variable NEXT_PUBLIC_OPENROUTER_API_KEY is empty or undefined
  When the page loads
  Then the terminal component is not rendered in the DOM
  And no error is thrown in the browser console

Scenario: API call fails (OpenRouter error)
  Given the terminal is active and the visitor submits a question
  When the OpenRouter API returns an error response (any HTTP error, network failure, or rate limit)
  Then a generic error message appears in the terminal output area (same message as existing Gemini error)
  And the question counter is NOT incremented
  And the input field is re-enabled so the visitor may retry
  And no distinction is shown between error types (401, 429, 500, network — all treated uniformly)

Scenario: All existing terminal behavior is preserved
  Given the migrated terminal with OpenRouter
  When a visitor interacts with the terminal
  Then the following behaviors are identical to the Gemini version:
    - 3-question session limit
    - 200-character input limit with live counter
    - Blinking cursor during streaming
    - Welcome message on mount
    - i18n strings for all UI labels
    - GA event on submission
    - Disable input during streaming
    - macOS-style terminal design

Scenario: .env.local.example is updated
  Given the migration is complete
  When reading .env.local.example
  Then it contains NEXT_PUBLIC_OPENROUTER_API_KEY and NEXT_PUBLIC_OPENROUTER_MODEL
  And no reference to NEXT_PUBLIC_GEMINI_API_KEY remains
```

---

## 8. MoSCoW Priority

| Item | MoSCoW | Justification |
|------|--------|---------------|
| RF-01 (replace SDK with fetch to OpenRouter) | Must | Core of the migration |
| RF-02 (correct request format) | Must | OpenRouter requires specific schema |
| RF-03 (system prompt preserved) | Must | AI behavior depends on it |
| RF-06 (new env var name) | Must | Key will come via new variable |
| RF-07 (graceful absent key) | Must | Key not provided yet; must not crash |
| RF-08 (remove Gemini package) | Must | Reduces bundle; old SDK must not remain |
| RF-09 (update env example) | Must | Prevents confusion for future setup |
| RF-10 (all UX preserved) | Must | This is a provider migration, not a feature change |
| RF-05 (streaming chunks) | Must | Streaming is core UX |
| RF-04 (user message format) | Must | Required for API to work |
| RF-11 (rename hook file) | Should | Clean naming; not blocking if import is adapted |
| RNF Bundle size reduction | Should | Automatic benefit of removing Gemini SDK |
| RNF Performance (3s token target) | Should | Same target; free models may vary |

---

## 9. Clarifications

### Session 2026-05-17

- **Q:** Qual modelo gratuito do OpenRouter será usado?
  **R:** `openrouter/free` — configurado como variável de ambiente `NEXT_PUBLIC_OPENROUTER_MODEL`.

- **Q:** O arquivo `useGeminiStream.ts` deve ser renomeado?
  **R:** Sim, renomear para `useOpenRouterStream.ts` (nome limpo, sem referência a Gemini). A assinatura de `sendMessage` permanece idêntica.

- **Q:** Quando a API key for inválida (erro 401), qual deve ser o comportamento?
  **R:** Mesmo tratamento de erro genérico — mostra mensagem de erro no terminal, não conta como pergunta, permite retry. Sem distinção entre tipos de erro.

- **Q:** O endpoint OpenRouter deve incluir headers opcionais de identificação (`HTTP-Referer`, `X-Title`)?
  **R:** Não. Enviar apenas o mínimo necessário: `Content-Type: application/json` e `Authorization: Bearer <key>`.

- **Q:** O tratamento de erros deve distinguir entre tipos de falha (rate limit, 401, rede)?
  **R:** Não. Tratamento unificado — qualquer erro (401, 429, 500, rede) mostra a mesma mensagem genérica, não conta pergunta, permite retry.

---

## 10. Gaps

> All doubts from the clarification session of 2026-05-17 have been resolved. No open gaps remain.

---

## 11. Change History

| Date | Change | Author |
|------|--------|--------|
| 2026-05-17 | Initial version generated by `/reversa-requirements` | reversa |
