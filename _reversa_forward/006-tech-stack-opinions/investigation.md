# Investigation: Tech Stack Opinions

> Feature: `006-tech-stack-opinions`
> Research scope: Schema design, system prompt integration patterns, AI behavior guardrails
> Date: `2026-05-20`

---

## Research Summary

This feature extends the existing `stacks.json` data file with an optional `opinion` field, allowing Gabriel to document his authentic perspective on technologies. The implementation leverages the existing Cloudflare Worker (feature 005) infrastructure to incorporate opinions into the system prompt at deploy time, with no runtime overhead or API changes.

---

## Alternatives Evaluated

### Alternative 1: Separate opinions file (`opinions.json`)

**Description:** Create a new file `src/data/opinions.json` with a separate mapping of stack ID → opinion text.

**Pros:**
- Cleaner separation of concerns
- Opinions can be updated independently without touching stacks.json
- Easier to version or archive opinions separately

**Cons:**
- Requires worker to import two files instead of one
- Risk of ID mismatches (opinion for a stack that doesn't exist in stacks.json)
- Adds complexity for Gabriel to maintain two files
- Harder to discover that opinions exist when editing stacks.json

**Decision:** **Rejected.** Inline opinions in stacks.json for simplicity and discoverability. Gabriel edits one file, not two.

---

### Alternative 2: Environment variables or worker secrets

**Description:** Store opinions as encrypted worker secrets (e.g., `OPINION_REACT`, `OPINION_NODEJS`) set via `wrangler secret put`.

**Pros:**
- Secrets are never committed to git
- Decoupling from data files
- Opinions can be rotated independently of code

**Cons:**
- Very tedious to maintain 49 separate secrets
- No easy way to inspect all opinions at a glance
- Overkill for non-sensitive data (opinions are just technical commentary)
- Deployment flow becomes more complex (secrets setup step)

**Decision:** **Rejected.** Opinions are not secrets; they're public technical commentary. JSON is simpler.

---

### Alternative 3: Database table (`stacks_opinions`)

**Description:** Deploy a simple serverless database (e.g., Cloudflare D1, Supabase) with opinions persisted in a table.

**Pros:**
- Scalable for future metadata (not just opinions)
- Could support admin UI for editing opinions live
- Opinions can be updated without redeploying worker

**Cons:**
- Adds external dependency (database service)
- Overkill for a static portfolio
- Breaks the "all data is static JSON" pattern
- Requires authentication/authorization for writes
- Adds latency to worker (database query on every prompt build)

**Decision:** **Rejected.** Portfolio is intentionally static with no database. Worker already reads JSON at deploy time; no need to query at runtime.

---

### Alternative 4: Dynamic prompt endpoint (not applicable)

**Description:** Have the worker fetch opinions from a GitHub API endpoint or separate URL.

**Pros:**
- Opinions can be updated without redeploying worker
- Single source of truth

**Cons:**
- Adds network latency to every AI request
- Requires the endpoint to be available (risk if GitHub is down)
- Contradicts the static/JAMstack architecture

**Decision:** **Rejected.** Build-time integration (opinions bundled at deploy time) is faster and more reliable.

---

## System Prompt Integration Patterns

### Pattern A: Unstructured prose (chosen)

```
"You have strong opinions on the following technologies based on years of experience:
React is my go-to for interactive frontends—excellent DX, huge ecosystem. 
Node.js and Express power my backend work; fast development cycle, JavaScript across the stack.
AWS is powerful but pricing is complex; I use it for production workloads..."
```

**Pros:**
- Reads naturally; AI can weave opinions into conversational responses
- Flexible, allows Gabriel to express nuance in 1–3 sentences per stack
- Easy to parse: just iterate and concatenate

**Cons:**
- No strict structure; AI must infer relationships
- Longer prompt (more tokens)

**Pattern chosen:** ✅ Unstructured prose aligns with Gabriel's preference for natural narrative.

---

### Pattern B: Markdown table (rejected)

```
"Here are your documented opinions on technologies:

| Technology | Opinion |
|---|---|
| React | Your go-to for interactive frontends |
| Node.js | Your backend default with Express |
| AWS | Powerful but pricing is complex |
```

**Cons:**
- Rigid structure; harder for AI to reference naturally
- Takes up more tokens due to table formatting
- Harder for Gabriel to write in this format

---

### Pattern C: Key-value JSON (rejected)

```json
{
  "opinions": {
    "reactjs": "React is my go-to...",
    "nodejs": "Node.js and Express power...",
    ...
  }
}
```

**Cons:**
- Requires JSON parsing in system prompt
- Less natural for AI to read
- Adds cognitive load on Gabriel (JSON syntax)

---

## AI Behavior Guardrails

### Guardrail 1: Fallback for missing opinions

**Decision:** AI informs Gabriel's visitor that no opinion is documented yet.

**Instruction in system prompt:**
> "For technologies where you don't have a documented opinion, respond with something like: 'I don't have a documented opinion on [technology] yet, but it's a solid tool for [use case].' This keeps you authentic and honest."

**Rationale:** Maintains trust. AI doesn't hallucinate opinions Gabriel never wrote.

---

### Guardrail 2: Opinions are descriptive, not prescriptive

**Instruction in system prompt:**
> "Your opinions are your authentic experience, not universal truths. When someone asks what you think about a technology, explain your use case and constraints. For example: 'AWS works great for my scalable applications, but the pricing requires monitoring.' Don't say: 'Everyone should use AWS.'"

**Rationale:** Prevents the AI from sounding dogmatic or selling Gabriel's opinions as objective fact.

---

### Guardrail 3: Opinion scope is technology only

**Instruction in system prompt:**
> "Your documented opinions cover technologies (React, Node.js, AWS, etc.). Don't extend them to people, organizations, or other domains."

**Rationale:** Keeps opinions focused on professional technical assessment.

---

## Sources & References

1. **Cloudflare Workers documentation:** https://developers.cloudflare.com/workers/
   - Server-side environment for deploying code to the edge
   - Supports `import()` with `assert { type: 'json' }` for static JSON bundling

2. **Next.js Data Files pattern:** https://nextjs.org/docs/data-fetching/getting-started
   - Portfolio already uses static JSON files for jobs, projects, stacks
   - Build-time imports are the standard pattern for static sites

3. **System prompts best practices:**
   - OpenAI Cookbook: https://platform.openai.com/docs/guides/prompt-engineering
   - Anthropic Prompt Engineering: https://docs.anthropic.com/guides/prompt-engineering
   - Emphasis on clarity, role definition, and behavioral guardrails in system instructions

4. **Fallback behavior in AI systems:**
   - Research shows users appreciate transparent acknowledgement of limitations over hallucination
   - "I don't know" responses build trust more than fabricated information

---

## Implementation Notes

### Worker code pattern (pseudocode)

```typescript
import stacks from '../../src/data/stacks.json' assert { type: 'json' };

function buildSystemPrompt(): string {
  // ... existing prompt sections (profile, work history, projects) ...
  
  // NEW: Build opinions section
  const stacksWithOpinions = Object.entries(stacks)
    .filter(([_, stack]) => stack.opinion)
    .map(([id, stack]) => `${stack.name}: ${stack.opinion}`);
  
  const opinionsSection = stacksWithOpinions.length > 0 
    ? `\n\nYour Technical Perspective:\n${stacksWithOpinions.join('\n')}`
    : '';
  
  return basePrompt + opinionsSection;
}
```

### Validation (pseudocode)

```bash
# Check all stacks have opinion field
jq 'to_entries | map(select(.value.opinion == null)) | length' src/data/stacks.json
# Should output: 0

# Check no empty opinions
jq 'to_entries | map(select(.value.opinion == "")) | length' src/data/stacks.json
# Should output: 0
```

---

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|-----------|
| Opinion text is empty/null for some stacks | Medium | Low | Validation before deploy; linting in CI |
| AI hallucinates opinions not in the file | Low | Medium | System prompt includes explicit guardrail ("I don't have an opinion on...") |
| Opinion text is too long, exceeds token limit | Low | Low | 49 stacks × 3 sentences ≈ 500–1000 tokens; system prompt budget is healthy |
| Opinions contradict each other | Low | Low | Gabriel's responsibility; code review catches obvious errors |
| Frontend accidentally exposes opinions | Low | Medium | Frontend never imports stacks.json; worker is the only consumer |

---

## Future Enhancements

1. **Opinion versioning:** Track opinion edit history (via git commits)
2. **Admin UI:** Build a simple web interface for Gabriel to edit opinions live (vs. editing JSON manually)
3. **Opinion scoring:** Add confidence levels or tags (e.g., "pros", "cons") per opinion
4. **Dynamic updates:** Move opinions to a database and fetch at runtime (requires architectural change)
5. **Multilingual opinions:** Translate opinions to ja, pt-BR alongside i18n

None of these are in scope for feature 006. They're future directions if the feature proves useful.
