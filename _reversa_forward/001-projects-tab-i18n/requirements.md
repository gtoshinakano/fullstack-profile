# Requirements: Projects Tab — i18n for Project Content

> Identificador: `001-projects-tab-i18n`
> Data: `2026-05-17`
> Pasta da extração reversa: `_reversa_sdd/`
> Confidência: 🟢 CONFIRMADO, 🟡 INFERIDO, 🔴 LACUNA / DÚVIDA

## 1. Resumo executivo

O componente `Projects.tsx` exibe todo o conteúdo textual dos projetos (título, aprendizado, público-alvo, problema, solução) lido diretamente de `toshi-projects.json` — que está inteiramente em inglês. Visitantes em `/ja/` e `/pt-BR/` veem o conteúdo dos projetos sempre em inglês, quebrando a promessa multilíngue do portfólio. Esta feature cria uma camada de tradução para conteúdo de projetos usando um namespace i18n dedicado (`projects-data`), mantendo `toshi-projects.json` como única fonte de verdade para o inglês, com fallback automático para qualquer campo não traduzido, sem duplicação de dados e sem arquivos difíceis de manter. O escopo inclui entrega das traduções completas (JA e PT-BR) para os 19 projetos, além da correção do label duplicado `"portfolio"` (presente em dois projetos distintos).

## 2. Contexto a partir do legado

| Fonte | Trecho relevante | Confidência |
|-------|------------------|-------------|
| `_reversa_sdd/code-analysis.md#Feature 2 — hero-dark` | `Projects()` lê `toshi-projects.json` e renderiza `item.title`, `item.learnings`, `item.public`, `item.problem`, `item.solution` sem `t()` — sem tradução possível | 🟢 |
| `_reversa_sdd/i18n/requirements.md#Responsabilidades` | Sistema i18n suporta EN / JA / PT-BR via `useTranslation('common')` — apenas UI labels são traduzidas | 🟢 |
| `_reversa_sdd/i18n/design.md#Dependências` | Namespaces ativos: `common` e `future-partner`. `getStatic.js` carrega `['common', 'future-partner']` por padrão | 🟢 |
| `_reversa_sdd/data/requirements.md#Regras de Negócio` | BR-07 — campo `label` em `toshi-projects.json` deveria ser chave única por projeto; 5 entradas tinham `label: "requirement"` | 🟢 |
| `_reversa_sdd/data/requirements.md#Requisitos Funcionais` | RF-05 — labels duplicados são bug ativo; correção recomendada para reimplementação | 🟢 |
| `_reversa_sdd/architecture.md#Technical Debt Summary` | Bug alto: accordion colapsa 5 projetos juntos por `label` duplicado `"requirement"` | 🟢 |

## 3. Personas e cenários de uso

| Persona | Objetivo | Cenário-chave |
|---------|----------|---------------|
| Recrutador japonês | Ler histórico de projetos em japonês | Acessa `/ja/dev/gabriel...`, abre accordion do projeto "AXA NBWF" — conteúdo exibido em japonês |
| Recrutador brasileiro | Entender contexto dos projetos em português | Acessa `/pt-BR/dev/gabriel...` — problema e solução de cada projeto em PT-BR |
| Autor (Gabriel) | Adicionar tradução de um novo projeto sem duplicar JSON | Edita apenas `ja/projects-data.json` e `pt-BR/projects-data.json` com os campos traduzidos do novo projeto |
| Autor | Deixar um projeto sem tradução momentaneamente | Omite a entrada do projeto nos arquivos de tradução — componente exibe conteúdo em inglês (fallback) |

## 4. Regras de negócio novas ou alteradas

1. **RN-01:** `toshi-projects.json` permanece a única fonte de verdade para o conteúdo em inglês e para dados estruturais (period, stacks, cover, action.url, country, where). Nenhum dado estrutural é duplicado nos arquivos de tradução. 🟢
   - Origem no legado: `_reversa_sdd/data/requirements.md#Responsabilidades`
   - Tipo: nova

2. **RN-02:** Para cada campo de conteúdo textual de projeto (`title`, `learnings`, `public`, `problem`, `solution`), o componente exibe o texto no idioma ativo quando tradução disponível para aquela entrada; quando não disponível, exibe o conteúdo original em inglês do JSON — sem erro visível e sem chave i18n exposta na UI. O campo `subtitle` **não é traduzível** — é tratado como dado estrutural (URL, nome de empresa ou sigla). 🟢
   - Tipo: nova

3. **RN-03:** `action.label` de cada projeto (`"See"`, `"Visit Guide"`, etc.) é traduzível por projeto mas, quando não traduzido, exibe o valor original do JSON sem degradação de UX. 🟡
   - Tipo: nova

