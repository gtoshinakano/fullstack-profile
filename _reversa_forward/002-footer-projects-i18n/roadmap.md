# Roadmap: Footer and Projects Labels i18n

> Identifier: `002-footer-projects-i18n`
> Date: `2026-05-17`
> Requirements: `_reversa_forward/002-footer-projects-i18n/requirements.md`
> Confidence: 🟢 CONFIRMED, 🟡 INFERRED, 🔴 GAP

## 1. Resumo da abordagem

A feature é um delta cirúrgico em duas frentes paralelas:

**Frente A — Footer em Introduction.tsx:** O rodapé do artigo (linhas 185-194) contém um link LinkedIn estático ("Let's connect") e um `<span>` não funcional ("Share this page"). As strings serão envolvidas por `t()` do namespace `common.json`, seguindo o padrão já usado no restante da UI. As chaves novas: `lets-connect` e `share-this-page` serão adicionadas em `common.json` (en, ja, pt-BR). O `<span>` "Share this page" permanece como elemento visual (sem implementar funcionalidade de compartilhamento).

**Frente B — Action labels dos projetos:** O campo `action.label` em `toshi-projects.json` (ex.: "See", "Visit Guide", "View code and video") será removido do JSON e movido para `projects-data.json` nos 3 locales, seguindo o mesmo padrão de `title`, `learnings`, etc. O `Projects.tsx` já usa `useTranslation(['common', 'projects-data'])`, bastando adicionar `t(\`projects-data:${item.label}.action\`)` onde o `item.action.label` é renderizado (linha 199). O campo `action.url` permanece no JSON (é uma URL, não traduz).

Nenhuma dependência nova é introduzida. O mecanismo `next-i18next` já está instalado e funcional.

## 2. Princípios aplicados

> Arquivo `.reversa/principles.md` não encontrado — seção registrada como n/a.

| Princípio | Como a feature se relaciona | Status |
|-----------|------------------------------|--------|
| n/a | Nenhum arquivo de princípios encontrado no projeto | — |

## 3. Decisões técnicas

| ID | Decisão | Justificativa | Alternativas descartadas | Confidência |
|----|---------|----------------|--------------------------|-------------|
| D-01 | Campo `action.label` removido de `toshi-projects.json`; chave `action` adicionada em `projects-data.json` (en, ja, pt-BR) | Consolida todo conteúdo traduzível do projeto no namespace `projects-data`, seguindo o padrão estabelecido na feature 001-projects-tab-i18n. O `action.url` permanece no JSON pois é uma URL universal | Manter `action.label` no JSON e usar `defaultValue` como fallback; criar arquivo `en/projects-data.json` com cópia das labels | 🟢 |
| D-02 | `t(\`projects-data:${item.label}.action\`)` sem `defaultValue` | O campo `action` não existirá mais no JSON (removido), logo não há valor de fallback. As chaves devem estar presentes nos 3 locales | Usar `defaultValue: item.action.label` (não funcionaria pois o campo será removido) | 🟢 |
| D-03 | Footer de `Introduction.tsx` usa `t()` do namespace `common.json` | São apenas 2 strings ("Let's connect" e "Share this page") — não justifica novo namespace. O `common.json` já contém chaves de UI estática | Criar namespace `footer.json`; usar namespace `projects-data` (semântica errada) | 🟢 |
| D-04 | `<span>Share this page</span>` traduzido mas mantido como `<span>` não funcional | Usuário confirmou que o rodapé deve ser traduzido, mas não solicitou funcionalidade de compartilhamento. A feature 001 deixou "Buy me a Coffee" como gap histórico | Implementar `navigator.share()` ou `window.open()` para compartilhamento real | 🟢 |
| D-05 | `action.url` permanece em `toshi-projects.json` | URLs são universais, não traduzem. Remover do JSON exigiria duplicar nos 3 locales desnecessariamente | Mover `action.url` para `projects-data.json`; usar URL relativa via `prefix` | 🟢 |

## 4. Premissas

Nenhuma premissa de `[DÚVIDA]` não resolvida. Todas as dúvidas foram integradas ao `requirements.md` na sessão de clarificação.

## 5. Delta arquitetural

