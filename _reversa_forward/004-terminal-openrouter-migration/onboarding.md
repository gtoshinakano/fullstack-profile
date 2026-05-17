# Onboarding: OpenRouter Provider Migration

> Feature: `004-terminal-openrouter-migration`
> Date: `2026-05-17`

## Objetivo

Verificar que a migração do Toshi AI Terminal de Google Gemini para OpenRouter foi concluída com sucesso, sem regressões de UX.

## Pré-requisitos

1. Node.js e npm instalados
2. Conta no OpenRouter (https://openrouter.ai) com API key
3. Clone do repositório `fullstack-profile`

## Passo a passo

### 1. Configurar variáveis de ambiente

Copie o arquivo de exemplo e preencha as variáveis:

```bash
cp .env.local.example .env.local
```

Edite `.env.local`:
```
NEXT_PUBLIC_OPENROUTER_API_KEY=sua-key-aqui
NEXT_PUBLIC_OPENROUTER_MODEL=openrouter/free
```

### 2. Instalar dependências

```bash
npm install
```

> Nota: `@google/generative-ai` deve ter sido removido do `package.json`. Verifique com:
> ```bash
> npm ls @google/generative-ai
> ```
> Deve retornar "empty" ou "not installed".

### 3. Build local

```bash
npm run build
```

Verifique que o build completa sem erros. Opcionalmente, analise o bundle para confirmar que `@google/generative-ai` não está presente.

### 4. Servir o build

```bash
npx serve out/
```

Ou, para desenvolvimento:
```bash
npm run dev
```

### 5. Verificar o terminal

1. Abra a página do portfolio no browser.
2. Navegue até a seção HeroDark (abaixo do hero animado).
3. Localize o terminal "Toshi AI" entre a foto de perfil e o menu de abas.
4. **Verifique:** O terminal renderiza com a barra de título (3 bolinhas coloridas) e a mensagem de boas-vindas.

### 6. Testar uma pergunta

1. Digite uma pergunta sobre Gabriel (ex: "What technologies does Gabriel know?").
2. Pressione Enter ou clique em "Send".
3. **Verifique:**
   - A pergunta aparece no output com prefixo `>`.
   - A resposta aparece incrementalmente (streaming caractere por caractere).
   - O cursor `▋` pisca durante o streaming e desaparece ao final.
   - O contador de perguntas restantes decrementa.

### 7. Testar limite de sessão

1. Envie 3 perguntas.
2. **Verifique:** Após a 3ª resposta, o input é desabilitado e aparece a mensagem de limite atingido.

### 8. Testar limite de caracteres

1. Digite mais de 200 caracteres no input.
2. **Verifique:** O contador fica vermelho, o botão de envio é desabilitado.

### 9. Testar ausência de API key

1. Remova ou esvazie `NEXT_PUBLIC_OPENROUTER_API_KEY` no `.env.local`.
2. Rebuild e recarregue a página.
3. **Verifique:** O terminal não aparece na página. Nenhum erro no console.

### 10. Testar tratamento de erro

1. Use uma API key inválida.
2. Envie uma pergunta.
3. **Verifique:** Uma mensagem de erro genérica aparece no terminal. O contador de perguntas NÃO incrementa. O input é reabilitado.

### 11. Verificar i18n

1. Troque o idioma (via widget de idioma no topo direito).
2. **Verifique:** O título do terminal, placeholder, botão e mensagens atualizam para o idioma selecionado.

### 12. Verificar DevTools (opcional)

1. Abra a aba Network do DevTools.
2. Envie uma pergunta.
3. **Verifique:**
   - Request URL: `https://openrouter.ai/api/v1/chat/completions`
   - Method: POST
   - Headers: apenas `Content-Type: application/json` e `Authorization: Bearer ...`
   - Body contém: `model`, `messages` (com roles `system` + `user`), `stream: true`

## Critérios de aprovação

- [ ] Terminal renderiza corretamente com key válida
- [ ] Terminal não renderiza sem key
- [ ] Streaming funciona (resposta incremental)
- [ ] Limite de 3 perguntas funciona
- [ ] Limite de 200 caracteres funciona
- [ ] Tratamento de erro funciona (key inválida, rede)
- [ ] i18n funciona (título, placeholder, mensagens)
- [ ] Network request usa formato OpenRouter correto
- [ ] `@google/generative-ai` não está no bundle
