# Design: Restaurant Chat Agent

## Overview

Floating Mistral-powered chat widget on city pages. Frontend calls Mistral API directly (no backend). Restaurant data injected via system prompt. Conversation state in React state, resets on navigation.

### Key Decisions

- Direct frontend API calls (acceptable for side project, key via env var)
- Full restaurant dataset serialized into system prompt
- No streaming (simple request/response)
- Session-scoped state (resets on navigation)

## Architecture

```
City.tsx
└── ChatWidget (isOpen state)
    ├── ChatButton (floating FAB, bottom-right)
    └── ChatPanel
        ├── Header (title + close)
        ├── Messages (scrollable, auto-scroll)
        ├── Loading indicator (3-dot animation)
        └── ChatInput (text + send button)
```

## Interfaces

```typescript
// ChatWidget — top-level, rendered in City.tsx
interface ChatWidgetProps { cityName: string; foodPlaces: FoodPlace[]; }

// ChatPanel — expanded chat UI
interface ChatPanelProps { cityName: string; foodPlaces: FoodPlace[]; onClose: () => void; }

// ChatInput — text input + send
interface ChatInputProps { onSend: (message: string) => void; disabled: boolean; }

// ChatMessage — aligns with Mistral API format
interface ChatMessage { role: 'user' | 'assistant' | 'system'; content: string; }
```

## Services

`buildSystemPrompt(cityName, foodPlaces)` — serializes restaurant data into a constraining system prompt.

`sendMessage(messages, apiKey)` — POSTs to `https://api.mistral.ai/v1/chat/completions` with `mistral-small-latest`. Throws on non-2xx.

## Error Handling

| Scenario | Handling |
|---|---|
| API error / network failure | Error message in chat, input stays enabled |
| Missing API key | "Chat unavailable" message, input disabled |
| Empty input | Rejected at ChatInput level |
| Malformed response | Generic error message in chat |

## Correctness Properties

1. `buildSystemPrompt` output contains every restaurant's name, price, cuisines, neighborhood — **Validates: 3.1**
2. API request starts with system message, followed by history in order — **Validates: 2.1, 4.1, 6.3**
3. Whitespace-only input is rejected — **Validates: 2.5**
4. Welcome message contains city name — **Validates: 1.5**
5. User/assistant messages appear in conversation history — **Validates: 2.2, 2.4**
6. API errors produce error messages in history — **Validates: 5.1**
