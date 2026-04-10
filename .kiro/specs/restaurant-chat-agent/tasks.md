# Tasks: Restaurant Chat Agent

## Tasks

- [x] 1. Setup
  - [x] 1.1 Create `.env.example` with `REACT_APP_MISTRAL_API_KEY` placeholder

- [x] 2. Service layer
  - [x] 2.1 Create `src/api/buildSystemPrompt.ts` — serialize restaurant data into constraining prompt
  - [x] 2.2 Create `src/api/MistralService.ts` — `sendMessage()` POSTs to Mistral API

- [x] 3. Data model
  - [x] 3.1 Create `src/model/ChatMessage.ts` — interface, `isValidMessage()`, `buildWelcomeMessage()`

- [x] 4. ChatInput component
  - [x] 4.1 Create `src/components/Chat/ChatInput.tsx` + SCSS

- [x] 5. ChatPanel component
  - [x] 5.1 Create `src/components/Chat/ChatPanel.tsx` + SCSS

- [x] 6. Widget components
  - [x] 6.1 Create `src/components/Chat/ChatButton.tsx` + SCSS — floating FAB
  - [x] 6.2 Create `src/components/Chat/ChatWidget.tsx` — manages open/closed state

- [x] 7. Integration
  - [x] 7.1 Add `ChatWidget` to `City.tsx` inside `LoadData` render prop

## Notes

- API key from `REACT_APP_MISTRAL_API_KEY` env var
