# Investigation: Projects Tab — i18n for Project Content

> Identificador: `001-projects-tab-i18n`
> Data: `2026-05-17`

## 1. Padrão existente: namespace `future-partner`

O projeto já tem um precedente direto: o componente `FuturePartner.jsx` usa um namespace dedicado `future-partner` carregado por `makeStaticProps(['common', 'future-partner'])`. O arquivo `public/locales/{locale}/future-partner.json` existe nos 3 locales com conteúdo independente. O padrão a ser replicado para `projects-data` é idêntico — mesma estrutura de arquivo, mesma declaração em `makeStaticProps`, mesmo hook `useTranslation`.

## 2. Mecanismo de fallback do i18next

`i18next` suporta `defaultValue` como terceiro parâmetro (ou dentro do objeto de opções) do `t()`:

```ts
t('projects-data:maplestory.title', { defaultValue: item.title })
```

Quando a chave `maplestory.title` não existe no bundle do locale ativo, o i18next retorna o `defaultValue` **sem emitir warning** desde que `saveMissing` seja `false` (padrão na configuração sem servidor). Isso elimina a necessidade de qualquer lógica de fallback manual no componente.

Referência: [i18next docs — defaultValue](https://www.i18next.com/translation-function/essentials#overview-options)

## 3. Schema dos arquivos `projects-data.json`

```json
{
  "<label>": {
    "title": "<texto traduzido>",
    "learnings": "<texto traduzido>",
    "public": "<texto traduzido>",
    "problem": "<texto traduzido>",
    "solution": "<texto traduzido>"
  }
}
```

Labels disponíveis (em ordem de exibição — mais recente primeiro, conforme `_.reverse()`):
`underwriting-improvement`, `web-template-string`, `local-file-uploader`, `nbwf-requirement`, `anki-web`, `axa-requirement`, `portfolio`, `onoda`, `gustavo-amaral`, `asebase`, `ishikari`, `ecoid`, `ros`, `jpn-utils`, `aliber`, `noli`, `cashier`, `mailer`, `bingo`, `sigup`, `maplestory`

> Nota: O label `anki-web` substitui o duplicado `portfolio` da "Japanese Kanji Memorization Application" após a correção do RF-04.

## 4. Alternativas avaliadas e descartadas

### A. Adicionar conteúdo a `common.json`
**Descartada.** `common.json` já tem ~43 chaves de UI. Adicionar ~95 novas chaves de conteúdo de projeto tornaria o arquivo ingerenciável. O namespace dedicado mantém coesão.

### B. Um arquivo JSON por projeto (19 arquivos por locale)
**Descartada.** Introduz sobrecarga de manutenção: 19 × 3 = 57 arquivos novos. O `makeStaticProps` precisaria listar todos os 19 namespaces. Não escala.

### C. Copiar `toshi-projects.json` por locale
**Descartada.** Viola o requisito de não duplicação (RN-01). Qualquer atualização no JSON original exigiria atualização em 3 cópias.

### D. Fetch runtime dos arquivos de tradução
**Descartada.** O projeto é 100% estático (static export). Fetch em runtime requereria um servidor.

### E. i18n no campo `subtitle`
**Descartada.** Subtítulos são: URLs (`https://anki.web.app/`), domínios (`gtoshinakano.github.io/fullstack-profile`), nomes de empresa (`WeDoIT.jp`, `Departamento de Águas e Energia Elétrica`) ou strings vazias. Nenhum caso justifica tradução. Decisão do autor (clarify 2026-05-17).

## 5. Impacto no bundle de build

Cada arquivo `projects-data.json` tem ~19 entradas × 5 campos × ~100 chars médios ≈ ~9.5 KB por locale antes de compressão. O impacto no bundle é negligenciável comparado ao JSON de projetos já bundled.

## 6. Ordem de labels após `_.reverse()`

O componente `Projects.tsx` chama `_.reverse([...data])` para exibir projetos mais recentes primeiro. A ordem no arquivo `projects-data.json` não precisa seguir nenhuma ordem específica — o i18next faz lookup por chave, não por posição.
