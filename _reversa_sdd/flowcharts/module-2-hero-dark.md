# Flowchart: Module 2 — hero-dark

> Tab state machine, photo carousel, projects accordion, ToshiAITerminal integration

---

## Tab State Machine (hero-dark/index.tsx)

```mermaid
graph TD
    A["User opens page"] --> B["Render HeroDark container"]
    B --> C["Initialize tab state: selected = 'job'"]
    C --> D{"Render active tab"} 
    
    D -->|selected = 'job'| E["Render Jobs.tsx"]
    D -->|selected = 'projects'| F["Render Projects.tsx"]
    D -->|selected = 'partner'| G["Render FuturePartner.jsx"]
    
    E --> H["Tab animations trigger (GSAP)"]
    F --> H
    G --> H
    
    H --> I["Lock tab changes during animation"]
    I --> J["Animation completes"]
    J --> K["Unlock tab changes"]
    K --> L{"User clicks tab?"} 
    
    L -->|Yes| M["BR-03: Verify not animating"]
    M --> N{"Animation locked?"} 
    N -->|Yes| O["Ignore click"]
    N -->|No| P["Update tab state"]
    P --> D
    
    L -->|No| L
    O --> L
```

---

## Photo Carousel (Scroll-Driven GSAP)

```mermaid
graph LR
    A["Scroll event fires"] --> B["ScrollTrigger detects position"]
    B --> C["Calculate scroll progress 0.0–1.0"]
    C --> D["GSAP timeline: opacity crossfade"]
    D --> E["Image 1 → Image 2 → Image 3"]
    E --> F["Update photo display"]
    F --> A
```

---

## Projects Accordion (Projects.tsx)

```mermaid
graph TD
    A["Render 19 projects in DOM"] --> B["Initialize expand state: {}"]
    B --> C["BR-04: Reverse order (newest first)"]
    C --> D["Render project accordion item"]
    
    D --> E{"User clicks label?"} 
    E -->|Yes| F["Toggle expand state for label"]
    F --> G["⚠️ BUG: Label not unique"]
    G --> H["All projects with same label toggle"]
    H --> I["Collapse/expand synchronized incorrectly"]
    I --> D
    
    E -->|No| J{"Click 'Read' / 'Hide'?"} 
    J -->|Yes| K["Toggle expand state"]
    K --> L["GSAP transition height"]
    L --> D
    J -->|No| D
```

---

## ToshiAITerminal Integration

```mermaid
graph TD
    A["ToshiAITerminal mounted in Project tab"] --> B["User enters question (max 200 chars)"]
    B --> C{"Questions limit reached?"} 
    C -->|Yes| D["Display: Max 3 questions reached"]
    C -->|No| E["Send question to Worker via SSE"]
    
    E --> F["Worker processes: buildSystemPrompt()"]
    F --> G["Feature 006: Include Tech Perspective"]
    G --> H["OpenRouter API call"]
    H --> I["Stream response back to client"]
    
    I --> J["MarkdownContent parses response"]
    J --> K["Render with syntax highlighting"]
    K --> L["Increment question counter"]
    L --> B
```

---

## Data Flow: Stacks → System Prompt (Feature 006)

```mermaid
graph LR
    A["stacks.json\n39 entries with opinion field"] --> B["worker/src/systemPrompt.ts\nbuiltSystemPrompt()"]
    B --> C["buildTechPerspective\nFilter non-empty opinions"]
    C --> D["Format: 'Stack: opinion' prose"]
    D --> E["Insert after\nTechnical Skills section"]
    E --> F["System prompt sent to OpenRouter"]
    F --> G["AI context enriched\nwith Gabriel's perspectives"]
    G --> H["ToshiAITerminal response\nincorporates opinions"]
```

---

## State Transitions Summary

| State | Transition | Condition |
|-------|-----------|-----------|
| `selected = 'job'` | → `'projects'` | Not animating + tab clicked |
| `selected = 'projects'` | → 'partner'` | Not animating + tab clicked |
| `selected = 'partner'` | → `'job'` | Not animating + tab clicked |
| Animation locked | → Unlocked | Animation duration elapsed |
| Question count < 3 | → Question sent | User submits form |
| Question count ≥ 3 | → Max reached | No further questions accepted |
