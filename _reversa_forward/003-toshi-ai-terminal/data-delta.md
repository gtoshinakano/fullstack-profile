# Data Delta: Toshi AI Chat Terminal

> Feature: `003-toshi-ai-terminal`
> Date: `2026-05-17`
> Base: `_reversa_sdd/data/`

---

## Summary

This feature is purely additive. No existing data files are modified or deleted.
The only data changes are new i18n keys in the three `common.json` locale files.

---

## 1. Static Data JSON Files (read-only)

| File | Change | Reason |
|------|--------|--------|
| `src/data/jobs.json` | None — read-only | Consumed to build system prompt context |
| `src/data/toshi-projects.json` | None — read-only | Consumed to build system prompt context |
| `src/data/stacks.json` | None — read-only | Consumed to build system prompt context |
| `src/data/swtools.json` | None — read-only | Consumed to build system prompt context |

---

## 2. i18n Locale Files (additive)

### 2.1 `public/locales/en/common.json`

Add the following key group (no existing keys removed or modified):

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

### 2.2 `public/locales/ja/common.json`

Add the following key group:

```json
"toshi-ai": {
  "title": "Toshi AI – Toshiについて聞いてください",
  "placeholder": "質問を入力してください…（200文字以内）",
  "send": "送信",
  "questions-remaining_one": "残り{{count}}回の質問",
  "questions-remaining_other": "残り{{count}}回の質問",
  "limit-reached": "セッションの制限に達しました。ページを更新して再開してください。",
  "welcome": "こんにちは！私はToshi AIです。Gabrielについて何でも聞いてください！",
  "error": "エラーが発生しました。もう一度お試しください。",
  "char-count": "{{count}}/200"
}
```

### 2.3 `public/locales/pt-BR/common.json`

Add the following key group:

```json
"toshi-ai": {
  "title": "Toshi AI – Pergunte sobre mim",
  "placeholder": "Digite sua pergunta… (máx. 200 caracteres)",
  "send": "Enviar",
  "questions-remaining_one": "{{count}} pergunta restante",
  "questions-remaining_other": "{{count}} perguntas restantes",
  "limit-reached": "Limite da sessão atingido. Atualize a página para recomeçar.",
  "welcome": "Olá! Sou o Toshi AI — pergunte qualquer coisa sobre o Gabriel!",
  "error": "Algo deu errado. Por favor, tente novamente.",
  "char-count": "{{count}}/200"
}
```

---

## 3. New Files (no legacy equivalent)

| File | Type | Content |
|------|------|---------|
| `src/components/views/dev/gabriel/HeroDark/ToshiAITerminal/index.tsx` | React component (TSX) | Terminal UI, message state, counter, streaming render |
| `src/components/views/dev/gabriel/HeroDark/ToshiAITerminal/useGeminiStream.ts` | Custom hook (TS) | Gemini SDK dynamic import, streaming loop, error handling |
| `src/components/views/dev/gabriel/HeroDark/ToshiAITerminal/systemPrompt.ts` | TypeScript module | Imports 4 data JSONs, assembles system prompt string |

---

## 4. Environment Variables

| Variable | Required | Purpose | Where to set |
|----------|----------|---------|--------------|
| `NEXT_PUBLIC_GEMINI_API_KEY` | Optional (feature hidden when absent) | Gemini API authentication | `.env.local` (dev), GitHub Actions secrets (prod) |

No existing environment variables are modified.

---

## 5. package.json Delta

| Package | Version | Change | Reason |
|---------|---------|--------|--------|
| `@google/generative-ai` | `^0.21.0` (or latest stable) | Add to `dependencies` | Gemini streaming SDK |
