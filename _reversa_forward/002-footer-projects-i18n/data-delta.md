# Data Delta: Footer and Projects Labels i18n

> Identifier: `002-footer-projects-i18n`
> Date: `2026-05-17`

## 1. Mudanças em arquivos existentes

### `src/data/toshi-projects.json`

| Linha (aprox.) | Campo | Antes | Depois | Motivo |
|--------------------|-------|-------|--------|--------|
| Para cada uma das 19 entradas | `action.label` | `"Use it for free "` / `"Visit Guide"` / `"See"` / `""` etc. | **Removido** (o campo `label` dentro de `action` é deletado) | Label movida para `projects-data.json` nos 3 locales; JSON fica apenas com `action.url` |
| Para cada uma das 19 entradas | `action` | `{ "label": "...", "url": "..." }` | `{ "url": "..." }` | Objeto `action` simplificado, contendo apenas URL |

**Exemplo de entrada antes:**
```json
{
  "label": "bingo",
  "title": "Bingo Screen for Matsuri Events",
  "action": {
    "label": "Use it for free ",
    "url": "https://gtoshinakano.github.io/bingo-screen/"
  },
  ...
}
```

**Exemplo de entrada depois:**
```json
{
  "label": "bingo",
  "title": "Bingo Screen for Matsuri Events",
  "action": {
    "url": "https://gtoshinakano.github.io/bingo-screen/"
  },
  ...
}
```

### `public/locales/en/common.json`

Adição de 2 chaves no nível raiz:

```json
{
  ...existente...,
  "lets-connect": "Let's connect",
  "share-this-page": "Share this page"
}
```

### `public/locales/ja/common.json`

Adição de 2 chaves no nível raiz:

```json
{
  ...existente...,
  "lets-connect": "コネクト",
  "share-this-page": "このページをシェア"
}
```

### `public/locales/pt-BR/common.json`

Adição de 2 chaves no nível raiz:

```json
{
  ...existente...,
  "lets-connect": "Vamos conectar",
  "share-this-page": "Compartilhe esta página"
}
```

### `public/locales/en/projects-data.json` (NOVO)

**Nota:** Este arquivo não existia na feature 001 (usava `defaultValue`). Agora é obrigatório porque o `action.label` será removido do JSON.

Schema para cada uma das 19 entradas:

```json
{
  "maplestory": {
    "title": "MapleBR Private Server",
    "learnings": "A good way to learn how to code is by testing things made by others",
    "public": "Friends",
    "problem": "I needed to practice what I've studied at the University...",
    "solution": "I built a custom MapleStory private server...",
    "action": "View Live"
  },
  "bingo": {
    ...existente...,
    "action": "Use it for free"
  },
  ...19 entradas...
}
```

**Valores `action` por projeto (extraídos do `toshi-projects.json` atual):**

| Label | Action (en) |
|-------|--------------|
| maplestory | (vazio) |
| sigup | (vazio) |
| bingo | Use it for free |
| mailer | (vazio) |
| cashier | (vazio) |
| noli | (vazio) |
| aliber | (vazio) |
| jpn-utils | (vazio) |
| ros | Visit Guide |
| ecoid | See |
| ishikari | See |
| asebase | View code and video |
| gustavo-amaral | See |
| onoda | See |
| portfolio | This page |
| axa-requirement | (vazio) |
| anki-web | (vazio) |
| nbwf-requirement | (vazio) |
| local-file-uploader | (vazio) |
| web-template-string | (vazio) |
| underwriting-improvement | (vazio) |

### `public/locales/ja/projects-data.json`

Mesmas 19 entradas, com `"action"` traduzido para japonês:

| Label | Action (ja) |
|-------|--------------|
| maplestory | (vazio) |
| sigup | (vazio) |
| bingo | 無料で使う |
| mailer | (vazio) |
| cashier | (vazio) |
| noli | (vazio) |
| aliber | (vazio) |
| jpn-utils | (vazio) |
| ros | ガイドを見る |
| ecoid | 見る |
| ishikari | 見る |
| asebase | コードと動画を見る |
| gustavo-amaral | 見る |
| onoda | 見る |
| portfolio | このページ |
| axa-requirement | (vazio) |
| anki-web | (vazio) |
| nbwf-requirement | (vazio) |
| local-file-uploader | (vazio) |
| web-template-string | (vazio) |
| underwriting-improvement | (vazio) |

### `public/locales/pt-BR/projects-data.json`

Mesmas 19 entradas, com `"action"` traduzido para português:

| Label | Action (pt-BR) |
|-------|--------------|
| maplestory | (vazio) |
| sigup | (vazio) |
| bingo | Use grátis |
| mailer | (vazio) |
| cashier | (vazio) |
| noli | (vazio) |
| aliber | (vazio) |
| jpn-utils | (vazio) |
| ros | Visite o guia |
| ecoid | Ver |
| ishikari | Ver |
| asebase | Ver código e vídeo |
| gustavo-amaral | Ver |
| onoda | Ver |
| portfolio | Esta página |
| axa-requirement | (vazio) |
| anki-web | (vazio) |
| nbwf-requirement | (vazio) |
| local-file-uploader | (vazio) |
| web-template-string | (vazio) |
| underwriting-improvement | (vazio) |

## 2. Arquivos novos

### `public/locales/en/projects-data.json`

Criado com 19 entradas contendo `title`, `learnings`, `public`, `problem`, `solution` (já existentes da feature 001) **mais** `action` (novo campo, com valores em inglês extraídos do JSON original).

## 3. Arquivos não alterados

| Arquivo | Motivo |
|---------|--------|
| `src/data/jobs.json` | Não tocado — fora do escopo |
| `src/data/stacks.json` | Não tocado — não tocado |
| `src/data/swtools.json` | Não tocado — fora do escopo |
| `next-i18next.config.js` | Namespaces já configurados corretamente |

## 4. Campos fora do escopo de tradução

| Campo | Motivo da exclusão |
|-------|--------------------|
| `action.url` | URL universal, não traduz — permanece em `toshi-projects.json` |
| `subtitle` | URLs ou nomes de empresa — não narrativo |
| `period` | Datas e intervalos — dados estruturais |
| `type` | Já traduzido via `project-types` em `common.json` (feature 001) |
| `where` | Nome de local/empresa — nome próprio |
| `country` | Emoji de bandeira — universal |
| `stacks` | Nomes de tecnologia — universais |
