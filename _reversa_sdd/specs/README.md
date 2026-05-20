# Software Design Specifications (SDD) — fullstack-profile

**Generated:** 2026-05-20  
**doc_level:** completo  
**Feature 006 Integration:** ✅ Comprehensive documentation

---

## Overview

This directory contains detailed Software Design Specifications for each module of the fullstack-profile portfolio application. Each spec documents:

- Module purpose and scope
- Data models and schemas
- Key algorithms and functions
- Business rules and constraints
- Feature 006 integration (where applicable)
- Testing and validation strategies
- Performance characteristics
- Dependencies and interactions

---

## Module Specifications

### Module 001: hero-section
**Status:** Not yet documented  
**Type:** Frontend Component (GSAP Animation)  
**Purpose:** Full-viewport animated mountain landscape entry point  
**Feature 006 Impact:** None

### Module 002: hero-dark
**Status:** Not yet documented  
**Type:** Frontend Component (React, GSAP, State Machine)  
**Purpose:** Dark-themed profile section with tab UI and ToshiAITerminal  
**Feature 006 Impact:** ToshiAITerminal calls Worker which uses buildTechPerspective()

### Module 003: main-content
**Status:** Not yet documented  
**Type:** Frontend Component (Static Article)  
**Purpose:** "3-3-3 Principles for Better UX" article  
**Feature 006 Impact:** None

### Module 004: analytics
**Status:** Not yet documented  
**Type:** Frontend Infrastructure (Google Analytics 4)  
**Purpose:** Event tracking for visitor behavior (production-only)  
**Feature 006 Impact:** None

