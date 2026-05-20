# SDD — Module 008: Cloudflare Worker

**Module ID:** 008  
**Module Name:** worker  
**Type:** Backend (Edge Runtime)  
**Status:** Active  
**Last Updated:** 2026-05-20  
**Feature 006 Status:** ✅ Core Implementation (buildTechPerspective function)

---

## Module Purpose

Serve as an edge-runtime server proxy for OpenRouter API calls. Handle CORS validation, build Gabriel's system prompt with authentic technical context, and stream AI responses back to the frontend. Eliminate client-side API key exposure.

---

## Scope

| Responsibility | Implementation | Feature 006 Impact |
|---|---|---|
| CORS validation | Origin header check against gtoshinakano.github.io | None |
| Preflight handling | OPTIONS request responses | None |
| System prompt building | Concatenate job history, projects, stacks | ✅ New buildTechPerspective() function |
| OpenRouter proxy | Forward question, stream SSE response | Uses enriched system prompt |
| Error handling | Graceful degradation on API failures | None |

---

## Architecture

### Worker Entry Point

**File:** `worker/src/index.ts`

**Function:** `fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response>`

**Responsibilities:**
1. Validate CORS (origin check)
2. Handle OPTIONS preflight
3. Parse request body: `{question: string}`
4. Build system prompt via `buildSystemPrompt()`
5. Forward to OpenRouter
6. Stream SSE response back to browser

### System Prompt Builder

**File:** `worker/src/systemPrompt.ts`

**Main Function:** `buildSystemPrompt(): string`

**Signature:**
```typescript
export function buildSystemPrompt(): string
```

**Behavior:**
- Imports jobs.json, toshi-projects.json, stacks.json, swtools.json at build-time
- Concatenates sections in order (see Section Order below)
- Returns single string (no structured model)

**Section Order:**
```
1. About Gabriel [static]
2. Work History [from jobs.json, formatted]
3. Education [from jobs.json + hardcoded JSX]
4. Portfolio Projects [from toshi-projects.json, formatted]
5. Technical Skills [enumerated stack names]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
6. YOUR TECHNICAL PERSPECTIVE [Feature 006 — NEW]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
7. Hobbies [static]
8. Dislikes [static]
9. Instructions [prompt engineering rules]
```

---

## Feature 006: buildTechPerspective Function

### Specification

**File:** `worker/src/systemPrompt.ts`

**Function Signature:**
```typescript
function buildTechPerspective(stackRegistry: StackRegistry): string
```

**Input:**
- `stackRegistry`: Object with 39 stack entries imported from stacks.json
  - Each entry: `{name: string, src: string, css: string, url: string, opinion: string}`

**Output:**
- Formatted markdown section: `"## Your Technical Perspective\n- Stack1: ...\n- Stack2: ..."`
- Or empty string if no opinions exist (backward compatible)

**Algorithm:**
```
1. Filter stacks where:
   - opinion field exists (not undefined/null)
   - opinion.trim().length > 0 (not empty after whitespace)

2. For each qualifying stack:
   - Format as: "Stack Name: [opinion text]"
   - Example: "React: React is my go-to for building interactive user interfaces..."

3. Join formatted strings with newline: "\n- Stack1\n- Stack2\n..."

4. If no opinions, return ""

5. Otherwise, return:
   "\n## Your Technical Perspective\n\n[formatted stacks joined by newlines]"
```

**Implementation (Pseudocode):**
```typescript
function buildTechPerspective(stackRegistry: StackRegistry): string {
  const stacksWithOpinions = Object.entries(stackRegistry)
    .filter(([_, stack]) => stack.opinion && stack.opinion.trim().length > 0)
    .map(([_, stack]) => `${stack.name}: ${stack.opinion}`)
  
  if (stacksWithOpinions.length === 0) return ''
  
  return `\n## Your Technical Perspective\n\nYou have strong opinions on the following technologies:\n${stacksWithOpinions.map((s) => `- ${s}`).join('\n')}`
}
```

### Validation

| Input | Expected Behavior | Status |
|---|---|---|
| All 39 stacks with opinions | Function returns formatted section | ✅ Pass |
| Missing opinion field on stack | Stack is skipped (filtered out) | ✅ Pass |
| Null/undefined opinion | Stack is skipped (filtered out) | ✅ Pass |
| Empty opinion after trim | Stack is skipped (filtered out) | ✅ Pass |
| No qualifying stacks | Returns empty string (backward compat) | ✅ Pass |

### Feature 006 Integration Points

**Call Site:** In `buildSystemPrompt()`
```typescript
const techPerspective = buildTechPerspective(stacks)
// Inserted after Technical Skills section
// Result concatenated into final prompt string
```

**System Prompt Size Impact:**
- 39 stacks × 50–200 chars per opinion = ~4–8 KB
- Converted to tokens: ~1500 tokens (acceptable within OpenRouter limits)
- Total system prompt size: ~2000 tokens (plenty of headroom)

---

## Request/Response Flow

### Request Format

**Method:** POST  
**Endpoint:** (Cloudflare Worker route)

**Body:**
```json
{
  "question": "What do you think about React?"
}
```

**Headers (CORS):**
```
Origin: https://gtoshinakano.github.io
```

### CORS Validation

**Rule:** Origin must match `https://gtoshinakano.github.io`

