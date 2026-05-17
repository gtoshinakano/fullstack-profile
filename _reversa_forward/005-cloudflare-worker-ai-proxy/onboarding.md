# Onboarding: Cloudflare Worker — Toshi AI Proxy

> Feature: `005-cloudflare-worker-ai-proxy`
> Date: `2026-05-17`
> Audience: Developer testing this feature for the first time

---

## Prerequisites

- Node.js 20+ and npm installed
- Cloudflare account (free tier sufficient)
- OpenRouter account with an API key

---

## Part 1 — Local Development (no Cloudflare account needed yet)

### Step 1 — Install Wrangler globally

```bash
npm install -g wrangler
```

Verify: `wrangler --version` should print `3.x.x` or higher.

### Step 2 — Create a local `.env.local` for the frontend

In the project root, copy the example:
```bash
cp .env.local.example .env.local
```

Edit `.env.local` and set:
```
NEXT_PUBLIC_TOSHI_AI_WORKER_URL=http://localhost:8787
```

> During local dev, the worker runs at `http://localhost:8787` by default.

### Step 3 — Set worker secrets for local dev

Create `worker/.dev.vars` (this file is gitignored by Wrangler):
```
OPENROUTER_API_KEY=sk-or-your-real-key-here
OPENROUTER_MODEL=google/gemini-2.0-flash-exp:free
```

> `.dev.vars` is the local equivalent of `wrangler secret put` — Wrangler reads it during `wrangler dev`.

### Step 4 — Start the worker locally

```bash
cd worker
wrangler dev
```

Expected output:
```
⛅️ wrangler 3.x.x
...
[mf:inf] Ready on http://localhost:8787
```

### Step 5 — Start the Next.js frontend

In a separate terminal, from the project root:
```bash
npm run dev
```

### Step 6 — Test the terminal

Open `http://localhost:3000` in your browser. Navigate to the HeroDark section. The Toshi AI Terminal should be visible (not hidden).

Type a question, e.g.: `"What is Gabriel's most recent job?"`

**Expected behavior:**
- Browser DevTools → Network: one `POST` to `http://localhost:8787` with body `{ "question": "..." }` — **no Authorization header**
- Response: SSE stream with `data:` lines, terminal fills incrementally
- After response: model name appears below the answer

### Step 7 — CORS rejection test

In the browser console:
```javascript
fetch('http://localhost:8787', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'Origin': 'https://evil.com' },
  body: JSON.stringify({ question: 'test' })
}).then(r => console.log(r.status))
```

Expected: `403`

---

## Part 2 — First Cloudflare Deployment

### Step 8 — Authenticate with Cloudflare

```bash
wrangler login
```

This opens a browser for OAuth. Log in with the Cloudflare account.

### Step 9 — Deploy the worker

```bash
cd worker
wrangler deploy
```

Expected output:
```
Uploaded fullstack-profile-ai (x.xx sec)
Published fullstack-profile-ai (x.xx sec)
  https://fullstack-profile-ai.<YOUR-ACCOUNT>.workers.dev
```

**Copy the worker URL** — you will need it in the next step.

### Step 10 — Set worker secrets on Cloudflare

```bash
cd worker
echo "sk-or-your-real-key-here" | wrangler secret put OPENROUTER_API_KEY
echo "google/gemini-2.0-flash-exp:free" | wrangler secret put OPENROUTER_MODEL
```

Each command will confirm: `✔ Success! Uploaded secret OPENROUTER_API_KEY`

### Step 11 — Update GitHub Actions secrets

In the GitHub repository: **Settings → Secrets and variables → Actions → New repository secret**

Add these secrets:

| Secret name | Value |
|-------------|-------|
| `CLOUDFLARE_API_TOKEN` | Cloudflare API token with "Edit Cloudflare Workers" permission |
| `CLOUDFLARE_ACCOUNT_ID` | Your Cloudflare Account ID (found in the Cloudflare dashboard right sidebar) |
| `OPENROUTER_API_KEY` | Your OpenRouter API key |
| `OPENROUTER_MODEL` | e.g. `google/gemini-2.0-flash-exp:free` |
| `NEXT_PUBLIC_TOSHI_AI_WORKER_URL` | `https://fullstack-profile-ai.<YOUR-ACCOUNT>.workers.dev` |

> Remove `OPENROUTER_API_KEY` and `OPENROUTER_MODEL` secrets if they were previously set from feature 004 — they are no longer needed in the frontend.

### Step 12 — Push to `dev` and verify the pipeline

```bash
git push origin dev
```

In GitHub Actions, you should see both jobs complete:
1. Worker deployment via Wrangler → green
2. Static site build and deploy to GitHub Pages → green

### Step 13 — Verify the deployed terminal

Open `https://gtoshinakano.github.io/fullstack-profile/dev/`

The Toshi AI Terminal should be visible. Submit a question and verify streaming response.

Open DevTools → Network → find the POST request → confirm:
- URL: `https://fullstack-profile-ai.<YOUR-ACCOUNT>.workers.dev`
- No `Authorization` header
- No API key visible anywhere in the request

---

## Troubleshooting

| Symptom | Likely cause | Fix |
|---------|-------------|-----|
| Terminal not visible on page | `NEXT_PUBLIC_TOSHI_AI_WORKER_URL` not set or empty at build time | Set the env var in GitHub Actions secrets and rebuild |
| 403 error in terminal | Wrong origin (e.g., testing from localhost while worker expects `gtoshinakano.github.io`) | Use `http://localhost:8787` locally; the deployed worker expects the GitHub Pages origin |
| 502 error in terminal | OpenRouter API key missing or invalid in worker secrets | Run `wrangler secret put OPENROUTER_API_KEY` and verify the key is correct |
| Worker deploy fails in CI | `CLOUDFLARE_API_TOKEN` or `CLOUDFLARE_ACCOUNT_ID` not set | Verify both secrets in GitHub Actions settings |
| JSON import error during `wrangler dev` | `resolveJsonModule` missing in worker `tsconfig.json` | Add `"resolveJsonModule": true` to `worker/tsconfig.json` |
| Streaming does not appear incremental | SSE passthrough being buffered | Verify `Content-Type: text/event-stream` header is present in the worker response |
