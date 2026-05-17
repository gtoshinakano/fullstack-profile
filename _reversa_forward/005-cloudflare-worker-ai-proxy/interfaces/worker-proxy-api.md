# Interface: Worker Proxy API

> Feature: `005-cloudflare-worker-ai-proxy`
> Worker name: `fullstack-profile-ai`
> Base URL: `https://fullstack-profile-ai.<ACCOUNT>.workers.dev` (stored as `NEXT_PUBLIC_TOSHI_AI_WORKER_URL`)
> Protocol: HTTPS / SSE (Server-Sent Events)

---

## Endpoint

```
POST /
```

The worker exposes a single endpoint at the root path. No versioning, no sub-paths.

---

## Request

### Headers

| Header | Value | Required |
|--------|-------|----------|
| `Content-Type` | `application/json` | Yes |
| `Origin` | `https://gtoshinakano.github.io` | Yes (CORS enforcement) |

> **No `Authorization` header.** The worker authenticates with OpenRouter internally using its own secret.

### Body

```json
{
  "question": "string"
}
```

| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| `question` | `string` | Yes | Non-empty; frontend caps at 200 characters before sending |

### Example Request

```http
POST https://fullstack-profile-ai.<ACCOUNT>.workers.dev/
Content-Type: application/json
Origin: https://gtoshinakano.github.io

{
  "question": "What programming languages does Gabriel know?"
}
```

---

## Response — Success (200)

The worker returns a streaming SSE response. The format is identical to OpenRouter's native SSE output, passed through without modification.

### Headers

| Header | Value |
|--------|-------|
| `Content-Type` | `text/event-stream` |
| `Cache-Control` | `no-cache` |
| `Access-Control-Allow-Origin` | `https://gtoshinakano.github.io` |

### Body Format (SSE stream)

```
data: {"id":"gen-...","model":"google/gemini-2.0-flash-exp:free","object":"chat.completion.chunk","choices":[{"index":0,"delta":{"content":"Gabriel"},"finish_reason":null}]}

data: {"id":"gen-...","model":"google/gemini-2.0-flash-exp:free","choices":[{"index":0,"delta":{"content":" knows"},"finish_reason":null}]}

data: [DONE]
```

Each `data:` line is a JSON object. The frontend reads:
- `data.choices[0].delta.content` → text chunk to append to terminal
- `data.model` → model name to display below the completed response
- `data: [DONE]` → stream complete sentinel

---

## Response — CORS Preflight (204)

```http
OPTIONS /
Origin: https://gtoshinakano.github.io
Access-Control-Request-Method: POST
Access-Control-Request-Headers: Content-Type
```

```
HTTP/2 204 No Content
Access-Control-Allow-Origin: https://gtoshinakano.github.io
Access-Control-Allow-Methods: POST, OPTIONS
Access-Control-Allow-Headers: Content-Type
Access-Control-Max-Age: 86400
```

---

## Errors

| Scenario | HTTP Status | Body |
|----------|-------------|------|
| Origin not in allowed list | `403 Forbidden` | `Forbidden` (plain text) |
| Method not POST or OPTIONS | `403 Forbidden` | `Forbidden` (plain text) |
| Request body missing or `question` field empty | `400 Bad Request` | `{"error": "question is required"}` |
| OpenRouter API returns non-200 | `502 Bad Gateway` | `{"error": "upstream error"}` |
| OpenRouter does not respond within 30 seconds | `504 Gateway Timeout` | `{"error": "upstream timeout"}` |
| Worker internal error | `500 Internal Server Error` | `{"error": "internal error"}` |

> The frontend treats all non-200 responses uniformly: shows a generic error message in the terminal, does not increment the question counter, re-enables input.

---

## Idempotency

The endpoint is **not idempotent** — each `POST` triggers a new AI inference call. Submitting the same question twice produces two independent responses.

---

## Timeout

- Worker enforces a 30-second upstream timeout (OpenRouter call).
- Cloudflare Workers have a maximum CPU time of 10ms per request on the free tier, but streaming responses are not CPU-bound — wall clock time up to 30 seconds is acceptable.

---

## Sequence Diagram

```
Browser                  Worker (fullstack-profile-ai)        OpenRouter
   |                              |                               |
   |── OPTIONS / ──────────────── |                               |
   |     Origin: gh.io            |                               |
   |                              |── 204 CORS preflight ────────>|
   |<── 204 No Content ───────────|                               |
   |                              |                               |
   |── POST / ─────────────────── |                               |
   |     { question: "..." }      |                               |
   |                              |── POST /chat/completions ──── |
   |                              |     system prompt + question  |
   |                              |     Authorization: Bearer *** |
   |                              |     stream: true              |
   |                              |                               |
   |                              |<── SSE chunks ─────────────── |
   |<── SSE passthrough ─────────-|                               |
   |    data: {...delta...}       |                               |
   |    data: [DONE]              |                               |
```
