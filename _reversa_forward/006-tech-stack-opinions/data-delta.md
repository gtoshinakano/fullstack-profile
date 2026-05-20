# Data Delta: Tech Stack Opinions

> Feature: `006-tech-stack-opinions`
> Affected file: `src/data/stacks.json`
> Date: `2026-05-20`

---

## Schema Changes

### Current Schema (before feature)

```json
{
  "reactjs": {
    "name": "React JS",
    "src": "/img/stacks/reactjs.svg",
    "css": "bg-white",
    "url": ""
  },
  ...
}
```

### New Schema (after feature)

```json
{
  "reactjs": {
    "name": "React JS",
    "src": "/img/stacks/reactjs.svg",
    "css": "bg-white",
    "url": "",
    "opinion": "React is my go-to for interactive frontends. Excellent DX, huge ecosystem, and the mental model is intuitive once you embrace unidirectional data flow."
  },
  ...
}
```

**Field added:**
- `opinion` (optional, string): Gabriel's personal technical perspective on the stack. May contain 1–3 sentences. If absent, field is omitted (backward-compatible).

---

## Data Migrations

**None required.** The schema extension is backward-compatible:

- Existing entries without `opinion` remain valid JSON
- Worker's `systemPrompt.ts` checks for field presence before including it in prose
- No data transformation, no index changes, no deletion

---

## Detailed Field Spec

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `opinion` | string or undefined | false | Gabriel's personal opinion on this technology | `"React is my go-to framework—excellent DX, vibrant community. Overhead for simple projects can be high."` |

**Opinion field rules:**
1. Format: free-form text, 1–3 sentences max
2. Tone: authentic, conversational, technical
3. Scope: Gabriel's genuine assessment, not marketing copy
4. Length: recommended 50–250 characters (soft limit; no hard limit)
5. Mandatory for all 49 stacks once feature is complete

---

## Stacks Affected

All 49 stacks in `src/data/stacks.json` (as documented in `_reversa_sdd/data-dictionary.md#3. stacks.json`):

| ID | Stack | Current Status |
|----|-------|---|
| 1 | aws | ← will receive opinion |
| 2 | bootstrap | ← will receive opinion |
| 3 | css | ← will receive opinion |
| ... | ... | ... |
| 49 | xd | ← will receive opinion |

---

## Data Integrity Checks

Before deploying the worker, validate:

1. **All entries have `opinion` field**: `jq 'to_entries | map(select(.value.opinion == null)) | length' src/data/stacks.json` should return `0`
2. **No empty opinion strings**: `jq 'to_entries | map(select(.value.opinion == "")) | length' src/data/stacks.json` should return `0`
3. **Valid JSON syntax**: `jq empty src/data/stacks.json` should not error
4. **Opinion strings are non-empty**: Each opinion should contain at least 10 characters of actual text (lint rule)

---

## Example Entries

### Before

```json
{
  "reactjs": {
    "name": "React JS",
    "src": "/img/stacks/reactjs.svg",
    "css": "bg-white",
    "url": ""
  },
  "nodejs": {
    "name": "Node.js",
    "src": "/img/stacks/nodejs.svg",
    "css": "bg-black",
    "url": ""
  },
  "aws": {
    "name": "Amazon Web Services",
    "src": "/img/stacks/aws.svg",
    "css": "bg-white",
    "url": ""
  }
}
```

### After

```json
{
  "reactjs": {
    "name": "React JS",
    "src": "/img/stacks/reactjs.svg",
    "css": "bg-white",
    "url": "",
    "opinion": "React is my go-to for interactive frontends. Excellent DX, vibrant ecosystem, unidirectional data flow is intuitive. Overkill for simple projects."
  },
  "nodejs": {
    "name": "Node.js",
    "src": "/img/stacks/nodejs.svg",
    "css": "bg-black",
    "url": "",
    "opinion": "Node.js and Express are my backend defaults. Fast development cycle, JavaScript across the stack, vast npm ecosystem. Requires discipline around async patterns."
  },
  "aws": {
    "name": "Amazon Web Services",
    "src": "/img/stacks/aws.svg",
    "css": "bg-white",
    "url": "",
    "opinion": "AWS is powerful and feature-rich, but the pricing model is complex. Ideal for scalable apps. Requires careful monitoring to avoid bill shock."
  }
}
```

---

## Notes for Implementation

1. **Frontend remains unchanged**: `src/components/views/dev/gabriel/` components read only the `name`, `src`, `css` fields from stacks.json. The `opinion` field is never imported or used by the frontend.

2. **Worker imports entire stacks.json**: The Cloudflare Worker (`worker/src/systemPrompt.ts`) imports the complete stacks.json at build time using `import stacks from '../../src/data/stacks.json' assert { type: 'json' }`, so it has access to the new `opinion` field.

3. **System prompt prose construction**: The worker iterates over stacks, collects those with non-null `opinion` fields, and builds a prose narrative like:
   ```
   "You have strong opinions on the following technologies based on your experience:
   - React is my go-to for interactive frontends. Excellent DX, vibrant ecosystem...
   - Node.js and Express are my backend defaults. Fast development...
   - AWS is powerful but the pricing model is complex..."
   ```

4. **Backward compatibility**: If a stack lacks an `opinion` field (e.g., during initial deploy before all 49 are filled), the worker's code simply skips it: `if (stack.opinion) { /* add to narrative */ }`.

---

## Testing & Validation

1. **Unit test (if added in future)**: JSON schema validation
2. **Manual test**: Edit one opinion in stacks.json, run `wrangler dev` locally, ask ToshiAITerminal about that stack, verify opinion appears in response
3. **CI validation**: GitHub Actions runs `jq` linting before deployment (if configured)

---

## Rollback Plan

If opinions are discovered to be problematic or need wholesale revision:

1. Remove all `opinion` fields from `stacks.json` (revert to previous schema)
2. Revert `worker/src/systemPrompt.ts` to pre-feature version
3. Redeploy worker

No data loss; stacks.json schema extension is non-breaking.
