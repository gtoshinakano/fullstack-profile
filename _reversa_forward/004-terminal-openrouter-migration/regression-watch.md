# Regression Watch: Terminal AI — OpenRouter Provider Migration

> Feature: `004-terminal-openrouter-migration`
> Date: `2026-05-17`

## Watch items

| ID | Origem | Regra esperada após mudança | Tipo de verificação | Sinal de violação |
|----|--------|----------------------------|--------------------|--------------------|
| W001 | `index.tsx` | A guarda de renderização verifica `NEXT_PUBLIC_OPENROUTER_API_KEY` (não `NEXT_PUBLIC_GEMINI_API_KEY`) | presença | `NEXT_PUBLIC_GEMINI_API_KEY` aparece no código fonte |
| W002 | `index.tsx` | O import do hook de streaming aponta para `./useOpenRouterStream` | presença | Import ainda referencia `./useGeminiStream` |
| W003 | `useOpenRouterStream.ts` | A request usa `https://openrouter.ai/api/v1/chat/completions` | presença | URL do Gemini aparece no código |
| W004 | `useOpenRouterStream.ts` | Headers contêm apenas `Content-Type` + `Authorization` | presença | Headers `HTTP-Referer` ou `X-Title` presentes |
| W005 | `useOpenRouterStream.ts` | O body inclui `stream: true` | presença | `stream: true` ausente ou `stream: false` |
| W006 | `useOpenRouterStream.ts` | O modelo é lido de `NEXT_PUBLIC_OPENROUTER_MODEL` | presença | Modelo hardcoded (ex: `gemini-2.0-flash`) |
| W007 | `package.json` | `@google/generative-ai` NÃO está em `dependencies` | ausência | `@google/generative-ai` presente em dependencies |
| W008 | `.env.local.example` | Contém `NEXT_PUBLIC_OPENROUTER_API_KEY` e `NEXT_PUBLIC_OPENROUTER_MODEL` | presença | `NEXT_PUBLIC_GEMINI_API_KEY` ainda presente |
| W009 | `systemPrompt.ts` | Arquivo inalterado — system prompt idêntico | presença | systemPrompt.ts modificado ou removido |
| W010 | `index.tsx` | Comportamento de erro: qualquer erro → mensagem genérica, contador NÃO incrementa, input reabilitado | redação | Mensagens de erro diferenciadas por tipo (401, 429, etc.) |

## Observações

> Regras originais 🟡 ou 🔴 — sem peso de regressão, apenas monitoramento.

- BR-10 (🟡) — Article content English-only: não afetada por esta mudança.
- BR-12 (🟡) — `reloadOnPrerender` ignorado: não afetada por esta mudança.

## Histórico de re-extrações

> Será preenchido quando `/reversa` for executado novamente após esta feature.

| Data | Extração | Resultado |
|------|----------|-----------|
| — | — | — |

## Arquivadas

> Itens que foram resolvidos ou se tornaram irrelevantes.

| ID | Data | Motivo |
|----|------|--------|
| — | — | — |
