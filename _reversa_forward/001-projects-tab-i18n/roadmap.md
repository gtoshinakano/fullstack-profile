# Roadmap: Projects Tab — i18n for Project Content

> Identificador: `001-projects-tab-i18n`
> Data: `2026-05-17`
> Requirements: `_reversa_forward/001-projects-tab-i18n/requirements.md`
> Confidência: 🟢 CONFIRMADO, 🟡 INFERIDO, 🔴 LACUNA

## 1. Resumo da abordagem

A feature é um delta cirúrgico de três camadas sobre o legado existente:

**Camada 1 — dados (pré-requisito):** corrigir o label duplicado `"portfolio"` em `toshi-projects.json` (linha 339, "Japanese Kanji Memorization Application") para `"anki-web"`. Esse campo é a chave primária do accordion e do sistema de tradução; sem a correção, os dois projetos colapsam juntos e o namespace i18n teria chaves ambíguas.

**Camada 2 — namespace i18n:** criar `public/locales/ja/projects-data.json` e `public/locales/pt-BR/projects-data.json` seguindo o padrão já estabelecido por `future-partner.json`. Cada arquivo é um objeto JSON flat-by-label: `{ "<label>": { "title": "...", "learnings": "...", "public": "...", "problem": "...", "solution": "..." } }`. O locale `en` não recebe arquivo — o componente usa o JSON como fallback nativo. O namespace `projects-data` é adicionado ao array de namespaces em `pages/[locale]/index.ts` (de `['common', 'future-partner']` para `['common', 'future-partner', 'projects-data']`).

**Camada 3 — componente:** `Projects.tsx` passa a chamar `useTranslation(['common', 'projects-data'])` e envolve cada campo textual com `t('projects-data:<label>.<campo>', { defaultValue: item.<campo> })`. O mecanismo nativo do i18next devolve o `defaultValue` quando a chave não existe no bundle carregado — sem warnings, sem chaves visíveis, sem fallback manual necessário. O campo `subtitle` permanece lido diretamente do JSON (não passa por `t()`). O campo `type` é traduzido via `t('project-types.<valor>', { defaultValue: item.type })` usando uma nova sub-chave em `common.json`.

Nenhuma dependência nova é introduzida. O mecanismo de tradução (`next-i18next`, `react-i18next`) já está instalado e funcional — basta estender o padrão existente do namespace `future-partner`.

## 2. Princípios aplicados

> Arquivo `.reversa/principles.md` não encontrado — seção registrada como n/a.

| Princípio | Como a feature se relaciona | Status |
|-----------|------------------------------|--------|
| n/a | Nenhum arquivo de princípios encontrado no projeto | — |

## 3. Decisões técnicas

| ID | Decisão | Justificativa | Alternativas descartadas | Confidência |
|----|---------|----------------|--------------------------|-------------|
| D-01 | Namespace separado `projects-data` em vez de adicionar chaves a `common.json` | `common.json` já contém ~43 chaves de UI; misturar conteúdo de 19 projetos (~95 chaves) tornaria o arquivo difícil de manter. O padrão `future-partner` como namespace próprio já existe no projeto | Adicionar tudo em `common.json`; usar arquivo JSON separado por projeto (19 arquivos) | 🟢 |
| D-02 | `defaultValue` no `t()` como mecanismo de fallback | i18next oferece `defaultValue` nativamente — a ausência de uma chave no bundle retorna o valor passado sem warning quando `saveMissing: false` (padrão). Zero código extra de fallback | `try/catch` manual; verificação `i18n.exists()`; arquivo `en/projects-data.json` com cópia do JSON | 🟢 |
| D-03 | Label `"anki-web"` para a "Japanese Kanji Memorization Application" | Aprovado pelo autor na sessão de clarify (2026-05-17). Reflete o domínio `anki.web.app` do projeto | `kanji-app`, `spaced-repetition`, `anki-flash` | 🟢 |
| D-04 | Campo `subtitle` excluído dos campos traduzíveis | Subtítulos no JSON são URLs (`https://anki.web.app/`), nomes de empresa (`WeDoIT.jp`) ou vazios — nenhum é texto de narrativa. Decisão do autor na sessão de clarify | Traduzir subtítulos descritivos seletivamente | 🟢 |
| D-05 | Tipos de projeto (`type`) traduzidos via sub-chave em `common.json` | São 5 valores fixos, reutilizáveis em contextos futuros, não pertencem ao namespace de conteúdo de projeto | Sub-chave em `projects-data.json`; mapeamento em componente | 🟢 |
| D-06 | Namespace `projects-data` adicionado em `pages/[locale]/index.ts` | É o único ponto onde `makeStaticProps` é chamado — incluir o namespace aqui carrega o bundle nos 3 locales em build time, seguindo o padrão existente | Carregar namespace em `getStaticProps` da página diretamente | 🟢 |

## 4. Premissas

Nenhuma premissa de `[DÚVIDA]` não resolvida. Todos os esclarecimentos foram integrados ao `requirements.md`.

## 5. Delta arquitetural

