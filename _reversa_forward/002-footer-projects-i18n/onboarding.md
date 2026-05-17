# Onboarding: Footer and Projects Labels i18n

> Identifier: `002-footer-projects-i18n`
> Date: `2026-05-17`
> Tempo estimado: 10 minutos

## Propósito

Este guia ensina como verificar que a feature de i18n do rodapé e dos rótulos de ação dos projetos foi implementada corretamente.

## Pré-requisitos

- Build do projeto gerado (`npm run build`)
- Pasta `out/` contendo os arquivos estáticos para os 3 locales
- Navegador web instalado

## Passo a passo

### 1. Verificar rodapé traduzido (Introduction.tsx)

1. Abra `out/en/dev/gabriel-toshinori-nakano/` no navegador
2. Role até o final do artigo "3-3-3 Principles"
3. **Esperado:** O link diz "Let's connect" e o texto ao lado diz "Share this page"
4. Clique no link — deve abrir o LinkedIn do autor em nova aba
5. Troque para `out/ja/dev/gabriel-toshinori-nakano/`
6. Role até o final do artigo
7. **Esperado:** O link diz "コネクト" e o texto ao lado diz "このページをシェア"
8. Troque para `out/pt-BR/dev/gabriel-toshinori-nakano/`
9. Role até o final do artigo
10. **Esperado:** O link diz "Vamos conectar" e o texto ao lado diz "Compartilhe esta página"

### 2. Verificar botões de ação dos projetos traduzidos

1. Ainda em `out/pt-BR/dev/gabriel-toshinori-nakano/`, clique na aba "Projetos"
2. Expanda o projeto "Bingo Screen for Matsuri Events"
3. **Esperado:** O botão de ação diz "Use grátis" (traduzido de "Use it for free")
4. Expanda o projeto "ROS - Bebop Research"
5. **Esperado:** O botão de ação diz "Visite o guia" (traduzido de "Visit Guide")
6. Expanda o projeto "Asebase Next"
7. **Esperado:** O botão de ação diz "Ver código e vídeo" (traduzido de "View code and video")
8. Expanda o projeto "This Portfolio" (portfolio label)
9. **Esperado:** O botão de ação diz "Esta página" (traduzido de "This page")
10. Troque para `out/ja/dev/gabriel-toshinori-nakano/`, aba "プロジェクト"
11. Expanda "Bingo Screen for Matsuri Events"
12. **Esperado:** O botão de ação diz "無料で使う"

### 3. Verificar que `toshi-projects.json` não tem mais `action.label`

1. Abra `src/data/toshi-projects.json` em um editor
2. Procure por `"label"` dentro de qualquer bloco `"action"`
3. **Esperado:** Nenhum campo `"label"` encontrado dentro de `"action"` — apenas `"url"` deve existir
4. Exemplo correto: `"action": { "url": "https://..." }`

### 4. Verificar arquivos `projects-data.json` nos 3 locales

1. Abra `public/locales/en/projects-data.json`
2. **Esperado:** Arquivo existe (novo nesta feature) e cada entrada tem campo `"action"`
3. Abra `public/locales/ja/projects-data.json`
4. **Esperado:** Cada entrada tem campo `"action"` com valor em japonês
5. Abra `public/locales/pt-BR/projects-data.json`
6. **Esperado:** Cada entrada tem campo `"action"` com valor em português

### 5. Verificação de build limpo

1. Execute `npm run build`
2. **Esperado:** Build conclui sem erros
3. Verifique se as pastas `out/en/`, `out/ja/`, `out/pt-BR/` foram geradas

## Problemas comuns

| Sintoma | Causa provável | Solução |
|---------|-----------------|----------|
| Botão de ação aparece como `projects-data:bingo.action` | Chave ausente no `projects-data.json` do locale | Verifique se o campo `"action"` foi adicionado em todos os 19 projetos |
| "Let's connect" aparece em inglês no Japanese | Chave `lets-connect` ausente em `ja/common.json` | Adicione `"lets-connect": "コネクト"` em `public/locales/ja/common.json` |
| Botão de ação não aparece (null/undefined) | `action.label` ainda presente no JSON mas código já usa `t()` | Remova o campo `"label"` de dentro de `"action"` em `toshi-projects.json` |
| Build falha com erro de i18n | Namespace `projects-data` não carregado | Verifique se `makeStaticProps` em `pages/[locale]/index.ts` inclui `'projects-data'` |

## Contato

Dúvidas sobre esta feature: ver `requirements.md` em `_reversa_forward/002-footer-projects-i18n/`.
