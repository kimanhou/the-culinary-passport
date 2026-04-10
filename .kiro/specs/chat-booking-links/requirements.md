# Requirements Document

## Introduction

Add clickable booking/restaurant links to the chat agent's restaurant recommendations. When the LLM recommends a restaurant, the chat response should include a clickable link that opens the restaurant's fullscreen card within the app (showing images, Instagram, Google Maps, website, etc.) rather than navigating to an external URL. The restaurant IDs and website URLs already exist in the restaurant data — this feature threads them through the system prompt, instructs the LLM to reference restaurants by ID, and renders clickable elements in the chat UI that open the in-app restaurant card.

## Glossary

- **Chat_Agent**: The Mistral-powered chat assistant that recommends restaurants on city pages
- **System_Prompt**: The prompt constructed by `buildSystemPrompt()` that provides the LLM with restaurant data and formatting instructions
- **Message_Renderer**: The `formatMessage` component that converts Markdown in chat responses into rendered React elements
- **Restaurant_Data**: The JSON data files containing restaurant information including the `website` field, numeric `id`, and `name`
- **Restaurant_Card**: The `FoodPlaceCardFullscreenWrapper` component that displays a restaurant in fullscreen mode with images, description, Instagram, Google Maps, website link, and other details
- **Restaurant_Slug**: A URL-friendly identifier derived from the restaurant name via `getFoodPlaceId()`, used to identify cards in the DOM and in URL fragments

## Requirements

### Requirement 1: Include Website URLs and Restaurant IDs in System Prompt

**User Story:** As a user, I want the chat agent to know restaurant website URLs and identifiers, so that it can reference them in its recommendations.

#### Acceptance Criteria

1. WHEN building the system prompt, THE System_Prompt SHALL include the `website` URL for each restaurant that has one
2. WHEN a restaurant has no website URL, THE System_Prompt SHALL omit the website field for that restaurant rather than including an empty value
3. WHEN building the system prompt, THE System_Prompt SHALL include the numeric `id` for each restaurant
4. WHEN building the system prompt, THE System_Prompt SHALL include the Restaurant_Slug for each restaurant

### Requirement 2: Instruct LLM to Reference Restaurants with Identifiers

**User Story:** As a user, I want the chat agent to include structured restaurant references in its responses, so that the UI can match them to the correct restaurant card.

#### Acceptance Criteria

1. THE System_Prompt SHALL instruct the Chat_Agent to include a Markdown link using the restaurant slug as the URL when recommending a restaurant (e.g., `[Book / Visit](restaurant-slug)`)
2. THE System_Prompt SHALL instruct the Chat_Agent to use actionable phrasing such as "Book / Visit" or "See details" for the link text
3. WHEN the user expresses intent to book, reserve, or visit a recommended restaurant, THE System_Prompt SHALL instruct the Chat_Agent to prominently include the restaurant link in the response

### Requirement 3: Render Restaurant Links as Card Openers

**User Story:** As a user, I want to click a restaurant link in the chat and see the restaurant's fullscreen card with all its details, so that I can view images, maps, and the external website without leaving the app.

#### Acceptance Criteria

1. WHEN a chat message contains a Markdown link whose URL matches a known Restaurant_Slug, THE Message_Renderer SHALL render the link as a clickable element that opens the corresponding Restaurant_Card in fullscreen mode
2. THE Message_Renderer SHALL render restaurant links as button-like elements rather than anchor tags, since the links do not navigate to an external URL
3. WHEN a chat message contains a Markdown link whose URL starts with `http://` or `https://`, THE Message_Renderer SHALL render the link as a standard anchor element opening in a new tab with `rel="noopener noreferrer"`
4. WHEN a chat message contains a plain URL without Markdown link syntax, THE Message_Renderer SHALL continue to render the URL as plain text (no auto-linking)

### Requirement 4: Open Restaurant Card from Chat Context

**User Story:** As a user, I want the restaurant card to open in fullscreen when I click a restaurant link in the chat, so that I can see all the restaurant details including images, Instagram, Google Maps, and the external website link.

#### Acceptance Criteria

1. WHEN a user clicks a restaurant link in the chat, THE Restaurant_Card SHALL open in fullscreen mode for the matching restaurant
2. THE Restaurant_Card SHALL display the restaurant's external website link (when available) so the user can still navigate to the external site from the card
3. WHEN the restaurant matching the clicked slug is not found in the current Restaurant_Data, THE Message_Renderer SHALL render the link as plain text rather than a clickable element
4. THE Chat_Agent panel SHALL provide the Message_Renderer with access to the list of Restaurant_Data and a callback to trigger the fullscreen Restaurant_Card

