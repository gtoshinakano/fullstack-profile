# Regression Watch — Tech Stack Opinions

> Feature: `006-tech-stack-opinions`
> Identification: `W001–W005`
> Date: `2026-05-20`

---

## Overview

This document tracks critical expectations about feature 006 that must remain true in subsequent re-extractions of the legacy codebase. Each watch item monitors a specific rule, schema change, or behavioral guarantee.

**Watch philosophy:** If a future re-extraction shows red on any item below, it signals a regression in the legacy system that would break feature 006's guarantees.

---

## Primary Watch Items

| ID | Origin | Rule Expected After Change | Type | Signal of Violation |
|----|--------|---------------------------|------|---|
| **W001** | `legacy-impact.md#Component 1` | `src/data/stacks.json` contains 39 stack entries, each with fields: `name`, `src`, `css`, `url`, **`opinion`** (string, non-empty) | presença | Re-extraction shows `opinion` field missing or null for any stack |
| **W002** | `legacy-impact.md#Component 2` | `worker/src/systemPrompt.ts` exports `buildSystemPrompt(): string` that includes opinions in system prompt via `buildTechPerspective()` | presença | Re-extraction shows `buildTechPerspective()` removed or `buildSystemPrompt()` no longer calls it |
| **W003** | `legacy-impact.md#Component 2` | System prompt includes a "## Your Technical Perspective" section with list of stacks and their opinions | redação | Re-extraction shows system prompt lacks this section or section format changed significantly |
| **W004** | `legacy-impact.md#Component 3` | Frontend components (`Projects.tsx`, `Jobs.tsx`, `ToshiAITerminal`) do NOT import or access `opinion` field from stacks.json | ausência | Re-extraction finds `opinion` imported or referenced in src/components/ |
| **W005** | `data-delta.md` | Schema mutation is backward-compatible: stacks without `opinion` field can be read without error by `buildTechPerspective()` | comportamento | Worker crashes or skips stacks when `opinion` is null/undefined |

---

## Watch Item Details

### W001 — All stacks have opinion field

**Check in next re-extraction:**
1. Read `_reversa_sdd/data-dictionary.md`
2. Look for "stacks.json" section
3. Verify it documents `opinion` field in schema
4. Verify it notes all 39 stacks are populated

**Green:** Data dictionary reflects `opinion` field as standard part of stack schema  
**Yellow:** Data dictionary mentions `opinion` but notes it is optional/incomplete  
**Red:** Data dictionary makes no mention of `opinion` field (would indicate data regression)

---

### W002 — Worker includes buildTechPerspective()

**Check in next re-extraction:**
1. Read `_reversa_sdd/code-analysis.md`
2. Look for "Feature 8 — worker" section
3. Verify it documents `buildTechPerspective()` function
4. Verify it documents integration in `buildSystemPrompt()`

**Green:** Code analysis documents the function and its purpose  
**Yellow:** Code analysis mentions opinions but not the specific function name  
**Red:** Code analysis makes no mention of opinions in worker (would indicate function was removed)

---

### W003 — System prompt includes perspectives

**Check in next re-extraction:**
1. Read `_reversa_sdd/code-analysis.md` (worker section)
2. Look for documentation of system prompt structure
3. Verify "Your Technical Perspective" section is documented

**Green:** System prompt structure documents the opinions section  
**Yellow:** System prompt structure changed but opinions still present  
**Red:** System prompt structure makes no mention of opinions (would indicate section was removed)

---

### W004 — Frontend isolation preserved

**Check in next re-extraction:**
1. Read `_reversa_sdd/code-analysis.md` (hero-dark section)
2. Look at imports in `Projects.tsx` and `Jobs.tsx`
3. Verify `opinion` field is NOT imported or used

**Green:** Code analysis confirms frontend accesses only `name`, `src`, `css`, `url`  
**Yellow:** Code analysis notes `opinion` is imported but not actively used  
**Red:** Code analysis shows `opinion` is accessed in frontend components (security regression)

---

### W005 — Schema remains backward-compatible

**Check in next re-extraction:**
1. Read `_reversa_sdd/code-analysis.md` (worker section)
2. Look at error handling in `buildTechPerspective()`
3. Verify it safely handles null/undefined `opinion`

**Green:** Code explicitly checks `stack.opinion && stack.opinion.trim().length > 0`  
**Yellow:** Code checks for null but not for empty strings  
**Red:** Code crashes when `opinion` is null (would indicate the safety check was removed)

---

## Observation Items (non-blocking)

| ID | Item | Note |
|----|------|------|
| **O001** | Opinions quality | Subjective: re-extractions may note if Gabriel's opinions seem inauthentic or outdated. No automatic failure, but triggers discussion. |
| **O002** | System prompt length | Token count of system prompt in future extractions should not exceed ~2000 tokens total (currently ~1000). If it grows significantly, consider breaking opinions into separate prompt section. |

---

## History of Re-extractions

> This section is populated after each `/reversa` run that checks these watch items.

### Re-extração 2026-05-20 11:50

| ID | Veredito | Observação |
|----|----------|------------|
| W001 | 🟢 verde | `src/data/stacks.json` validated: all 39 stacks have non-empty `opinion` field; JSON is syntactically correct |
| W002 | 🟢 verde | `worker/src/systemPrompt.ts` verified: `buildTechPerspective()` function implemented and integrated in `buildSystemPrompt()` |
| W003 | 🟢 verde | System prompt structure validated: "## Your Technical Perspective" section present and formatted correctly in systemPrompt.ts |
| W004 | 🟢 verde | Frontend isolation confirmed: grep search found zero references to `opinion` field in src/components/; frontend only accesses `name`, `src`, `css`, `url` |
| W005 | 🟢 verde | Backward compatibility confirmed: `buildTechPerspective()` safely filters `stack.opinion && stack.opinion.trim().length > 0`, handles null/undefined gracefully |

---

## Archived Items

> Items that were added then resolved or deprecated.

(None yet.)

---

## Maintenance

- Watch items are stable and should not change across re-extractions
- If an item is resolved (e.g., feature behavior changes intentionally), move it to "Archived Items"
- New items can be added if feature 006 evolves (e.g., multilingual opinions, admin UI)
- IDs (W001–W005) are permanent and never reused

