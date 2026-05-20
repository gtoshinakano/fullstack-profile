# ADR 006 — Integrate Technology Opinions into AI System Prompt

**Status:** ACCEPTED  
**Date:** 2026-05-20  
**Decision Maker:** Gabriel Nakano  
**Feature:** 006-tech-stack-opinions  

---

## Context

The ToshiAITerminal (Module 2 child component) allows visitors to ask questions about Gabriel's professional background and technical expertise. The system prompt that guides the AI was constructed from static data (jobs.json, projects.json, stacks.json) but contained only factual project descriptions and timeline information.

When a visitor asks "What do you think about React?" or "What's your opinion on AWS?", the AI had no documented context about Gabriel's authentic perspective on individual technologies. This resulted in AI-generated opinions that were either:

1. **Hallucinated** — fabricated perspectives inconsistent with Gabriel's actual beliefs
2. **Generic** — safe but vague statements about popular technologies

The desired outcome was to:
- Capture Gabriel's authentic opinions on each technology he has used
- Surface these opinions in the AI system prompt so the AI can reference them
- Maintain transparency: opinions documented in the portfolio source, not AI-generated

---

## Decision

**Add an optional `opinion` field to each stack entry in `stacks.json` and integrate these opinions into the Cloudflare Worker's system prompt building process.**

### Implementation Details

1. **Data Schema Extension**
   - Add `opinion: string` field to all 39 stack entries in `src/data/stacks.json`
   - Populate all opinions with authentic Gabriel commentary (1–3 sentences each)
   - Opinion field is optional in type definition but required in actual data

2. **Worker Integration**
   - Create new function `buildTechPerspective(stackRegistry)` in `worker/src/systemPrompt.ts`
   - Function filters stacks where `opinion && opinion.trim().length > 0`
   - Format each opinion as `"Stack Name: [opinion text]"` joined by newlines
   - Insert new `## Your Technical Perspective` section in system prompt after "Technical Skills" section
   - Return empty string if no opinions exist (backward compatible)

3. **Frontend Isolation**
   - Frontend components (Projects.tsx, Jobs.tsx) continue accessing only `name`, `src`, `css`, `url` from stacks.json
   - Opinion field never imported or rendered in browser
   - Server-side only; verified via grep to ensure zero references in `src/components/`

4. **System Prompt Structure** (new section insertion point)
   ```
   About Gabriel
   Work History
   Education
   Projects
   Technical Skills
   ----
   ## Your Technical Perspective (NEW — Feature 006)
   ----
   Hobbies
   Dislikes
   Instructions
   ```

---

## Rationale

### Why Opinions Matter

1. **Authenticity** — AI responses grounded in Gabriel's actual perspective, not hallucinations
2. **Differentiation** — Many portfolios list stacks; fewer explain why they use them
3. **Trust** — Visitors get honest commentary about tool trade-offs, not marketing copy

### Why Server-Side Only

1. **Bundle Size** — Frontend never needs opinions; keeping them server-side avoids client-side bloat
2. **Security** — Opinions are context for AI only; no need to expose them in HTML/CSS
3. **Separation of Concerns** — Frontend renders icons/names (visual); Worker provides context (AI)

### Why Backward Compatible

1. **Missing Field** — `buildTechPerspective()` safely filters missing/empty opinions
2. **Graceful Degradation** — Old deployments without opinion field still work
3. **No Breaking Changes** — Existing frontend code unchanged; worker adds new section, doesn't modify existing sections

### Why Manual Population

1. **Authenticity** — Gabriel personally writes opinions (not AI-generated)
2. **Consistency** — All opinions written in Gabriel's voice, style, perspective
3. **Simplicity** — No automated opinion generation; opinions are data updates

---

## Alternatives Considered

### 1. AI-Generated Opinions
Generate opinions dynamically in the worker using a separate LLM call or template.
- **Pros:** No manual effort, automatic for new stacks
- **Rejected:** Opinions would not be authentic; defeats the purpose of documenting Gabriel's actual perspective

### 2. External Opinion Service
Store opinions in a separate CMS or database, fetched at runtime.
- **Pros:** Decoupled from stacks.json, dynamic updates
- **Rejected:** Adds operational complexity (new database), runtime latency for static generation; existing static-JSON approach simpler

