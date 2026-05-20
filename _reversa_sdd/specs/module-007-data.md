# SDD — Module 007: Data Layer

**Module ID:** 007  
**Module Name:** data  
**Type:** Data Layer (Static JSON)  
**Status:** Active  
**Last Updated:** 2026-05-20  
**Feature 006 Status:** ✅ Integrated (stacks.json extended with opinions)

---

## Module Purpose

Provide immutable, author-managed static data sources for portfolio content. No database, no runtime fetching — all data is imported as ES modules at build time and embedded in the application bundle.

---

## Scope

| Data File | Records | Purpose | Feature 006 Impact |
|-----------|---------|---------|-------------------|
| `src/data/jobs.json` | 5 | Work history timeline | None |
| `src/data/toshi-projects.json` | 19 | Portfolio projects | None |
| `src/data/stacks.json` | 39 | Technology registry | ✅ Added `opinion` field |
| `src/data/swtools.json` | ~15 | Software tools | None |

---

## Data Schema

### jobs.json

**Purpose:** Work history entries, oldest-first (reversed by consumers for newest-first display)

**Location:** `src/data/jobs.json`

**Record Count:** 5

**Schema:**
```typescript
interface JobEntry {
  company: string;           // e.g., "AXA Life Japan"
  job_name: string;          // e.g., "FullStack Engineer"
  period: [string, string];  // ["Apr 2022", "Apr 2025"]
  description: string;       // Currently always "" (unused)
  image: string;             // Logo path: /img/dev/gabriel/logos/{name}.{ext}
  stacks: string[];          // Stack IDs: ["reactjs", "aws", "vite"]
  tools: string[];           // Tool IDs: ["vscode", "nodejs", "github"]
}
```

**Example:**
```json
{
  "company": "AXA Life Japan",
  "job_name": "FullStack Engineer",
  "period": ["Apr 2022", "Apr 2025"],
  "description": "",
  "image": "/img/dev/gabriel/logos/axa.svg",
  "stacks": ["reactjs", "aws", "sonarqube", "git", "vite"],
  "tools": ["vscode", "nodejs", "postman", "github", "jira", "jenkins"]
}
```

**Validation Rules:**
- `period` must have exactly 2 elements
- `stacks` and `tools` must reference valid IDs from their respective registries
- `image` path must exist in `/public/img/dev/gabriel/logos/`

---

### toshi-projects.json

**Purpose:** Portfolio project showcase with problem/solution narrative, newest-first

**Location:** `src/data/toshi-projects.json`

**Record Count:** 19

**Schema:**
```typescript
interface ProjectEntry {
  period: string[];          // ["Month Year", "Month Year"] OR ["Month", "Year"]
  type: "personal" | "job" | "volunteer" | "freelance" | "open source";
  title: string;             // Project name
  subtitle: string;          // Context/organization
  learnings: string;         // Key takeaway
  country: string;           // Emoji: 🇧🇷, 🇯🇵, etc.
  where: string;             // Location/venue
  public: string;            // Intended audience
  problem: string;           // Problem statement (long)
  solution: string;          // Solution description (long)
  stacks: string[];          // Stack IDs
  cover: object;             // {} (always empty)
  action: {
    url: string;             // External link or ""
  };
  label: string;             // Accordion expand/collapse key ⚠️ NOT UNIQUE
}
```

**Known Issues:**
- ⚠️ **CRITICAL:** `label` field is not unique. 5 projects share `"requirement"`:
  - AXA requirement design
  - AXA NBWF
  - local-file-uploader
  - web-template-string
  - underwriting improvement
- When one is clicked, all 5 expand/collapse together (accordion bug)

**Validation Rules:**
- `label` field should be unique (currently not enforced)
- `period` format inconsistent (some: `["Month Year", "Month Year"]`, others: `["Month", "Year"]`)
- `stacks` must reference valid stack IDs

---

### stacks.json (Feature 006 Updated)

**Purpose:** Central technology registry with authentic Gabriel opinions

**Location:** `src/data/stacks.json`

**Record Count:** 39

**Schema (Feature 006):**
```typescript
interface StackEntry {
  name: string;              // Display name: "ReactJS", "Amazon Web Services"
  src: string;               // Icon path: /img/stacks/{id}.svg
  css: string;               // Tailwind class for icon background: "bg-white" | ""
  url: string;               // External link (currently always "")
  opinion: string;           // Feature 006: Gabriel's perspective (1–3 sentences)
}
```

