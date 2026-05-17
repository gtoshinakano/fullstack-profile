# Roadmap: Cloudflare Worker — Toshi AI Proxy

> Identifier: `005-cloudflare-worker-ai-proxy`
> Date: `2026-05-17`
> Requirements: `_reversa_forward/005-cloudflare-worker-ai-proxy/requirements.md`
> Confidence: 🟢 CONFIRMED, 🟡 INFERRED, 🔴 GAP

---

## 1. Approach Summary

A new Cloudflare Worker project is created inside the existing repository under a `worker/` directory at the repo root. The worker is a self-contained TypeScript project with its own `wrangler.toml`, `package.json`, and `tsconfig.json`. It does not share the frontend's `node_modules` or build pipeline.

The worker imports Gabriel's profile data (`jobs.json`, `toshi-projects.json`, `stacks.json`) from `src/data/` via relative TypeScript imports, which esbuild (used internally by Wrangler) resolves and bundles at deploy time. This preserves a single source of truth for profile data across both the frontend and the worker.

On the frontend side, the only changes are in `ToshiAITerminal/`: the hook `useOpenRouterStream.ts` is updated to call `NEXT_PUBLIC_TOSHI_AI_WORKER_URL` with a simplified body (`{ question }`, no auth header), and the guard in `index.tsx` is switched from `NEXT_PUBLIC_OPENROUTER_API_KEY` to `NEXT_PUBLIC_TOSHI_AI_WORKER_URL`. All terminal UI, streaming parsing, and GA event logic remain untouched.

The GitHub Actions workflow (`deploy.yml`) gains a new job (or step) that runs `wrangler deploy` after authenticating with `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` GitHub secrets. The worker is deployed before (or in parallel with) the frontend so the endpoint is live when the new frontend build goes out.

---

## 2. Principles Applied

> No `.reversa/principles.md` found — section populated from ADRs and established project conventions.

| Principle (source) | How this feature relates | Status |
|--------------------|--------------------------|--------|
| ADR-001: Static export, no server-side runtime | The portfolio itself stays a static export. The worker is an independent service, not a Next.js API route. | respects |
| ADR-001: Zero hosting cost preference | Cloudflare Workers free tier (100k requests/day) covers expected portfolio traffic. | respects |
| Zero test coverage (existing project norm) | No automated tests are added for the worker. Manual verification via `wrangler dev` is the testing strategy. | respects (norm preserved) |
| Single source of truth for profile data (`src/data/`) | Worker imports the same JSON files rather than copying data. | respects |
| `NEXT_PUBLIC_*` convention for browser env vars | `NEXT_PUBLIC_TOSHI_AI_WORKER_URL` follows the existing pattern. | respects |

---

## 3. Technical Decisions

| ID | Decision | Justification | Alternatives Discarded | Confidence |
|----|----------|---------------|------------------------|------------|
| D-01 | Worker lives in `worker/` directory at repo root, not a separate repository | Enables atomic commits across frontend + worker; simpler CI/CD; aligns with RN-08 | Separate repo (adds cross-repo coordination overhead) | 🟢 |
| D-02 | Worker imports JSON files from `../../src/data/` via TypeScript static import | Single source of truth (RN-02); esbuild bundles them at deploy time; no runtime HTTP fetch needed | Copy JSON into `worker/src/data/` (duplicates data, divergence risk) | 🟢 |
| D-03 | CORS validated explicitly in worker code via `Origin` header string comparison | Fully transparent, auditable, no third-party middleware; exact semantics required by RN-03 | Cloudflare Workers CORS middleware (hides logic, harder to audit) | 🟢 |
| D-04 | SSE passthrough via `TransformStream` — pipe `openrouterResponse.body` directly into the worker response | Zero buffering, minimal memory footprint, preserves SSE line format exactly (RN-05) | Buffer full response then send (breaks streaming UX, high memory) | 🟢 |
| D-05 | Single worker instance (`fullstack-profile-ai`) for both `main` and `dev` branches | `main` and `dev` share origin `https://gtoshinakano.github.io`, so one CORS rule covers both (confirmed RN-03) | Two workers: higher infra complexity, duplication of secrets management | 🟢 |
| D-06 | No server-side rate limiting in the worker | Free-tier model provides cost protection; frontend 3-question limit is the UX guard; added complexity not justified (RN-09) | IP-based KV rate limiting (adds Cloudflare KV binding, complexity, cost) | 🟢 |
| D-07 | Worker deployment step runs before frontend deployment step in CI | Ensures the API endpoint is live before the new frontend that targets it is served to visitors | Parallel deploy (race condition: new frontend live before worker is ready) | 🟡 |
| D-08 | Worker secrets (`OPENROUTER_API_KEY`, `OPENROUTER_MODEL`) set via `wrangler secret put` piped from CI env, not in `wrangler.toml` | Secrets must never appear in source files or git history | `[vars]` in `wrangler.toml` (plaintext, committed to repo — violates RN-01) | 🟢 |