| Componente | Arquivo de origem no legado | Tipo de mudança | Resumo |
|------------|------------------------------|-----------------|--------|
| `Introduction()` | `_reversa_sdd/code-analysis.md#Feature 3 — main-content` | componente-alterado | Linhas 185-194: strings "Let's connect" e "Share this page" envolvidas por `t('lets-connect')` e `t('share-this-page')` do namespace `common` |
| `Projects()` | `_reversa_sdd/code-analysis.md#Feature 2 — hero-dark` | componente-alterado | Linha 199: `{item.action.label}` substituído por `{t(\`projects-data:${item.label}.action\`)}`; campo `action` removido de `toshi-projects.json` |
| `toshi-projects.json` | `_reversa_sdd/architecture.md#Component Map` | dados-alterados | Campo `action` (label + url) removido de todas as 19 entradas; permanece apenas `action.url`... **ERRADO** → na verdade o `action.url` deve permaneer, apenas o `action.label` é removido. Correção: `action` vira `{"url": "..."}` sem `label` | 🟢 |
| `public/locales/*/common.json` | `_reversa_sdd/code-analysis.md#Feature 5 — i18n` | contrato-alterado | Adição de chaves `lets-connect` e `share-this-page` em en, ja, pt-BR |
| `public/locales/*/projects-data.json` | `_reversa_sdd/code-analysis.md#Feature 2 — hero-dark` | contrato-alterado | Adição de chave `action` em cada entrada de projeto (19 entradas × 3 locales) |

## 6. Delta no modelo de dados

- Resumo das mudanças: O campo `action.label` é removido de `toshi-projects.json` (o `action.url` permanece). O campo `action` é adicionado em cada entrada de `projects-data.json` nos 3 locales. A chave `lets-connect` e `share-this-page` são adicionadas em `common.json`.
- Detalhe completo em: `_reversa_forward/002-footer-projects-i18n/data-delta.md`

## 7. Delta de contratos externos

Nenhum contrato externo é afetado. A feature altera apenas arquivos locais de i18n e componentes React.

## 8. Plano de migração

1. Atualizar `src/data/toshi-projects.json`: para cada uma das 19 entradas, remover `"label"` de dentro do objeto `"action"`, mantendo apenas `"url"`. Exemplo: `"action": { "url": "..." }`.
2. Atualizar `public/locales/en/projects-data.json`: adicionar `"action"` em cada uma das 19 entradas com o valor em inglês (ex.: `"maplestory": { ..., "action": "View Live" }`). **Nota:** o `en/projects-data.json` não existia na feature 001 (usava `defaultValue`), mas agora será criado porque o `action.label` será removido do JSON e precisa de fallback em inglês.
3. Atualizar `public/locales/ja/projects-data.json`: adicionar `"action"` em cada entrada com o valor em japonês.
4. Atualizar `public/locales/pt-BR/projects-data.json`: adicionar `"action"` em cada entrada com o valor em português brasileiro.
5. Atualizar `public/locales/en/common.json`: adicionar `"lets-connect": "Let's connect"` e `"share-this-page": "Share this page"`.
6. Atualizar `public/locales/ja/common.json`: adicionar `"lets-connect": "コネクト"` e `"share-this-page": "このページをシェア"`.
7. Atualizar `public/locales/pt-BR/common.json`: adicionar `"lets-connect": "Vamos conectar"` e `"share-this-page": "Compartilhe esta página"`.
8. Atualizar `src/components/views/dev/gabriel/MainContent/Introduction.tsx`: envolver "Let's connect" com `{t('lets-connect')}` e "Share this page" com `{t('share-this-page')}`.
9. Atualizar `src/components/views/dev/gabriel/HeroDark/Projects.tsx`: substituir `{item.action.label}` por `{t(\`projects-data:${item.label}.action\`)}`.

## 9. Riscos e mitigações

| Risco | Impacto | Probabilidade | Mitigação |
|-------|---------|---------------|-----------|
| Chave `action` ausente em algum locale de `projects-data.json` | Médio | Baixo | i18next retorna a chave como texto (ex.: `projects-data:maplestory.action`) quando `saveMissing: false` — visível mas não quebra a página |
| Esquecer de remover `action.label` de alguma entrada em `toshi-projects.json` | Baixo | Médio | O `Projects.tsx` não lerá mais `item.action.label`, então o campo ficará órfão mas sem efeito visual |
| Traduções de "Share this page" e "Let's connect" não capturam o tom original | Baixo | Baixo | Revisão manual por falante nativo; ajuste em `common.json` sem tocar no código |

## 10. Critério de pronto

- [ ] Todas as ações do `actions.md` marcadas `[X]`
- [ ] `regression-watch.md` gerado (se executado)
- [ ] Build (`npm run build`) conclui sem erro, pastas `out/en/`, `out/ja/`, `out/pt-BR/` geradas
- [ ] No `out/` estático, as strings do rodapé aparecem no idioma correto conforme o locale
- [ ] No `out/` estático, botões de ação dos projetos aparecem traduzidos conforme o locale
- [ ] `toshi-projects.json` não contém mais nenhum campo `"label"` dentro de `"action"`

## 11. Histórico de alterações

| Data | Alteração | Autor |
|------|-----------|-------|
| 2026-05-17 | Versão inicial gerada por `/reversa-plan` | reversa |
