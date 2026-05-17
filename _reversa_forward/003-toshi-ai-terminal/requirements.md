# Requirements: Toshi AI Chat Terminal

> Identifier: `003-toshi-ai-terminal`
> Date: `2026-05-17`
> Extraction folder: `_reversa_sdd/`
> Confidence: 🟢 CONFIRMED, 🟡 INFERRED, 🔴 GAP / DOUBT

## 1. Executive Summary

This feature introduces an interactive macOS-style terminal window component positioned inside the `HeroDark` section, between the developer's profile photo carousel and the expandable tab menu (Profile / Projects / Recruiters). Visitors can type natural-language questions about the developer and receive streamed responses from a generative AI service. The AI is constrained by a system prompt to only answer questions about the developer, using the developer's own data JSON files as context. The session is limited to 3 questions and 200 characters per message. The component title is fully translatable across all 3 supported locales (en / ja / pt-BR).

---

## 2. Legacy Context

| Source | Relevant excerpt | Confidence |
|--------|------------------|------------|
| `_reversa_sdd/architecture.md#System Summary` | Static export (GitHub Pages) — no server, no API routes. All runtime logic must run client-side in the browser. | 🟢 |
| `_reversa_sdd/architecture.md#Key Architectural Decisions` | ADR-001: `output: 'export'` — no SSR, no API routes, no server-side rendering. External API calls must originate from the browser. | 🟢 |
| `_reversa_sdd/architecture.md#Component Map` | `HeroDark/index.tsx` orchestrates photo carousel + Menu + tab panels. New terminal component is inserted between the photo block (`flex flex-wrap`) and `<Menu>`. | 🟢 |
| `_reversa_sdd/hero-dark/design.md#Interface` | `HeroDark` state: `selected`, `loading`, `hasEducation`. New terminal component is independent and must not interfere with existing GSAP animations or tab state. | 🟢 |
| `_reversa_sdd/i18n/design.md#Dependências` | i18n pattern: `useTranslation('common')`, keys in `public/locales/{en,ja,pt-BR}/common.json`. New keys for terminal title and UI labels must follow this pattern. | 🟢 |
| `_reversa_sdd/data/requirements.md` | Developer context available from: `src/data/jobs.json` (5 work entries), `src/data/toshi-projects.json` (19 projects), `src/data/stacks.json` (tech stack), `src/data/swtools.json` (software tools). These are bundled at build time and can be imported statically. | 🟢 |
| `_reversa_sdd/domain.md#Purpose of the System` | Portfolio targets recruiters and technical partners. AI must represent the developer professionally and stay on-topic. | 🟢 |
| `_reversa_sdd/architecture.md#External Integrations` | Existing external calls: GA4, Pace.js CDN, Unicons CDN, Google Fonts. New integration: AI inference API (browser-initiated, production-gated preferred). | 🟢 |

---

## 3. Personas and Use Cases

| Persona | Goal | Key scenario |
|---------|------|--------------|
| Recruiter | Quickly understand the developer's skills and experience | Opens the terminal, types "What technologies does Gabriel know?", receives a streamed summary |
| Technical partner | Assess past project work | Types "Tell me about Gabriel's most challenging project", receives context from project data |
| Casual visitor | Learn about the person behind the portfolio | Types "Where does Gabriel live?", receives a friendly answer |
| Author (Gabriel) | Showcase AI integration as a portfolio feature itself | Demonstrates the feature to audiences; the terminal design reflects the developer's tech identity |

---

## 4. New or Changed Business Rules

1. **RN-01:** The AI inference API is called directly from the browser. There is no server-side proxy.  🟢
   - Origin: `_reversa_sdd/architecture.md#Key Architectural Decisions` → ADR-001 (static export)
   - Type: new
   - Consequence: The API key must be accessible client-side via a `NEXT_PUBLIC_*` environment variable.

2. **RN-02:** The API key is stored as `NEXT_PUBLIC_GEMINI_API_KEY` in the `.env.local` file and is bundled into the client. 🟡
   - Type: new
   - Risk: Key is visible in the browser bundle. Mitigation: HTTP referrer restriction via the AI provider's console (only the portfolio domain may use the key).

3. **RN-03:** The system prompt must instruct the AI to respond only to questions about Gabriel Toshinori Nakano. Questions outside this scope must be politely declined. 🟢
   - Type: new

4. **RN-04:** The AI system prompt context is assembled from the four data JSON files at component initialization, not at build time. 🟡
   - Type: new
   - Rationale: JSON files are already bundled by Next.js; importing them in the component makes the context always up to date.

5. **RN-05:** A session allows a maximum of 3 questions. After the 3rd question is sent, the input is permanently disabled for the remainder of the session. 🟢
   - Type: new
   - "Session" is defined as the React component's in-memory state (`useState`). The counter resets on any page navigation or page refresh. No `sessionStorage` or `localStorage` is used.

6. **RN-06:** Each question is limited to a maximum of 200 characters. The UI must enforce this limit before the API call is made. 🟢
   - Type: new

