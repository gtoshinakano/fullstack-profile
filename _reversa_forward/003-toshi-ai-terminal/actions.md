# Actions: Toshi AI Chat Terminal

> Identificador: `003-toshi-ai-terminal`
> Data: `2026-05-17`
> Roadmap: `_reversa_forward/003-toshi-ai-terminal/roadmap.md`

## Resumo

| Métrica | Valor |
|---------|-------|
| Total de ações | 10 |
| Paralelizáveis (`[//]`) | 4 |
| Maior cadeia de dependência | 6 (T001→T005→T006→T007→T008→T010) |

## Fase 1 — Preparação

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|--------------|-------------|--------------|-------------|--------|
| T001 | Instalar `@google/generative-ai` via `npm install @google/generative-ai`. Verificar que o pacote aparece em `dependencies` no `package.json` e que `package-lock.json` foi atualizado. | - | - | `package.json` | 🟢 | `[X]` |
| T002 | Adicionar o grupo `"toshi-ai"` em `public/locales/en/common.json` com as chaves: `title`, `placeholder`, `send`, `questions-remaining_one`, `questions-remaining_other`, `limit-reached`, `welcome`, `error`, `char-count`. Valores em inglês conforme `data-delta.md#2.1`. | - | `[//]` | `public/locales/en/common.json` | 🟢 | `[X]` |
| T003 | Adicionar o grupo `"toshi-ai"` em `public/locales/ja/common.json` com as mesmas chaves em japonês conforme `data-delta.md#2.2`. | - | `[//]` | `public/locales/ja/common.json` | 🟢 | `[X]` |
| T004 | Adicionar o grupo `"toshi-ai"` em `public/locales/pt-BR/common.json` com as mesmas chaves em português conforme `data-delta.md#2.3`. | - | `[//]` | `public/locales/pt-BR/common.json` | 🟢 | `[X]` |

## Fase 2 — Testes

> Omitida. O projeto tem zero arquivos de teste (`_reversa_sdd/inventory.md`: `test_files: 0`). Nenhum framework de teste configurado.

