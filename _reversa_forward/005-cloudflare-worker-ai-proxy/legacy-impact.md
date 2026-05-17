# Legacy Impact — 005-cloudflare-worker-ai-proxy

> Data: 2026-05-17
> Identificador: `005-cloudflare-worker-ai-proxy`

## Tabela de Impacto

| Arquivo afetado | Componente (_reversa_sdd) | Tipo | Severidade | Justificativa |
|----------------|--------------------------|------|------------|---------------|
| `src/components/views/dev/gabriel/HeroDark/ToshiAITerminal/useOpenRouterStream.ts` | Hero Dark Section — ToshiAITerminal | regra-alterada | HIGH | Removida chamada direta ao OpenRouter com `Authorization` header. Frontend agora envia apenas `{ question }` ao worker; toda autenticação migrou para o servidor. |
| `src/components/views/dev/gabriel/HeroDark/ToshiAITerminal/index.tsx` | Hero Dark Section — ToshiAITerminal | regra-alterada | MEDIUM | Guard de renderização trocou de `NEXT_PUBLIC_OPENROUTER_API_KEY` para `NEXT_PUBLIC_TOSHI_AI_WORKER_URL`. Comportamento de render condicional preservado. |
| `src/components/views/dev/gabriel/HeroDark/ToshiAITerminal/systemPrompt.ts` | Hero Dark Section — ToshiAITerminal | componente-extinto | MEDIUM | Arquivo deletado. A lógica de `buildSystemPrompt()` migrou para `worker/src/systemPrompt.ts` — não é mais código morto no bundle do frontend. |
| `.env.local.example` | Deployment / Config | regra-alterada | LOW | Removidas variáveis `NEXT_PUBLIC_OPENROUTER_API_KEY` e `NEXT_PUBLIC_OPENROUTER_MODEL`; adicionada `NEXT_PUBLIC_TOSHI_AI_WORKER_URL`. |
| `.github/workflows/deploy.yml` | CI/CD Pipeline | regra-alterada | HIGH | Pipeline expandida: agora deploya o Cloudflare Worker antes do frontend. Removidas variáveis de secrets do OpenRouter do bloco `env:` do job. Adicionado step `cloudflare/wrangler-action@v3` com injeção de `OPENROUTER_API_KEY` e `OPENROUTER_MODEL` como worker secrets. |
| `worker/package.json` | (componente novo) | componente-novo | LOW | Novo sub-projeto Node/Wrangler isolado. |
| `worker/tsconfig.json` | (componente novo) | componente-novo | LOW | Configuração TypeScript para o worker. |
| `worker/wrangler.toml` | (componente novo) | componente-novo | MEDIUM | Define o worker `fullstack-profile-ai` no Cloudflare. |
| `worker/src/index.ts` | (componente novo) | componente-novo | HIGH | Handler HTTP principal: CORS, routing POST/OPTIONS, proxy SSE para OpenRouter. |
| `worker/src/systemPrompt.ts` | (componente novo) | componente-novo | HIGH | Geração do system prompt movida para o servidor; importa os mesmos JSONs de `src/data/`. |
| `worker/.gitignore` | (componente novo) | componente-novo | LOW | Protege `.dev.vars` (segredos locais) de serem commitados. |
| `worker/.dev.vars.example` | (componente novo) | componente-novo | LOW | Documentação de dev local para secrets do worker. |

## Diff Conceitual por Componente

### ToshiAITerminal (frontend)

Antes: o componente chamava `https://openrouter.ai/api/v1/chat/completions` diretamente com `Authorization: Bearer <key>` exposta em variável `NEXT_PUBLIC_*`, que fica visível no bundle JS.

Depois: o componente chama `NEXT_PUBLIC_TOSHI_AI_WORKER_URL` (o endereço do worker) com apenas `{ question }` no body. Sem header de autenticação. A chave OpenRouter nunca sai do worker.

O sistema prompt, que antes era construído no cliente, agora é construído pelo worker e nunca trafega pela rede. O frontend não tem acesso ao conteúdo do prompt.

### CI/CD Pipeline

Antes: um único job Node.js + GitHub Pages deploy. Segredos do OpenRouter eram injetados como `NEXT_PUBLIC_*` no build (ficavam no bundle).

Depois: pipeline tem dois estágios — primeiro deploya o worker via Wrangler (injetando secrets como variáveis de ambiente do worker, não do build), depois builda e deploya o frontend estático. O frontend só recebe `NEXT_PUBLIC_TOSHI_AI_WORKER_URL`.

### Cloudflare Worker (novo)

Componente totalmente novo, sem equivalente no legado. Responsável por:
- Verificar `Origin` (CORS restrito a `https://gtoshinakano.github.io`)
- Construir o system prompt a partir dos JSONs de dados
- Autenticar com OpenRouter usando `env.OPENROUTER_API_KEY`
- Fazer streaming SSE de volta ao cliente sem buffering

## Regras Preservadas

- Comportamento de streaming SSE do frontend (`useOpenRouterStream.ts`) preservado integralmente — mesma lógica de parsing de linhas `data:`, mesmo `[DONE]`, mesma extração de `model` e `totalTokens`.
- Guard de renderização condicional do `ToshiAITerminal` preservado — componente retorna `null` se a URL do worker não estiver configurada.
- Limite de 3 perguntas por sessão (`MAX_QUESTIONS = 3`) preservado no cliente, sem alteração.
- Exibição de model name e token count após resposta preservada.
- Blinking cursor, font-mono e max-width preservados (não tocados nesta feature).
- Deploy para GitHub Pages preservado sem alteração de lógica ou branches.
- Todas as variáveis `NEXT_PUBLIC_GOOGLE_ANALYTICS` e `NEXT_PUBLIC_BASE_PATH` preservadas.

## Regras Modificadas

- **`NEXT_PUBLIC_OPENROUTER_API_KEY` removida do build** — chave nunca mais aparece no bundle JS do frontend.
- **`NEXT_PUBLIC_OPENROUTER_MODEL` removida do build** — modelo é configurado via `wrangler secret put` no worker.
- **System prompt migrado para servidor** — `buildSystemPrompt()` não é mais executado no cliente.
- **CORS passa a ser responsabilidade do worker**, não do servidor de edge do GitHub Pages (que não tinha CORS configurável).
