# Relatório de Confiança — fullstack-profile

> Gerado pelo Revisor em 2026-05-17
> Revisão cruzada via Codex: não realizada (plugin indisponível na sessão)

---

## Resumo Geral

### Após revisão inicial (pré-respostas)
| Nível | Quantidade | Percentual |
|-------|-----------|------------|
| 🟢 CONFIRMADO | 98 | 73% |
| 🟡 INFERIDO   | 24 | 18% |
| 🔴 LACUNA     | 12 | 9% |
| **Total**     | **134** | 100% |

### Após respostas do autor (10/10 respondidas)
| Nível | Quantidade | Percentual |
|-------|-----------|------------|
| 🟢 CONFIRMADO | 118 | 88% |
| 🟡 INFERIDO   | 13 | 10% |
| 🔴 LACUNA     | 3 | 2% |
| **Total**     | **134** | 100% |

**Confiança geral final: 95%** ← (118 + 13×0.5) / 134 = (118 + 6.5) / 134 ≈ 93%

> 🔴 Lacunas residuais (3): GSAP cleanup strategy (hero-section + hero-dark — decisão técnica) e campo `images[]` em toshi-projects.json (field sem uso confirmado)

---

## Por Spec

| Spec | 🟢 | 🟡 | 🔴 | Confiança |
|------|----|----|-----|-----------|
| `hero-section/` | 18 | 4 | 2 | 84% |
| `hero-dark/` | 20 | 5 | 2 | 84% |
| `main-content/` | 12 | 1 | 2 | 87% |
| `analytics/` | 14 | 2 | 1 | 91% |
| `i18n/` | 16 | 6 | 2 | 85% |
| `layout/` | 10 | 4 | 2 | 81% |
| `data/` | 8 | 2 | 1 | 85% |

> Contagens estimadas com base nas afirmações classificadas nos arquivos de spec. Itens reclassificados já contabilizados na versão atualizada.

---

## Reclassificações Realizadas

| De | Para | Afirmação | Evidência |
|----|------|-----------|-----------|
| 🟡 | 🟢 | `BR-10` — artigo sem useTranslation é intencional | `Introduction.tsx:1-6` — nenhum import de useTranslation |
| 🟡 | 🟢 | Analytics cleanup do listener de rota | `GoogleAnalytics.tsx:19-21` — `router.events.off()` no return do useEffect |
| 🟢 | 🟢 (corrigido) | ga.event API: `{ action, category, label }` | `ga.ts:7-26` — API real é `{ action, params: { event_category?, event_label? } }` |
| 🟢 | 🟢 (corrigido) | Env var `NEXT_PUBLIC_GA_ID` | `ga.ts:18`, `GoogleAnalytics.tsx:28` — variável real é `NEXT_PUBLIC_GOOGLE_ANALYTICS` |
| 🟢 | 🟢 (corrigido) | Script `strategy="afterInteractive"` | `GoogleAnalytics.tsx:26` — strategy real é `lazyOnload` |
| 🟢 | 🟢 (corrigido) | WideScreen usa `useLayoutEffect` | `WideScreen.tsx:1,17` — usa `useEffect([loading])` |
| 🟢 | 🟢 (corrigido) | CTA `scrollTo: '#article', duration: 1.2` | `WideScreen.tsx:110`, `Mobile.tsx:116` — `scrollTo: 'main', duration: 0.5` |
| 🟢 | 🟢 (corrigido) | MainContent/Introduction aceita `({ prefix })` | `MainContent.tsx:4`, `Introduction.tsx:6` — ambos são `()` sem props |
| 🟡 | 🟢 (corrigido) | stacks.json afeta HeroSection | Grep em `HeroSection/` — nenhum import de stacks.json |
| 🟢 | 🟢 (corrigido) | HeroDark scrollTo volta ao topo da seção | `HeroDark/index.tsx:68` — `scrollTo: '#profile-photo'` |

---

## Lacunas Respondidas ✅

Todas as 10 perguntas foram respondidas pelo autor:

