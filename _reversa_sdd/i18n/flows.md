# i18n — Fluxos Detalhados

> Arquivo opcional gerado por Reversa Writer · 2026-05-17
> Documenta os 3 fluxos distintos da unit que complementam o design.md.
> Confidence: 🟢 CONFIRMADO | 🟡 INFERIDO

---

## Fluxo 1 — Detecção Automática de Locale na Primeira Visita

```mermaid
sequenceDiagram
    participant B as Browser (PT-BR)
    participant GHP as GitHub Pages CDN
    participant App as React App
    participant LD as languageDetector
    participant Router as next/router

    B->>GHP: GET /fullstack-profile/
    GHP-->>B: HTML de pages/index.ts (estático)
    B->>App: hidratação do React

    App->>App: useRedirect() montado
    App->>App: useEffect executa (sem deps — bug BR no legado)

    App->>Router: router.pathname === '/404'?
    Router-->>App: NÃO → prossegue

    App->>LD: languageDetector.detect()
    LD->>LD: verifica cookie 'i18next'
    alt cookie encontrado
        LD-->>App: locale salvo (ex: 'ja')
    else cookie ausente
        LD->>B: lê navigator.languages[0]
        alt 'pt-BR' ou 'pt'
            LD-->>App: 'pt-BR'
        else 'ja'
            LD-->>App: 'ja'
        else qualquer outro
            LD-->>App: 'en' (fallback)
        end
    end

    App->>LD: languageDetector.cache('pt-BR')
    Note over LD: salva em cookie e localStorage

    App->>Router: router.asPath !== '/fullstack-profile/pt-BR/dev/...'?
    Router-->>App: SIM (estamos em '/')

    App->>Router: router.push('/fullstack-profile/pt-BR/dev/gabriel-toshinori-nakano/')
    Router->>GHP: GET /fullstack-profile/pt-BR/dev/gabriel-toshinori-nakano/
    GHP-->>B: HTML de gabriel.tsx pré-gerado para pt-BR
    B->>App: re-hidratação com strings PT-BR
```

**Hops totais na primeira visita:** 2 redirects client-side antes do conteúdo aparecer.
**Impacto:** em conexões lentas, o visitante pode perceber o delay entre a URL raiz e a URL final.

---

## Fluxo 2 — Geração Estática em Build Time

```mermaid
flowchart TD
    A[npm run build] --> B[Next.js processa pages/locale/dev/gabriel.tsx]
    B --> C[getStaticPaths chamado]
    C --> D[retorna 3 paths:\nen, ja, pt-BR]
    D --> E1[getStaticProps para 'en']
    D --> E2[getStaticProps para 'ja']
    D --> E3[getStaticProps para 'pt-BR']

    E1 --> F1[serverSideTranslations 'en' common\ncarrega public/locales/en/common.json]
    E2 --> F2[serverSideTranslations 'ja' common\ncarrega public/locales/ja/common.json]
    E3 --> F3[serverSideTranslations 'pt-BR' common\ncarrega public/locales/pt-BR/common.json]

    F1 --> G1[gera out/en/dev/gabriel-toshinori-nakano/index.html\nstrings EN no bundle]
    F2 --> G2[gera out/ja/dev/gabriel-toshinori-nakano/index.html\nstrings JA no bundle]
    F3 --> G3[gera out/pt-BR/dev/gabriel-toshinori-nakano/index.html\nstrings PT-BR no bundle]

    G1 & G2 & G3 --> H[GitHub Actions deploy\npasta out/ → gh-pages branch]
```

**Nota sobre `serverSideTranslations`:** apesar do nome sugerir execução no servidor, em `output: 'export'` esta função roda exclusivamente em build time. As strings ficam serializadas no HTML estático e no bundle JS — não há fetch de traduções em runtime.

**`fallback: false`:** qualquer locale não listado em `getStaticPaths` resulta em 404 estático. Não há geração sob demanda.

---

## Fluxo 3 — Troca Manual de Idioma (ChangeLanguage Widget)

```mermaid
sequenceDiagram
    participant V as Visitante
    participant CL as ChangeLanguage
    participant Prefix as prefix.ts
    participant Router as next/router
    participant App as React App

    Note over V,App: Visitante está em /fullstack-profile/en/dev/gabriel-toshinori-nakano/

    V->>CL: clica em "日本語"
    CL->>Prefix: prefix (= '/fullstack-profile' em prod, '' em dev)
    CL->>Router: router.push(prefix + '/ja/dev/gabriel-toshinori-nakano/')

    alt Ambiente de desenvolvimento
        Note over Router: router.push('/ja/dev/gabriel-toshinori-nakano/')
    else Produção (GitHub Pages)
        Note over Router: router.push('/fullstack-profile/ja/dev/gabriel-toshinori-nakano/')
    end

    Router->>App: navegação client-side para rota JA
    App->>App: componente re-hidrata
    App->>App: useTranslation('common') retorna strings japonesas
    App-->>V: conteúdo exibido em japonês

    Note over CL: locale atual destacado visualmente no widget
```

**Por que o `prefix` é crítico aqui (BR-09):**
Sem `prefix`, em produção, `router.push('/ja/dev/...')` navega para `gtoshinakano.github.io/ja/dev/...` (raiz do GitHub, não dentro de `/fullstack-profile/`) — resultando em 404. Este foi um bug de produção corrigido no commit `e33d3e7` (Aug 10, 2022).

**Cache do locale após troca manual:**
Na reimplementação, `ChangeLanguage` chamará `languageDetector.cache(locale)` antes de `router.push()` — a preferência é salva imediatamente, garantindo que a próxima visita redirecione para o locale escolhido manualmente. 🟢 [Decisão confirmada — Pergunta 10]
