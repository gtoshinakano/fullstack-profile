# Regression Watch — 005-cloudflare-worker-ai-proxy

> Identificador: `005-cloudflare-worker-ai-proxy`

## Watch Items

| ID | Origem | Regra esperada após mudança | Tipo de verificação | Sinal de violação |
|----|--------|----------------------------|---------------------|-------------------|
| W001 | `useOpenRouterStream.ts` | Frontend NÃO envia header `Authorization` ao worker — autenticação pertence exclusivamente ao worker | ausência | Header `Authorization` presente no request ao worker (verificável em DevTools Network) |
| W002 | `useOpenRouterStream.ts` | Body do POST ao worker contém apenas `{ question: string }` — sem `model`, sem `messages`, sem `stream` | presença | Body contendo campos além de `question` |
| W003 | `worker/src/index.ts` | Requests com `Origin` diferente de `https://gtoshinakano.github.io` retornam HTTP 403 — sem exceção para localhost em prod | presença | Worker aceitando requests de origens arbitrárias em produção |
| W004 | `worker/src/index.ts` | `OPENROUTER_API_KEY` é lida exclusivamente de `env.OPENROUTER_API_KEY` (Cloudflare secret) — nunca hardcoded ou exposta em variável `NEXT_PUBLIC_*` | ausência | String da API key aparecendo no bundle JS do frontend (`grep -r "sk-or-" ./out/`) |
| W005 | `.github/workflows/deploy.yml` | Step do worker (`cloudflare/wrangler-action@v3`) precede todos os steps do frontend no pipeline — garante que o worker está atualizado antes do frontend ser buildado | presença | Steps de build/deploy do frontend aparecendo antes do step Wrangler no YAML |
| W006 | `.github/workflows/deploy.yml` — bloco `env:` | `NEXT_PUBLIC_OPENROUTER_API_KEY` e `NEXT_PUBLIC_OPENROUTER_MODEL` estão ausentes do bloco `env:` do job | ausência | Qualquer das duas variáveis re-aparecendo no bloco `env:` do job de CI |
| W007 | `worker/src/systemPrompt.ts` e `src/data/*.json` | Os JSONs em `src/data/` continuam sendo a única fonte de verdade para jobs, projects e stacks — worker importa os mesmos arquivos que o frontend usa | presença | Worker importando JSONs de localização diferente de `../../src/data/` |

## Histórico de re-extrações

### Re-extração 2026-05-17 12:30

| ID | Veredito | Observação |
|----|----------|------------|
| W001 | 🟢 verde | `useOpenRouterStream.ts`: nenhum header `Authorization` presente — confirmado por `grep Authorization` sem resultado |
| W002 | 🟢 verde | `body: JSON.stringify({ question })` — único campo no body, linha 16 |
| W003 | 🟢 verde | `ALLOWED_ORIGIN = 'https://gtoshinakano.github.io'` e check em toda request — `worker/src/index.ts:8,23,32` |
| W004 | 🟢 verde | Nenhuma ocorrência de `NEXT_PUBLIC_OPENROUTER` em `src/` ou `pages/` — chave nunca exposta no bundle |
| W005 | 🟢 verde | Step `cloudflare/wrangler-action@v3` (linha 21) precede `Setup Node.js` (linha 41) no `deploy.yml` |
| W006 | 🟢 verde | Nenhuma ocorrência de `NEXT_PUBLIC_OPENROUTER_*` no bloco `env:` do job |
| W007 | 🟢 verde | `worker/src/systemPrompt.ts` importa de `../../src/data/` nas linhas 1–4 — fonte de verdade preservada |

## Arquivadas

> Seção inicialmente vazia.

## Observações

> Itens com confidência 🟡 ou 🔴 na origem — sem peso de regressão.

- O modelo OpenRouter (`OPENROUTER_MODEL`) é flexível por design — pode ser trocado via `wrangler secret put` sem re-deploy do frontend. Não constitui regressão mudar o modelo.
- `MAX_QUESTIONS = 3` é um limite client-side sem enforcement no servidor — intencional conforme decisão de escopo (sem rate limiting server-side). Não criar watch item para isso.