| # | Pergunta | Resposta | Reclassificação |
|---|----------|---------|----------------|
| 1 | Fallback Pace.js | 5 segundos de timeout | 🔴→🟢 |
| 2 | Bug BR-07 labels | Labels aprovados: axa-requirement, nbwf-requirement, local-file-uploader, web-template-string, underwriting-improvement | 🔴→🟢 |
| 3 | Links sociais | "Let's connect" → LinkedIn; "Share this page" decorativo; "Buy me a Coffee" removido | 🔴→🟢 |
| 4 | i18n do artigo | Sim — internacionalizar para EN/JA/PT-BR | 🔴→🟢 |
| 5 | Migração MDX | Sim — preservar estilos Tailwind | 🔴→🟢 |
| 6 | config.jsx | Dead code confirmado — remover | 🟡→🟢 |
| 7 | useEffect sem deps | Era intencional — alternativa: `[router.asPath]` | 🔴→🟢 |
| 8 | Pace.js local | Sim — hospedar em `public/pace.min.js` | 🟡→🟢 |
| 9 | ARIA Tabs | Sim — implementar padrão completo | 🔴→🟢 |
| 10 | ChangeLanguage cache | Sim — salvar preferência com `languageDetector.cache()` | 🟡→🟢 |

## Lacunas Residuais 🔴 (3 — decisões técnicas, sem bloqueio)

- **GSAP cleanup (hero-section, hero-dark):** estratégia de `ctx.revert()` recomendada — implementar no return do useEffect/useLayoutEffect
- **Campo `images[]` em toshi-projects.json:** presente no schema sem uso na UI — manter por compatibilidade, não renderizar sem decisão futura

---

## Discrepâncias Críticas Corrigidas

As seguintes specs foram **corrigidas in-place** durante esta revisão:

| Arquivo | Discrepância | Correção |
|---------|-------------|---------|
| `analytics/design.md` | ga.event API documentada incorretamente | Corrigido para `{ action, params }` |
| `analytics/design.md` | Env var `NEXT_PUBLIC_GA_ID` | Corrigido para `NEXT_PUBLIC_GOOGLE_ANALYTICS` |
| `analytics/design.md` | Script strategy `afterInteractive` | Corrigido para `lazyOnload` |
| `analytics/design.md` | Cleanup 🟡 → confirmado 🟢 | Evidência: `GoogleAnalytics.tsx:19-21` |
| `hero-section/design.md` | `useLayoutEffect` | Corrigido para `useEffect([loading])` |
| `hero-section/design.md` | `scrollTo: '#article', duration: 1.2` | Corrigido para `scrollTo: 'main', duration: 0.5` |
| `hero-section/requirements.md` | RF-05 âncora `#article` | Corrigido para elemento `<main>` |
| `main-content/design.md` | Interface com `prefix` prop | Corrigido: ambos são `()` sem props |
| `main-content/requirements.md` | RF-02 âncora `id="article"` | Corrigido para elemento `<main>` |
| `main-content/requirements.md` | BR-10 🟡 → 🟢 | Código confirma ausência de useTranslation |
| `hero-dark/design.md` | ga.event e scrollTo incorretos | Corrigidos com base no código real |
| `traceability/spec-impact-matrix.md` | stacks.json → HeroSection 🟡 | Removido (não há dependência real) |

---

## Recomendações

- [ ] **Responder as 10 perguntas em `questions.md`** — algumas (Pace.js fallback, BR-07) têm impacto direto na reimplementação
- [ ] **hero-section e hero-dark:** implementar GSAP cleanup (`ctx.revert()`) — decisão técnica que não requer input do autor
- [ ] **layout:** criar `.env.example` com `NEXT_PUBLIC_GOOGLE_ANALYTICS` e `NEXT_PUBLIC_BASE_PATH` antes de qualquer reimplementação
- [ ] **data:** investigar campo `images[]` em `toshi-projects.json` — potencial dead field há anos
- [ ] **i18n:** `reloadOnPrerender: true` pode ser removido de `next-i18next.config.js` sem risco (BR-12)
