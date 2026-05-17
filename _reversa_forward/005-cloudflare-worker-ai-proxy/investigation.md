# Investigation: Cloudflare Worker — Toshi AI Proxy

> Feature: `005-cloudflare-worker-ai-proxy`
> Date: `2026-05-17`

---

## 1. Cloudflare Workers — Streaming SSE Passthrough

**Question:** Can a Cloudflare Worker pass through an SSE streaming response from OpenRouter to the browser without buffering?

**Answer:** Yes. Cloudflare Workers support the WHATWG Streams API (`ReadableStream`, `TransformStream`, `WritableStream`). The correct pattern is to pipe the upstream `Response.body` (a `ReadableStream`) directly into the downstream `Response` constructor. Wrangler bundles with esbuild, which is compatible with the standard fetch API and `ReadableStream`.

**Pattern:**
```typescript
const upstream = await fetch('https://openrouter.ai/api/v1/chat/completions', {
  method: 'POST',
  headers: { Authorization: `Bearer ${env.OPENROUTER_API_KEY}`, 'Content-Type': 'application/json' },
  body: JSON.stringify({ model: env.OPENROUTER_MODEL, messages, stream: true }),
})

return new Response(upstream.body, {
  status: 200,
  headers: {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
  },
})
```

**Key insight:** Passing `upstream.body` directly is sufficient — no manual `TransformStream` needed unless transformation of the SSE lines is required (it is not here, since the worker passes them through unchanged).

**Reference pattern:** Cloudflare Workers documentation — "Streaming responses", "Using Fetch".

---

## 2. JSON Import in Cloudflare Worker (esbuild)

**Question:** Can the worker import JSON files from outside its `worker/` directory (e.g., `../../src/data/jobs.json`)?

**Answer:** Yes, with a minor configuration requirement. esbuild (used by Wrangler) resolves relative imports at bundle time. The worker TypeScript config needs `"resolveJsonModule": true`. The import then becomes a static, inlined value in the bundle — no runtime file system access required.

**Required worker `tsconfig.json` flag:**
```json
{
  "compilerOptions": {
    "resolveJsonModule": true,
    "moduleResolution": "bundler"
  }
}
```

**Import syntax:**
```typescript
import jobs from '../../src/data/jobs.json' assert { type: 'json' }
import projects from '../../src/data/toshi-projects.json' assert { type: 'json' }
import stacks from '../../src/data/stacks.json' assert { type: 'json' }
```

> Note: The `assert { type: 'json' }` import assertion may be required depending on the TypeScript target version. Wrangler 3+ with esbuild handles this correctly.

---

## 3. Wrangler CLI in GitHub Actions

**Question:** What is the standard pattern for deploying a Cloudflare Worker from GitHub Actions?

**Answer:** The official Cloudflare-maintained action is `cloudflare/wrangler-action`. Alternatively, Wrangler CLI can be installed via `npm install -g wrangler` and called directly. Either approach works.

**Recommended approach (official action):**
```yaml
- name: Deploy Cloudflare Worker
  uses: cloudflare/wrangler-action@v3
  with:
    apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
    accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
    workingDirectory: worker
```

**Secret pattern for worker secrets (OPENROUTER_API_KEY):**
```yaml
- name: Set worker secrets
  run: |
    echo "${{ secrets.OPENROUTER_API_KEY }}" | wrangler secret put OPENROUTER_API_KEY
    echo "${{ secrets.OPENROUTER_MODEL }}" | wrangler secret put OPENROUTER_MODEL
  working-directory: worker
  env:
    CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
    CLOUDFLARE_ACCOUNT_ID: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
```

> Note: `wrangler secret put` is idempotent — re-running with the same value produces no error (covers RF-12).

---

## 4. CORS in Cloudflare Workers

**Question:** How to implement strict CORS enforcement (single allowed origin) in a Cloudflare Worker?

**Answer:** Manually check the `Origin` request header against the allowed origin. Return `403` for non-matching origins. Handle `OPTIONS` preflight separately with `204` and the required `Access-Control-Allow-*` headers.

**Pattern:**
```typescript
const ALLOWED_ORIGIN = 'https://gtoshinakano.github.io'

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const origin = request.headers.get('Origin') ?? ''

    if (request.method === 'OPTIONS') {
      if (origin !== ALLOWED_ORIGIN) return new Response(null, { status: 403 })
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Max-Age': '86400',
        },
      })
    }

    if (request.method !== 'POST' || origin !== ALLOWED_ORIGIN) {
      return new Response('Forbidden', { status: 403 })
    }

    // ... handle POST
  }
}
```

---

## 5. Worker Secrets vs. Environment Variables in wrangler.toml

**Question:** What is the difference between `[vars]` in `wrangler.toml` and `wrangler secret put`?

**Answer:**
- `[vars]` in `wrangler.toml` — plaintext, committed to the repository, visible in source control. **Must not be used for API keys.**
- `wrangler secret put` — encrypted, stored in Cloudflare's secret storage, never visible in source or deploy logs. Values are injected into the worker's `env` object at runtime.

The decision (D-08) is to use `wrangler secret put` for `OPENROUTER_API_KEY` and `OPENROUTER_MODEL`, keeping `wrangler.toml` free of any sensitive data.

---

## 6. Alternatives Evaluated

| Alternative | Reason Discarded |
|-------------|-----------------|
| Vercel Edge Functions | Requires a Vercel account and a different deployment pipeline; adds infra complexity for a portfolio on GitHub Pages |
| Next.js API Routes | Incompatible with `output: 'export'` (ADR-001 — static export). This is a hard constraint. |
| AWS Lambda / API Gateway | Significant setup overhead; overkill for a portfolio project; cost model less predictable than Cloudflare Workers free tier |
| Storing key in OpenRouter's HTTP referrer restriction only (existing mitigation in feature 004) | Referrer headers can be spoofed; the key remains visible in the bundle to anyone who inspects the JavaScript |
| Netlify Edge Functions | Requires Netlify account; conflicts with the GitHub Pages deployment strategy |
| Two Cloudflare Workers (prod + dev) | Confirmed unnecessary — both branches share `https://gtoshinakano.github.io` origin |

---

## 7. `wrangler.toml` Structure Reference

```toml
name = "fullstack-profile-ai"
main = "src/index.ts"
compatibility_date = "2024-01-01"

[build]
command = ""

# No [vars] — all sensitive config via `wrangler secret put`
# Secrets available in env: OPENROUTER_API_KEY, OPENROUTER_MODEL
```

Worker URL after first deploy: `https://fullstack-profile-ai.<ACCOUNT>.workers.dev`
(The `<ACCOUNT>` subdomain is determined by the Cloudflare account — see Gaps in `requirements.md`.)