**Validation Code:**
```typescript
const allowedOrigin = "https://gtoshinakano.github.io"
const origin = request.headers.get("Origin")

if (origin !== allowedOrigin) {
  return new Response("Forbidden", {status: 403})
}
```

### Preflight Handling

**Trigger:** OPTIONS request

**Response:**
```
Status: 204 No Content
Headers:
  Access-Control-Allow-Origin: https://gtoshinakano.github.io
  Access-Control-Allow-Methods: POST, OPTIONS
  Access-Control-Allow-Headers: Content-Type
  Access-Control-Max-Age: 86400
```

### Response Format

**Type:** Server-Sent Events (SSE)

**Stream Format:**
```
data: {
  "choices": [{"delta": {"content": "Some response text"}}],
  "model": "model-name"
}

data: [DONE]
```

**Browser Parser:** `useOpenRouterStream.ts` hook parses SSE chunks and updates UI

---

## Error Handling

| Scenario | Detection | Response | User Experience |
|---|---|---|---|
| Invalid CORS origin | Origin header mismatch | 403 Forbidden | Browser blocks request (CORS error) |
| Invalid JSON | JSON.parse fails | 400 Bad Request | Error displayed in terminal |
| OpenRouter 429 (rate limited) | HTTP 429 response | 500 Internal Server Error | "Rate limited, please try again" |
| OpenRouter timeout | Fetch timeout | 500 Internal Server Error | "Request timed out" |
| Network error | Connection refused | 500 Internal Server Error | "Network error" |

---

## Data Models

### StackEntry Type

```typescript
interface StackEntry {
  name: string;
  src: string;
  css: string;
  url: string;
  opinion?: string;  // Feature 006: optional in type, required in data
}

type StackRegistry = Record<string, StackEntry>
```

### Request/Response Types

```typescript
interface AskRequest {
  question: string
}

interface OpenRouterMessage {
  role: "system" | "user" | "assistant"
  content: string
}

interface OpenRouterRequest {
  model: string
  messages: OpenRouterMessage[]
  stream: boolean
}
```

---

## Build Configuration

**File:** `wrangler.toml`

**Relevant Settings:**
```toml
name = "fullstack-profile-ai"
type = "javascript"

[env.production]
route = "..."
zone_name = "..."

[env.development]
...
```

**Environment Variables:**
- `OPENROUTER_API_KEY` — Securely injected at deploy time (never exposed to browser)
- `NEXT_PUBLIC_TOSHI_AI_WORKER_URL` — Endpoint URL (set in Next.js build)

---

## Business Rules

### BR-Worker-001: Single Instance, Multiple Deployments

**Rule:** One worker instance (`fullstack-profile-ai`) serves both main and dev deployments

**Impact:** 
- Shared environment variables
- Shared rate limits (if any)
- Single point of failure for both deployments

### BR-Worker-002: No Rate Limiting in Worker

**Rule:** Rate limiting is client-side only (MAX_QUESTIONS = 3 in ToshiAITerminal)

**Impact:**
- Visitor cannot ask more than 3 questions per session
- No server-side quota enforcement

### BR-Worker-003: Stateless Execution

**Rule:** Worker has no persistent state (no database, no in-memory cache)

**Impact:**
- Each request is independent
- No session affinity required
- Scales horizontally by default

### BR-Worker-004: Build-Time System Prompt

**Rule:** System prompt is built and frozen at worker deploy-time, not at request-time

**Impact:**
- System prompt changes require redeployment
- Opinions cannot be live-edited (must commit + deploy)
- Immutable audit trail of opinions per deployment

---

## Feature 006 Specifications

### Design Decision: Opinion Field

**Decision:** Add optional `opinion: string` field to stacks.json, integrate into system prompt via `buildTechPerspective()`

**Rationale:** Authentic AI responses grounded in Gabriel's perspective, not hallucinations