4. **RN-04:** O campo `type` de cada projeto (`"personal"`, `"job"`, `"volunteer"`, `"freelance"`, `"open source"`) é traduzido globalmente via `common.json` (lookup por valor), não por projeto individual. Isso evita repetir o mesmo tipo em dezenas de entradas de tradução. 🟢
   - Tipo: nova

5. **RN-05:** O locale `en` não requer arquivo `projects-data.json` — quando o locale ativo é `en`, o componente usa exclusivamente o conteúdo do JSON. Para `ja` e `pt-BR`, o arquivo `projects-data.json` pode existir com zero, alguns ou todos os projetos traduzidos. 🟢
   - Tipo: nova

6. **RN-06 (herdada, alterada):** O campo `label` de cada projeto em `toshi-projects.json` deve ser único — serve como chave primária para lookup de tradução e para o accordion. O único label duplicado ativo é `"portfolio"`, que aparece em dois projetos distintos: "This Portfolio and the 3-3-3 Principles For a Better UX" (label correto: `portfolio`) e "Japanese Kanji Memorization Application" (novo label aprovado: `anki-web`). A correção deve ocorrer antes de popular os arquivos de tradução. 🟢
   - Origem no legado: `_reversa_sdd/data/requirements.md#Regras de Negócio BR-07`
   - Tipo: alterada

## 5. Requisitos Funcionais

| ID | Requisito | Prioridade | Critério de aceite | Confidência |
|----|-----------|------------|--------------------|-------------|
| RF-01 | Criar namespace `projects-data` com arquivo `projects-data.json` em `public/locales/ja/` e `public/locales/pt-BR/` | Must | Build não falha; `useTranslation('projects-data')` disponível em `Projects.tsx` | 🟢 |
| RF-02 | `Projects.tsx` exibe conteúdo textual dos projetos (`title`, `learnings`, `public`, `problem`, `solution`) no idioma ativo; `subtitle` sempre exibido como dado estrutural (sem tradução); quando a tradução não existe para um campo, o conteúdo em inglês do JSON é exibido sem degradação visual ou erro | Must | Em locale `ja`, projeto com tradução exibe conteúdo em japonês; projeto sem tradução exibe conteúdo em inglês; DevTools sem warnings i18n | 🟢 |
| RF-03 | O namespace `projects-data` é incluído no carregamento de traduções em build time para os 3 locales | Must | Build gera bundle de tradução correto; namespace disponível em runtime sem fetch adicional | 🟢 |
| RF-04 | Corrigir o label duplicado `"portfolio"` em `toshi-projects.json`: renomear o label da "Japanese Kanji Memorization Application" para `"anki-web"` | Must | Accordion não colapsa os dois projetos simultaneamente; lookup de tradução por label `anki-web` funciona corretamente | 🟢 |
| RF-09 | Entregar arquivos `public/locales/ja/projects-data.json` e `public/locales/pt-BR/projects-data.json` populados com traduções dos campos `title`, `learnings`, `public`, `problem`, `solution` de todos os 19 projetos | Must | Visitante em locale `ja` ou `pt-BR` vê conteúdo dos projetos no idioma correto em todos os 19 itens | 🟢 |
| RF-05 | Criar `common.json` → seção `project-types` com traduções para: `"personal"`, `"job"`, `"volunteer"`, `"freelance"`, `"open source"` nos 3 locales | Should | Tipo do projeto exibido no idioma correto; nova entrada de `type` desconhecida exibe o valor original (fallback) | 🟡 |
| RF-06 | Arquivo `public/locales/en/projects-data.json` não é necessário — se existir, deve estar vazio (`{}`) | Should | Locale `en` funciona sem o arquivo; se presente, não interfere no comportamento | 🟢 |
| RF-07 | Para projetos sem tradução em `ja`/`pt-BR`, o conteúdo em inglês do JSON é exibido sem console error ou warning | Must | DevTools sem warnings de i18n; UX sem quebra visual | 🟢 |
| RF-08 | `action.label` de cada projeto é traduzível por chave `projects-data:<label>.action_label` com fallback para `item.action.label` | Could | Botão de ação exibe texto traduzido quando disponível | 🟡 |

## 6. Requisitos Não Funcionais

| Tipo | Requisito | Evidência ou justificativa | Confidência |
|------|-----------|----------------------------|-------------|
| Manutenibilidade | Adicionar tradução de novo projeto requer apenas adicionar uma entrada nos arquivos `ja/projects-data.json` e/ou `pt-BR/projects-data.json` — sem toque no componente ou na lógica de build | RN-01 + RN-02: fallback automático elimina obrigatoriedade de tradução completa | 🟢 |
| Manutenibilidade | Nenhum campo de `toshi-projects.json` é duplicado nos arquivos de tradução para o locale `en` | RN-01 e RN-05 | 🟢 |
| Performance | O novo namespace `projects-data` é carregado no bundle estático em build time — sem fetch em runtime | Padrão existente: `serverSideTranslations` em `getStaticProps` + static export | 🟢 |
| Consistência | O mecanismo de fallback deve ser transparente: ausência de tradução não produz chave visível (ex: `"projects-data:maplestory.title"`) | Configurar `saveMissing: false` ou usar `defaultValue` explícito no `t()` | 🟢 |

