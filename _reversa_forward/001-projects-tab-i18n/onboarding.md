# Onboarding: Como testar a feature Projects Tab i18n

> Identificador: `001-projects-tab-i18n`
> Data: `2026-05-17`
> Para: desenvolvedor ou revisor testando a feature pela primeira vez

## Pré-requisitos

- Node.js 24.x instalado
- Dependências instaladas: `npm install`
- Projeto clonado em branch que contém as mudanças desta feature

## Passo 1 — Verificar a correção do label duplicado

```bash
grep -n '"label": "portfolio"' src/data/toshi-projects.json
```

**Resultado esperado:** exatamente 1 ocorrência (linha ~301, "This Portfolio..."). Se aparecer 2, o RF-04 não foi aplicado.

```bash
grep -n '"label": "anki-web"' src/data/toshi-projects.json
```

**Resultado esperado:** exatamente 1 ocorrência (entrada da "Japanese Kanji Memorization Application").

## Passo 2 — Verificar os arquivos de tradução

```bash
ls public/locales/ja/
# Deve listar: common.json  future-partner.json  projects-data.json

ls public/locales/pt-BR/
# Deve listar: common.json  future-partner.json  projects-data.json
```

Verificar que o arquivo tem 19 entradas:

```bash
cat public/locales/ja/projects-data.json | python3 -c "import json,sys; d=json.load(sys.stdin); print(len(d), 'entries')"
# Resultado esperado: 19 entries (ou 21 se o total real de projetos for 21)
```

## Passo 3 — Rodar o build

```bash
npm run build
```

**Resultado esperado:** build conclui sem erro. Os 3 locales (en, ja, pt-BR) devem ser gerados em `out/`.

```bash
ls out/ja/dev/gabriel-toshinori-nakano/
ls out/pt-BR/dev/gabriel-toshinori-nakano/
```

## Passo 4 — Servir e testar em localhost

```bash
npm run dev
```

Abrir no browser:

| URL | O que verificar |
|-----|-----------------|
| `http://localhost:3000/ja/dev/gabriel-toshinori-nakano/` | Conteúdo dos projetos em japonês |
| `http://localhost:3000/pt-BR/dev/gabriel-toshinori-nakano/` | Conteúdo dos projetos em português |
| `http://localhost:3000/en/dev/gabriel-toshinori-nakano/` | Conteúdo dos projetos em inglês (inalterado) |

## Passo 5 — Verificar a aba Projects

1. Clicar na aba **Projects** / **プロジェクト** / **Projetos** no menu sticky
2. Clicar em **Expand All** / **詳細表示** / **Expandir Tudo**
3. Verificar que o conteúdo de `title`, `learnings`, `public`, `problem`, `solution` aparece no idioma correto
4. Verificar que `subtitle` (quando visível) continua em inglês/original

## Passo 6 — Verificar fallback graceful

No arquivo `public/locales/ja/projects-data.json`, remover temporariamente uma entrada (ex: `"maplestory"`). Reabrir a página em `/ja/`:

- O projeto "MapleBR Private Server" deve aparecer com conteúdo em inglês (fallback)
- Nenhuma chave i18n visível na UI (`"projects-data:maplestory.title"` não deve aparecer)
- Console do DevTools sem warnings de i18n

Desfazer a remoção após o teste.

## Passo 7 — Verificar accordion independente

1. Acessar qualquer locale
2. Clicar no projeto "This Portfolio" — apenas ele deve expandir
3. Clicar no projeto "Japanese Kanji Memorization Application" — apenas ele deve expandir (independentemente do anterior)
4. Os dois podem estar expandidos simultaneamente sem interferência

## Passo 8 — Verificar badge de tipo traduzido

Em `/ja/dev/...`, os badges de tipo dos projetos devem exibir:
- `個人` (personal)
- `仕事` (job)
- `ボランティア` (volunteer)
- `フリーランス` (freelance)
- `オープンソース` (open source)

## Checklist final

- [ ] Label `anki-web` único no JSON
- [ ] Arquivos `projects-data.json` presentes em `ja/` e `pt-BR/`
- [ ] `npm run build` sem erro
- [ ] Conteúdo traduzido visível em `/ja/` e `/pt-BR/`
- [ ] Fallback em inglês para campo sem tradução (sem chave visível)
- [ ] Accordion de "portfolio" e "anki-web" funcionam independentemente
- [ ] Badges de tipo traduzidos por locale
- [ ] DevTools sem warnings i18n
