# Investigation: OpenRouter Provider Migration

> Feature: `004-terminal-openrouter-migration`
> Date: `2026-05-17`

## 1. Pesquisa de fundo

### OpenRouter API

OpenRouter (https://openrouter.ai) é um gateway de API unificado que fornece acesso a múltiplos modelos de IA através de uma interface compatível com a OpenAI Chat Completions API.

**Endpoint:** `POST https://openrouter.ai/api/v1/chat/completions`

**Headers obrigatórios:**
- `Content-Type: application/json`
- `Authorization: Bearer <OPENROUTER_API_KEY>`

**Headers opcionais (para ranking no OpenRouter):**
- `HTTP-Referer`: URL do site
- `X-Title`: Nome do site

**Request body (OpenAI-compatible):**
```json
{
  "model": "openrouter/free",
  "messages": [
    { "role": "system", "content": "<system prompt>" },
    { "role": "user", "content": "<question>" }
  ],
  "stream": true
}
```

**Streaming response (SSE):**
Cada chunk segue o formato SSE do OpenAI:
```
data: {"id":"...","choices":[{"delta":{"content":"..."}}]}
data: [DONE]
```

### Modelo `openrouter/free`

O modelo `openrouter/free` é um modelo gratuito gerenciado pelo OpenRouter que roteia para modelos disponíveis sem custo. A disponibilidade pode variar. Documentação: https://openrouter.ai/docs#models

### Comparação: Gemini SDK vs OpenRouter fetch

| Aspecto | Gemini SDK (`@google/generative-ai`) | OpenRouter (`fetch`) |
|---------|---------------------------------------|----------------------|
| Bundle size | ~150KB minified | 0 (fetch nativo) |
| Streaming | `generateContentStream()` | SSE via `fetch` + `ReadableStream` |
| Formato request | Gemini-specific JSON | OpenAI Chat Completions |
| System prompt | `systemInstruction` param | `messages[0].role: "system"` |
| Auth | API key via SDK constructor | `Authorization: Bearer` header |

## 2. Alternativas avaliadas

### Alternativa A: Usar SDK `openai` npm
- **Pronto:** Compatível com OpenRouter (OpenRouter implementa a API OpenAI).
- **Contra:** Adiciona ~150KB ao bundle (mesmo tamanho do SDK Gemini que estamos removendo). Desnecessário para uma única chamada `fetch`.
- **Veredito:** Descartada.

### Alternativa B: Usar `axios` ou outro HTTP client
- **Pronto:** API mais ergonômica que `fetch`.
- **Contra:** Adiciona dependência. `fetch` é nativo do browser e suficiente para este caso.
- **Veredito:** Descartada.

### Alternativa C: Manter SDK Gemini e adicionar OpenRouter em paralelo
- **Pronto:** Fallback se OpenRouter falhar.
- **Contra:** Aumenta bundle. Complexidade desnecessária para portfolio.
- **Veredito:** Descartada.

### Alternativa D (escolhida): `fetch` nativo + SSE parsing manual
- **Pronto:** Zero dependência extra. Bundle menor. Controle total sobre request/response.
- **Contra:** Requer parsing manual do SSE (linhas `data: ...`).
- **Veredito:** Escolhida. O parsing SSE é trivial (~10 linhas de código).

## 3. Padrões aplicáveis

### SSE Streaming com fetch

O padrão para consumir SSE via `fetch` no browser:

```typescript
const response = await fetch(url, { method: 'POST', headers, body })
const reader = response.body!.getReader()
const decoder = new TextDecoder()
let buffer = ''

while (true) {
  const { done, value } = await reader.read()
  if (done) break
  buffer += decoder.decode(value, { stream: true })
  const lines = buffer.split('\n')
  buffer = lines.pop() || ''
  for (const line of lines) {
    if (line.startsWith('data: ') && line !== 'data: [DONE]') {
      const data = JSON.parse(line.slice(6))
      const content = data.choices[0]?.delta?.content
      if (content) onChunk(content)
    }
  }
}
```

### Compatibilidade com o código existente

A função `sendMessage` no arquivo atual tem a assinatura:
```typescript
export async function sendMessage(
  question: string,
  onChunk: (text: string) => void
): Promise<void>
```

Essa assinatura é preservada no novo arquivo, garantindo que `index.tsx` precise apenas atualizar o import path.

## 4. Referências

- OpenRouter Docs: https://openrouter.ai/docs
- OpenRouter Models: https://openrouter.ai/docs#models
- OpenAI Chat Completions API: https://platform.openai.com/docs/api-reference/chat/create
- MDN Fetch API: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
- MDN ReadableStream: https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream
- Server-Sent Events (SSE): https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events