## 7. Critérios de Aceitação

```gherkin
Cenário: Projeto com tradução completa em japonês
  Dado que "public/locales/ja/projects-data.json" contém entrada para o projeto "asebase"
  Quando o visitante acessa "/ja/dev/gabriel-toshinori-nakano/" e abre o accordion do projeto "ASEBASE"
  Então os campos title, problem e solution são exibidos em japonês

Cenário: Projeto sem tradução em japonês
  Dado que "public/locales/ja/projects-data.json" não contém entrada para o projeto "bingo"
  Quando o visitante acessa "/ja/dev/gabriel-toshinori-nakano/" e abre o accordion do projeto "Bingo Screen"
  Então os campos são exibidos em inglês (conteúdo do toshi-projects.json)
  E não há console error nem chave i18n visível na UI

Cenário: Locale en sem arquivo projects-data.json
  Dado que "public/locales/en/projects-data.json" não existe
  Quando o build é executado com "npm run build"
  Então o build conclui sem erro
  E a página em inglês exibe o conteúdo do toshi-projects.json corretamente

Cenário: Labels duplicados corrigidos
  Dado que os 5 projetos anteriormente com label "requirement" têm labels únicos
  Quando o visitante clica em qualquer um desses projetos no accordion
  Então apenas aquele projeto expande (não os outros 4)
  E a chave de tradução "projects-data:<label-unico>.title" resolve corretamente

Cenário: Tipo do projeto traduzido
  Dado que "public/locales/ja/common.json" contém "project-types.volunteer" = "ボランティア"
  Quando o visitante acessa "/ja/dev/gabriel-toshinori-nakano/"
  Então o badge de tipo do projeto "Bingo Screen" exibe "ボランティア"

Cenário: Tipo desconhecido sem tradução
  Dado que um projeto futuro tem type: "contract" (sem entrada em project-types)
  Quando o visitante acessa qualquer locale
  Então o badge exibe "contract" (valor original) sem erro
```

## 8. Prioridade MoSCoW

| Item | MoSCoW | Justificativa |
|------|--------|---------------|
| RF-04 Corrigir label duplicado `portfolio` → `anki-web` | Must | Pré-requisito técnico: sem isso, a chave de tradução por label é ambígua e o accordion colapsa os dois projetos juntos |
| RF-09 Entregar traduções JA e PT-BR para 19 projetos | Must | Escopo acordado: feature não termina sem conteúdo traduzido nos arquivos |
| RF-01 Criar namespace projects-data | Must | Sem o namespace o mecanismo de tradução não existe |
| RF-02 Atualizar Projects.tsx com t() + defaultValue | Must | Núcleo da feature — habilita o fallback graceful |
| RF-03 Incluir namespace no serverSideTranslations | Must | Sem isso o bundle não inclui as traduções no build estático |
| RF-07 Sem erros em projetos não traduzidos | Must | Requisito de qualidade — UX não pode degradar parcialmente |
| RF-05 Tradução de project-types em common.json | Should | Melhora consistência, mas ausência não quebra nada |
| RF-06 Locale en sem projects-data.json | Should | Evita arquivo redundante; documentar comportamento esperado |
| RF-08 Tradução de action.label por projeto | Could | Baixo impacto — maioria dos botões são nomes próprios ou vazios |

## 9. Esclarecimentos

### Sessão 2026-05-17

- **Q:** Qual deve ser o label único para o projeto "Japanese Kanji Memorization Application" (atualmente `"portfolio"`, duplicado)?
  **R:** `anki-web`

- **Q:** O que esta feature deve entregar em termos de conteúdo traduzido?
  **R:** Infraestrutura + traduções completas para JA e PT-BR de todos os 19 projetos (RF-09 adicionado).

- **Q:** O campo `subtitle` deve ser incluído nos campos traduzíveis?
  **R:** Não — subtítulos são estruturais (URLs, nomes de empresa, siglas). Nunca traduzir (RN-02 e RF-02 atualizados).

## 10. Lacunas

Nenhuma lacuna em aberto. Todos os `[DÚVIDA]` resolvidos na sessão de 2026-05-17.

## 11. Histórico de alterações

| Data | Alteração | Autor |
|------|-----------|-------|
| 2026-05-17 | Versão inicial gerada por `/reversa-requirements` | reversa |
| 2026-05-17 | Esclarecimentos integrados via `/reversa-clarify`: label `anki-web`, escopo de tradução completa, `subtitle` excluído dos campos traduzíveis | reversa |
