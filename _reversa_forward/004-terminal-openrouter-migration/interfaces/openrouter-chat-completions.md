# Interface: OpenRouter Chat Completions (Streaming)

> Feature: `004-terminal-openrouter-migration`
> Date: `2026-05-17`
> Contrato: HTTP REST, OpenAI-compatible

## Visão geral

| Propriedade | Valor |
|-------------|-------|
| Provedor | OpenRouter (https://openrouter.ai) |
| Protocolo | HTTPS |
| Formato | JSON request, SSE streaming response |
| Autenticação | Bearer token (API key) |
| Idempotência | Não (cada request é uma chamada de inference única) |
| Timeout | ~30s (default do browser `fetch`) |

## Request

### URL
```
POST https://openrouter.ai/api/v1/chat/completions
```

### Headers

| Header | Valor | Obrigatório |
|--------|-------|-------------|
| `Content-Type` | `application/json` | Sim |
| `Authorization` | `Bearer <NEXT_PUBLIC_OPENROUTER_API_KEY>` | Sim |

> Nota: Headers opcionais `HTTP-Referer` e `X-Title` NÃO são enviados (decisão D-05).

### Body

```json
{
  "model": "openrouter/free",
  "messages": [
    {
      "role": "system",
      "content": "<system prompt construído por systemPrompt.ts>"
    },
    {
      "role": "user",
      "content": "<pergunta do usuário, max 200 chars>"
    }
  ],
  "stream": true
}
```

### Campos do body

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `model` | string | Valor de `NEXT_PUBLIC_OPENROUTER_MODEL` (ex: `openrouter/free`) |
| `messages` | array | Sempre 2 itens: system (contexto do dev) + user (pergunta) |
| `messages[0].role` | string | `"system"` |
| `messages[0].content` | string | System prompt completo (~500-800 chars) |
| `messages[1].role` | string | `"user"` |
| `messages[1].content` | string | Pergunta do visitante (1-200 chars) |
| `stream` | boolean | Sempre `true` |

## Response (Streaming SSE)

### Status codes

| Code | Significado | Tratamento |
|------|-------------|------------|
| 200 | Sucesso | Processar SSE stream |
| 401 | API key inválida | Tratamento de erro unificado (mesma mensagem genérica) |
| 429 | Rate limit | Tratamento de erro unificado |
| 500+ | Server error | Tratamento de erro unificado |
| Network error | Sem conexão | Tratamento de erro unificado |

### Formato SSE (status 200)

Cada chunk chega como uma linha SSE:

```
data: {"id":"...","object":"chat.completion.chunk","created":...,"model":"...","choices":[{"index":0,"delta":{"content":"Olá"},"finish_reason":null}]}

data: {"id":"...","object":"chat.completion.chunk","created":...,"model":"...","choices":[{"index":0,"delta":{"content":"!"},"finish_reason":null}]}

...

data: [DONE]
```

### Extração de conteúdo

Para cada linha `data: ...` (exceto `data: [DONE]`):
1. Fazer `JSON.parse(line.slice(6))` (remover prefixo `data: `)
2. Acessar `data.choices[0].delta.content`
3. Se `content` existir e não for vazio, chamar `onChunk(content)`

### Exemplo de parsing

```typescript
if (line.startsWith('data: ') && line !== 'data: [DONE]') {
  const data = JSON.parse(line.slice(6))
  const content = data.choices[0]?.delta?.content
  if (content) onChunk(content)
}
```

## Erros

### Response body (quando status != 200)

```json
{
  "error": {
    "message": "<descrição do erro>",
    "type": "<tipo do erro>",
    "code": "<código>"
  }
}
```

> Nota: O tratamento de erro é **unificado** — independente do status code ou tipo de erro, o terminal exibe a mesma mensagem genérica definida em `toshi-ai.error` nas traduções i18n. Nenhum detalhe técnico do erro é exposto ao visitante.

## Timeout

O `fetch` do browser usa timeout padrão. Não há `AbortController` configurado. Se a conexão falhar, o `catch` do `handleSubmit` no `index.tsx` trata o erro.

## Exemplo completo de request

```typescript
const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENROUTER_API_KEY}`,
  },
  body: JSON.stringify({
    model: process.env.NEXT_PUBLIC_OPENROUTER_MODEL,
    messages: [
      { role: 'system', content: buildSystemPrompt() },
      { role: 'user', content: question },
    ],
    stream: true,
  }),
})
```
