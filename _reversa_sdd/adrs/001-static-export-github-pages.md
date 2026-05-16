# ADR-001 — Static Export to GitHub Pages

> Status: **Accepted** (active)
> Date: 2022-04-16
> Detected by: Reversa Detective · 2026-05-17
> Confidence: 🟢 CONFIRMED (evidenced by `next.config.js`, `deploy.yml`, git history)

---

## Context

The portfolio is a personal project with no backend requirements and zero budget. It needs to be publicly accessible at a stable URL.

## Decision

Use Next.js `output: 'export'` to generate a fully static site and deploy it to GitHub Pages (free hosting via the `gh-pages` branch).

## Rationale

- Zero hosting cost
- No server maintenance
- GitHub Pages provides a stable, HTTPS URL at `gtoshinakano.github.io/fullstack-profile/`
- Next.js static export supports all required features (React, Tailwind, i18n via client-side routing)

## Consequences

- **No server-side rendering** — all data is baked at build time
- **No API routes** — Next.js API routes do not work in static export
- **Image optimization disabled** — Next.js `<Image>` optimization requires a server; replaced with `customLoader` (identity function)
- **BasePath complexity** — GitHub Pages serves under a sub-path (`/fullstack-profile/`), requiring the `prefix` helper for all asset URLs and the `assetPrefix` config option
- **i18n constraint** — Next.js built-in i18n (server-side locale detection) is incompatible with static export; required a custom client-side redirect approach (see ADR-002)

## Evidence

```js
// next.config.js
module.exports = {
  output: 'export',
  assetPrefix: isProd ? '/fullstack-profile/' : '',
  images: { loader: 'custom' }
}
```

```yaml
# .github/workflows/deploy.yml
- name: Build project
  run: npm run build
- name: Deploy
  uses: JamesIves/github-pages-deploy-action@v4
  with:
    branch: gh-pages
    folder: out
```