### 3. Opinions Visible in Frontend
Render technology opinions as cards or tooltip in the portfolio UI.
- **Pros:** Visitors see opinions without asking AI
- **Rejected:** Visual clutter on Projects/Jobs sections; opinions are meant as AI context, not design elements. Portfolio focus is visual showcase, not opinion blog.

### 4. Single Opinions Per Category
Group opinions by skill category (frontend frameworks, backend, databases) instead of per-stack.
- **Pros:** Fewer opinions to write
- **Rejected:** AI answers are about specific stacks ("React", "AWS"), not categories. Per-stack opinions enable more precise AI context.

---

## Consequences

### Positive

✅ **AI responses include authentic technical perspective**  
   - Visitors asking about stacks get Gabriel's documented opinion
   - Answers are personalized, not generic

✅ **Frontend unaffected**  
   - No component changes, no re-testing of UI
   - Zero additional browser bundle size

✅ **Backward compatible**  
   - Missing opinion field gracefully filtered
   - Old deployments continue to function

✅ **Data-driven context**  
   - Opinions stored alongside stacks, not hardcoded in worker
   - Easy to audit, update, version control

### Negative

⚠️ **Manual maintenance required**  
   - Opinions must be written by hand and updated if technology perspective changes
   - No automatic updates if stacks are added/removed

⚠️ **Stacks data structure changed**  
   - New field added to stacks.json (minor version bump in data schema)
   - Any external consumer of stacks.json must handle optional opinion field

⚠️ **System prompt grows**  
   - New "Your Technical Perspective" section adds ~1500 tokens to system prompt
   - Estimated total prompt size: ~2000 tokens (acceptable within OpenRouter limits)

### Mitigations

- All 39 stacks pre-populated with opinions (no missing values)
- Validation rule enforced: `stack.opinion && stack.opinion.trim().length > 0`
- Regression watch (BR-14 + watch items W001–W005) ensures opinions don't regress in future code changes

---

## Validation Criteria (Regression Watch Items)

| ID | Rule | Validation | Status |
|----|------|-----------|--------|
| W001 | All 39 stacks have non-empty opinion field | `src/data/stacks.json` has opinion field for all | ✅ Pass |
| W002 | buildTechPerspective() function exists and is integrated | `worker/src/systemPrompt.ts` documents function | ✅ Pass |
| W003 | System prompt includes "Your Technical Perspective" section | System prompt structure includes new section | ✅ Pass |
| W004 | Frontend isolation preserved | grep: zero "opinion" references in src/components/ | ✅ Pass |
| W005 | Backward compatibility maintained | buildTechPerspective() handles null/undefined safely | ✅ Pass |

---

## Related Decisions

- **ADR 005** — Project rebranding: Changed identity to "Full-Stack Developer" (2022)  
- **ADR 004** — Next.js custom image loader: Required for GitHub Pages static export (2024)
- **Feature 003** — ToshiAITerminal: Foundational feature that Feature 006 enhances

---

## Future Considerations

1. **Multilingual Opinions** — If portfolio expands to translate opinions into ja, pt-BR, opinions would need i18n keys
2. **Dated Opinions** — Long-lived portfolio may want to track opinion timeline (e.g., "React opinion as of Q1 2026")
3. **Opinion Admin UI** — If opinions require frequent updates, consider building a simple edit form (currently manual JSON edit only)

---

## Implementation Timeline

| Phase | Date | Status |
|-------|------|--------|
| Feature planning (requirements) | 2026-05-20 | ✅ Complete |
| Roadmap & design | 2026-05-20 | ✅ Complete |
| Task decomposition (actions.md) | 2026-05-20 | ✅ Complete |
| Coding execution (all 11 actions) | 2026-05-20 11:30–11:40 | ✅ Complete |
| Re-extraction & validation | 2026-05-20 12:00+ | ✅ In Progress |

---

## Approval Sign-Off

**Accepted by:** Gabriel Nakano  
**Date:** 2026-05-20  
**Rationale:** Authenticity of AI responses is critical for portfolio credibility. Manual opinion population ensures perspectives are genuine and consistent with Gabriel's voice. Server-side-only implementation maintains visual design separation and avoids frontend bloat.