**Example:**
```json
{
  "reactjs": {
    "name": "ReactJS",
    "src": "/img/stacks/reactjs.svg",
    "css": "",
    "url": "",
    "opinion": "React is my go-to for building interactive user interfaces. The component model and hooks system make code cleaner and more reusable than older jQuery patterns. Pair it with TypeScript and you have a solid foundation."
  }
}
```

**Feature 006 Details:**

| Aspect | Specification |
|--------|---|
| **Field Name** | `opinion` |
| **Type** | string (required, non-empty after trim) |
| **Content** | 1–3 sentences of Gabriel's authentic technical perspective |
| **Validation** | `opinion && opinion.trim().length > 0` |
| **Population** | All 39 stacks manually populated (2026-05-20) |
| **Consumer** | Cloudflare Worker `buildTechPerspective()` function only |
| **Frontend Access** | NEVER — isolated server-side |
| **Version Control** | Git-tracked; changes via author commits |

**Stack IDs (39 total):**

**Languages:** java, php, html, css, javascript, typescript, python, sql

**Frontend:** reactjs, nextjs, jquery, bootstrap, semantic-ui, styled-components, tailwind

**Backend:** express, fastify, sonarqube

**Cloud:** aws, firebase, vite, git

**Google Products:** google-analytics, google-apps-script, google-charts, google-maps, google-spreadsheets

**State Management:** redux, react-query, i18n, gsap

**Tools:** mysql, drawio, excel, camunda, ubuntu

**Validation Rules:**
- All 39 stacks MUST have non-empty `opinion` field
- Icon path must exist in `/public/img/stacks/`
- Opinion field is optional in TypeScript type but required in actual data (enforced by validation)

---

### swtools.json

**Purpose:** Software tools registry (same schema as pre-Feature-006 STACK)

**Location:** `src/data/swtools.json`

**Record Count:** ~15 (inferred; not documented)

**Schema:**
```typescript
interface ToolEntry {
  name: string;
  src: string;
  css: string;
}
```

**Tool IDs:** atom, dreamweaver, figma, fireworks, github, illustrator, jira, jenkins, mysql-front, netbeans, nodejs, postman, vscode, workbench, xd

---

## Data Relationships

### Reference Graph

```
jobs.json ─┬─→ stacks.json (by id)
           └─→ swtools.json (by id)

toshi-projects.json ──→ stacks.json (by id)

Both (job + project stacks) ──→ stacks.json entries
                                 ├─→ name, src, css (displayed in UI)
                                 └─→ opinion (Feature 006: AI context only)
```

### Foreign Key Validation

| Relationship | Enforcement | Status |
|---|---|---|
| job.stacks[*] → stacks.json keys | Manual (no FK) | 🟢 All 5 jobs reference valid stacks |
| job.tools[*] → swtools.json keys | Manual (no FK) | 🟡 Not validated; missing tools render undefined |
| project.stacks[*] → stacks.json keys | Manual (no FK) | 🟢 All 19 projects reference valid stacks |

---

## Feature 006 Integration Points

### Data Flow: stacks.json → buildTechPerspective()

```
stacks.json (all 39 entries)
    ↓
[Imported by worker at build-time]
    ↓
buildSystemPrompt()
    ↓
buildTechPerspective(stackRegistry)
    ├─ Iterate over entries
    ├─ Filter: opinion && opinion.trim().length > 0
    ├─ Format: "Stack Name: opinion text"
    └─ Output: "## Your Technical Perspective\n- Stack1: ...\n- Stack2: ..."
    ↓
[Inserted into system prompt after Technical Skills section]
    ↓
[Sent to OpenRouter for AI inference]
```

### Frontend Isolation (BR-14)

**Rule:** Frontend components NEVER access `opinion` field

**Verification:**
- grep "opinion" src/components/ → 0 results ✅
- Projects.tsx imports: name, src, css, url only
- Jobs.tsx imports: name, src, css, url only
- ToshiAITerminal uses Worker (server-side), not stacks.json directly

---

## Data Governance

### Author Responsibility

| Action | Frequency | Owner |
|--------|-----------|-------|
| Add new stack | On first use in project | Gabriel |
| Update opinion | When perspective changes | Gabriel |
| Retire stack | Remove from active projects | Gabriel |
| Fix duplicate label (BR-07) | One-time (planned) | Gabriel |

