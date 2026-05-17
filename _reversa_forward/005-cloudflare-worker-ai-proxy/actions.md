# Actions: Cloudflare Worker — Toshi AI Proxy

> Identificador: `005-cloudflare-worker-ai-proxy`
> Data: `2026-05-17`
> Roadmap: `_reversa_forward/005-cloudflare-worker-ai-proxy/roadmap.md`

## Resumo

| Métrica | Valor |
|---------|-------|
| Total de ações | 12 |
| Paralelizáveis (`[//]`) | 8 |
| Maior cadeia de dependência | 3 (T001 → T005 → T006) |

---

## Fase 1 — Preparação

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|--------------|-------------|--------------|-------------|--------|
| [//] T001 | Criar `worker/package.json` com `name: "fullstack-profile-ai-worker"`, `private: true`, `main: "src/index.ts"`, `scripts: { dev: "wrangler dev", deploy: "wrangler deploy" }`, e `wrangler` como `devDependency` (versão `^3`) | - | `[//]` | `worker/package.json` | 🟢 | `[X]` |
| [//] T002 | Criar `worker/tsconfig.json` com `target: "esnext"`, `module: "esnext"`, `moduleResolution: "bundler"`, `resolveJsonModule: true`, `strict: true`, `lib: ["esnext"]`; excluir `node_modules` | - | `[//]` | `worker/tsconfig.json` | 🟢 | `[X]` |
| [//] T003 | Criar `worker/wrangler.toml` com `name = "fullstack-profile-ai"`, `main = "src/index.ts"`, `compatibility_date = "2024-01-01"`; sem `[vars]` (segredos só via `wrangler secret put`) | - | `[//]` | `worker/wrangler.toml` | 🟢 | `[X]` |
| [//] T004 | Atualizar `.env.local.example`: remover `NEXT_PUBLIC_OPENROUTER_API_KEY` e `NEXT_PUBLIC_OPENROUTER_MODEL`; adicionar `NEXT_PUBLIC_TOSHI_AI_WORKER_URL=http://localhost:8787` com comentário explicativo | - | `[//]` | `.env.local.example` | 🟢 | `[X]` |

---

## Fase 2 — Testes

> Omitida. O projeto tem cobertura de testes zero (`_reversa_sdd/architecture.md#Technical Debt Summary`). Verificação manual via `wrangler dev` substitui testes automatizados conforme decisão de escopo.

---

## Fase 3 — Núcleo

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|--------------|-------------|--------------|-------------|--------|
| T005 | Criar `worker/src/systemPrompt.ts`: importar `jobs.json`, `toshi-projects.json` e `stacks.json` de `../../src/data/` via static import com `assert { type: 'json' }`; exportar função `buildSystemPrompt(): string` que monta o mesmo prompt que o frontend monta hoje em `ToshiAITerminal/systemPrompt.ts` — incluindo regra de resposta somente sobre Gabriel, idioma adaptativo, seção de trabalhos, projetos e skills | T001, T002, T003 | - | `worker/src/systemPrompt.ts` | 🟢 | `[X]` |
| T006 | Criar `worker/src/index.ts`: definir interface `Env { OPENROUTER_API_KEY: string; OPENROUTER_MODEL: string }`; implementar `fetch` handler com (a) CORS check por `Origin` — retornar `403` se diferente de `https://gtoshinakano.github.io`; (b) `OPTIONS` preflight → `204` com headers `Access-Control-Allow-*`; (c) `POST` — parse `{ question }` do body, chamar `buildSystemPrompt()`, fazer `fetch` ao OpenRouter com `Authorization: Bearer env.OPENROUTER_API_KEY` e `stream: true`, retornar `upstream.body` diretamente com `Content-Type: text/event-stream`; tratar erros upstream (502) e timeout (504) com JSON de erro e headers CORS | T005 | - | `worker/src/index.ts` | 🟢 | `[X]` |
| [//] T007 | Atualizar `useOpenRouterStream.ts`: remover import de `buildSystemPrompt`; substituir a URL do fetch por `process.env.NEXT_PUBLIC_TOSHI_AI_WORKER_URL`; simplificar o body para `{ question }` (remover `model` e `messages`); remover o header `Authorization`; manter toda a lógica de parsing SSE (`data.choices[0]?.delta?.content`, `data.model`, `[DONE]`) e o tipo de retorno `Promise<string>` intactos | - | `[//]` | `src/components/views/dev/gabriel/HeroDark/ToshiAITerminal/useOpenRouterStream.ts` | 🟢 | `[X]` |
| [//] T008 | Atualizar `ToshiAITerminal/index.tsx`: renomear a variável de guard de `apiKey` (lida de `NEXT_PUBLIC_OPENROUTER_API_KEY`) para `workerUrl` (lida de `NEXT_PUBLIC_TOSHI_AI_WORKER_URL`); atualizar o guard `if (!apiKey) return null` para `if (!workerUrl) return null`; nenhuma outra alteração no componente | - | `[//]` | `src/components/views/dev/gabriel/HeroDark/ToshiAITerminal/index.tsx` | 🟢 | `[X]` |

---

## Fase 4 — Integração

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|--------------|-------------|--------------|-------------|--------|
| T009 | Atualizar `.github/workflows/deploy.yml`: (a) adicionar step de deploy do worker ANTES dos steps do frontend, usando `cloudflare/wrangler-action@v3` com `apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}`, `accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}`, `workingDirectory: worker`; (b) remover `NEXT_PUBLIC_OPENROUTER_API_KEY` e `NEXT_PUBLIC_OPENROUTER_MODEL` do bloco `env:` do job; (c) adicionar `NEXT_PUBLIC_TOSHI_AI_WORKER_URL: ${{ secrets.NEXT_PUBLIC_TOSHI_AI_WORKER_URL }}` no bloco `env:` | T001, T003 | - | `.github/workflows/deploy.yml` | 🟢 | `[X]` |
| [//] T010 | Criar `worker/.gitignore` com entradas: `.dev.vars`, `node_modules/`, `dist/`, `.wrangler/` | - | `[//]` | `worker/.gitignore` | 🟢 | `[X]` |

---

## Fase 5 — Polimento

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|--------------|-------------|--------------|-------------|--------|
| T011 | Deletar `ToshiAITerminal/systemPrompt.ts` do frontend: após T007 remover o import, o arquivo fica sem consumidor. Remover o arquivo para eliminar código morto | T007 | - | `src/components/views/dev/gabriel/HeroDark/ToshiAITerminal/systemPrompt.ts` | 🟢 | `[X]` |
| [//] T012 | Criar `worker/.dev.vars.example` documentando os segredos necessários para dev local: `OPENROUTER_API_KEY=sk-or-your-key-here` e `OPENROUTER_MODEL=google/gemini-2.0-flash-exp:free`, com comentário explicando que o arquivo real `.dev.vars` deve ser criado a partir deste exemplo e nunca commitado | T003 | `[//]` | `worker/.dev.vars.example` | 🟢 | `[X]` |

---

## Notas de execução

> Reservado para `/reversa-coding` registrar observações durante a execução.

**Pré-condição para primeiro deploy real:**
Antes de `wrangler deploy` rodar em CI, os seguintes GitHub Secrets precisam existir no repositório:
- `CLOUDFLARE_API_TOKEN` — token com permissão "Edit Cloudflare Workers"
- `CLOUDFLARE_ACCOUNT_ID` — ID da conta Cloudflare
- `OPENROUTER_API_KEY` — chave do OpenRouter (configurada via `wrangler secret put` no worker)
- `OPENROUTER_MODEL` — ex: `google/gemini-2.0-flash-exp:free`
- `NEXT_PUBLIC_TOSHI_AI_WORKER_URL` — URL do worker após primeiro deploy manual

**Ordem de setup na primeira vez:**
1. Executar T001–T006 (scaffold + worker code)
2. Executar `wrangler deploy` manualmente para obter a URL do worker
3. Adicionar todos os secrets ao GitHub
4. Executar T009 (atualizar CI)
5. Executar T007, T008 (frontend)
6. Push → pipeline completa automaticamente

---

## Histórico de alterações

| Data | Alteração | Autor |
|------|-----------|-------|
| 2026-05-17 | Versão inicial gerada por `/reversa-to-do` | reversa |