### Module 005: i18n
**Status:** Not yet documented  
**Type:** Frontend Infrastructure (next-i18next)  
**Purpose:** Internationalization for 3 languages (en, ja, pt-BR)  
**Feature 006 Impact:** None (opinions not i18n'd)

### Module 006: layout
**Status:** Not yet documented  
**Type:** Frontend Infrastructure (Page Shell)  
**Purpose:** Shared page layout, head meta, language switcher  
**Feature 006 Impact:** None

### Module 007: data
**Location:** [`module-007-data.md`](./module-007-data.md)  
**Status:** ✅ Complete  
**Type:** Data Layer (Static JSON)  
**Purpose:** Immutable data sources: jobs, projects, stacks, tools  
**Feature 006 Impact:** ✅ stacks.json extended with 39 opinion fields

### Module 008: worker
**Location:** [`module-008-worker.md`](./module-008-worker.md)  
**Status:** ✅ Complete  
**Type:** Backend (Cloudflare Workers Edge Runtime)  
**Purpose:** OpenRouter API proxy, system prompt building  
**Feature 006 Impact:** ✅ Core implementation: buildTechPerspective() function

---

## Cross-Module Dependencies

```
ToshiAITerminal (in Module 002)
    ↓
Module 008 Worker (buildSystemPrompt)
    ↓
Module 007 Data (jobs.json, projects.json, stacks.json)
    ├─ Jobs rendered by Module 002 (Jobs.tsx)
    ├─ Projects rendered by Module 002 (Projects.tsx)
    └─ Opinions formatted by Module 008 (buildTechPerspective)

Frontend Components (Modules 001-006)
    ↓
Module 007 Data (stacks.json, jobs.json, projects.json)
    ├─ Display: name, src, css, url (icons)
    └─ Never access: opinion field (Feature 006)
```

---

## Feature 006 Integration Map

| Module | Specification | Feature 006 Integration |
|--------|---|---|
| 001 hero-section | N/A | None |
| 002 hero-dark | N/A | ToshiAITerminal → Worker (indirect) |
| 003 main-content | N/A | None |
| 004 analytics | N/A | None |
| 005 i18n | N/A | None |
| 006 layout | N/A | None |
| 007 data | ✅ [`module-007-data.md`](./module-007-data.md) | stacks.json opinion field (39 entries) |
| 008 worker | ✅ [`module-008-worker.md`](./module-008-worker.md) | buildTechPerspective() function |

---

## Validation & Testing

### Feature 006 Validation Checklist

- ✅ W001: All 39 stacks have non-empty opinion field
- ✅ W002: buildTechPerspective() function exists and is integrated
- ✅ W003: System prompt includes "Your Technical Perspective" section
- ✅ W004: Frontend isolation: zero references to opinion field in src/components/
- ✅ W005: Backward compatibility: missing opinion gracefully filtered

### Recommended Test Coverage

**Module 007 (Data):**
- [ ] JSON schema validation (39 stacks, all fields present)
- [ ] Opinion field validation (non-empty after trim)
- [ ] Foreign key validation (stacks/tools referenced by jobs/projects exist)
- [ ] Label uniqueness audit (projects.json, find duplicates)

**Module 008 (Worker):**
- [ ] buildTechPerspective filters correctly
- [ ] System prompt building doesn't crash with missing opinions
- [ ] CORS validation rejects unauthorized origins
- [ ] OpenRouter integration handles errors gracefully

---

## Architecture & Design Decisions

### Specification References

- **Architecture Diagram:** `_reversa_sdd/architecture.md`
- **C4 Diagrams:** `_reversa_sdd/c4-*.md`
- **Deployment Architecture:** `_reversa_sdd/deployment-architecture.md`
- **Entity-Relationship Diagram:** `_reversa_sdd/erd-complete.md`
- **Domain & Business Rules:** `_reversa_sdd/domain.md`
- **Architectural Decision Records:** `_reversa_sdd/adrs/`

### Feature 006 Decision Record

**File:** `_reversa_sdd/adrs/006-tech-stack-opinions.md`

**Summary:** Add optional opinion field to stacks.json, integrate into worker system prompt via buildTechPerspective() function. Server-side only (frontend isolation). All 39 stacks populated with authentic Gabriel commentary (May 20, 2026).

---

## Documentation Standards

### Spec Structure

Each module SDD includes:

1. **Header** — Module ID, name, type, status, Feature 006 impact
2. **Purpose** — What the module does and why
3. **Scope** — Clear boundaries of responsibility
4. **Architecture** — High-level design, entry points, responsibilities
5. **Data Models** — Schemas, types, validation rules
6. **Algorithms** — Key functions, pseudocode, complexity analysis
7. **Business Rules** — Constraints, invariants, domain rules
8. **Error Handling** — Failure scenarios, mitigation strategies
9. **Performance** — Scalability, latency, resource usage
10. **Testing** — Unit tests, integration tests, recommended coverage
11. **References** — Links to related documentation

### Confidence Levels

- 🟢 **CONFIRMED** — Extracted directly from code/design
- 🟡 **INFERRED** — Based on patterns and context
- 🔴 **GAP** — Requires clarification or validation

---

## Next Steps

### Immediate (Writer Phase Completion)

- [ ] Complete specs for Modules 001–006 (frontend components)
- [ ] Document interdependencies between modules
- [ ] Create integration test specifications

### Short-term (Reviewer Phase)

- [ ] Cross-validate specs against actual code
- [ ] Check for inconsistencies in naming, terminology, business rules
- [ ] Verify Feature 006 integration completeness

### Long-term (Future Enhancements)

- [ ] Add automation tests matching test specs
- [ ] Create API documentation (OpenAPI/GraphQL if applicable)
- [ ] Document deployment procedures
- [ ] Create runbooks for common operational tasks

---

## Revision History

| Date | Change | Author |
|---|---|---|
| 2026-05-20 | Initial creation with Module 007 & 008 specs | Reversa Writer |
| 2026-05-20 | Feature 006 integration documented | Reversa Writer |

---

## Contact & Questions

For questions about module specifications or Feature 006 integration, refer to:

- **Code Analysis:** `_reversa_sdd/code-analysis.md`
- **Domain Rules:** `_reversa_sdd/domain.md`
- **Decision Records:** `_reversa_sdd/adrs/006-tech-stack-opinions.md`
- **Regression Watch:** `_reversa_forward/006-tech-stack-opinions/regression-watch.md`