---

## 4. Premises

| Premise | Source (requirements.md) | Risk if Wrong |
|---------|--------------------------|---------------|
| The Cloudflare account subdomain for `fullstack-profile-ai` produces a stable `workers.dev` URL that can be set as `NEXT_PUBLIC_TOSHI_AI_WORKER_URL` before the first frontend deploy | Section 10 — Gaps (1 remaining [DÚVIDA]) | Worker URL mismatch → terminal guard triggers, terminal invisible on deployed site until env var is corrected and site rebuilt |
| Cloudflare Workers free tier (100k requests/day) is sufficient for portfolio traffic | RN-09 (rate limiting explicitly waived) | If traffic spikes unexpectedly, requests may be throttled by Cloudflare; no in-code fallback |

---

## 5. Architectural Delta

| Component | Legacy source | Change type | Summary |
|-----------|---------------|-------------|---------|
| `ToshiAITerminal/useOpenRouterStream.ts` | `_reversa_sdd/code-analysis.md#Feature 2 — hero-dark` | contract-altered | Call target changes from OpenRouter API to worker URL; request body simplified to `{ question }`; `Authorization` header removed; response format (SSE) unchanged |
| `ToshiAITerminal/index.tsx` | `_reversa_sdd/code-analysis.md#Feature 2 — hero-dark` | rule-altered | Guard variable switches from `NEXT_PUBLIC_OPENROUTER_API_KEY` to `NEXT_PUBLIC_TOSHI_AI_WORKER_URL` |
| `ToshiAITerminal/systemPrompt.ts` | `_reversa_sdd/code-analysis.md#Feature 2 — hero-dark` | component-altered | File remains in frontend for local development reference, but its logic is duplicated/moved into the worker; frontend no longer uses it in production calls |
| `fullstack-profile-ai` (Cloudflare Worker) | — | component-new | New independent service; proxies OpenRouter calls; generates system prompt; enforces CORS |
| `.github/workflows/deploy.yml` | `_reversa_sdd/architecture.md#High-Level Architecture` | contract-altered | New deployment step added: Wrangler CLI deploys the worker to Cloudflare before/alongside the static site deploy |
| `.env.local.example` | — | contract-altered | `NEXT_PUBLIC_OPENROUTER_API_KEY` and `NEXT_PUBLIC_OPENROUTER_MODEL` removed; `NEXT_PUBLIC_TOSHI_AI_WORKER_URL` added |
| `_reversa_sdd/c4-context.md` (conceptual) | External integrations table | contrato-novo | New external system: Cloudflare Worker (`fullstack-profile-ai`); new relation: Browser → Worker (HTTPS POST); new relation: Worker → OpenRouter (HTTPS streaming) |

---

## 6. Data Model Delta

No database, no persistent storage, no schema migration required. The only data change is the movement of Gabriel's profile JSON files from being a frontend-only resource to also being bundled into the worker at deploy time.

Full detail: `_reversa_forward/005-cloudflare-worker-ai-proxy/data-delta.md`

---

## 7. External Contract Delta

