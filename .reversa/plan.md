# Plano de Exploração — fullstack-profile

> Criado pelo Reversa em 2026-05-16
> Marque cada tarefa com ✅ quando concluída.
> Você pode editar este plano antes de iniciar: adicione, remova ou reordene tarefas conforme necessário.

---

## Fase 1: Reconhecimento 🔍

- ✅ **Scout** — Mapeamento de estrutura de pastas e tecnologias
- ✅ **Scout** — Análise de dependências e gerenciadores de pacotes
- ✅ **Scout** — Identificação de entry points, CI/CD e configurações

## Decisão de organização das specs 🗂️

> Entre o Scout e o Arqueólogo, o Reversa pergunta como você quer organizar as specs (por módulo, caso de uso, endpoint, híbrida, por features ou customizada). A escolha fica persistida em `.reversa/config.toml` na seção `[specs]` e não será reperguntada em execuções futuras. Para reapresentar o menu, remova manualmente a seção.

## Fase 2: Escavação 🏗️

- ✅ **Arqueólogo** — Análise da feature `hero-section` (HeroSection — parallax hero animado)
- ✅ **Arqueólogo** — Análise da feature `hero-dark` (HeroDark — seção de perfil com abas Jobs/Projects/FuturePartner)
- ✅ **Arqueólogo** — Análise da feature `main-content` (artigo "3-3-3 Principles for a Better UX")
- ✅ **Arqueólogo** — Análise da feature `analytics` (Google Analytics 4 integration)
- ✅ **Arqueólogo** — Análise da feature `i18n` (internacionalização — 3 locales: en, ja, pt-BR)
- ✅ **Arqueólogo** — Análise da feature `layout` + `data` (shell público e dados estáticos JSON)

## Fase 3: Interpretação 🧠

- ✅ **Detetive** — Arqueologia Git e ADRs retroativos
- ✅ **Detetive** — Regras de negócio implícitas e máquinas de estado
- ✅ **Detetive** — Matriz de permissões (RBAC/ACL)
- ✅ **Arquiteto** — Diagramas C4 (Contexto, Containers, Componentes)
- ✅ **Arquiteto** — ERD completo e integrações externas
- ✅ **Arquiteto** — Spec Impact Matrix

## Fase 4: Geração 📝

- ✅ **Redator** — Specs SDD por componente (7 features × 3 arquivos + 2 opcionais)
- ✅ **Redator** — OpenAPI (n/a — sem API)
- ✅ **Redator** — User Stories (12 stories em visitor-journey.md)
- ✅ **Redator** — Code/Spec Matrix (~94% de cobertura)

## Fase 5: Revisão ✅

- ✅ **Revisor** — Revisão cruzada de specs (7 units — 10 reclassificações, 12 discrepâncias críticas corrigidas)
- ✅ **Revisor** — Resolução de lacunas com o usuário (10/10 perguntas respondidas)
- ✅ **Revisor** — Relatório de confiança final (confiança final: ~93%)

---

## Agentes Independentes

> Execute estes agentes quando os recursos estiverem disponíveis — podem rodar em qualquer fase.

- [ ] **Visor** — Análise de interface via screenshots
- [ ] **Data Master** — Análise completa do banco de dados
- [ ] **Design System** — Extração de tokens de design
- [ ] **Tracer** — Análise dinâmica (requer sistema acessível)

---

## Próximo passo

Após o Time de Descoberta concluir e o `_reversa_sdd/` estar populado, você pode disparar um dos fluxos seguintes:

- `/reversa-migrate`: orquestrador do **Time de Migração** (Paradigm Advisor → Curator → Strategist → Designer → Screen Translator → Inspector). Gera as specs do sistema novo. Saída em `_reversa_sdd/migration/` e `_reversa_sdd/screens/`.
- `/reversa-reconstructor`: gera plano bottom-up para reimplementar o software a partir das specs do legado (uma tarefa por sessão).