## Fase 3 — Núcleo

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|--------------|-------------|--------------|-------------|--------|
| T005 | Criar `src/components/views/dev/gabriel/HeroDark/ToshiAITerminal/systemPrompt.ts`. Importar estaticamente os 4 arquivos de dados (`jobs.json`, `toshi-projects.json`, `stacks.json`, `swtools.json`). Exportar a função `buildSystemPrompt(): string` que retorna o system prompt completo incluindo: (1) instrução de papel ("Você é Toshi AI…"), (2) regra de escopo ("responda apenas sobre Gabriel"), (3) instrução de idioma ("responda no idioma do usuário"), (4) bio de Gabriel (nome, apelido, localização, nacionalidade, idiomas), (5) histórico profissional serializado de `jobs.json` (company, role, period, stacks), (6) projetos serializados de `toshi-projects.json` (title, type, problem, solution, period), (7) habilidades técnicas extraídas das chaves de stacks/swtools, (8) formação acadêmica hardcoded: FATEC 2010-2013 e UNINOVE 2008-2010 (fonte: `_reversa_sdd/domain.md#BR-05`). | T001 | - | `src/components/views/dev/gabriel/HeroDark/ToshiAITerminal/systemPrompt.ts` | 🟢 | `[X]` |
| T006 | Criar `src/components/views/dev/gabriel/HeroDark/ToshiAITerminal/useGeminiStream.ts`. Exportar a função assíncrona `sendMessage(question: string, onChunk: (text: string) => void): Promise<void>`. Internamente: (1) `const { GoogleGenerativeAI } = await import('@google/generative-ai')` (dynamic import — D-02), (2) inicializar `GoogleGenerativeAI` com `process.env.NEXT_PUBLIC_GEMINI_API_KEY`, (3) obter modelo `gemini-2.0-flash` com `systemInstruction: buildSystemPrompt()`, (4) chamar `model.generateContentStream(question)`, (5) iterar chunks via `for await` chamando `onChunk(chunk.text())` a cada fragmento. Propagar erros (`throw`) para o chamador tratar. | T005 | - | `src/components/views/dev/gabriel/HeroDark/ToshiAITerminal/useGeminiStream.ts` | 🟢 | `[X]` |
| T007 | Criar `src/components/views/dev/gabriel/HeroDark/ToshiAITerminal/index.tsx` com o componente completo `ToshiAITerminal`. **Guard:** retornar `null` se `process.env.NEXT_PUBLIC_GEMINI_API_KEY` for falsy (RF-13). **Estado:** `messages: Message[]` (inicializado com mensagem de boas-vindas via `t('toshi-ai.welcome')`), `questionsUsed: number` (0), `isStreaming: boolean` (false), `input: string` (''). **Ref:** `outputRef` em `<div>` do output para auto-scroll (`scrollTop = scrollHeight`) via `useEffect([messages])`. **Handler `handleSubmit`:** bloquear se input vazio, >200 chars, questionsUsed >= 3 ou isStreaming; adicionar mensagem do user ao array; incrementar questionsUsed; setar isStreaming=true; chamar `sendMessage` com `onChunk` que faz `setMessages` com update funcional acumulando chunks no último item; ao completar, marcar `isStreaming=false`; em erro, decrementar questionsUsed, substituir último item por mensagem de erro (t('toshi-ai.error')), resetar isStreaming. **GA:** chamar `event({ action: 'ai_terminal_query', params: { questions_remaining: 3 - questionsUsed } })` via `src/lib/ga.ts` ao disparar submit com sucesso. **JSX:** (1) container `rounded-lg overflow-hidden shadow-2xl border border-gray-700 my-8`; (2) title bar `bg-gray-800 px-4 py-3 flex items-center gap-2` com 3 dots (FF5F57 / FFBD2E / 28C840) + título `t('toshi-ai.title')` em `text-gray-300 text-sm ml-3`; (3) output div `ref={outputRef} bg-gray-900 font-mono text-sm overflow-y-auto p-4 min-h-[200px] max-h-[400px]` com lista de messages (user → `text-white`, AI → `text-green-400`); cursor `▋` com `animate-pulse` no final do último item se `isStreaming`; (4) input bar `flex items-center gap-2 px-4 py-3 border-t border-gray-700 bg-gray-800` com prefixo `>` verde, campo `<input>` (`maxLength={200}`, `disabled={isStreaming \|\| questionsUsed >= 3}`), contador `t('toshi-ai.char-count', { count: input.length })` em vermelho se >200, indicador `t('toshi-ai.questions-remaining', { count: 3 - questionsUsed })`, botão Send desabilitado se canSubmit falso. Exibir `t('toshi-ai.limit-reached')` como último item do output quando questionsUsed >= 3. | T006, T002, T003, T004 | - | `src/components/views/dev/gabriel/HeroDark/ToshiAITerminal/index.tsx` | 🟢 | `[X]` |

## Fase 4 — Integração

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|--------------|-------------|--------------|-------------|--------|
| T008 | Modificar `src/components/views/dev/gabriel/HeroDark/index.tsx`: (1) adicionar no topo `import ToshiAITerminal from './ToshiAITerminal'`; (2) inserir `<ToshiAITerminal />` entre o fechamento `</div>` do bloco de foto/perfil (linha ~137, após o `</div>` que fecha o `<div className='flex flex-wrap'>`) e o componente `<Menu setSelected={onSelect} ...>`. Não alterar nenhuma outra linha do arquivo. | T007 | - | `src/components/views/dev/gabriel/HeroDark/index.tsx` | 🟢 | `[X]` |

## Fase 5 — Polimento

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|--------------|-------------|--------------|-------------|--------|
| T009 | Criar `.env.local.example` na raiz do projeto (se não existir) ou adicionar linha ao arquivo existente: `NEXT_PUBLIC_GEMINI_API_KEY=` com comentário explicando que a chave deve ser obtida em Google AI Studio e que deve ter restrição de HTTP referrer configurada para o domínio do portfólio. | T001 | `[//]` | `.env.local.example` | 🟡 | `[X]` |
| T010 | Executar `npm run build` para verificar compilação TypeScript e geração estática. Corrigir quaisquer erros de tipo nos arquivos novos (`systemPrompt.ts`, `useGeminiStream.ts`, `ToshiAITerminal/index.tsx`). Verificar que o build termina sem erros e que o output em `out/` contém as três rotas de locale. | T008, T009 | - | (build output) | 🟢 | `[X]` |

## Notas de execução

<!-- Reservado para /reversa-coding registrar avisos durante a execução. -->

## Histórico de alterações

| Data | Alteração | Autor |
|------|-----------|-------|
| 2026-05-17 | Versão inicial gerada por `/reversa-to-do` | reversa |
