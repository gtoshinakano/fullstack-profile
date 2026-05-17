# Interface: Gemini API — generateContent (streaming)

> Feature: `003-toshi-ai-terminal`
> Date: `2026-05-17`
> Type: HTTP REST (browser-initiated, via SDK)

---

## Overview

The terminal calls the Gemini API to generate streamed text responses. The call is made from the browser using the `@google/generative-ai` SDK (dynamically imported on first use). There is no server-side proxy.

---

## Endpoint

| Property | Value |
|----------|-------|
| Provider | Google AI Studio (generativelanguage.googleapis.com) |
| Model | `gemini-2.0-flash` (configurable constant in `useGeminiStream.ts`) |
| Method | `model.generateContentStream(userMessage)` via SDK |
| Auth | API key via `NEXT_PUBLIC_GEMINI_API_KEY` (query param or header, handled by SDK) |
| Protocol | HTTPS |
| Direction | Browser → Google AI Studio |

---

## Request

**Assembled by SDK from these inputs:**

| Input | Source | Notes |
|-------|--------|-------|
| `systemInstruction` | `systemPrompt.ts` — built from 4 data JSONs + hardcoded bio | Set once per model instance |
| `userMessage` | Terminal input field | Max 200 chars (enforced at UI level before SDK call) |
| `model` | `gemini-2.0-flash` | Constant in `useGeminiStream.ts` |

**SDK initialization:**
```typescript
const { GoogleGenerativeAI } = await import('@google/generative-ai')
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!)
const model = genAI.getGenerativeModel({
  model: 'gemini-2.0-flash',
  systemInstruction: buildSystemPrompt(),
})
```

---

## Response (streaming)

**SDK returns:** `GenerateContentStreamResult`

| Property | Type | Description |
|----------|------|-------------|
| `result.stream` | `AsyncIterable<GenerateContentResponse>` | Async iterator yielding chunks |
| `chunk.text()` | `string` | Text fragment for this chunk (may be 1–N tokens) |

**Consumption pattern:**
```typescript
for await (const chunk of result.stream) {
  const text = chunk.text()
  // append text to last message in state
}
```

---

## Errors

| Scenario | SDK behaviour | Component handling |
|----------|--------------|-------------------|
| Invalid / missing API key | Throws `GoogleGenerativeAIError` with 400/403 | Catch → show `t('toshi-ai.error')` in terminal; decrement counter back |
| Rate limit exceeded (429) | Throws with `status: 429` | Same as above |
| Network failure | `fetch` throws `TypeError: Failed to fetch` | Same as above |
| Empty / refused response | `chunk.text()` returns empty string or finishReason `SAFETY` | Message shows partial or empty response; no crash |
| Stream interrupted mid-way | Iterator rejects | Catch → show partial response + error notice; mark streaming done |

**Counter decrement on failure:** Per RF-14, the question counter is NOT incremented for failed API calls. Implementation: increment on submit, decrement on error catch before returning.

---

## Idempotency

Not applicable. Each call generates a unique response. The API is not idempotent — retrying the same message will produce a different (but semantically equivalent) answer.

---

## Timeouts

No explicit timeout is set in the SDK by default. The browser's native `fetch` timeout applies (typically 5 minutes, browser-dependent). For a portfolio use case this is acceptable — if the connection hangs, the user will eventually see the browser error.

**Future mitigation if needed:** Use `AbortController` with a 30-second timeout and pass `signal` via fetch options (requires SDK custom fetch config).

---

## Rate Limits (Google AI Studio Free Tier)

| Limit | Value (Free Tier as of 2026) |
|-------|------------------------------|
| Requests per minute (RPM) | 15 |
| Tokens per minute (TPM) | 1,000,000 |
| Requests per day (RPD) | 1,500 |

Portfolio traffic is expected to be low; these limits are unlikely to be hit. The 3-question session cap provides an additional natural throttle.

---

## Security Notes

1. **Key exposure:** `NEXT_PUBLIC_GEMINI_API_KEY` is visible in the browser bundle. Mitigation: set HTTP referrer restriction in Google AI Studio console to `https://gtoshinakano.github.io/fullstack-profile/*`.
2. **Prompt injection risk:** User input is passed directly as `userMessage`. The system prompt instructs the model to decline off-topic requests. No sanitization needed beyond the 200-character UI limit, as the model itself acts as the gate.
3. **PII:** No user PII is collected or stored. Questions are transient (in-memory state, lost on page reload).