**Backward Compatibility:** Missing opinion field gracefully filtered (empty string returned if no opinions)

### Validation Rules (Feature 006)

| Rule | Implementation | Status |
|---|---|---|
| All stacks have opinion | 39/39 populated | ✅ Pass |
| Opinion non-empty after trim | Validation rule enforced | ✅ Pass |
| Frontend doesn't access opinion | Grep search: 0 refs | ✅ Pass |
| System prompt includes perspectives | buildTechPerspective() called | ✅ Pass |
| Worker imports stacks at build-time | webpack bundle analysis | ✅ Pass |

---

## Performance

### Latency

| Operation | Typical Duration | Note |
|---|---|---|
| Worker receives request | < 1ms | Cloudflare edge |
| Parse request body | < 1ms | JSON parsing |
| Build system prompt | < 10ms | String concatenation (pre-built, cached) |
| Forward to OpenRouter | 1–5 sec | Network latency + inference |
| Stream SSE chunks | 5–15 sec | Inference time (varies by model) |
| **Total user-perceived latency** | **~5–20 sec** | Dominated by LLM inference |

### Token Budget

| Component | Token Count | Headroom |
|---|---|---|
| System prompt (base) | ~500 tokens | — |
| Feature 006 opinions | ~1500 tokens | — |
| User question | ~50–100 tokens | — |
| **Total context input** | **~2000 tokens** | — |
| **OpenRouter context window** | **100,000+ tokens** | ✅ Plenty of headroom |

---

## Deployment & Scaling

### Deployment Steps

1. Commit changes to worker code and stacks.json
2. Push to main branch
3. GitHub Actions triggers build
4. `wrangler deploy` in CI/CD
5. Cloudflare Workers deploys new version

### Scaling Characteristics

- **Horizontal scalability:** Cloudflare Workers automatically scales across edge locations
- **No state management needed:** Stateless execution enables easy scaling
- **Rate limiting:** Can be implemented via Cloudflare rate-limiting rules if needed

---

## Testing

### Unit Tests (Recommended)

```typescript
describe("buildTechPerspective", () => {
  it("should filter and format opinions correctly", () => {
    const result = buildTechPerspective({
      react: {name: "React", opinion: "My go-to UI library"},
      aws: {name: "AWS", opinion: "Cloud platform of choice"}
    })
    expect(result).toContain("React: My go-to UI library")
    expect(result).toContain("AWS: Cloud platform of choice")
  })

  it("should handle missing opinion field", () => {
    const result = buildTechPerspective({
      react: {name: "React", opinion: ""},
      aws: {name: "AWS"}  // no opinion field
    })
    expect(result).toBe("")  // empty if no valid opinions
  })
})

describe("fetch handler", () => {
  it("should reject non-allowed origins", async () => {
    const request = new Request("...", {
      headers: {Origin: "https://evil.com"}
    })
    const response = await handleRequest(request)
    expect(response.status).toBe(403)
  })

  it("should handle OPTIONS preflight", async () => {
    const request = new Request("...", {method: "OPTIONS"})
    const response = await handleRequest(request)
    expect(response.status).toBe(204)
  })
})
```

### Integration Tests (Recommended)

```typescript
describe("System Prompt Building", () => {
  it("should include opinions in system prompt", () => {
    const prompt = buildSystemPrompt()
    expect(prompt).toContain("Your Technical Perspective")
    expect(prompt).toContain("React")
    expect(prompt).toContain("AWS")
  })

  it("should handle missing opinions gracefully", () => {
    // Test with stacks missing opinion field
    // Verify prompt builds without errors
  })
})
```

---

## Monitoring & Observability

### Key Metrics

- Worker invocation count (per day, per hour)
- Error rate (4xx, 5xx responses)
- P95 latency (OpenRouter call duration)
- System prompt size (token count)

### Alerting

| Alert | Threshold | Action |
|---|---|---|
| Worker error rate > 1% | — | Page oncall |
| OpenRouter 429 responses > 10% | — | Check rate limits |
| Worker timeout > 30s | — | Check OpenRouter status |

---

## Documentation References

- **Architecture:** `_reversa_sdd/architecture.md`
- **Deployment:** `_reversa_sdd/deployment-architecture.md` (data flow diagram)
- **Domain:** `_reversa_sdd/domain.md` (BR-14: opinions server-side only)
- **ADR-006:** `_reversa_sdd/adrs/006-tech-stack-opinions.md` (design decision)
- **Code Analysis:** `_reversa_sdd/code-analysis.md` (module overview)
