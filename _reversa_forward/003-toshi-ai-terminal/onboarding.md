# Onboarding: Toshi AI Chat Terminal

> Feature: `003-toshi-ai-terminal`
> Date: `2026-05-17`
> For: developer testing the feature for the first time

---

## Prerequisites

- Node.js 18+ installed
- `npm install` completed in project root
- A valid Gemini API key from Google AI Studio (https://aistudio.google.com/app/apikey)

---

## Step 1 — Install the new dependency

```bash
npm install @google/generative-ai
```

Verify it appears in `package.json` under `dependencies`.

---

## Step 2 — Configure the API key

Create or edit `.env.local` in the project root:

```env
NEXT_PUBLIC_GEMINI_API_KEY=your_key_here
```

> **Note:** Without this key, the terminal component does not render at all (returns `null`). This is expected behaviour per RF-13.

---

## Step 3 — Start the dev server

```bash
npm run dev
```

Navigate to `http://localhost:3000` (or the port shown in the terminal).

---

## Step 4 — Verify the terminal renders

1. Wait for the Pace.js loading bar to complete (the hero section appears)
2. Scroll down to the `HeroDark` section (dark background)
3. After the profile photo, **before** the Profile / Projects / Message tab menu, you should see the macOS-style terminal window titled "Toshi AI – Ask me about Toshi"

**Expected:**
- Title bar with three coloured dots (red, yellow, green)
- Welcome message: "Hi! I'm Toshi AI — ask me anything about Gabriel!"
- Input prompt at the bottom with `>` prefix
- Counter showing "3 questions remaining"

---

## Step 5 — Test a valid question

1. Click the input field
2. Type: `What programming languages does Gabriel know?`
3. Press `Enter` or click `Send`

**Expected:**
- Question appears in the output area labelled with `> user:`
- AI response streams in character-by-character with `▋` cursor blinking
- Counter decrements to "2 questions remaining"
- After streaming completes, cursor disappears

---

## Step 6 — Test the 200-character limit

1. Paste a text longer than 200 characters into the input
2. Verify the character counter turns red and shows e.g. `205/200`
3. Verify the `Send` button is disabled and Enter has no effect
4. Delete characters until count is ≤ 200 — button re-enables

---

## Step 7 — Test the 3-question session limit

1. Send 3 questions (any content)
2. After the 3rd response, verify:
   - Input field becomes disabled (greyed out)
   - Counter shows "0 questions remaining"
   - A message appears: "Session limit reached. Refresh the page to start over."
3. Refresh the page — counter resets to 3 (in-memory state cleared)

---

## Step 8 — Test the absent API key

1. Remove `NEXT_PUBLIC_GEMINI_API_KEY` from `.env.local` (or set it to empty string)
2. Restart the dev server (`npm run dev`)
3. Navigate to the HeroDark section
4. **Expected:** No terminal component visible. The photo carousel flows directly into the tab menu. No error in browser console.

---

## Step 9 — Test i18n

1. Change locale using the language switcher to Japanese (`ja`)
2. Navigate to the HeroDark section
3. **Expected:** Terminal title shows "Toshi AI – Toshiについて聞いてください"; welcome message in Japanese; placeholder in Japanese

Repeat for `pt-BR` locale.

---

## Step 10 — Verify no regressions

After testing the terminal, check:
- [ ] Photo carousel (scrolling changes photos — scrub behaviour)
- [ ] Tab menu sticky behaviour (menu expands/pins on scroll)
- [ ] Switching between Profile / Projects / Message tabs still works with GSAP animations
- [ ] `npm run build` completes without TypeScript errors

---

## Troubleshooting

| Issue | Likely cause | Fix |
|-------|-------------|-----|
| Terminal not visible | `NEXT_PUBLIC_GEMINI_API_KEY` missing or empty | Add key to `.env.local`, restart server |
| "Something went wrong" on submit | Invalid API key or quota exceeded | Verify key in Google AI Studio; check quota |
| Build error: module not found | `@google/generative-ai` not installed | Run `npm install @google/generative-ai` |
| TypeScript error on import | `@types` missing | SDK includes its own types; check tsconfig paths |
| Terminal appears but content overflows | CSS height constraint issue | Check `min-h-[200px] max-h-[400px]` on output div |
