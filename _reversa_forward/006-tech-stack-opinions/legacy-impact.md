# Legacy Impact — Tech Stack Opinions

> Feature: `006-tech-stack-opinions`
> Date: `2026-05-20`
> Execution: `/reversa-coding` — all 11 actions completed successfully ✅

---

## Summary

Feature 006 extends the data model (`stacks.json`) with an optional `opinion` field for each technology and updates the Cloudflare Worker's system prompt generation to include these opinions. **Zero breaking changes.** Frontend remains untouched. Backward-compatible with existing deployments.

---

## Affected Components

| File | Component (from `_reversa_sdd/`) | Type of Change | Severity | Justification |
|------|----------------------------------|---|---|---|
| `src/data/stacks.json` | Data layer — Tech Stack Registry | **delta-de-dados** | MEDIUM | Added optional `opinion: string` field to 39 stack entries. Existing fields unchanged. Non-breaking. |
| `worker/src/systemPrompt.ts` | Cloudflare Worker — System Prompt Builder | **regra-alterada** | MEDIUM | Added `buildTechPerspective()` function and integrated opinions into system prompt. Worker behavior changes, but only in prompt content (richer context for AI). |
| `src/components/views/dev/gabriel/HeroDark/` | ToshiAITerminal & Jobs & Projects | **nenhuma** | LOW | No changes. Frontend continues using only `name`, `src`, `css`, `url` fields. `opinion` remains server-side only. |

---

## Component-by-Component Analysis

### 1. Data Layer — `src/data/stacks.json`

**Original schema:**
```json
{
  "reactjs": {
    "name": "ReactJS",
    "src": "/img/stacks/reactjs.svg",
    "css": "",
    "url": ""
  }
}
```

**New schema:**
```json
{
  "reactjs": {
    "name": "ReactJS",
    "src": "/img/stacks/reactjs.svg",
    "css": "",
    "url": "",
    "opinion": "React is my go-to for building interactive user interfaces..."
  }
}
```

**Impact:** Schema extended with optional field. All 39 stacks now have `opinion` populated with Gabriel's authentic perspective. **Backward compatible** — missing `opinion` field would be gracefully filtered by worker code.

**Affected rule from `_reversa_sdd/domain.md`:**
- ✅ **BR-04** preserved: "Projects always display newest-first" — no change to project/job ordering logic

---

### 2. Cloudflare Worker — `worker/src/systemPrompt.ts`

**New function:**
```typescript
function buildTechPerspective(stackRegistry: StackRegistry): string {
  const stacksWithOpinions = Object.entries(stackRegistry)
    .filter(([_, stack]) => stack.opinion && stack.opinion.trim().length > 0)
    .map(([_, stack]) => `${stack.name}: ${stack.opinion}`)
  
  if (stacksWithOpinions.length === 0) return ''
  
  return `\n## Your Technical Perspective\n...\n${stacksWithOpinions.map((s) => `- ${s}`).join('\n')}`
}
```

**Integration:**
- Added after "## Technical Skills" section in system prompt
- Called unconditionally; returns empty string if no opinions exist
- Safely handles null/undefined/empty opinion fields

**Impact on AI behavior:**
- System prompt is now richer with Gabriel's documented opinions
- AI can reference these opinions when answering questions about technologies
- Fallback behavior: if visitor asks about stack without opinion, AI was instructed to acknowledge the gap ("I don't have a documented opinion on that yet")

**Affected rule from `_reversa_sdd/domain.md`:**
- ✅ **BR-02** preserved: "Responsive breakpoint is aspect ratio, not viewport width" — no change to rendering logic
- ✅ **BR-03** preserved: "Tab changes are locked during animations" — no change to terminal UI logic

---

### 3. Frontend Components (NO CHANGES)

**Files verified but untouched:**
- `src/components/views/dev/gabriel/HeroDark/ToshiAITerminal/index.tsx` — Terminal UI
- `src/components/views/dev/gabriel/HeroDark/Jobs.tsx` — Work history display
- `src/components/views/dev/gabriel/HeroDark/Projects.tsx` — Project accordion

**Verification:**
- ✅ No imports of `opinion` field
- ✅ Frontend continues reading only `name`, `src`, `css`, `url` from stacks.json
- ✅ No bundle bloat from opinions

---

## Rules Preserved (🟢 from `_reversa_sdd/domain.md`)

| Rule | Status | Notes |
|------|--------|-------|
| **BR-01** — Page renders only after Pace.js done | ✅ Preserved | No change to loading behavior |
| **BR-02** — Responsive breakpoint is aspect ratio | ✅ Preserved | No change to responsive logic |
| **BR-03** — Tab changes locked during animations | ✅ Preserved | No change to animation locking |
| **BR-04** — Projects display newest-first | ✅ Preserved | No change to ordering |
| **BR-05** — Education hardcoded in JSX | ✅ Preserved | No change to education display |
| **BR-06** — Education visible by default | ✅ Preserved | No change to education toggle |

---

## Rules Modified

| Rule | Original | Modified | Impact |
|------|----------|----------|--------|
| (none) | — | — | Feature adds new data (`opinion`), does not modify existing rules. |

---

## External Integrations Affected

| Integration | Change | Status |
|---|---|---|
| Cloudflare Worker `fullstack-profile-ai` | System prompt now includes opinions section | ✅ Forward compatible — opinions enhance context without breaking existing behavior |
| OpenRouter API | No change | ✅ No impact |
| GitHub Pages | No change | ✅ No impact |
| GitHub Actions CI/CD | No change (feature 005 already handles worker deploy) | ✅ No impact |

---

## Data Migration

**None required.** Schema extension is additive; no data transformation or backfill needed. Worker handles missing `opinion` field gracefully (filters it out).

---

## Risk Mitigation

| Risk | Original | Mitigation | Status |
|------|----------|-----------|--------|
| Opinion field left null for some stacks | Medium | All 39 stacks populated; validation in place | ✅ Addressed |
| Frontend accidentally accesses opinion | Medium | Verified: frontend never imports opinion field | ✅ Verified |
| System prompt becomes too long | Low | 39 stacks × ~50–200 chars ≈ 1500 tokens; acceptable margin | ✅ Acceptable |
| TypeScript compilation error | Low | Code validated; no type errors | ✅ Validated |

---

## Deliverables Checklist

- ✅ `src/data/stacks.json` — All 39 stacks with opinion field
- ✅ `worker/src/systemPrompt.ts` — buildTechPerspective() function implemented and integrated
- ✅ `actions.md` — All 11 actions marked `[X]`
- ✅ Frontend unchanged — no component modifications
- ✅ Backward compatible — optional schema extension

---

## Next Steps for Re-extraction

When `/reversa` is run again (re-extraction), verify:
1. **`_reversa_sdd/data-dictionary.md`** — Should reflect new `opinion` field in stacks.json schema
2. **`_reversa_sdd/architecture.md`** — Should note that Worker's system prompt now includes opinions
3. **`_reversa_sdd/code-analysis.md`** — Should document the new `buildTechPerspective()` function
4. **`regression-watch.md`** entries — Should all remain 🟢 (no regressions)
