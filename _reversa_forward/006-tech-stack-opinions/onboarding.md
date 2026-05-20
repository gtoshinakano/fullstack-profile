# Onboarding: Tech Stack Opinions

> Feature: `006-tech-stack-opinions`
> For: Gabriel (author) and testers
> Date: `2026-05-20`

---

## Quick Start

**Feature goal:** Add personal opinions about tech stacks to `stacks.json`, so the AI terminal can reference your perspective when visitors ask about technologies.

**Time to test:** ~15 minutes

---

## Prerequisites

- [ ] Local repo cloned with feature branch checked out
- [ ] Node.js 18+ installed
- [ ] Cloudflare account with Wrangler CLI installed (`npm install -g wrangler`)
- [ ] `NEXT_PUBLIC_TOSHI_AI_WORKER_URL` set in `.env.local` (points to your local or deployed worker)

---

## Step 1: Inspect Current stacks.json

Open `src/data/stacks.json` in your editor. You'll see entries like:

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

**Notice:** No `opinion` field yet. That's what we're adding.

---

## Step 2: Add Opinion to One Stack (Test Entry)

Edit the `reactjs` entry in `stacks.json`:

```json
{
  "reactjs": {
    "name": "React JS",
    "src": "/img/stacks/reactjs.svg",
    "css": "bg-white",
    "url": "",
    "opinion": "React is my go-to for interactive frontends. Excellent DX, vibrant ecosystem, unidirectional data flow is intuitive. Overhead for simple projects can be high."
  },
  ...
}
```

Save the file.

---

## Step 3: Add Opinion to a Few More Stacks (Optional)

Add opinions to at least 2–3 more stacks you know well, e.g.:

**nodejs:**
```json
"opinion": "Node.js and Express are my backend defaults. Fast development cycle, JavaScript across the stack, vast npm ecosystem. Requires discipline around async patterns."
```

**typescript:**
```json
"opinion": "TypeScript is essential for large projects. The type system catches errors early; the development experience is significantly better than plain JavaScript."
```

**aws:**
```json
"opinion": "AWS is powerful and feature-rich, ideal for scalable applications. The pricing model is complex; requires monitoring to avoid bill shock."
```

---

## Step 4: Update the Worker's systemPrompt.ts

Navigate to `worker/src/systemPrompt.ts` and locate the function that builds the system prompt (likely `buildSystemPrompt()` or similar).

**Current code (before feature):**
```typescript
function buildSystemPrompt(): string {
  // imports stacks.json
  // builds string with profile, jobs, projects
  return systemPromptString;
}
```

**Updated code (feature):**
```typescript
import stacks from '../../src/data/stacks.json' assert { type: 'json' };

function buildSystemPrompt(): string {
  // ... existing code for profile, jobs, projects ...
  
  // NEW: Add opinions section
  const stacksWithOpinions = Object.entries(stacks)
    .filter(([_, stack]) => stack.opinion && stack.opinion.trim().length > 0)
    .map(([id, stack]) => `• ${stack.name}: ${stack.opinion}`)
    .join('\n');
  
  const opinionsSection = stacksWithOpinions.length > 0 
    ? `\n\n## Your Technical Perspective\n\nYou have strong opinions on the following technologies based on your professional experience:\n${stacksWithOpinions}`
    : '';
  
  return systemPromptString + opinionsSection;
}
```

Save the file.

---

## Step 5: Test Locally with Wrangler Dev

1. **Start the worker in dev mode:**
   ```bash
   cd worker
   wrangler dev
   ```
   The worker should start on `http://localhost:8787` (or similar port).

2. **In another terminal, start the Next.js frontend:**
   ```bash
   npm run dev
   ```
   Frontend runs on `http://localhost:3000`.

3. **Open the portfolio in your browser:** `http://localhost:3000`

4. **Navigate to the ToshiAITerminal** (scroll to HeroDark section, click "Profile" or "Message" tab if needed to see the terminal).

---

## Step 6: Test Happy Path

**Test 1: Ask about a stack WITH opinion**

In the terminal, type:
```
What do you think about React?
```

**Expected:** The AI response should incorporate your documented opinion about React from `stacks.json`. E.g., "React is my go-to for interactive frontends. Excellent DX, vibrant ecosystem..."

