# Roadmap: Terminal AI — OpenRouter Provider Migration

> Identifier: `004-terminal-openrouter-migration`
> Date: `2026-05-17`
> Requirements: `_reversa_forward/004-terminal-openrouter-migration/requirements.md`
> Confidence: 🟢 CONFIRMED, 🟡 INFERRED, 🔴 GAP

## 1. Resumo da abordagem

Substituir o SDK `@google/generative-ai` no arquivo `useGeminiStream.ts` por uma chamada `fetch` direta à API REST do OpenRouter (`https://openrouter.ai/api/v1/chat/completions`), usando o formato OpenAI Chat Completions com `stream: true`. O arquivo é renomeado para `useOpenRouterStream.ts` e a assinatura de `sendMessage` é preservada, de modo que `index.tsx` requer apenas atualização do import. A variável de ambiente muda de `NEXT_PUBLIC_GEMINI_API_KEY` para `NEXT_PUBLIC_OPENROUTER_API_KEY`, e uma nova variável `NEXT_PUBLIC_OPENROUTER_MODEL` (valor: `openrouter/free`) é adicionada. O pacote `@google/generative-ai` é removido do `package.json`. Nenhum outro componente, arquivo de dados, i18n key ou comportamento de UI é alterado.

## 2. Princípios aplicados

> `.reversa/principles.md` não existe neste projeto. Nenhum princípio formal para validar.

## 3. Decisões técnicas

| ID | Decisão | Justificativa | Alternativas descartadas | Confidência |
|----|---------|----------------|--------------------------|-------------|
| D-01 | Usar `fetch` nativo do browser em vez de SDK | OpenRouter implementa a API OpenAI Chat Completions; `fetch` nativo é suficiente e elimina a dependência de SDK. Reduz bundle em ~150KB. | Usar SDK `openai` npm (pesado, desnecessário); usar SDK específico do OpenRouter (não existe oficial). | 🟢 |
| D-02 | Renomear arquivo de `useGeminiStream.ts` para `useOpenRouterStream.ts` | Nome limpo sem referência ao provedor anterior. A assinatura de `sendMessage` é preservada, então `index.tsx` só muda o import. | Manter nome antigo (confuso); criar novo arquivo e manter o antigo (lixo no codebase). | 🟢 |
| D-03 | Modelo configurado via env var `NEXT_PUBLIC_OPENROUTER_MODEL` | O usuário escolheu `openrouter/free` como modelo. Env var permite trocar sem rebuild. Segue a convenção `NEXT_PUBLIC_*` existente. | Hardcoded no source (impossível trocar sem redeploy); arquivo de config JSON (overhead desnecessário). | 🟢 |
| D-04 | Tratamento de erro unificado (qualquer erro = mesma mensagem) | Decisão do usuário no clarify. Simplifica o código e evita vazamento de detalhes internos para o visitante. | Mensagens por tipo de erro (mais complexo, sem benefício UX identificado). | 🟢 |
| D-05 | Apenas headers `Content-Type` + `Authorization` | Decisão do usuário no clarify. Headers opcionais `HTTP-Referer`/`X-Title` do OpenRouter são para ranking, não necessários. | Enviar headers de ranking (sem benefício concreto para portfolio). | 🟢 |
| D-06 | Guarda de renderização verifica apenas `NEXT_PUBLIC_OPENROUTER_API_KEY` | A ausência da key é o gating principal. Se a model estiver ausente mas a key presente, a chamada ao OpenRouter falhará e o tratamento de erro genérico (D-04) cobre o caso. Manter uma única guarda simplifica o código. | Verificar ambas as env vars na guarda (mais seguro mas mais complexo); verificar apenas model (key ausente causaria erro menos claro). | 🟡 |

## 4. Premissas

> Nenhum marcador `[DÚVIDA]` restava no requirements após o `/reversa-clarify`. Nenhuma premissa adotada.

## 5. Delta arquitetural

