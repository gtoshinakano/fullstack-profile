# Data Delta: Projects Tab — i18n for Project Content

> Identificador: `001-projects-tab-i18n`
> Data: `2026-05-17`

## 1. Mudanças em arquivos existentes

### `src/data/toshi-projects.json`

| Linha | Campo | Antes | Depois | Motivo |
|-------|-------|-------|--------|--------|
| 339 | `label` | `"portfolio"` | `"anki-web"` | Label duplicado com o projeto "This Portfolio" (linha 301); chave única necessária para accordion e namespace i18n |

Nenhum outro campo é alterado. Nenhuma entrada é adicionada ou removida.

### `public/locales/en/common.json`

Adição da sub-chave `project-types` (valores canônicos em inglês):

```json
"project-types": {
  "personal": "Personal",
  "job": "Job",
  "volunteer": "Volunteer",
  "freelance": "Freelance",
  "open source": "Open Source"
}
```

### `public/locales/ja/common.json`

Adição da sub-chave `project-types` em japonês:

```json
"project-types": {
  "personal": "個人",
  "job": "仕事",
  "volunteer": "ボランティア",
  "freelance": "フリーランス",
  "open source": "オープンソース"
}
```

### `public/locales/pt-BR/common.json`

Adição da sub-chave `project-types` em português:

```json
"project-types": {
  "personal": "Pessoal",
  "job": "Emprego",
  "volunteer": "Voluntário",
  "freelance": "Freelance",
  "open source": "Open Source"
}
```

### `pages/[locale]/index.ts`

```ts
// Antes:
const getStaticProps = makeStaticProps(['common', 'future-partner'])

// Depois:
const getStaticProps = makeStaticProps(['common', 'future-partner', 'projects-data'])
```

### `src/components/views/dev/gabriel/HeroDark/Projects.tsx`

```ts
// Antes:
const { t } = useTranslation()

// Depois:
const { t } = useTranslation(['common', 'projects-data'])
```

Cada campo textual de `item` envolvido por `t()` com `defaultValue`:

```tsx
// Antes:
{item.title}
{item.learnings}
{item.public}
{item.problem}
{item.solution}
{item.type}  // badge de tipo

// Depois:
{t(`projects-data:${item.label}.title`, { defaultValue: item.title })}
{t(`projects-data:${item.label}.learnings`, { defaultValue: item.learnings })}
{t(`projects-data:${item.label}.public`, { defaultValue: item.public })}
{t(`projects-data:${item.label}.problem`, { defaultValue: item.problem })}
{t(`projects-data:${item.label}.solution`, { defaultValue: item.solution })}
{t(`project-types.${item.type}`, { defaultValue: item.type })}  // badge de tipo
```

`item.subtitle` permanece sem `t()`.

## 2. Arquivos novos

### `public/locales/ja/projects-data.json`

Schema:
```json
{
  "<label>": {
    "title": "<título em japonês>",
    "learnings": "<aprendizado em japonês>",
    "public": "<público-alvo em japonês>",
    "problem": "<problema em japonês>",
    "solution": "<solução em japonês>"
  },
  ...
}
```

19 entradas, uma por projeto. Labels: `maplestory`, `sigup`, `bingo`, `mailer`, `cashier`, `noli`, `aliber`, `jpn-utils`, `ros`, `ecoid`, `ishikari`, `asebase`, `gustavo-amaral`, `onoda`, `portfolio`, `axa-requirement`, `anki-web`, `nbwf-requirement`, `local-file-uploader`, `web-template-string`, `underwriting-improvement`.

### `public/locales/pt-BR/projects-data.json`

Schema idêntico ao `ja/projects-data.json`, com conteúdo em português brasileiro.

## 3. Arquivos não criados

- `public/locales/en/projects-data.json` — **não criado**. O locale `en` usa o `defaultValue` nativo (conteúdo do JSON) como fonte canônica. Criá-lo seria duplicação (violaria RN-01).

## 4. Campos fora do escopo de tradução

| Campo | Motivo da exclusão |
|-------|--------------------|
| `subtitle` | URLs, nomes de empresa, strings vazias — não narrativo |
| `period` | Datas e intervalos — dados estruturais |
| `type` | Traduzido globalmente via `project-types` em `common.json`, não por entrada |
| `where` | Nome de local/empresa — nome próprio |
| `country` | Emoji de bandeira — universal |
| `stacks` | Nomes de tecnologia — universais |
| `action.label` | Fora do escopo (RF-08 classificado como Could, não implementado nesta iteração) |
| `action.url` | URL — nunca traduzir |