| Contract | Type | Detail file |
|----------|------|-------------|
| Worker Proxy API — browser sends question, worker streams SSE response | HTTP / SSE | `_reversa_forward/005-cloudflare-worker-ai-proxy/interfaces/worker-proxy-api.md` |

> The OpenRouter API contract is now consumed by the worker (not the browser). Its format is unchanged from feature 004; no new interface file needed.

---

## 8. Migration Plan

This is a greenfield addition alongside an existing frontend. No database migration, no data loss, no breaking change for users already on the site. Deploy sequence:

1. **Implement worker** (`worker/` directory, `wrangler.toml`, source code, JSON imports) — locally testable with `wrangler dev`
2. **Update frontend** (`useOpenRouterStream.ts` call target, `index.tsx` guard, env files) — locally testable with worker running via `wrangler dev`
3. **Update CI/CD** (`deploy.yml`: add Wrangler step, remove old env vars, add `NEXT_PUBLIC_TOSHI_AI_WORKER_URL`)
4. **Obtain Cloudflare credentials** — Account ID, API token with Worker deployment permissions
5. **Add GitHub Actions secrets** — `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`, `OPENROUTER_API_KEY`, `OPENROUTER_MODEL`, `NEXT_PUBLIC_TOSHI_AI_WORKER_URL`
6. **First deployment** — push to `dev` branch; verify worker deploys, terminal connects, streaming works
7. **Promote to `main`** — push/merge to main; verify production deployment

Rollback: revert the `useOpenRouterStream.ts` and `index.tsx` changes, restore `NEXT_PUBLIC_OPENROUTER_API_KEY` and `NEXT_PUBLIC_OPENROUTER_MODEL` env vars in CI. The worker can remain deployed (it does nothing if the frontend doesn't call it).

---

## 9. Risks and Mitigations

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Worker URL unknown until first Cloudflare deploy — `NEXT_PUBLIC_TOSHI_AI_WORKER_URL` must be set before frontend build | High (terminal invisible if wrong) | Low (one-time setup) | Document the URL retrieval step explicitly in `onboarding.md`; keep the absent-URL guard (RF-14) so the site degrades gracefully rather than crashing |
| SSE passthrough may buffer in Cloudflare Workers if response is not streamed correctly | High (breaks terminal UX) | Low (standard pattern) | Use `TransformStream` pipe pattern; verify locally with `wrangler dev` before deploying |
| esbuild JSON import from outside `worker/` directory may require explicit config | Medium (build failure) | Low (esbuild supports relative imports by default) | Add `resolveJsonModule: true` to worker `tsconfig.json`; test with `wrangler dev` early |
| OpenRouter free-tier model may have higher latency than expected | Medium (UX degradation) | Medium (free tier) | Existing 30s timeout in non-functional requirements; frontend streaming indicator already manages user perception |
| Cloudflare Worker free tier request limit (100k/day) could be exceeded by bots or scrapers calling the endpoint directly | Low (cost/availability) | Low (portfolio traffic is small) | Accepted per RN-09; no mitigation in scope |
| Worker secrets (OPENROUTER_API_KEY) must be set via `wrangler secret put` before first deploy — missing secrets cause worker to fail silently | High (worker returns 500) | Low (one-time setup risk) | Document the secrets setup step; worker should return a user-friendly error if secrets are missing |

---

## 10. Definition of Done

- [ ] All actions in `actions.md` marked `[X]`
- [ ] `wrangler dev` runs the worker locally and the terminal in local Next.js dev server connects to it successfully
- [ ] Browser DevTools confirms no `Authorization` header and no API key in any request from the frontend
- [ ] CORS rejection test: direct `fetch` from browser console with wrong origin returns 403
- [ ] GitHub Actions pipeline deploys both artifacts on push to `dev`; both steps show green
- [ ] Terminal works end-to-end on the deployed `dev` site: question submitted → streaming answer received
- [ ] `grep -r "NEXT_PUBLIC_OPENROUTER" .` returns no results in the frontend source
- [ ] `regression-watch.md` generated

---

## 11. Change History

| Date | Change | Author |
|------|--------|--------|
| 2026-05-17 | Initial version generated by `/reversa-plan` | reversa |
