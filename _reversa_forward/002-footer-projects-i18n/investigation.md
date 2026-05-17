# Investigation: Footer and Projects Labels i18n

> Identifier: `002-footer-projects-i18n`
> Date: `2026-05-17`

## 1. Padrão i18n existente no projeto

O projeto já usa `react-i18next` com namespace `common` e `future-partner`. A feature 001-projects-tab-i18n introduziu o namespace `projects-data` para conteúdo textual dos projetos (`title`, `learnings`, `public`, `problem`, `solution`).

**Padrão observado em `Projects.tsx` (feature 001):**
```tsx
const { t } = useTranslation(['common', 'projects-data'])
// ...
{t(`projects-data:${item.label}.title`, { defaultValue: item.title })}
{t(`projects-data:${item.label}.learnings`, { defaultValue: item.learnings })}
```

Para o `action.label`, o mesmo padrão será usado:
```tsx
{t(`projects-data:${item.label}.action`)}
```

Diferente dos outros campos, **não há `defaultValue`** porque o campo `action.label` será removido do JSON — os 3 locales devem obrigatoriamente ter a chave.

## 2. Tratamento de `action.url`

**Decisão:** O campo `action.url` permanece em `toshi-projects.json`.

**Justificativa:**
- URLs são universais, não sofrem tradução
- O `Projects.tsx` já acessa `item.action.url` diretamente (linha 196)
- Migrar URLs para arquivos de tradução criaria duplicação desnecessária (3 cópias da mesma URL)

**Alternativas avaliadas:**
| Alternativa | Prós | Contras | Resultado |
|-------------|------|--------|----------|
| Mover `action.url` para `projects-data.json` | Tudo centralizado no i18n | URLs duplicadas em 3 locales; perda de semântica (URL não é tradução) | Descartada |
| Usar URL relativa via `prefix` helper | Compatível com GitHub Pages basePath | Nem todas as URLs são internas (LinkedIn, Vercel, etc.) | Descartada |
| Manter `action.url` no JSON (escolhida) | Simplicidade; URLs universais | Pequena assimetria (label no i18n, url no JSON) | Adotada |

## 3. Footer em Introduction.tsx

**Localização:** Linhas 185-194 de `src/components/views/dev/gabriel/MainContent/Introduction.tsx`.

**Conteúdo atual:**
```tsx
<p className='flex text-primary justify-center space-x-4 text-sm mt-18'>
  <a href='https://www.linkedin.com/in/gabriel-toshinori-nakano-5b2ba696/'
     target='_blank' rel='noopener noreferrer' className='hover:underline'>
    Let&apos;s connect
  </a>
  <span>Share this page</span>
</p>
```

**Decisão:** Usar namespace `common.json` (não criar novo namespace).

**Justificativa:**
- São apenas 2 strings estáticas, não justificam novo arquivo de tradução
- O `common.json` já contém todas as strings de UI estática (`hello`, `menu.*`, `projects.*`, etc.)
- Seguindo o princípio da feature 001: namespaces próprios apenas para conteúdo estruturado (por entrada de projeto)

**Strings novas em `common.json`:**
- `lets-connect` → "Let's connect" (en), "コネクト" (ja), "Vamos conectar" (pt-BR)
- `share-this-page` → "Share this page" (en), "このページをシェア" (ja), "Compartilhe esta página" (pt-BR)

## 4. Funcionalidade de "Share this page"

**Decisão:** O `<span>Share this page</span>` será traduzido mas **permanecerá como `<span>` não funcional**.

**Justificativa:**
- Usuário confirmou via `/reversa-clarify` que quer traduzir o rodapé, sem mencionar funcionalidade
- O `domain.md#BR-11` menciona "Buy me a Coffee" como placeholder não funcional — o padrão do projeto é ter elementos decorativos estáticos
- Implementar `navigator.share()` ou compartilhamento real foge do escopo; seria feature separada

## 5. Referências

- `_reversa_sdd/code-analysis.md#Feature 2 — hero-dark` — padrão `useTranslation` em Projects.tsx
- `_reversa_sdd/code-analysis.md#Feature 3 — main-content` — estrutura de Introduction.tsx
- `_reversa_forward/001-projects-tab-i18n/roadmap.md` — padrão `projects-data` namespace
- `_reversa_forward/001-projects-tab-i18n/investigation.md` — investigação de padrões i18n
