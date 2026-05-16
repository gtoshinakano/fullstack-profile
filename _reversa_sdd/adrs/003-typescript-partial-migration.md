# ADR-003 — Partial TypeScript Migration (FuturePartner left as JSX)

> Status: **Accepted** (incomplete — one file intentionally or accidentally skipped)
> Date: 2022-04-19
> Detected by: Reversa Detective · 2026-05-17
> Confidence: 🟢 CONFIRMED (evidenced by commit `37fc6f8` and `FuturePartner.jsx` remaining as `.jsx`)

---

## Context

The project began in JavaScript. On April 19, 2022, a TypeScript migration was performed alongside extracting `jobs.json` from hardcoded JSX. The `tsconfig.json` was added, and most components were converted to `.tsx`/`.ts`.

## Decision

Migrate the codebase to TypeScript, but retain `FuturePartner.jsx` as a JavaScript React component.

## Rationale (Inferred)

🟡 The rationale is inferred — no commit message explains the omission. Likely causes:

1. `FuturePartner.jsx` was added after the migration sweep and never converted
2. The component is self-contained with no shared prop types — the absence of TypeScript causes no type errors in consuming components because it is rendered dynamically
3. Low perceived risk: the component is purely presentational (no state, no data fetching, only `useTranslation`)

## Consequences

- **Mixed codebase:** 24 `.tsx`/`.ts` files + 1 `.jsx` file — newcomers may assume the project is fully typed
- **No type checking on FuturePartner props:** the parent `HeroDark/index.tsx` passes no props to `<FuturePartner />`, so the lack of TypeScript causes no practical issue
- **`strict: false` in tsconfig.json:** TypeScript is not in strict mode — even the migrated files have limited type safety (e.g., `any` implicit in several GSAP ref callbacks)
- **Migration path exists:** converting `FuturePartner.jsx` to `.tsx` is trivial; no blockers identified

## Evidence from Git

```
37fc6f8  TypeScript setup + jobs.json extracted  (2022-04-19)
```

Current state:
```
src/components/dom/HeroDark/FuturePartner.jsx  ← only .jsx file in src/components/dom/
```

All sibling files: `index.tsx`, `Jobs.tsx`, `Projects.tsx` — TypeScript.
