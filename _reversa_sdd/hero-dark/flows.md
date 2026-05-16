# Hero Dark — Fluxos Detalhados

> Arquivo opcional gerado por Reversa Writer · 2026-05-17
> Documenta os 4 fluxos distintos da unit que não cabem completamente no design.md.
> Confidence: 🟢 CONFIRMADO | 🟡 INFERIDO

---

## Fluxo 1 — Máquina de Estado de Abas

```mermaid
sequenceDiagram
    participant V as Visitante
    participant UI as HeroDark UI
    participant GSAP
    participant GA as Google Analytics

    V->>UI: clica em botão de aba (ex: "Projects")
    UI->>UI: verifica se selected === 'projects'
    alt já selecionada
        UI-->>V: nenhuma ação
    else aba diferente
        UI->>UI: loading = true (botões desabilitados)
        UI->>GSAP: animar saída dos elementos da aba atual\n(stagger: 0.05 × n, fade out + slide)
        GSAP-->>UI: animação de saída concluída
        UI->>GSAP: scrollTo topo da seção HeroDark
        GSAP-->>UI: scroll concluído
        UI->>UI: selected = 'projects'
        UI->>GSAP: animar entrada dos elementos da nova aba\n(fade in + slide)
        GSAP-->>UI: animação de entrada concluída
        UI->>UI: loading = false (botões reabilitados)
        UI->>GA: event('menu_click', { category: 'projects' })
        UI-->>V: nova aba visível e interativa
    end
```

**Estados possíveis de `selected`:** `'job'` | `'projects'` | `'partner'`
**Estado inicial:** `'job'`
**Invariante:** `loading=true` e `loading=false` nunca ocorrem simultaneamente em duas transições (não há fila de transições — a trava impede enfileiramento).

---

## Fluxo 2 — Accordion de Projetos

```mermaid
flowchart TD
    A[Projects renderiza\nexpanded = empty array] --> B{Visitante clica em projeto}
    B --> C{label está em expanded?}
    C -- Não --> D[adiciona label ao array\nexpanded = ...expanded, label]
    C -- Sim --> E[remove label do array\nexpanded = filter excluindo label]
    D --> F[item expande via Tailwind\nmax-h-0 → max-h-screen]
    E --> G[item colapsa via Tailwind\nmax-h-screen → max-h-0]

    H[Visitante clica Expand All / Collapse All] --> I{allExpanded?}
    I -- Não --> J[expanded = todos os labels\nall 19 projetos abrem]
    I -- Sim --> K[expanded = array vazio\nall 19 projetos fecham]

    style D fill:#d4edda
    style E fill:#f8d7da
    style J fill:#d4edda
    style K fill:#f8d7da
```

**⚠️ Bug BR-07:** Quando `label="requirement"` é adicionado ao `expanded[]`, todos os 5 projetos com esse label são exibidos como expandidos (`expanded.includes(label)` retorna `true` para todos). A correção requer migrar o estado para usar `id` numérico em vez de `label` string.

**Transição CSS (sem GSAP):**
```css
/* Tailwind classes aplicadas condicionalmente */
max-h-0 overflow-hidden transition-all duration-300   /* colapsado */
max-h-screen overflow-hidden transition-all duration-300  /* expandido */
```

---

## Fluxo 3 — Carrossel de Fotos (ScrollTrigger)

```mermaid
sequenceDiagram
    participant Browser
    participant ST as GSAP ScrollTrigger
    participant DOM

    Note over Browser,DOM: useLayoutEffect — executa uma vez após mount

    Browser->>ST: registerPlugin(ScrollTrigger)
    ST->>DOM: observa #profile-photo\nstart:'top center', end:'10% 10%', scrub:1

    loop Scroll do visitante
        Browser->>ST: posição de scroll atualizada
        ST->>DOM: calcula progresso (0.0 → 1.0)

        alt progresso < 0.5
            DOM->>DOM: photo-01 opacity=1\nphoto-02 opacity=0\nphoto-03 opacity=0
        else progresso entre 0.5 e 0.75
            DOM->>DOM: photo-01 opacity=0\nphoto-02 opacity=1\nphoto-03 opacity=0
        else progresso > 0.75
            DOM->>DOM: photo-01 opacity=0\nphoto-02 opacity=0\nphoto-03 opacity=1
        end
    end
```

**Fotos em sequência:**
1. `gabriel-photo.png` — foto profissional
2. `gabriel-github.png` — avatar do GitHub
3. `gabriel-photo.jpg` — foto profissional alternativa

**Nota:** `scrub:1` significa que o ScrollTrigger usa 1 segundo de "suavização" ao seguir o scroll — não é sincronização frame-a-frame imediata, o que gera um leve lag intencionalmente suave.

---

## Fluxo 4 — Menu Sticky (Expansão ao Entrar na Seção)

```mermaid
stateDiagram-v2
    [*] --> Collapsed : HeroDark fora do viewport\nMenu lateral compacto

    Collapsed --> Expanded : ScrollTrigger detecta entrada de #hero-dark\nonEnter callback / toggleClass

    Expanded --> Collapsed : ScrollTrigger detecta saída de #hero-dark\nonLeave callback / toggleClass remoção

    state Expanded {
        [*] --> MenuVisible
        MenuVisible --> TabSelected : clique em aba
        TabSelected --> MenuVisible : transição concluída
    }
```

**Implementação inferida** 🟡 — o mecanismo exato (GSAP `toggleClass`, `onEnter`/`onLeave` ou classe CSS adicionada via JS) não foi confirmado com leitura linha a linha do componente. O comportamento observável é: o menu se expande ao entrar na seção `#hero-dark` e se contrai ao sair.

**Sem estado React** — a expansão é puramente visual, controlada por CSS class toggle via GSAP. Nenhum `useState` é usado para este comportamento.
