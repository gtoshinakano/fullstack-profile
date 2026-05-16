# ADR-004 — Next.js Image Optimization Disabled via Custom Loader

> Status: **Accepted** (active)
> Date: 2022-04-16 (initial) · Refactored: 2024-06-XX (Next 13 `<Image>` API)
> Detected by: Reversa Detective · 2026-05-17
> Confidence: 🟢 CONFIRMED (evidenced by `customLoader.ts`, `next.config.js`, commit `5cafa13`)

---

## Context

Next.js `<Image>` component provides automatic image optimization (WebP conversion, responsive srcset, lazy loading) but requires a running server to process images at request time. The portfolio uses `output: 'export'` (static export) which has no runtime server.

## Decision

Disable Next.js image optimization by configuring a custom loader that is an identity function — it returns the source URL unchanged, bypassing all optimization.

```ts
// src/helpers/customLoader.ts
const customLoader = ({ src }: { src: string }) => src;
export default customLoader;
```

```js
// next.config.js
images: {
  loader: 'custom',
  loaderFile: './src/helpers/customLoader.ts',
}
```

All `<Image>` usages pass `loader={customLoader}` explicitly.

## Rationale

- `output: 'export'` is incompatible with the default Next.js image optimization server
- Without a loader override, `next build` throws: *"Image Optimization using Next.js default loader is not compatible with `next export`"*
- The custom loader is the official Next.js recommended workaround for static export scenarios
- Image sizes in this portfolio are small enough that optimization savings are negligible

## Consequences

- **No WebP conversion** — images are served in their original format (`.png`, `.jpg`)
- **No responsive srcset** — the browser always downloads the full-size image regardless of display size
- **No built-in lazy loading via optimization** — though browser-native lazy loading still applies
- **`unoptimized` prop pattern** — some `<Image>` usages also pass `unoptimized` for clarity
- **Next 13 migration (commit `5cafa13`):** The upgrade required updating the `<Image>` import path and adapting the loader signature — the core decision (bypass optimization) was unchanged

## Evidence

```js
// next.config.js (current)
images: {
  loader: 'custom',
  loaderFile: './src/helpers/customLoader.ts',
}
```

```ts
// src/helpers/customLoader.ts
const customLoader = ({ src }: { src: string }) => src;
```

Commit `5cafa13` — "upgraded to next 13 image" — adapted `<Image>` component API without changing the bypass strategy.