**Verify in browser DevTools:**
1. Open DevTools → Network tab
2. Filter for requests to `localhost:8787` (or your worker URL)
3. Look at the `POST` request body — should be `{ "question": "What do you think about React?" }`
4. Look at the response — should be SSE stream with AI answer mentioning your React opinion

---

## Step 7: Test Fallback Path

**Test 2: Ask about a stack WITHOUT opinion**

In the terminal, type:
```
What about Ruby on Rails?
```

(Assuming `ruby` or `rails` entry in stacks.json has no opinion yet.)

**Expected:** AI should respond honestly with something like: "I don't have a documented opinion on Rails yet, but it's a solid web framework known for developer productivity."

**Verify:** Response should NOT make up fake opinions for you; should acknowledge the gap gracefully.

---

## Step 8: Test Persistence

**Test 3: Edit an opinion and re-test**

1. Edit the `nodejs` opinion in `stacks.json` to something different, e.g.: "Node.js is powerful, though I prefer Python for data science tasks."
2. Stop the worker (`Ctrl+C`)
3. Restart with `wrangler dev` — worker reloads stacks.json
4. In the terminal, ask: `What's your take on Node.js?`
5. **Expected:** AI response uses the NEW opinion you just edited

**Verify:** The worker picked up the change without needing to redeploy. (Local `wrangler dev` reloads on file changes.)

---

## Step 9: Validate JSON Schema

Before committing, ensure all entries are valid JSON:

```bash
# In the project root
jq empty src/data/stacks.json
# Should output nothing (no error)

# Count stacks with opinions
jq '[.[] | select(.opinion)] | length' src/data/stacks.json
# Should output a number ≥ 0
```

---

## Step 10: Manual Review Checklist

- [ ] All opinions are authentic and sound like Gabriel's voice
- [ ] No opinions are longer than 3 sentences
- [ ] All opinions are on technologies only (not people, organizations, etc.)
- [ ] No typos or grammatical errors (spell-check if needed)
- [ ] JSON is valid (`jq empty` passes)
- [ ] Frontend still works (no 404 errors in DevTools)
- [ ] Worker redeploy doesn't error in CI/CD logs

---

## Troubleshooting

### Issue: Worker fails to import stacks.json

**Error:** `Module not found: stacks.json`

**Cause:** Path to stacks.json is wrong or file doesn't exist.

**Fix:** Check the import path in `worker/src/systemPrompt.ts`. Should be:
```typescript
import stacks from '../../src/data/stacks.json' assert { type: 'json' };
```

---

### Issue: AI response doesn't mention opinions

**Cause:** `buildSystemPrompt()` is not including the opinions section.

**Fix:**
1. Check that `stacks.json` has `opinion` fields (not null or empty)
2. Check that `systemPrompt.ts` has the new opinions-building code
3. Check worker logs: `wrangler tail` should show no errors

---

### Issue: Terminal is empty, no responses from AI

**Cause:** Worker URL not set or unreachable.

**Fix:**
1. Check `.env.local` has `NEXT_PUBLIC_TOSHI_AI_WORKER_URL=http://localhost:8787`
2. Check worker is running: `wrangler dev` should show "Ready on http://localhost:8787"
3. Check browser DevTools → Network tab for failed requests to worker

---

### Issue: Opinions are visible in frontend JavaScript bundle

**Cause:** Frontend is accidentally importing stacks.json.

**Fix:**
1. Check that no component in `src/components/` imports stacks.json directly
2. Opinions should ONLY be imported by the worker
3. Grep to verify: `grep -r "import.*stacks" src/components/` should return nothing related to opinions

---

## When Satisfied

1. Commit your `src/data/stacks.json` changes (with opinions for all or most stacks)
2. Commit your `worker/src/systemPrompt.ts` changes
3. Push to feature branch
4. GitHub Actions runs; worker deploys to Cloudflare
5. Visit the live portfolio and test again with the deployed worker

Congratulations, feature 006 is live! 🎉

---

## Rollback

If opinions cause issues in production:

1. Remove all `opinion` fields from `stacks.json` (git revert)
2. Revert `worker/src/systemPrompt.ts` to pre-feature version
3. Commit and push
4. GitHub Actions redeploys worker without opinions

No data loss; fully reversible.
