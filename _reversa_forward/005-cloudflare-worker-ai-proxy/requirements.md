# Requirements: Cloudflare Worker — Toshi AI Proxy

> Identifier: `005-cloudflare-worker-ai-proxy`
> Date: `2026-05-17`
> Extraction folder: `_reversa_sdd/`
> Confidence: 🟢 CONFIRMED, 🟡 INFERRED, 🔴 GAP / DOUBT

## 1. Executive Summary

Introduce a dedicated server-side proxy worker that sits between the Toshi AI Terminal and the OpenRouter API, eliminating the current practice of baking the OpenRouter API key into the frontend JavaScript bundle. The worker receives chat messages from the browser, builds the system prompt internally (using Gabriel's profile data embedded in the worker), calls OpenRouter using a securely stored API key, and streams the response back to the browser. CORS (Cross-Origin Resource Sharing) is enforced so that only the portfolio's GitHub Pages origin is accepted. The GitHub Actions CI/CD pipeline is extended to deploy both the static Next.js frontend and the worker on every push, keeping both artifacts in sync.

---

## 2. Legacy Context

| Source | Relevant excerpt | Confidence |
|--------|------------------|------------|
| `_reversa_sdd/architecture.md#System Summary` | The portfolio is a static export (Next.js `output: 'export'`) deployed to GitHub Pages. There is no server, no API routes, and no runtime server-side logic. A new independent service is required to handle secrets securely. | 🟢 |
| `_reversa_sdd/architecture.md#Key Architectural Decisions` | ADR-001: static export to GitHub Pages means no Next.js API routes. Any server-side computation must live in an external service. | 🟢 |
| `_reversa_sdd/architecture.md#External Integrations` | Current external integrations are all browser-initiated. This feature adds a new server-side integration: the proxy worker calling OpenRouter. | 🟢 |
| `_reversa_forward/004-terminal-openrouter-migration/requirements.md#RN-01` | Feature 004 established that the AI inference call originates in the browser with `NEXT_PUBLIC_OPENROUTER_API_KEY` baked in the bundle. This feature supersedes that decision by moving the key server-side. | 🟢 |
| `_reversa_forward/004-terminal-openrouter-migration/requirements.md#RN-02` | Feature 004 acknowledged the client-side key exposure as a risk and noted HTTP referrer restriction as a partial mitigation. This feature resolves that risk entirely. | 🟢 |
| `_reversa_forward/004-terminal-openrouter-migration/requirements.md#RN-04` | The OpenRouter streaming response uses the SSE format with `delta.content` fields (OpenAI-compatible). The proxy must pass this streaming format through to the browser intact. | 🟢 |
| `_reversa_sdd/code-analysis.md#Feature 2 — hero-dark` | The `ToshiAITerminal` sub-component lives inside `HeroDark/ToshiAITerminal/`, calling `useOpenRouterStream.sendMessage()`. Only the call target URL and the removal of the local API key need to change; the terminal UI is unchanged. | 🟢 |

---

## 3. Personas and Use Cases

| Persona | Goal | Key scenario |
|---------|------|--------------|
| Recruiter / Visitor | Ask questions about Gabriel and receive streamed answers | Opens the terminal, types a question, sees the answer stream in — behavior identical to the current version, but the API key is never in the browser |
| Author (Gabriel) | Secure the OpenRouter API key so it cannot be extracted from the bundle | Deploys; the key is stored only in the worker's secret store, not in any frontend env var |
| Author (Gabriel) | Update Gabriel's profile description without changing the frontend | Edits the profile data embedded in the worker and redeploys the worker; no frontend rebuild required |
| CI/CD pipeline | Deploy both the frontend and the worker on every push | GitHub Actions runs two deployment steps in a single workflow: one for the static site, one for the worker |

---

## 4. New or Changed Business Rules

1. **RN-01:** The OpenRouter API key must not appear in any frontend file, environment variable, build artifact, or browser request. It is stored exclusively in the worker's secret management system. 🟢
   - Origin: `_reversa_forward/004-terminal-openrouter-migration/requirements.md#RN-02` (risk now fully resolved)
   - Type: altered (was: key baked in `NEXT_PUBLIC_OPENROUTER_API_KEY`; now: key stored server-side only)

2. **RN-02:** The system prompt (Gabriel Toshinori Nakano's profile, work history, skills, projects) is generated exclusively by the worker. The worker imports the same JSON data files used by the frontend (`jobs.json`, `toshi-projects.json`, `stacks.json`) at build time, making them its own embedded data source. The frontend sends only the user's raw question text; it does not supply any profile data or system-level instructions to the worker. 🟢
   - Type: new (previously the system prompt was assembled in `systemPrompt.ts` on the frontend)
   - Data source: `src/data/jobs.json`, `src/data/toshi-projects.json`, `src/data/stacks.json` — same canonical files, bundled into the worker at deploy time

3. **RN-03:** The worker, named `fullstack-profile-ai`, is deployed as a single Cloudflare Worker instance. It enforces CORS strictly: only requests with `Origin: https://gtoshinakano.github.io` are accepted. Requests from any other origin receive a `403 Forbidden` response. This single-instance, single-origin rule covers both the `main` deployment (`/fullstack-profile/`) and the `dev` deployment (`/fullstack-profile/dev/`), since both share the same GitHub Pages origin. There are no separate dev/prod worker instances. 🟢
   - Type: new
   - Worker name: `fullstack-profile-ai` (determines default subdomain `fullstack-profile-ai.<account>.workers.dev`)

4. **RN-04:** The worker responds to HTTP `OPTIONS` preflight requests with the correct CORS headers and a `204 No Content` status, allowing the browser to proceed with the actual `POST` request. (Preflight is a browser mechanism to verify cross-origin permission before sending the real request.) 🟢
   - Type: new

5. **RN-05:** The worker streams the OpenRouter SSE (Server-Sent Events) response directly back to the browser without buffering the full response first. The streaming format (SSE `data:` lines ending with a `[DONE]` terminator) must remain identical to what OpenRouter produces, so the existing frontend SSE parser in `useOpenRouterStream.ts` requires no changes. 🟢
   - Type: new

6. **RN-06:** All existing terminal business rules (3-question session limit, 200-character input cap, graceful absent-configuration handling, error recovery, streaming indicator, i18n) remain unchanged in the frontend. 🟢
   - Origin: `_reversa_forward/004-terminal-openrouter-migration/requirements.md#RN-06`
   - Type: preserved

7. **RN-07:** The frontend determines the worker endpoint via a build-time environment variable (`NEXT_PUBLIC_TOSHI_AI_WORKER_URL`). When this variable is absent or empty, the terminal component is not rendered — consistent with the existing absent-key behavior. 🟢
   - Type: altered (was: `NEXT_PUBLIC_OPENROUTER_API_KEY` guard; now: `NEXT_PUBLIC_TOSHI_AI_WORKER_URL` guard)

8. **RN-08:** The GitHub Actions workflow deploys the worker first (or in parallel with the frontend build) and always redeploys both artifacts on every push to `main` or `dev`. The worker deployment must succeed for the pipeline to be considered green. 🟡
   - Type: new

9. **RN-09:** The worker does not enforce server-side rate limiting. The 3-question session limit (MAX_QUESTIONS=3) is enforced exclusively by the frontend React state counter. The risk of direct API calls bypassing this limit is accepted; the OpenRouter free-tier model provides natural cost protection. 🟢
   - Type: new (explicit decision to keep rate limiting client-side only)

---

## 5. Functional Requirements

| ID | Requirement | Priority | Acceptance Criterion | Confidence |
|----|-------------|----------|----------------------|------------|
| RF-01 | Create a new Cloudflare Worker project within the repository (separate `worker/` directory with its own configuration and source files) | Must | A `worker/` directory exists with runnable worker source and configuration; `cd worker && wrangler dev` starts a local worker instance | 🟢 |
| RF-02 | The worker exposes a single `POST /` endpoint that accepts a JSON body `{ question: string }` | Must | A `POST` request with `{ "question": "Who is Gabriel?" }` returns a streamed SSE response | 🟢 |
| RF-03 | The worker validates the `Origin` header of incoming requests against the allowed origin (`https://gtoshinakano.github.io`); requests with any other origin receive `403 Forbidden` | Must | A `POST` from `Origin: https://evil.com` returns HTTP 403; a request from the allowed origin succeeds | 🟢 |
| RF-04 | The worker handles HTTP `OPTIONS` preflight requests, returning `204` with the correct `Access-Control-Allow-*` headers | Must | Browser DevTools shows the preflight `OPTIONS` returning `204`; the subsequent `POST` is not blocked by CORS | 🟢 |
| RF-05 | The worker builds the system prompt internally by reading the bundled JSON data files (`jobs.json`, `toshi-projects.json`, `stacks.json`) at deploy time. The assembled prompt is prepended as a `system` role message before forwarding to OpenRouter | Must | AI responses correctly reference Gabriel's information without the browser having sent any system prompt; updating a JSON file and redeploying the worker reflects the change | 🟢 |
| RF-06 | The worker forwards the assembled request to the OpenRouter API using the securely stored API key, with `stream: true` | Must | OpenRouter SSE response is received by the worker and forwarded to the browser | 🟢 |
| RF-07 | The worker streams the OpenRouter SSE response back to the browser maintaining the `text/event-stream` content type and the same `data:` / `[DONE]` line format | Must | The existing `useOpenRouterStream.ts` SSE parser in the frontend works without modification when pointed at the worker | 🟢 |
| RF-08 | The model identifier used by the worker to call OpenRouter is configurable via the worker's environment (not hardcoded); the frontend does not need to specify a model | Must | Changing the model in the worker environment takes effect without a frontend rebuild | 🟢 |
| RF-09 | The `ToshiAITerminal` component's `useOpenRouterStream.ts` is updated to call `NEXT_PUBLIC_TOSHI_AI_WORKER_URL` instead of `https://openrouter.ai/api/v1/chat/completions`; it sends `{ question }` in the body and no `Authorization` header | Must | Browser DevTools shows the terminal's request going to the worker URL with no API key in the headers | 🟢 |
| RF-10 | The `NEXT_PUBLIC_OPENROUTER_API_KEY` and `NEXT_PUBLIC_OPENROUTER_MODEL` variables are removed from the frontend's environment files, GitHub Actions workflow, and `.env.local.example`; `NEXT_PUBLIC_TOSHI_AI_WORKER_URL` is added | Must | `grep -r NEXT_PUBLIC_OPENROUTER` returns no results in the frontend source; `NEXT_PUBLIC_TOSHI_AI_WORKER_URL` is present in `.env.local.example` | 🟢 |
| RF-11 | The GitHub Actions workflow (`deploy.yml`) gains a new step that deploys the Cloudflare Worker using the Wrangler CLI, authenticated via GitHub Actions secrets (`CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`) | Must | On push to `main` or `dev`, the worker is deployed to Cloudflare as part of the same pipeline run | 🟢 |
| RF-12 | The worker deployment step in GitHub Actions is idempotent: redeploying the same worker code with the same secrets produces no error | Must | Running the deploy twice in a row returns success both times | 🟡 |
| RF-13 | A single worker instance named `fullstack-profile-ai` serves both the `main` and `dev` branch deployments; both branches use the same `NEXT_PUBLIC_TOSHI_AI_WORKER_URL` value in their builds | Must | Both `https://gtoshinakano.github.io/fullstack-profile/` and `https://gtoshinakano.github.io/fullstack-profile/dev/` connect to the same worker URL and receive valid streaming responses | 🟢 |
| RF-14 | When `NEXT_PUBLIC_TOSHI_AI_WORKER_URL` is absent or empty at build time, the terminal component is not rendered in the DOM — matching the pre-existing absent-key behavior | Must | Building without the env var set results in no terminal element on the page; no console errors | 🟢 |

---

## 6. Non-Functional Requirements

| Type | Requirement | Evidence or rationale | Confidence |
|------|-------------|----------------------|------------|
| Security | The OpenRouter API key must be stored in the worker's secret management system (encrypted at rest), never in plaintext in any file committed to the repository | RN-01 — core security requirement of this feature | 🟢 |
| Security | The worker must reject requests not originating from `https://gtoshinakano.github.io` with `403 Forbidden` before forwarding any data to OpenRouter | RN-03 — strict CORS enforcement prevents unauthorized API usage | 🟢 |
| Performance | End-to-end time from browser submission to first streaming token should not degrade more than 500 ms compared to the direct OpenRouter call baseline | The worker adds one network hop; Cloudflare's edge network minimises added latency | 🟡 |
| Streaming | The worker must not buffer the full OpenRouter response before forwarding; it must use pass-through streaming | RN-05 — buffering would break the incremental terminal UX and increase memory footprint | 🟢 |
| Observability | Worker deployment success/failure is visible in the GitHub Actions run log | Standard CI/CD requirement; Wrangler CLI exit codes propagate to the workflow | 🟡 |
| Maintainability | The worker lives in the same repository (`worker/` directory) so that system prompt updates and frontend changes can be committed and deployed atomically | RN-08 — single pipeline for both artifacts | 🟢 |
| Availability | The worker must be always-on; there is no warm-up delay acceptable since the terminal appears on the portfolio's main page | Cloudflare Workers are serverless with zero cold-start time on the global edge | 🟡 |
| Resilience | If the OpenRouter API does not respond within 30 seconds, the worker must terminate the connection and return a generic error response to the browser; the worker must not hang indefinitely | Open connections consume worker CPU time; 30 s is the practical upper bound for a user waiting in a terminal UI | 🟡 |

---

## 7. Acceptance Criteria

```gherkin
Scenario: Visitor submits a question — happy path
  Given the frontend is deployed with NEXT_PUBLIC_TOSHI_AI_WORKER_URL pointing to the worker
  And the terminal is visible on the page
  When the visitor types "What technologies does Gabriel know?" and submits
  Then the browser sends a POST to the worker URL with body { "question": "What..." } and no Authorization header
  And the worker returns a streaming SSE response
  And the terminal displays the AI answer incrementally

Scenario: CORS rejection from unknown origin
  Given the worker is deployed
  When a POST request arrives with Origin: https://attacker.com
  Then the worker responds with 403 Forbidden
  And no request is forwarded to OpenRouter

Scenario: CORS preflight from portfolio origin
  Given the browser at https://gtoshinakano.github.io sends an OPTIONS preflight
  When the preflight includes Access-Control-Request-Method: POST
  Then the worker responds with 204 and Access-Control-Allow-Origin: https://gtoshinakano.github.io
  And the browser proceeds to send the actual POST request

Scenario: System prompt is not exposed in the browser
  Given the terminal is active
  When a visitor submits a question
  Then browser DevTools shows the request body contains only { "question": "<text>" }
  And no system prompt, profile data, or API key appears in any browser-visible network request

Scenario: OpenRouter API key not present in frontend bundle
  Given the production frontend is built
  When the JavaScript bundles are inspected
  Then no string matching an OpenRouter API key pattern (sk-or-...) is found
  And NEXT_PUBLIC_OPENROUTER_API_KEY does not appear in any chunk

Scenario: Worker absent-configuration guard
  Given the frontend is built without NEXT_PUBLIC_TOSHI_AI_WORKER_URL
  When the page loads
  Then the terminal component is not present in the DOM
  And no network error related to the terminal appears in the console

Scenario: GitHub Actions deploys both artifacts on push
  Given a commit is pushed to the main branch
  When the GitHub Actions workflow runs
  Then both the static site (to GitHub Pages) and the worker (to Cloudflare) are deployed
  And the workflow is marked green only if both deployments succeed

Scenario: Worker call fails (network or OpenRouter error)
  Given the terminal is active and the visitor submits a question
  When the worker or OpenRouter returns an error (any HTTP error, network failure)
  Then the terminal displays a generic error message
  And the question counter is not incremented
  And the input is re-enabled so the visitor may retry
```

---

## 8. MoSCoW Priority

| Item | MoSCoW | Justification |
|------|--------|---------------|
| RF-01 (worker project scaffold) | Must | Foundation for all other requirements |
| RF-02 (POST endpoint accepting question) | Must | Core API surface |
| RF-03 (CORS origin enforcement — 403) | Must | Primary security requirement |
| RF-04 (OPTIONS preflight handling) | Must | Browser will not proceed without it |
| RF-05 (system prompt generated in worker) | Must | Gabriel's profile must stay server-side |
| RF-06 (OpenRouter call with stored key) | Must | Core proxy functionality |
| RF-07 (streaming SSE passthrough) | Must | Terminal UX depends on streaming |
| RF-09 (frontend points to worker, no key) | Must | Closes the key-exposure vulnerability |
| RF-10 (remove old env vars, add new) | Must | Without this the old key remains in the bundle |
| RF-11 (worker deploy step in CI) | Must | Deployment automation required |
| RF-14 (absent-URL guard) | Must | Must not crash when worker URL not configured |
| RF-08 (configurable model in worker) | Should | Allows model changes without frontend rebuild |
| RF-12 (idempotent worker deploy) | Should | Prevents CI failures on re-run |
| RF-13 (single worker for dev and main) | Must | Confirmed: one instance, one CORS origin, shared URL for both branches |
| RNF Performance (< 500 ms added latency) | Should | User perception matters but hard to guarantee |
| RNF Availability (no cold start) | Should | Important for UX but depends on Cloudflare platform |

---

## 9. Clarifications

### Session 2026-05-17

- **Q:** Should there be one Cloudflare Worker for both `main` and `dev` deployments, or two separate workers?
  **R:** A single worker instance serves both branches. Both deployments use the same `NEXT_PUBLIC_TOSHI_AI_WORKER_URL`. The CORS rule for `https://gtoshinakano.github.io` already covers both sub-paths.

- **Q:** What should the Cloudflare Worker be named?
  **R:** `fullstack-profile-ai`. This name will be used in `wrangler.toml` and determines the default workers.dev subdomain. The full URL is pending account credentials.

- **Q:** Should the worker enforce server-side rate limiting?
  **R:** No. The 3-question session limit stays client-side only (MAX_QUESTIONS=3 in the React state). The OpenRouter free-tier model provides sufficient natural cost protection. This is an accepted risk.

- **Q:** Should the worker have its own copy of Gabriel's profile data, or share the JSON files with the frontend?
  **R:** Share the same JSON files (`jobs.json`, `toshi-projects.json`, `stacks.json`). The worker imports them at build/deploy time. This keeps a single source of truth for Gabriel's profile data across both the frontend and the worker.

---

## 10. Gaps

- 🔴 [DÚVIDA] **Full worker URL**: The worker name is confirmed as `fullstack-profile-ai`. The full default URL (`https://fullstack-profile-ai.<ACCOUNT_SUBDOMAIN>.workers.dev`) and the final value of `NEXT_PUBLIC_TOSHI_AI_WORKER_URL` cannot be determined until Cloudflare credentials and account details are provided. This is the only remaining open item; it does not block planning or implementation — it can be supplied as a secret/env var during the first deployment.

> ~~**Server-side rate limiting**~~: Resolved — no server-side rate limiting. Decided in session 2026-05-17.

---

## 11. Change History

| Date | Change | Author |
|------|--------|--------|
| 2026-05-17 | Initial version generated by `/reversa-requirements` | reversa |
| 2026-05-17 | Clarification session: single worker confirmed, name `fullstack-profile-ai`, no rate limiting, shared JSON data source; 4 doubts resolved, 1 remaining | reversa |
