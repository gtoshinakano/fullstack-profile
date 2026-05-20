# Flowchart: Module 8 — Cloudflare Worker

> System prompt builder, OpenRouter proxy, Feature 006 integration

---

## Worker Request Lifecycle

```mermaid
graph TD
    A["Browser sends POST to Worker"] --> B["Parse request body: {question: string}"]
    B --> C["Extract Origin header"]
    C --> D{"Origin = allowed?"} 
    
    D -->|No| E["Return 403 Forbidden"]
    D -->|Yes| F{"Method = OPTIONS?"} 
    
    F -->|Yes| G["Return 204 + CORS headers"]
    F -->|No| H["Method = POST?"]
    
    H -->|No| I["Return 405 Method Not Allowed"]
    H -->|Yes| J["Build system prompt"]
    J --> K["Forward question to OpenRouter"]
    K --> L["Stream SSE response"]
    L --> M["Browser receives streamed response"]
```

---

## System Prompt Building Pipeline (buildSystemPrompt)

```mermaid
graph TD
    A["buildSystemPrompt() called"] --> B["Load static data at build time"]
    B --> C["Import jobs.json, projects.json, stacks.json, swtools.json"]
    
    C --> D["Initialize prompt sections"]
    D --> E["1. About Gabriel profile"]
    E --> F["2. Work History from jobs.json"]
    F --> G["3. Education hardcoded text"]
    G --> H["4. Portfolio Projects from projects.json"]
    H --> I["5. Technical Skills listing"]
    
    I --> J["6. Feature 006: buildTechPerspective()"]
    J --> K["7. Hobbies section"]
    K --> L["8. Dislikes section"]
    L --> M["9. Instruction closing"]
    
    M --> N["Return concatenated prompt string"]
```

---

## Feature 006: buildTechPerspective() Function

```mermaid
graph TD
    A["buildTechPerspective(stacks)"] --> B["Initialize empty array"]
    B --> C["Iterate over all 39 stacks"]
    
    C --> D{"stack.opinion exists?"} 
    D -->|No| E["Skip this stack"]
    D -->|Yes| F{"stack.opinion.trim().length > 0?"} 
    
    F -->|No| G["Skip: empty after trim"]
    F -->|Yes| H["Format: 'Stack Name: opinion text'"]
    
    H --> I["Push to array"]
    E --> C
    G --> C
    I --> C
    
    C --> J{"Array length = 0?"} 
    J -->|Yes| K["Return empty string"]
    J -->|No| L["Format as markdown section:\n## Your Technical Perspective\n\n- Stack1: opinion\n- Stack2: opinion..."]
    
    K --> M["Output to caller"]
    L --> M
```

---

## OpenRouter API Integration

```mermaid
graph LR
    A["System prompt + question"] --> B["Fetch OpenRouter /api/v1/chat/completions"]
    B --> C["Headers: Authorization Bearer"]
    C --> D["Params: stream=true"]
    D --> E["OpenRouter returns SSE stream"]
    
    E --> F["Parse SSE: data: {chunk}"]
    F --> G["Detect [DONE] marker"]
    G --> H["Stream data to browser"]
    H --> I["Browser parses response\nvia useOpenRouterStream hook"]
```

---

## Data Transformations

| Source | Transformation | Destination |
|--------|---|---|
| jobs.json | Format: "Company (Period): [stacks]" | System prompt work history |
| toshi-projects.json | Sort newest-first, extract title + stacks | System prompt projects list |
| stacks.json | Filter non-empty `opinion`, format | System prompt "Your Technical Perspective" section |
| User question | Trim whitespace, validate | OpenRouter request |

---

## Error Handling

```mermaid
graph TD
    A["Request received"] --> B{"Valid JSON?"} 
    B -->|No| C["Log error, return 400"]
    B -->|Yes| D{"CORS check?"} 
    
    D -->|No| E["Return 403"]
    D -->|Yes| F["Build prompt"]
    F --> G{"OpenRouter responds?"} 
    
    G -->|No| H["Return 500 + error"]
    G -->|Yes| I["Stream response"]
    I --> J{"Stream completes?"} 
    
    J -->|No| K["Return 500 on stream error"]
    J -->|Yes| L["Return 200"]
```

---

## Build-Time vs. Runtime

| Phase | Action | Data |
|-------|--------|------|
| **Build-time** | Import JSON, concat into buildSystemPrompt() | jobs, projects, stacks, swtools |
| **Runtime** | Receive question, call buildSystemPrompt() | User input only |
| **Feature 006** | buildTechPerspective() runs at build-time, opinions frozen in deployed prompt | 39 opinions as constant |

---

## Backward Compatibility (Feature 006)

```mermaid
graph TD
    A["Old deployment: no opinion field in stacks.json"]
    B["New code: buildTechPerspective() called"]
    
    A --> C["stack.opinion = undefined"]
    B --> D["Filter: stack.opinion && ..."} 
    D --> E["Condition fails"]
    E --> F["Stack skipped gracefully"]
    F --> G["System prompt = standard version"]
    
    H["New deployment: all stacks have opinion"]
    I["buildTechPerspective() called"]
    H --> J["stack.opinion = 'authentic text'"]
    I --> K["Filter: stack.opinion && ..."]
    K --> L["Condition passes"]
    L --> M["Stack opinion included"]
    M --> N["System prompt = enriched version"]
```
