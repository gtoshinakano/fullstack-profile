# Perguntas para Validação — fullstack-profile

> Gerado pelo Revisor em 2026-05-17
> Responda cada pergunta preenchendo o campo **Resposta** e me avise quando terminar (basta digitar `reversa`).

---

## Pergunta 1

**Contexto:** `gabriel.tsx` usa `Pace.on('done', cb)` como gate de loading. Se o CDN do Pace.js estiver inacessível, o portfólio inteiro fica oculto indefinidamente — nenhum conteúdo é exibido.
**Spec afetada:** [`_reversa_sdd/hero-section/tasks.md#Lacunas`], [`_reversa_sdd/layout/tasks.md#Lacunas`]
**Pergunta:** Você quer adicionar um timeout de fallback em `gabriel.tsx` que força `loading=false` após N segundos caso o evento `done` do Pace.js nunca chegue? Se sim, qual deve ser o timeout (ex: 5 segundos)?
**Impacto:** Se sim: criar tarefa T-10 em `hero-section/tasks.md` com lógica de fallback. Se não: manter o risco documentado como 🔴 no relatório final.

**Resposta:** 5 segundos

---

## Pergunta 2

**Contexto:** 5 projetos em `toshi-projects.json` compartilham `label: "requirement"` (AXA requirement design, NBWF, local-file-uploader, web-template-string, underwriting improvement). Isso causa comportamento de accordion agrupado: clicar em qualquer um expande todos os 5.
**Spec afetada:** [`_reversa_sdd/data/tasks.md#T-03`], [`_reversa_sdd/hero-dark/tasks.md#T-13`]
**Pergunta:** Você quer corrigir o bug BR-07 atribuindo labels únicos a esses 5 projetos? Se sim, qual label único deve ser atribuído a cada um? (ex: `"axa-requirement"`, `"nbwf-requirement"`, `"local-file-uploader"`, `"web-template-string"`, `"underwriting-improvement"`)
**Impacto:** Se sim: atualizar `toshi-projects.json` + migrar `Projects.tsx` de `expanded.includes(label)` para `expanded.includes(id)`. Se não: manter o bug como comportamento intencional do legado.

**Resposta:** `"axa-requirement"`, `"nbwf-requirement"`, `"local-file-uploader"`, `"web-template-string"`, `"underwriting-improvement"`

---

## Pergunta 3

**Contexto:** Os três links sociais ao final do artigo ("Let's connect", "Share this page", "Buy me a Coffee") são elementos `<span>` sem `href`, sem `onClick` — puramente decorativos (BR-11).
**Spec afetada:** [`_reversa_sdd/main-content/tasks.md#Lacunas`]
**Pergunta:** Você quer implementar esses links como funcionais na reimplementação? Se sim, quais serão os destinos? (ex: LinkedIn, Twitter/X, Ko-fi URL)
**Impacto:** Se sim: transformar os `<span>` em `<a href="...">` com targets reais. Se não: manter como elementos decorativos conforme o legado.

**Resposta:** Sim, O link para o linkedin: `https://www.linkedin.com/in/gabriel-toshinori-nakano-5b2ba696/` e remova o Buy Me a Coffee

---

## Pergunta 4

**Contexto:** O artigo "3-3-3 Principles for a Better UX" está em inglês fixo, sem tradução para PT-BR ou JA (BR-10). Visitantes brasileiros com inglês limitado são um público potencial da aba FuturePartner.
**Spec afetada:** [`_reversa_sdd/main-content/tasks.md#Lacunas`]
**Pergunta:** Você quer internacionalizar o artigo para PT-BR (e/ou JA) na reimplementação?
**Impacto:** Se sim: adicionar chaves i18n no `common.json` para os 9 princípios + estrutura de `Introduction` com `useTranslation`. Se não: manter o artigo em inglês fixo como decisão de produto.

**Resposta:** Sim, quero estruturar a internacionalizacao para toda a aplicacao, inclusive para o artigo.

---

## Pergunta 5

**Contexto:** O artigo está escrito como ~630 linhas de JSX hardcoded em `Introduction.tsx`. Manutenção requer edição manual de código React, não de conteúdo editorial simples.
**Spec afetada:** [`_reversa_sdd/main-content/tasks.md#Lacunas`]
**Pergunta:** Você quer migrar o artigo para MDX (ou Markdown puro) na reimplementação para facilitar edições futuras sem tocar em componentes React?
**Impacto:** Se sim: adicionar dependência `@next/mdx` ou `next-mdx-remote`, criar `content/article.mdx`, adaptar `Introduction.tsx` como wrapper MDX. Se não: manter o JSX hardcoded conforme o legado.