### Data Validation Checklist

| File | Check | Tool | Status |
|------|-------|------|--------|
| stacks.json | Valid JSON syntax | `jq empty` | ✅ Pass |
| stacks.json | All 39 stacks have opinion | Custom validation | ✅ Pass |
| stacks.json | No opinion field empty after trim() | Custom validation | ✅ Pass |
| stacks.json | Icon paths exist | Manual check | 🟡 Not automated |
| jobs.json | All stacks reference stacks.json | Manual check | ✅ Pass |
| projects.json | All stacks reference stacks.json | Manual check | ✅ Pass |
| projects.json | Label uniqueness | Manual audit | 🔴 5 duplicates (BR-07) |

---

## Performance Characteristics

| Metric | Value | Impact |
|--------|-------|--------|
| stacks.json file size | ~15 KB | Negligible impact on bundle |
| Build-time import | < 100ms | Negligible impact on build time |
| Runtime memory (stacks) | < 1 MB | Negligible impact on memory |
| Opinion character count | 39 × 50–200 chars = ~4–8 KB | System prompt grows by ~1500 tokens |

---

## Future Considerations

### Potential Enhancements

1. **Opinion Versioning** — Track opinion history as Gabriel's perspective evolves
2. **i18n Opinions** — Translate opinions into ja, pt-BR for international recruiters
3. **Dated Opinions** — Associate opinions with quarters/years (e.g., "React opinion as of Q2 2026")
4. **Opinion Confidence** — Flag opinions as "expert", "intermediate", "novice" (metadata)
5. **Admin UI** — Web form to edit opinions without manual JSON editing

### Migration Path

- Current: Manual JSON edits via GitHub commits
- Future v2: Admin dashboard with opinion editor
- Trigger: When opinions become too frequent to manage via JSON

---

## Module Dependencies

### Imports (consumed by)

- `src/components/views/dev/gabriel/HeroDark/Jobs.tsx` → jobs.json
- `src/components/views/dev/gabriel/HeroDark/Projects.tsx` → toshi-projects.json
- `worker/src/systemPrompt.ts` → jobs.json, toshi-projects.json, stacks.json, swtools.json (build-time)

### Exported

- jobs.json (5 entries)
- toshi-projects.json (19 entries)
- stacks.json (39 entries)
- swtools.json (~15 entries)

---

## Testing & Validation

### Unit Tests (recommended, currently absent)

```typescript
describe("stacks.json", () => {
  it("should have exactly 39 entries", () => {
    expect(Object.keys(stacks)).toHaveLength(39);
  });

  it("should have opinion field on all stacks", () => {
    Object.values(stacks).forEach(stack => {
      expect(stack.opinion).toBeDefined();
      expect(stack.opinion.trim().length).toBeGreaterThan(0);
    });
  });

  it("should have valid icon paths", () => {
    Object.values(stacks).forEach(stack => {
      expect(stack.src).toMatch(/\.svg|\.png|\.jpg/);
    });
  });
});

describe("toshi-projects.json", () => {
  it("should have unique labels", () => {
    const labels = projects.map(p => p.label);
    const unique = new Set(labels);
    expect(unique.size).toBe(projects.length);
  });
});
```

### Regression Watch (Feature 006)

| Watch ID | Rule | Status | Last Verified |
|---|---|---|---|
| W001 | All 39 stacks have opinion | 🟢 Pass | 2026-05-20 11:50 |
| W002 | buildTechPerspective() exists | 🟢 Pass | 2026-05-20 11:50 |
| W003 | System prompt has perspectives section | 🟢 Pass | 2026-05-20 11:50 |
| W004 | Frontend doesn't access opinion | 🟢 Pass | 2026-05-20 11:50 |
| W005 | Backward compatibility maintained | 🟢 Pass | 2026-05-20 11:50 |

---

## Documentation References

- **Architecture:** `_reversa_sdd/architecture.md`
- **Domain:** `_reversa_sdd/domain.md` (BR-14: opinions server-side only)
- **ERD:** `_reversa_sdd/erd-complete.md` (STACK entity schema)
- **Deployment:** `_reversa_sdd/deployment-architecture.md` (data flow diagram)
- **ADR-006:** `_reversa_sdd/adrs/006-tech-stack-opinions.md` (design decision)