7. **RN-07:** When `NEXT_PUBLIC_GEMINI_API_KEY` is absent or empty, the terminal component is not rendered in the DOM. No element appears in the page; no space is reserved. No crash. 🟢
   - Type: new

---

## 5. Functional Requirements

| ID | Requirement | Priority | Acceptance Criterion | Confidence |
|----|-------------|----------|----------------------|------------|
| RF-01 | A macOS-style terminal window component is rendered inside `HeroDark`, between the profile photo block and the `<Menu>` component | Must | Component appears in the correct position; does not shift or break existing layout or GSAP ScrollTrigger on the photo carousel | 🟢 |
| RF-02 | Terminal title bar displays three colored dots (red, yellow, green) and the translatable title `"toshi-ai.title"` (default EN: "Toshi AI – Ask me about Toshi") | Must | Title renders in the correct locale; dots are visually correct macOS decoration | 🟢 |
| RF-03 | Terminal body displays a scrollable message history area where both user questions and AI responses are shown | Must | After submitting a question, the question appears labeled (e.g., `> user:`) and the AI response appears below it | 🟢 |
| RF-04 | An input field styled as a terminal prompt (`>` prefix) is fixed at the bottom of the terminal window | Must | Input is always visible at the bottom; user can type and submit with Enter or a Send button | 🟢 |
| RF-05 | The system prompt is assembled from the developer's data files (`jobs.json`, `toshi-projects.json`, `stacks.json`, `swtools.json`) and instructs the AI to restrict its answers to questions about Gabriel Toshinori Nakano | Must | AI declines off-topic questions; AI answers correctly for on-topic questions about the developer's career | 🟢 |
| RF-06 | Each question submission triggers a streaming call to the AI inference API | Must | Response text appears incrementally in the terminal as tokens arrive, not as a single block | 🟢 |
| RF-07 | The streaming response is rendered chunk-by-chunk in the terminal output area, with a blinking cursor `▋` shown at the end of the in-progress line while tokens are arriving | Must | Visible streaming effect with blinking `▋` cursor; scrolls automatically to show new content; cursor disappears when response completes | 🟢 |
| RF-08 | A session counter tracks questions sent. After 3 questions, the input field and submit action are permanently disabled for the session | Must | After 3rd question is answered, input is disabled; a message explains the limit has been reached | 🟢 |
| RF-09 | Character count is shown live next to the input. Submission is blocked if the message exceeds 200 characters | Must | Counter updates on keystroke; button/Enter is disabled when count > 200 | 🟢 |
| RF-10 | A visible indicator shows how many questions remain in the session (e.g., "2 questions left") | Should | Indicator decrements with each submission; shows "0 questions left" when depleted | 🟡 |
| RF-11 | The terminal title, input placeholder, and limit-reached message are translatable via `useTranslation('common')` and keys in `public/locales/{locale}/common.json` | Must | Changing locale updates all terminal UI strings | 🟢 |
| RF-12 | While a streaming response is in progress, the input field and submit action are disabled to prevent concurrent requests | Must | Submit is unavailable while the AI is generating; enabled again after response completes | 🟢 |
| RF-13 | When `NEXT_PUBLIC_GEMINI_API_KEY` is absent or empty, the terminal component is not rendered in the DOM | Must | Terminal element is absent from the page when the env var is not set; no crash, no blank space reserved | 🟢 |
| RF-14 | When an API call fails (network error, API error), the terminal displays an error message in the output area and re-enables the input | Should | Error message visible in terminal; question counter is NOT incremented for failed requests | 🟡 |
| RF-15 | The terminal window is responsive: full-width on mobile, constrained width on desktop. The message history area has a minimum height of 200px and a maximum height of 400px; beyond that, it scrolls internally | Should | Component does not overflow container on any viewport; area scrolls internally when history exceeds 400px; readable on mobile | 🟢 |
| RF-16 | On mount, the terminal displays an automatic welcome message from Toshi AI in the output area (e.g., "Hi! I'm Toshi AI — ask me anything about Gabriel!") before the user sends any question | Must | Welcome message is visible when the terminal first renders; message is translatable via `useTranslation('common')` | 🟢 |

---

## 6. Non-Functional Requirements

