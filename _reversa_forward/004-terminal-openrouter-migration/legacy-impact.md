# Legacy Impact: Terminal AI — OpenRouter Provider Migration

> Feature: `004-terminal-openrouter-migration`
> Date: `2026-05-17`

## Arquivos afetados

| Arquivo afetado | Componente | Tipo de impacto | Severidade | Justificativa |
|-----------------|------------|-----------------|------------|---------------|
| `useOpenRouterStream.ts` (novo) | `ToshiAITerminal` hook | componente-novo | LOW | Novo arquivo com a implementação OpenRouter via `fetch` + SSE. Substitui `useGeminiStream.ts`. |
| `useGeminiStream.ts` (removido) | `ToshiAITerminal` hook | componente-extinto | LOW | Arquivo removido. SDK `@google/generative-ai` não é mais usado. |
| `index.tsx` | `ToshiAITerminal` container | regra-alterada | LOW | Import atualizado (`useGeminiStream` → `useOpenRouterStream`). Env var de guarda atualizada (`NEXT_PUBLIC_GEMINI_API_KEY` → `NEXT_PUBLIC_OPENROUTER_API_KEY`). Nenhuma mudança de UI ou comportamento. |
| `package.json` | Dependências do projeto | delta-de-contrato-externo | LOW | Removida dependência `@google/generative-ai`. Nenhuma dependência adicionada (usa `fetch` nativo). |
| `.env.local.example` | Configuração de ambiente | delta-de-contrato-externo | LOW | `NEXT_PUBLIC_GEMINI_API_KEY` substituído por `NEXT_PUBLIC_OPENROUTER_API_KEY` + `NEXT_PUBLIC_OPENROUTER_MODEL`. |

## Diff conceitual por componente

### ToshiAITerminal (hook de streaming)

**Antes:** O hook `useGeminiStream.ts` importava `@google/generative-ai`, instanciava `GoogleGenerativeAI` com a API key, configurava o modelo `gemini-2.0-flash` com `systemInstruction`, e usava `generateContentStream()` para streaming.

**Depois:** O hook `useOpenRouterStream.ts` usa `fetch` nativo para chamar `https://openrouter.ai/api/v1/chat/completions` com body no formato OpenAI Chat Completions (`stream: true`). O sistema de prompt é enviado como mensagem `role: "system"`. O streaming SSE é parseado manualmente, extraindo `delta.content` de cada chunk.

**Invariantes preservados:**
- Assinatura `sendMessage(question, onChunk)` idêntica
- System prompt construído por `systemPrompt.ts` (inalterado)
- Tratamento de erro genérico (qualquer erro → mensagem i18n `toshi-ai.error`, contador não incrementa)
- Guarda de renderização: sem API key → componente não renderiza

### Dependências externas

**Antes:** `@google/generative-ai` (^0.24.1) — SDK oficial do Google para Gemini API.

**Depois:** Nenhum SDK externo. Usa `fetch` nativo do browser para OpenRouter API.

## Regras de negócio preservadas (🟢)

| Regra | Localização | Nota |
|-------|-------------|------|
| BR-01 — Page renders only after Pace.js | `gabriel.tsx` | Não afetada |
| BR-02 — Responsive breakpoint (aspect ratio) | `gabriel.tsx` | Não afetada |
| BR-03 — Tab changes locked during animations | `HeroDark/index.tsx` | Não afetada |
| BR-04 — Projects newest-first | `Projects.tsx`, `Jobs.tsx` | Não afetada |
| BR-05 — Education hardcoded in JSX | `Jobs.tsx` | Não afetada |
| BR-06 — Education visible by default | `Jobs.tsx` | Não afetada |
| BR-07 — Duplicate label bug | `toshi-projects.json` | Não afetada (bug preservado) |
| BR-08 — Analytics disabled in development | `Analytics/index.tsx` | Não afetada |
| BR-09 — Language switcher requires prefix | `ChangeLanguage/index.tsx` | Não afetada |
| BR-11 — Social links decorative | `Introduction.tsx` | Não afetada |
| BR-12 — reloadOnPrerender ignored | `next-i18next.config.js` | Não afetada |
| BR-13 — GitHub Pages auto-deploy | `.github/workflows/deploy.yml` | Não afetada |
| RN-03 — System prompt restringe ao dev | `systemPrompt.ts` | Preservado (arquivo inalterado) |
| RN-05 — 3-question session limit | `index.tsx` | Preservado (lógica inalterada) |
| RN-06 — 200-char limit | `index.tsx` | Preservado (lógica inalterada) |
| RN-07 — Graceful absent key | `index.tsx` | Preservado (env var name alterado, comportamento idêntico) |

## Regras de negócio modificadas

| Regra | Tipo | Antes | Depois |
|-------|------|-------|--------|
| RN-01 (provedor de IA) | regra-alterada | Google Gemini API via SDK | OpenRouter API via `fetch` |
| RN-02 (env var da key) | regra-alterada | `NEXT_PUBLIC_GEMINI_API_KEY` | `NEXT_PUBLIC_OPENROUTER_API_KEY` |
| RN-04 (streaming) | regra-alterada | `generateContentStream()` do SDK Gemini | SSE via `fetch` + parsing manual |
