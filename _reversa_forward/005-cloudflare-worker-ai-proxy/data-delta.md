# Data Delta: Cloudflare Worker — Toshi AI Proxy

> Feature: `005-cloudflare-worker-ai-proxy`
> Date: `2026-05-17`
> Source model: `_reversa_sdd/data-dictionary.md`

---

## Summary

No new database, no persistent storage, no schema migration. The only data change is that three existing JSON files previously used exclusively by the frontend are now also consumed by the Cloudflare Worker at deploy time.

---

## Existing Data Files — Status After This Feature

| File | Previous consumers | New consumers | Change |
|------|--------------------|---------------|--------|
| `src/data/jobs.json` | `Jobs.tsx` (frontend) | `Jobs.tsx` + Cloudflare Worker (`worker/src/systemPrompt.ts`) | No structural change. Bundled into worker at deploy. |
| `src/data/toshi-projects.json` | `Projects.tsx` (frontend) | `Projects.tsx` + Cloudflare Worker | No structural change. Bundled into worker at deploy. |
| `src/data/stacks.json` | `Jobs.tsx`, `Projects.tsx` | Both + Cloudflare Worker | No structural change. Bundled into worker at deploy. |
| `src/data/swtools.json` | `Jobs.tsx` | `Jobs.tsx` only — NOT imported by worker | No change. System prompt does not require tool-level detail. |

---

## Environment Variables — Delta

### Removed from Frontend

| Variable | Was | Reason |
|----------|-----|--------|
| `NEXT_PUBLIC_OPENROUTER_API_KEY` | OpenRouter API key baked in frontend bundle | Moved to Cloudflare Worker secret storage (RN-01) |
| `NEXT_PUBLIC_OPENROUTER_MODEL` | Model identifier baked in frontend bundle | Moved to Cloudflare Worker secret storage (RN-02) |

### Added to Frontend

| Variable | Value | Where set |
|----------|-------|-----------|
| `NEXT_PUBLIC_TOSHI_AI_WORKER_URL` | `https://fullstack-profile-ai.<ACCOUNT>.workers.dev` | `.env.local` (local dev), GitHub Actions secret `NEXT_PUBLIC_TOSHI_AI_WORKER_URL` (CI) |

### New Worker Secrets (not in `wrangler.toml`)

| Secret | Description | Set via |
|--------|-------------|---------|
| `OPENROUTER_API_KEY` | OpenRouter API key, never in source files | `wrangler secret put OPENROUTER_API_KEY` |
| `OPENROUTER_MODEL` | Model identifier (e.g., `google/gemini-2.0-flash-exp:free`) | `wrangler secret put OPENROUTER_MODEL` |

---

## Files Added

| File | Location | Role |
|------|----------|------|
| `worker/wrangler.toml` | repo root → `worker/` | Cloudflare Worker configuration |
| `worker/package.json` | repo root → `worker/` | Worker npm dependencies (wrangler dev dep only) |
| `worker/tsconfig.json` | repo root → `worker/` | TypeScript config with `resolveJsonModule: true` |
| `worker/src/index.ts` | `worker/src/` | Worker entry point: CORS, routing, OpenRouter call, SSE passthrough |
| `worker/src/systemPrompt.ts` | `worker/src/` | Builds system prompt from imported JSON data |

## Files Modified

| File | Change |
|------|--------|
| `src/components/views/dev/gabriel/HeroDark/ToshiAITerminal/useOpenRouterStream.ts` | Call target URL, request body shape, remove Authorization header |
| `src/components/views/dev/gabriel/HeroDark/ToshiAITerminal/index.tsx` | Guard env var name |
| `.github/workflows/deploy.yml` | New worker deploy step; env var section updated |
| `.env.local.example` | Vars replaced |

## Files Removed (conceptually)

| File | Action |
|------|--------|
| `src/components/views/dev/gabriel/HeroDark/ToshiAITerminal/systemPrompt.ts` | Kept for local dev reference but no longer called in production flow. Can optionally be deleted or retained. |

---

## No Migrations Required

- No database schemas to migrate
- No persistent user data affected
- No breaking changes to existing JSON file structures
- No locale/i18n files affected
