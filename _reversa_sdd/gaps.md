# Gaps — fullstack-profile

> Gerado pelo Revisor em 2026-05-17
> Lacunas que permaneceram sem resposta após a revisão, organizadas por severidade.

---

## Crítico — Impacta reimplementação se não resolvido

### hero-section: Cleanup do GSAP ScrollTrigger
- **Tipo:** Ausência de comportamento no legado
- **Detalhe:** `WideScreen.tsx` usa `useEffect([loading])` para criar ScrollTrigger mas não retorna função de cleanup. Ao alternar entre WideScreen e Mobile (resize de landscape para portrait), a instância GSAP pode permanecer ativa. Correção recomendada: retornar `ScrollTrigger.getAll().forEach(t => t.kill())` ou usar `gsap.context().revert()` dentro do `useEffect`.
- **Spec afetada:** `hero-section/tasks.md#T-09`, `hero-section/design.md#Fluxos-Alternativos`
- **Pergunta correspondente:** N/A (decisão técnica, não de produto — implementar na reimplementação)

### hero-dark: Cleanup do GSAP ScrollTrigger
- **Tipo:** Ausência de comportamento no legado
- **Detalhe:** `HeroDark/index.tsx` usa `useLayoutEffect` para criar ScrollTrigger (carrossel de fotos e menu sticky) mas sem cleanup explícito no unmount. Pode causar conflitos de ScrollTrigger se o componente for remontado.
- **Spec afetada:** `hero-dark/design.md#Riscos`, `hero-dark/tasks.md#Lacunas`
- **Pergunta correspondente:** N/A (decisão técnica)

---

## Moderado — Afeta qualidade mas não bloqueia funcionamento

### layout: Fallback do Pace.js CDN
- **Tipo:** Ausência de resiliência
- **Detalhe:** Nenhum fallback implementado se o CDN do Pace.js não responder. Portfólio fica oculto indefinidamente.
- **Spec afetada:** `layout/requirements.md#RNF`, `hero-section/requirements.md#RNF`
- **Pergunta correspondente:** `questions.md#Pergunta-1`

### hero-dark: Accordion estado não persiste entre abas
- **Tipo:** Comportamento surpreendente documentado
- **Detalhe:** Ao trocar de aba (ex: ir para Jobs e voltar para Projects), `expanded[]` reseta para `[]`. O visitante perde o estado de qual projeto estava expandido.
- **Spec afetada:** `hero-dark/design.md#Estado-Interno`
- **Pergunta correspondente:** N/A (comportamento do legado; decisão de manter ou não está em Pergunta 2)

### data: Campo `images[]` potencialmente dead code
- **Tipo:** Schema sem uso confirmado
- **Detalhe:** Campo `images[]` presente no schema de `toshi-projects.json` mas sem referência encontrada em `Projects.tsx`. Pode ser legado de feature de galeria nunca implementada.
- **Spec afetada:** `data/design.md#Riscos`
- **Pergunta correspondente:** N/A (manter no schema para compatibilidade; não renderizar sem decisão de produto)

### analytics: Sem `.env.example`
- **Tipo:** Ausência de documentação de configuração
- **Detalhe:** O legado não tem `.env.example`. Novas instalações precisam conhecer `NEXT_PUBLIC_GOOGLE_ANALYTICS` e `NEXT_PUBLIC_BASE_PATH` sem referência documentada.
- **Spec afetada:** `analytics/tasks.md#Lacunas`, `layout/tasks.md#T-07`
- **Pergunta correspondente:** N/A (criar `.env.example` é decisão simples, já documentada como tarefa)

### i18n: Múltiplos hops de redirect na primeira visita
- **Tipo:** UX degradada em conexões lentas
- **Detalhe:** Primeira visita passa por 2 redirects client-side antes do conteúdo aparecer: `/` → `/{locale}/dev/...`. Sem loading state nessa transição.
- **Spec afetada:** `i18n/requirements.md#RNF`, `i18n/flows.md#Fluxo-1`
- **Pergunta correspondente:** N/A (consequência da arquitetura de static export documentada em ADR-002)

---

## Cosmético — Não afeta funcionamento

### main-content: Links sociais decorativos sem feedback visual
- **Tipo:** UX menor
- **Detalhe:** Os 3 links sociais são `<span>` sem `cursor: default` ou indicação visual de não-interatividade. Visitantes podem tentar clicar esperando ação.
- **Spec afetada:** `main-content/design.md#Riscos`
- **Pergunta correspondente:** `questions.md#Pergunta-3`

### hero-dark: `selected` não reflete na URL
- **Tipo:** Limitação de compartilhamento
- **Detalhe:** Não há query string ou hash para compartilhar uma aba específica diretamente (ex: `?tab=projects`).
- **Spec afetada:** `hero-dark/design.md#Riscos`
- **Pergunta correspondente:** N/A (comportamento do legado; melhoria de produto)

### i18n: `reloadOnPrerender: true` dead option
- **Tipo:** Configuração sem efeito
- **Detalhe:** Opção em `next-i18next.config.js` sem efeito em static export. Pode ser removida com segurança.
- **Spec afetada:** `i18n/design.md#BR-12`
- **Pergunta correspondente:** N/A (remover na reimplementação conforme T-01)

### main-content: Sem markup semântico de artigo
- **Tipo:** Acessibilidade e SEO
- **Detalhe:** Ausência de `<article>`, `role="article"`, headings hierárquicos e sumário de navegação interno.
- **Spec afetada:** `main-content/requirements.md#RNF`
- **Pergunta correspondente:** N/A (melhoria; não bloqueia funcionamento)
