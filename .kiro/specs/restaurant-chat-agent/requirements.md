# Requirements: Restaurant Chat Agent

Floating AI chat widget on city pages. Powered by Mistral AI, recommends restaurants exclusively from the app's existing `FoodPlace` data for the selected city.

## Glossary

- **Chat_Widget**: Floating button + expandable chat panel on city pages
- **Chat_Agent**: Mistral-powered conversational system for restaurant recommendations
- **Restaurant_Data**: `FoodPlace[]` loaded from city JSON files
- **System_Prompt**: Instruction sent to Mistral containing serialized restaurant data

## Requirements

### 1. Chat Widget on City Pages

As a user browsing a city page, I want a floating chat button to access the restaurant recommendation agent.

- 1.1 Floating button renders bottom-right on city pages
- 1.2 Clicking expands into a chat panel with conversation history and text input
- 1.3 Close button collapses back to floating button
- 1.4 Panel stays visible while scrolling
- 1.5 Welcome message on first open includes city name

### 2. Send Messages and Receive Responses

As a user, I want to type a message and get restaurant recommendations matching my preferences.

- 2.1 Enter/send button submits message with conversation history and system prompt to Mistral
- 2.2 User message appears in history immediately
- 2.3 Loading indicator shown during API request
- 2.4 Agent response appears in history when received
- 2.5 Empty/whitespace-only messages are rejected

### 3. Constrain to City Restaurant Data

As a user, I want recommendations only from the app's data for the current city.

- 3.1 System prompt includes all restaurant data (name, description, price, cuisines, neighborhood)
- 3.2 System prompt instructs agent to only recommend listed restaurants
- 3.3 Agent references actual restaurant names, prices, neighborhoods from the data
- 3.4 Agent says "no match" and suggests broadening criteria when nothing fits

### 4. Conversation Context

As a user, I want multi-turn dialogue with the agent.

- 4.1 Follow-up messages include full conversation history in API request
- 4.2 History resets when navigating away from city page
- 4.3 History resets when switching cities

### 5. Error Handling

- 5.1 API failures show error message in chat history
- 5.2 User can continue sending messages after an error
- 5.3 Missing API key shows "chat unavailable" message

### 6. API Configuration

- 6.1 API key read from `REACT_APP_MISTRAL_API_KEY` env var
- 6.2 Uses Mistral chat completion endpoint
- 6.3 System prompt sent as first message with role "system"
