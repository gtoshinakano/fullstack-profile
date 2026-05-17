# Investigation: Toshi AI Chat Terminal

> Feature: `003-toshi-ai-terminal`
> Date: `2026-05-17`

---

## 1. Gemini SDK — Browser Compatibility

**Package:** `@google/generative-ai`

The SDK officially supports browser environments as of v0.15+. The streaming API returns an `AsyncIterable<GenerateContentStreamResult>` that works natively with `for await...of` in modern browsers. No Node.js-specific APIs are used in the browser path.

**Streaming usage pattern:**

```typescript
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(apiKey)
const model = genAI.getGenerativeModel({
  model: 'gemini-2.0-flash',
  systemInstruction: systemPrompt,
})
const result = await model.generateContentStream(userMessage)
for await (const chunk of result.stream) {
  const text = chunk.text()
  // append text to component state
}
```

**Alternative considered:** `@google/genai` (unified SDK, 2025+). More modern API surface, same underlying endpoint. Discarded for this feature because `@google/generative-ai` has wider usage documentation and more Stack Overflow coverage, reducing implementation risk. Can be migrated later.

---

## 2. Static Export + Client-Side AI Call

Next.js `output: 'export'` (ADR-001) means:
- No `pages/api/` routes — all server-side processing is impossible at runtime
- `NEXT_PUBLIC_*` env vars are inlined into the JS bundle at build time
- The Gemini API key is visible to anyone who inspects the bundle

**Accepted mitigation:** Google AI Studio (ai.google.dev) allows setting HTTP referrer restrictions on API keys. The key should be restricted to `https://gtoshinakano.github.io/fullstack-profile/*`. This does not prevent key extraction, but renders the extracted key useless from any other domain.

---

## 3. System Prompt Design

The system prompt is a structured text built from the 4 data JSON files. Since these are small files (< 50 KB total), embedding them as text in the prompt is practical.

**Recommended structure:**

```
You are Toshi AI, the personal AI assistant embedded in Gabriel Toshinori Nakano's portfolio.

Your ONLY purpose is to answer questions about Gabriel Toshinori Nakano.
If a user asks about anything unrelated to Gabriel, politely decline and invite them to ask about him.
Keep your answers concise, friendly, and professional.
Respond in the same language the user writes in.

## About Gabriel
- Full name: Gabriel Toshinori Nakano
- Nickname: Toshi
- Nationality: Japanese-Brazilian (born in Brazil, based in Tokyo since Jan 2022)
- Role: Full-Stack Developer | UI/UX Enthusiast
- Languages: Portuguese (native), Japanese (conversational), English (professional)

## Work History (chronological, most recent last)
[Serialized from jobs.json — company, role, period, description, stacks]

## Projects (most recent first)
[Serialized from toshi-projects.json — title, type, problem, solution, stacks, period]

## Technical Skills
[Derived from stacks used across jobs and projects]

## Education
- FATEC São Paulo — Systems Analysis and Development (2010–2013)
- UNINOVE — Information Systems (2008–2010)
```

**Note:** Education entries are hardcoded in `Jobs.tsx` (not in JSON files) — they must be hardcoded in the system prompt too. 🟢 `_reversa_sdd/domain.md#BR-05`.

---

## 4. Dynamic Import Pattern for SDK

To avoid the SDK being included in the initial page bundle:

```typescript
const handleSubmit = async () => {
  // ... validation
  const { GoogleGenerativeAI } = await import('@google/generative-ai')
  const genAI = new GoogleGenerativeAI(apiKey)
  // ...
}
```

Next.js webpack will split `@google/generative-ai` into a separate chunk automatically. The chunk is downloaded only when `handleSubmit` is first called. Subsequent calls reuse the cached module.

---

## 5. Streaming State Update Pattern

Updating a streaming message in React state requires care to avoid stale closures:

```typescript
// Pattern: functional update to avoid stale closure
setMessages(prev => {
  const updated = [...prev]
  const last = updated[updated.length - 1]
  updated[updated.length - 1] = { ...last, content: last.content + chunk }
  return updated
})
```

This pattern is safe with concurrent React (`React 18`) because `setMessages` with a function argument reads the latest state.

---

## 6. i18n Key Strategy

All terminal strings go under the `"toshi-ai"` group in `common.json`. This avoids touching `getStaticProps`, `getStaticPaths`, or `getStatic.js`.

**Required keys (per locale):**

```json
"toshi-ai": {
  "title": "Toshi AI – Ask me about Toshi",
  "placeholder": "Type your question... (200 chars max)",
  "send": "Send",
  "questions-remaining_one": "{{count}} question remaining",
  "questions-remaining_other": "{{count}} questions remaining",
  "limit-reached": "Session limit reached. Refresh the page to start over.",
  "welcome": "Hi! I'm Toshi AI — ask me anything about Gabriel!",
  "error": "Something went wrong. Please try again.",
  "char-count": "{{count}}/200"
}
```

**i18next pluralisation:** `_one` / `_other` suffixes are the standard i18next plural keys.

---

## 7. Terminal Visual Design Reference

macOS terminal window anatomy (CSS mapping):

```
┌────────────────────────────────────────────────┐
│ ● ● ●   Toshi AI – Ask me about Toshi          │  ← bg-gray-800, flex, items-center
├────────────────────────────────────────────────┤
│                                                │
│  > Toshi AI: Hi! I'm Toshi AI...              │  ← bg-gray-900, font-mono, text-green-400
│  > user: What stack does Gabriel use?          │  ← text-white
│  > Toshi AI: Gabriel uses TypeScript...▋       │  ← streaming + animate-pulse cursor
│                                                │
├────────────────────────────────────────────────┤
│  > |__________________________| [Send] 2/3 left│  ← bg-gray-800, border-t border-gray-700
└────────────────────────────────────────────────┘
```

Tailwind classes:
- Container: `rounded-lg overflow-hidden shadow-2xl border border-gray-700 my-8`
- Title bar: `bg-gray-800 px-4 py-3 flex items-center gap-2`
- Dot red: `w-3 h-3 rounded-full bg-[#FF5F57]`
- Dot yellow: `w-3 h-3 rounded-full bg-[#FFBD2E]`
- Dot green: `w-3 h-3 rounded-full bg-[#28C840]`
- Body: `bg-gray-900 font-mono text-sm`
- Output area: `overflow-y-auto p-4` with `min-h-[200px] max-h-[400px]`
- User line: `text-white`
- AI line: `text-green-400`
- Input bar: `flex items-center gap-2 px-4 py-3 border-t border-gray-700 bg-gray-800`
- Input field: `bg-transparent text-white flex-1 outline-none placeholder-gray-500`
- Prompt prefix: `text-green-400 font-bold select-none`

---

## 8. Auto-Scroll Implementation

```typescript
const outputRef = useRef<HTMLDivElement>(null)

useEffect(() => {
  if (outputRef.current) {
    outputRef.current.scrollTop = outputRef.current.scrollHeight
  }
}, [messages])
```

Attach `ref={outputRef}` to the output `<div>`. This runs after every message update including streaming chunks.
