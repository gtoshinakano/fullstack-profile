# ADR-005 — Project Rebranding: uiux-profile → fullstack-profile

> Status: **Accepted** (active)
> Date: 2022-07-28
> Detected by: Reversa Detective · 2026-05-17
> Confidence: 🟢 CONFIRMED (evidenced by commit `631d295` "Rebranded" and git repository rename)

---

## Context

The project was originally created on April 16, 2022 as `uiux-profile` — positioned as a UI/UX specialist portfolio. After approximately 3.5 months, the author decided to rebrand.

## Decision

Rename the project repository from `uiux-profile` to `fullstack-profile`, update the GitHub Pages URL, and shift the professional identity presented to recruiters from "UI/UX Developer" to "Full-Stack Developer".

## Rationale (Inferred)

🟡 No commit message explains the reasoning. Based on the timeline and content:

1. **Career positioning shift** — The author likely concluded that "Full-Stack Developer" attracts more opportunities in the Tokyo job market than "UI/UX Developer"
2. **Timing** — The rebrand coincides roughly with the i18n implementation (Aug 2022), suggesting the site was being prepared for a serious job search push
3. **Content already supported it** — The `jobs.json` data already showed full-stack work history (React, Next.js, Node.js, Java); the "UI/UX" label was underselling the technical depth

## Consequences

- **URL changed** — GitHub Pages URL became `gtoshinakano.github.io/fullstack-profile/` (previously `gtoshinakano.github.io/uiux-profile/`)
- **BasePath updated** — `NEXT_PUBLIC_BASE_PATH` and `assetPrefix` both updated to `/fullstack-profile`
- **Repository rename** — All git clone URLs changed; any external links to the old URL broke
- **Identity preserved in content** — The site still prominently features UI/UX expertise through the "3-3-3 Principles" article; the rebranding expanded the perceived scope rather than replacing it
- **`uiux-profile` appears in git history** — Early commits and branches still reference the old name in commit messages and paths

## Evidence from Git

```
631d295  Rebranded  (2022-07-28)
```

The `next.config.js` `assetPrefix: '/fullstack-profile/'` and `NEXT_PUBLIC_BASE_PATH` env var are direct artifacts of this decision.
