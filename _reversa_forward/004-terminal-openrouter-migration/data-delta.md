# Data Delta: OpenRouter Provider Migration

> Feature: `004-terminal-openrouter-migration`
> Date: `2026-05-17`

## Resumo

**Nenhuma mudança no modelo de dados.** Esta migration troca apenas o provedor de IA (backend de inference). Nenhum arquivo JSON de dados é criado, modificado ou removido.

## Arquivos de dados existentes (inalterados)

| Arquivo | Status | Notas |
|---------|--------|-------|
| `src/data/jobs.json` | inalterado | Usado pelo system prompt |
| `src/data/toshi-projects.json` | inalterado | Usado pelo system prompt |
| `src/data/stacks.json` | inalterado | Usado pelo system prompt |
| `src/data/swtools.json` | inalterado | Usado pelo system prompt |

## Arquivo de system prompt (inalterado)

| Arquivo | Status | Notas |
|---------|--------|-------|
| `src/components/views/dev/gabriel/HeroDark/ToshiAITerminal/systemPrompt.ts` | inalterado | Lógica de construção do prompt idêntica |

## Novas variáveis de ambiente

| Variável | Tipo | Obrigatório | Default | Descrição |
|----------|------|-------------|---------|-----------|
| `NEXT_PUBLIC_OPENROUTER_API_KEY` | string | Sim | — | API key do OpenRouter |
| `NEXT_PUBLIC_OPENROUTER_MODEL` | string | Sim | — | Identificador do modelo (ex: `openrouter/free`) |

## Variáveis de ambiente removidas

| Variável | Motivo |
|----------|--------|
| `NEXT_PUBLIC_GEMINI_API_KEY` | Provedor Gemini não é mais usado |