| Componente | Arquivo de origem no legado | Tipo de mudança | Resumo |
|------------|------------------------------|-----------------|--------|
| `Projects()` | `_reversa_sdd/code-analysis.md#Feature 2 — hero-dark` | regra-alterada | Passa a consumir namespace `projects-data` via `useTranslation`; campos textuais envolvidos por `t()` com `defaultValue` |
| `toshi-projects.json` | `_reversa_sdd/data/requirements.md#Responsabilidades` | regra-alterada | Label da entrada "Japanese Kanji Memorization App" corrigido de `"portfolio"` para `"anki-web"` |
| `pages/[locale]/index.ts` | `_reversa_sdd/i18n/design.md#Fluxo Principal — Build Time` | contrato-alterado | Namespace `projects-data` adicionado ao array de `makeStaticProps` |
| `public/locales/ja/common.json` | `_reversa_sdd/i18n/requirements.md#Responsabilidades` | regra-alterada | Sub-chave `project-types` adicionada com tradução dos 5 tipos |
| `public/locales/pt-BR/common.json` | `_reversa_sdd/i18n/requirements.md#Responsabilidades` | regra-alterada | Sub-chave `project-types` adicionada com tradução dos 5 tipos |
| `public/locales/en/common.json` | `_reversa_sdd/i18n/requirements.md#Responsabilidades` | regra-alterada | Sub-chave `project-types` adicionada (valores em inglês como fallback canônico) |
| `public/locales/ja/projects-data.json` | — | componente-novo | Namespace de conteúdo de projetos em japonês (19 entradas) |
| `public/locales/pt-BR/projects-data.json` | — | componente-novo | Namespace de conteúdo de projetos em PT-BR (19 entradas) |

## 6. Delta no modelo de dados

- **`toshi-projects.json`:** alteração pontual — 1 campo `label` muda de `"portfolio"` para `"anki-web"` na entrada da "Japanese Kanji Memorization Application" (linha 339). Nenhuma estrutura de campo é adicionada ou removida do JSON.
- **Novos arquivos de tradução:** dois arquivos JSON novos (`ja/projects-data.json`, `pt-BR/projects-data.json`) com schema `{ [label]: { title, learnings, public, problem, solution } }`.
- Detalhe completo em: `_reversa_forward/001-projects-tab-i18n/data-delta.md`

## 7. Delta de contratos externos

Nenhum contrato externo afetado. A feature é inteiramente client-side com dados bundled em build time — sem HTTP, filas ou APIs envolvidas.

## 8. Plano de migração

1. **Corrigir label duplicado** em `toshi-projects.json` (`"portfolio"` → `"anki-web"` na entrada do Kanji app) — pré-requisito para todas as etapas seguintes.
2. **Criar `public/locales/ja/projects-data.json`** com as 19 entradas traduzidas em japonês.
3. **Criar `public/locales/pt-BR/projects-data.json`** com as 19 entradas traduzidas em português.
4. **Adicionar sub-chave `project-types`** nos três arquivos `common.json` (en, ja, pt-BR).
5. **Atualizar `pages/[locale]/index.ts`** para incluir `'projects-data'` na lista de namespaces.
6. **Atualizar `Projects.tsx`** para usar `useTranslation(['common', 'projects-data'])` e envolver campos textuais com `t()` + `defaultValue`.
7. **Verificar build** (`npm run build`) — garantir que os 3 locales compõem sem erro.
8. **Verificar runtime** — abrir `/ja/dev/...` e `/pt-BR/dev/...`, confirmar conteúdo traduzido nos projetos e fallback em inglês para eventual campo ausente.

## 9. Riscos e mitigações

| Risco | Impacto | Probabilidade | Mitigação |
|-------|---------|---------------|-----------|
| `accordion` usa `expanded: string[]` com `item.label` como chave — se o label `"portfolio"` mudar para `"anki-web"` e o visitante tiver o accordion já aberto em sessão (estado React), o estado não persiste entre navegações (sem localStorage) — impacto zero em prática | baixo | baixo | Não requer ação; estado é volátil por design |
| i18next emite warning `"key ... not found"` para projetos sem tradução se `saveMissing` não estiver desabilitado | médio | médio | Usar `defaultValue` explícito no `t()` suprime o warning nativamente; verificar `i18next.options.saveMissing` na config |
| Tradução de 19 projetos × 2 idiomas × 5 campos = ~190 strings — qualidade das traduções depende de revisão humana | médio | alto | Aceito como dado do escopo; autor valida as traduções antes do deploy |
| Build falha se `projects-data` for adicionado ao `makeStaticProps` mas os arquivos de locale não existirem ainda | alto | baixo | Criar os arquivos JSON antes de atualizar o `index.ts`; manter essa ordem no plano de migração |

## 10. Critério de pronto

- [ ] `toshi-projects.json` com label `"anki-web"` para o Kanji app; nenhum label duplicado remanescente
- [ ] `public/locales/ja/projects-data.json` com 19 entradas (todos os projetos)
- [ ] `public/locales/pt-BR/projects-data.json` com 19 entradas (todos os projetos)
- [ ] Sub-chave `project-types` presente nos três `common.json`
- [ ] `pages/[locale]/index.ts` incluindo namespace `projects-data`
- [ ] `Projects.tsx` usando `t()` com `defaultValue` para todos os campos textuais (exceto `subtitle`)
- [ ] `npm run build` conclui sem erro nos 3 locales
- [ ] Inspeção manual em `/ja/dev/...` e `/pt-BR/dev/...` confirma conteúdo no idioma correto
- [ ] DevTools sem warnings i18n de chave não encontrada
- [ ] Accordion dos dois projetos "portfolio" e "anki-web" funcionam independentemente

## 11. Histórico de alterações

| Data | Alteração | Autor |
|------|-----------|-------|
| 2026-05-17 | Versão inicial gerada por `/reversa-plan` | reversa |