| Type | Requirement | Evidence or rationale | Confidence |
|------|-------------|----------------------|------------|
| Performance | First streaming token must appear within 3 seconds of submission (excluding network latency outside developer's control) | Acceptable UX for a synchronous API call from portfolio | 🟡 |
| Security | API key must have HTTP referrer restriction configured in the AI provider's console to the portfolio domain | RN-02 — client-side key exposure mitigation | 🟢 |
| Accessibility | Terminal input has a visible label or `aria-label`; submit button is keyboard-accessible; streaming content area has `role="log"` and `aria-live="polite"` | ARIA gap documented in `_reversa_sdd/hero-dark/requirements.md#RNF` | 🟢 |
| UX / Non-interference | Component must not trigger or interfere with existing GSAP ScrollTrigger instances (photo carousel, menu sticky) | `_reversa_sdd/hero-dark/design.md#Fluxo Principal — Menu Sticky` — GSAP ScrollTrigger registered on existing elements | 🟢 |
| Observability | Each question submission fires a GA4 event `ai_terminal_query` with parameter `questions_remaining` | GA4 pattern established in `src/lib/ga.ts`; extends existing pattern | 🟡 |
| Build / Bundle | The AI provider SDK must be a production dependency that does not significantly increase bundle size for users who do not interact with the terminal (lazy import preferred) | Static site loads all JS upfront; heavy deps impact all users | 🟡 |

---

## 7. Acceptance Criteria

```gherkin
Scenario: Visitor submits a valid question
  Given the terminal is loaded with a valid API key
  And the visitor has 3 questions remaining
  When the visitor types a question about Gabriel (≤ 200 characters) and submits
  Then the question appears in the terminal output
  And the AI response streams into the terminal character-by-character
  And the questions-remaining counter decrements by 1

Scenario: Visitor submits a question exceeding 200 characters
  Given the terminal is loaded and active
  When the visitor types more than 200 characters
  Then the submit button is disabled
  And the character counter shows a warning style (e.g., red text)
  And submitting via Enter key has no effect

Scenario: Session limit reached
  Given the visitor has already sent 3 questions in this session
  Then the input field is disabled
  And a message is shown indicating the session limit has been reached
  And no further API calls can be made from this terminal

Scenario: API key is absent
  Given the environment variable NEXT_PUBLIC_GEMINI_API_KEY is empty or undefined
  When the page loads
  Then the terminal renders with a placeholder message
  And the input field is disabled
  And no error is thrown in the browser console

Scenario: API call fails
  Given the terminal is active and the visitor submits a question
  When the AI API returns an error response
  Then an error message appears in the terminal output area
  And the question counter is NOT incremented
  And the input field is re-enabled so the visitor may retry

Scenario: Off-topic question
  Given the terminal is active with a valid API key
  When the visitor types a question unrelated to Gabriel (e.g., "What is the capital of France?")
  Then the AI responds with a polite refusal
  And the question counter IS incremented (the question was sent and processed)

Scenario: Locale change
  Given the visitor is viewing the terminal in English
  When the visitor switches locale to Japanese
  Then the terminal title, placeholder, and all UI labels update to Japanese strings
  And the chat history remains visible (locale change does not clear history)
```

---

## 8. MoSCoW Priority

| Item | MoSCoW | Justification |
|------|--------|---------------|
| RF-01 (placement in HeroDark) | Must | Without correct placement, the feature does not exist where specified |
| RF-02 (macOS design + translatable title) | Must | Visual identity of the terminal is the primary UX hook |
| RF-03 (message history area) | Must | Core interaction surface |
| RF-04 (terminal input prompt) | Must | Core interaction surface |
| RF-05 (system prompt + data context) | Must | Without this, AI is unconstrained and off-brand |
| RF-06 (AI API streaming call) | Must | Core functionality |
| RF-07 (streaming render) | Must | Streaming is a UX requirement per author spec |
| RF-08 (3-question session limit) | Must | Explicit author requirement |
| RF-09 (200-char limit) | Must | Explicit author requirement |
| RF-11 (i18n for terminal UI) | Must | Portfolio is multilingual; terminal must not be the only non-translated section |
| RF-12 (disable during streaming) | Must | Prevents race conditions and broken UX |
| RF-13 (graceful absent key) | Must | Key will not exist during development; component must not crash |
| RF-10 (questions-remaining indicator) | Should | Helpful UX but session still functions without it |
| RF-14 (error handling + retry) | Should | Good UX; not blocking for initial delivery |
| RF-15 (responsive layout) | Should | Portfolio is viewed on mobile; importance is high but can be iterated |
| RNF Observability (GA4 event) | Could | Nice-to-have metrics; portfolio GA already works without this |
| RNF Bundle (lazy import) | Should | Affects all users; worth effort to keep bundle lean |

---

## 9. Clarifications

### Session 2026-05-17

- **Q:** Where is the 3-question session counter stored?
  **R:** React in-memory state (`useState`). Resets on any page navigation or refresh. No `sessionStorage` or `localStorage` used.

- **Q:** What happens when `NEXT_PUBLIC_GEMINI_API_KEY` is absent?
  **R:** The terminal component is not rendered in the DOM. No element, no placeholder, no space reserved in the page.

- **Q:** Should the terminal display an automatic welcome message on mount?
  **R:** Yes. On mount, the terminal shows a welcome message from Toshi AI (e.g., "Hi! I'm Toshi AI — ask me anything about Gabriel!"). Must be translatable.

- **Q:** What are the height constraints for the terminal's message history area?
  **R:** Minimum 200px, maximum 400px. Scrolls internally once the maximum is reached.

- **Q:** Should a blinking cursor be shown during streaming?
  **R:** Yes. A `▋` cursor blinks at the end of the current in-progress line while tokens arrive. Disappears when streaming completes.

---

## 10. Gaps

> All doubts from the initial requirements have been resolved in the clarification session of 2026-05-17. No open gaps remain.

---

## 11. Change History

| Date | Change | Author |
|------|--------|--------|
| 2026-05-17 | Initial version generated by `/reversa-requirements` | reversa |
