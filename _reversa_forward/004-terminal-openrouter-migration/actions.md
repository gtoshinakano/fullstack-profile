# Actions: Terminal AI — OpenRouter Provider Migration

> Identifier: `004-terminal-openrouter-migration`
> Date: `2026-05-17`
> Roadmap: `_reversa_forward/004-terminal-openrouter-migration/roadmap.md`

## Resumo

| Métrica | Valor |
|---------|-------|
| Total de ações | 7 |
| Paralelizáveis (`[//]`) | 2 |
| Maior cadeia de dependência | 5 (T001 → T003 → T004 → T005 → T006) |

## Fase 1, Preparação

<!-- Setup, scaffolding, configuração de ambiente. -->

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|--------------|-------------|--------------|-------------|--------|
| T001 | Atualizar `.env.local.example`: substituir `NEXT_PUBLIC_GEMINI_API_KEY` por `NEXT_PUBLIC_OPENROUTER_API_KEY` e adicionar `NEXT_PUBLIC_OPENROUTER_MODEL` com valor de exemplo `openrouter/free` | - | `[//]` | `.env.local.example` | 🟢 | `[X]` |
| T002 | Remover `@google/generative-ai` de `dependencies` no `package.json` e rodar `npm install` para atualizar `package-lock.json` | - | `[//]` | `package.json` | 🟢 | `[X]` |

## Fase 2, Testes

<!-- Sem testes automatizados — o projeto não possui framework de testes (zero test files, conforme `_reversa_sdd/inventory.md`). Validação será manual via `onboarding.md`. -->

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|--------------|-------------|--------------|-------------|--------|
| — | — | — | — | — | — | — |

## Fase 3, Núcleo

<!-- Lógica central da migração: novo hook de streaming OpenRouter. -->

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|--------------|-------------|--------------|-------------|--------|
| T003 | Criar `useOpenRouterStream.ts` com a função `sendMessage(question, onChunk)` usando `fetch` para `https://openrouter.ai/api/v1/chat/completions` com streaming SSE, headers mínimos (`Content-Type` + `Authorization`), body no formato OpenAI Chat Completions com `stream: true`, e parsing de SSE chunks extraindo `delta.content` | T002 | - | `src/components/views/dev/gabriel/HeroDark/ToshiAITerminal/useOpenRouterStream.ts` | 🟢 | `[X]` |
| T004 | Atualizar `index.tsx`: trocar import de `./useGeminiStream` para `./useOpenRouterStream`, trocar env var de guarda de `NEXT_PUBLIC_GEMINI_API_KEY` para `NEXT_PUBLIC_OPENROUTER_API_KEY` | T003 | - | `src/components/views/dev/gabriel/HeroDark/ToshiAITerminal/index.tsx` | 🟢 | `[X]` |
| T005 | Remover o arquivo `useGeminiStream.ts` (não é mais referenciado após T004) | T004 | - | `src/components/views/dev/gabriel/HeroDark/ToshiAITerminal/useGeminiStream.ts` | 🟢 | `[X]` |

## Fase 4, Integração

<!-- Verificação de build e funcionamento end-to-end. -->

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|--------------|-------------|--------------|-------------|--------|
| T006 | Rodar `npm run build` e verificar que o build completa sem erros, que `@google/generative-ai` não aparece nos chunks, e que o terminal renderiza no HTML estático | T005 | - | `out/` (build output) | 🟢 | `[X]` |

## Fase 5, Polimento

<!-- Validação manual e documentação de regressão. -->

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|--------------|-------------|--------------|-------------|--------|
| T007 | Executar o passo a passo do `onboarding.md` localmente: servir o build, enviar pergunta via terminal, verificar streaming, verificar limite de 3 perguntas, verificar limite de 200 chars, verificar ausência de key, verificar i18n | T006 | - | — (validação manual) | 🟢 | `[X]` |

## Notas de execução

<!--
Reservado para /reversa-coding registrar avisos ou observações que surgiram durante a execução.
Não use isso para corrigir ações, edits manuais ficam fora desse arquivo, vão direto no código.
-->

## Histórico de alterações

| Data | Alteração | Autor |
|------|-----------|-------|
| 2026-05-17 | Versão inicial gerada por `/reversa-to-do` | reversa |