**Resposta:** Sim, quero refatorar esta parte com markdown, porem tenha em mente que os estilos devem continuar os mesmos de antes da refatoracao. 

---

## Pergunta 6

**Contexto:** O arquivo `src/config.jsx` aparece na análise do legado mas não foi encontrado em uso por nenhum componente ativo. O Scout e o code-spec-matrix listam-no como potencialmente dead code ("header não renderizado").
**Spec afetada:** [`_reversa_sdd/traceability/code-spec-matrix.md`]
**Pergunta:** O arquivo `src/config.jsx` é dead code e pode ser removido? Ou ele tem algum propósito que não é óbvio pela análise estática do código?
**Impacto:** Se for dead code: não incluí-lo na reimplementação e registrar como remoção intencional. Se tiver propósito: criar spec para ele e cobrir na code-spec-matrix.

**Resposta:** Se ele nao causar nenhuma alteracao ou mal funcionamento da aplicacao, pode remover.

---

## Pergunta 7

**Contexto:** O hook `useRedirect` em `src/lib/redirect.js` usa `useEffect()` sem array de dependências. Isso faz o efeito rodar após cada render do componente (não apenas no mount). O guard `router.asPath !== target` evita loop infinito, mas a detecção de locale roda redundantemente.
**Spec afetada:** [`_reversa_sdd/i18n/tasks.md#T-03`]
**Pergunta:** O `useEffect` sem array de dependências em `useRedirect` foi intencional ou é um bug? A reimplementação está planejada para adicionar `[]` como correção.
**Impacto:** Se foi bug: correção com `[]` é confirmada (tarefa T-03 já documenta isso). Se foi intencional: investigar o motivo antes de corrigir.

**Resposta:** Foi intencional. Por favor verifique se existe uma melhor alternativa para obter o mesmo resultado.

---

## Pergunta 8

**Contexto:** O Pace.js é carregado via `<script>` CDN sem pinagem de versão. Mudanças breaking no CDN poderiam afetar o comportamento de loading do portfólio sem aviso prévio.
**Spec afetada:** [`_reversa_sdd/layout/tasks.md#Lacunas`]
**Pergunta:** Você prefere hospedar o Pace.js localmente em `public/pace.min.js` para eliminar a dependência de CDN externo na reimplementação?
**Impacto:** Se sim: baixar `pace.min.js`, servi-lo de `public/`, atualizar a URL do `<script>` em `layout/Public/index.tsx`. Se não: manter a dependência de CDN.

**Resposta:** Sim, por favor hospedar o pace para nao haver dependencia.

---

## Pergunta 9

**Contexto:** Os botões de aba (Profile, Projects, Message) em `HeroDark/index.tsx` não têm atributos ARIA (`role="tab"`, `aria-selected`, `aria-controls`). Isso impacta visitantes que usam leitores de tela.
**Spec afetada:** [`_reversa_sdd/hero-dark/tasks.md#Lacunas`], [`_reversa_sdd/hero-dark/requirements.md#RNF`]
**Pergunta:** Você quer implementar o padrão ARIA Tabs completo na reimplementação (`role="tablist"`, `role="tab"`, `aria-selected`, `aria-controls`, `role="tabpanel"`)?
**Impacto:** Se sim: adicionar atributos ARIA nos botões de aba e no painel de conteúdo, reclassificar o RNF de 🔴 para 🟢. Se não: manter o comportamento atual sem ARIA.

**Resposta:** Sim, melhorar a acessibilidade para leitores de tela.

---

## Pergunta 10

**Contexto:** O widget `ChangeLanguage` chama `router.push(prefix + '/' + locale + '/dev/...')` mas não chama `languageDetector.cache()` diretamente. Na próxima visita ao portfólio, o visitante que trocou de idioma manualmente pode ser redirecionado para o locale padrão do browser, não para o locale que escolheu.
**Spec afetada:** [`_reversa_sdd/i18n/flows.md#Fluxo-3`], [`_reversa_sdd/i18n/design.md`]
**Pergunta:** O `ChangeLanguage` deve salvar a preferência de locale no cookie/localStorage via `languageDetector.cache(locale)` ao trocar de idioma?
**Impacto:** Se sim: adicionar chamada a `languageDetector.cache(locale)` no handler do `ChangeLanguage`, reclassificando o comportamento de 🟡 para 🟢. Se não: aceitar que a preferência salva manualmente pode ser sobrescrita pelo browser locale.

**Resposta:** Sim, deve salvar e persistir o estado.