| Componente | Arquivo de origem no legado | Tipo de mudança | Resumo |
|------------|------------------------------|-----------------|--------|
| `ToshiAITerminal/useGeminiStream.ts` | `_reversa_sdd/architecture.md#Component Map` → `src/components/views/dev/gabriel/HeroDark/ToshiAITerminal/` | componente-extinto + contrato-alterado | Arquivo removido e substituído por `useOpenRouterStream.ts` com implementação via `fetch` para OpenRouter em vez de SDK Gemini. |
| `ToshiAITerminal/useOpenRouterStream.ts` | — | componente-novo + contrato-novo | Novo arquivo. Chama `https://openrouter.ai/api/v1/chat/completions` via `fetch` com streaming SSE. |
| `ToshiAITerminal/index.tsx` | `_reversa_sdd/architecture.md#Component Map` | regra-alterada | Import atualizado de `useGeminiStream` para `useOpenRouterStream`. Env var de guarda muda de `NEXT_PUBLIC_GEMINI_API_KEY` para `NEXT_PUBLIC_OPENROUTER_API_KEY`. |
| `package.json` | `_reversa_sdd/dependencies.md` | contrato-removido | Removida dependência `@google/generative-ai`. |
| `.env.local.example` | — | contrato-alterada | `NEXT_PUBLIC_GEMINI_API_KEY` substituído por `NEXT_PUBLIC_OPENROUTER_API_KEY` + `NEXT_PUBLIC_OPENROUTER_MODEL`. |
| External integrations | `_reversa_sdd/architecture.md#External Integrations` | contrato-alterado | Google Gemini API → OpenRouter API (ambos HTTPS, browser-initiated). |

## 6. Delta no modelo de dados

- Resumo das mudanças: Nenhuma. Nenhum arquivo de dados (`jobs.json`, `toshi-projects.json`, `stacks.json`, `swtools.json`) é tocado. O sistema de prompt (`systemPrompt.ts`) permanece idêntico.
- Detalhe completo em: `_reversa_forward/004-terminal-openrouter-migration/data-delta.md`

## 7. Delta de contratos externos

| Contrato | Tipo | Arquivo de detalhe |
|----------|------|--------------------|
| OpenRouter Chat Completions (streaming) | HTTP | `_reversa_forward/004-terminal-openrouter-migration/interfaces/openrouter-chat-completions.md` |

## 8. Plano de migração

1. Criar `useOpenRouterStream.ts` com a nova implementação via `fetch` + SSE parsing.
2. Atualizar `index.tsx`: trocar import e env var de guarda.
3. Remover `useGeminiStream.ts`.
4. Atualizar `.env.local.example`.
5. Remover `@google/generative-ai` do `package.json` e rodar `npm install`.
6. Build local + verificação de que o terminal renderiza e responde via OpenRouter.
7. Deploy via push para `main` (GitHub Actions).

## 9. Riscos e mitigações

| Risco | Impacto | Probabilidade | Mitigação |
|-------|---------|---------------|-----------|
| OpenRouter free model indisponível ou com alta latência | Médio | Médio | O tratamento de erro genérico exibe mensagem amigável; o visitante pode tentar novamente. O modelo pode ser trocado via env var sem redeploy. |
| API key do OpenRouter não configurada no deploy | Alto | Baixa (key será fornecida antes do deploy) | A guarda `!apiKey` já existente impede renderização sem key — terminal simplesmente não aparece, sem crash. |
| Formato de resposta SSE do OpenRouter difere do esperado | Médio | Baixa (OpenRouter segue formato OpenAI) | Testar com modelo real antes do deploy. Tratamento de erro genérico cobre falhas de parsing. |
| Bundle não reduz como esperado | Baixo | Baixa | Verificar com `npm run build` que `@google/generative-ai` não aparece nos chunks. |

## 10. Critério de pronto

- [ ] Todas as ações do `actions.md` marcadas `[X]`
- [ ] `cross-check.md` (se executado) sem CRITICAL nem HIGH
- [ ] `regression-watch.md` gerado
- [ ] Re-extração reversa executada e sem regressão vermelha (recomendado, não obrigatório)

## 11. Histórico de alterações

| Data | Alteração | Autor |
|------|-----------|-------|
| 2026-05-17 | Versão inicial gerada por `/reversa-plan` | reversa |
