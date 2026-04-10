# Implementation Plan: Chat Booking Links

## Overview

Thread restaurant slugs and IDs through the system prompt, render slug-based links as in-app card openers, and wire the fullscreen card into the chat panel. Builds on top of completed tasks (website URLs in prompt, Markdown link rendering with `<a>` tags).

## Tasks

- [x] 1. Update `buildSystemPrompt` to include website URLs and formatting instructions
  - [x] 1.1 Append `| Website: ${fp.website}` to each restaurant line when `fp.website` is truthy
    - In the `restaurantList` map inside `src/api/buildSystemPrompt.ts`, conditionally add the website field
    - Skip the website segment when the value is falsy (empty string, undefined)
    - _Requirements: 1.1, 1.2_
  - [x] 1.2 Add LLM formatting instructions for Markdown links
    - Add instruction: "When recommending a restaurant that has a website, include a Markdown link like [Book / Visit](url)"
    - Add instruction: "When the user wants to book or visit, prominently include the website link"
    - _Requirements: 2.1, 2.2, 2.3_
  - [x] 1.3 Write unit tests for `buildSystemPrompt` website handling
    - Test that restaurants with a website include the URL in the prompt
    - Test that restaurants without a website omit the website segment
    - Test that formatting instructions are present in the output
    - _Requirements: 1.1, 1.2, 2.1_

- [x] 2. Update `formatMessage` to render Markdown links
  - [x] 2.1 Extend `renderInline` regex to match `[text](url)` patterns
    - In `src/components/Chat/formatMessage.tsx`, add a Markdown link pattern to the regex in `renderInline`
    - Process link matches before bold/italic to avoid bracket conflicts
    - Emit `<a href={url} target="_blank" rel="noopener noreferrer">{text}</a>` for each match
    - _Requirements: 3.1, 3.2, 3.3_
  - [x] 2.2 Write unit tests for Markdown link rendering
    - Test that `[text](url)` renders as a clickable anchor element
    - Test that links open in a new tab with correct `rel` attribute
    - Test that plain URLs without Markdown syntax remain as plain text
    - Test that links alongside bold/italic text render correctly
    - _Requirements: 3.1, 3.2, 3.3, 3.4_

- [x] 3. Update `buildSystemPrompt` to include restaurant IDs and slugs, and use slug-based link instructions
  - [x] 3.1 Add restaurant ID and slug to each restaurant line in the system prompt
    - Import `getFoodPlaceId` from `ts/utils`
    - For each restaurant in the `restaurantList` map, include `| ID: ${fp.id} | Slug: ${getFoodPlaceId(fp.name)}` in the line
    - _Requirements: 1.3, 1.4_
  - [x] 3.2 Change the LLM formatting instruction to use slugs instead of URLs
    - Update the instruction from `[Book / Visit](url)` to `[Book / Visit](restaurant-slug)` telling the LLM to use the restaurant slug as the link target
    - Update the booking-intent instruction to reference the slug-based link
    - _Requirements: 2.1, 2.2, 2.3_
  - [x] 3.3 Update existing `buildSystemPrompt` unit tests and add new tests
    - Update existing test for the formatting instruction to expect `[Book / Visit](restaurant-slug)` instead of `[Book / Visit](url)`
    - Add test: prompt contains `ID:` and `Slug:` for each restaurant
    - Add test: slug in prompt matches `getFoodPlaceId(fp.name)` for a known restaurant
    - Run tests inside Docker: `docker build -t culinary-passport . && docker run --rm culinary-passport npx react-scripts test --watchAll=false`
    - _Requirements: 1.3, 1.4, 2.1_

- [ ] 4. Checkpoint – Verify prompt changes
  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. Update `formatMessage` to distinguish slug links from HTTP links
  - [x] 5.1 Change `formatMessage` signature to accept `slugMap` and `onOpenCard`
    - Change signature to `formatMessage(text: string, slugMap?: Map<string, FoodPlace>, onOpenCard?: (fp: FoodPlace) => void): React.ReactNode`
    - Pass `slugMap` and `onOpenCard` through to every `renderInline` call
    - Update `renderInline` to accept `slugMap` and `onOpenCard` as additional parameters
    - _Requirements: 4.4_
  - [x] 5.2 Update the link regex and rendering logic to handle slug vs HTTP links
    - Broaden the Markdown link regex from `(https?:\/\/[^)]+)` to `([^)]+)` so it matches both HTTP URLs and slugs
    - For links where the URL starts with `http://` or `https://`: keep rendering as `<a href={url} target="_blank" rel="noopener noreferrer">`
    - For links where the URL matches a key in `slugMap`: render as a `<button>` with `className="chat-booking-link"` that calls `onOpenCard(slugMap.get(slug))`
    - For links where the URL is a non-HTTP string not in `slugMap`: render as plain text (just the link text, no clickable element)
    - When `slugMap` is undefined or not provided, treat all non-HTTP links as plain text (backward compatible)
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 4.3_
  - [x] 5.3 Update existing `formatMessage` tests and add new tests for slug link rendering
    - Ensure existing HTTP link tests still pass (may need to update `renderMessage` helper to pass no slugMap)
    - Add test: `[text](slug)` with slug in slugMap renders a `<button>`, not an `<a>`
    - Add test: clicking the slug button calls `onOpenCard` with the correct `FoodPlace`
    - Add test: `[text](unknown-slug)` with slug NOT in slugMap renders as plain text
    - Add test: message with both a slug link and an HTTP link renders both correctly
    - Add test: `formatMessage` called without slugMap still renders HTTP links as `<a>` tags
    - Run tests inside Docker: `docker build -t culinary-passport . && docker run --rm culinary-passport npx react-scripts test --watchAll=false`
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 4.3_

- [ ] 6. Checkpoint – Verify formatMessage changes
  - Ensure all tests pass, ask the user if questions arise.

- [x] 7. Update `ChatPanel` to build slug map, manage card state, and render fullscreen card
  - [x] 7.1 Build the slug lookup map and add `selectedFoodPlace` state
    - Import `getFoodPlaceId` from `ts/utils`, `FoodPlaceCardFullscreenWrapper`, `CityEnum`, `ToastNotificationEnum`
    - Build `slugMap: Map<string, FoodPlace>` from `foodPlaces` using `useMemo`, keyed by `getFoodPlaceId(fp.name)`
    - Add state: `const [selectedFoodPlace, setSelectedFoodPlace] = useState<FoodPlace | null>(null)`
    - Define `onOpenCard` callback that sets `selectedFoodPlace`
    - _Requirements: 4.1, 4.4_
  - [x] 7.2 Pass `slugMap` and `onOpenCard` to `formatMessage` in the message rendering loop
    - Update the `formatMessage(msg.content)` call to `formatMessage(msg.content, slugMap, onOpenCard)`
    - _Requirements: 4.4_
  - [x] 7.3 Render `FoodPlaceCardFullscreenWrapper` when `selectedFoodPlace` is set
    - When `selectedFoodPlace` is non-null, render a `FoodPlaceCardFullscreenWrapper` overlay with `isFullScreen={true}`
    - Pass `city={cityName as CityEnum}`, `foodPlace={selectedFoodPlace}`, `onLike`, and `showToast` props
    - Add `onLike` and `showToast` as optional props on `ChatPanelProps`, with no-op defaults: `onLike = () => {}`, `showToast = () => {}`
    - Add a close/dismiss mechanism (e.g., clicking the fullscreen background or using the card's built-in close) that sets `selectedFoodPlace` back to `null`
    - _Requirements: 4.1, 4.2_

- [x] 8. Thread `onLike` and `showToast` through `ChatWidget` from `City`
  - [x] 8.1 Add optional `onLike` and `showToast` props to `ChatWidgetProps` and pass to `ChatPanel`
    - In `src/components/Chat/ChatWidget.tsx`, add `onLike?: (foodPlaceId: number) => void` and `showToast?: (message: string, type: ToastNotificationEnum) => void` to `ChatWidgetProps`
    - Pass them through to `ChatPanel`
    - _Requirements: 4.1, 4.2_
  - [x] 8.2 Pass `onLike` and `showToast` from `City` to `ChatWidget`
    - In `src/components/City/City.tsx`, pass the existing `onLike` (from `useFilters`) and `showToast` (from `useToastNotifications`) to `ChatWidget`
    - _Requirements: 4.1, 4.2_

- [ ] 9. Checkpoint – Verify full integration
  - Ensure all tests pass, ask the user if questions arise.
  - Run full test suite inside Docker: `docker build -t culinary-passport . && docker run --rm culinary-passport npx react-scripts test --watchAll=false`

- [ ]* 10. Write property-based tests
  - [ ]* 10.1 Write property test for system prompt metadata
    - **Property 1: System prompt contains correct per-restaurant metadata**
    - Generate random arrays of FoodPlace objects with varying `id`, `name`, `website` (truthy/falsy)
    - Assert prompt contains ID, slug (matching `getFoodPlaceId`), and website iff truthy for each FoodPlace
    - **Validates: Requirements 1.1, 1.2, 1.3, 1.4**
  - [ ]* 10.2 Write property test for slug link rendering as buttons
    - **Property 2: Slug links render as interactive buttons that trigger the card callback**
    - Generate random message strings containing `[text](slug)` with slugs drawn from a generated slug map
    - Assert rendered output contains a `<button>` element; simulated click calls `onOpenCard` with correct FoodPlace
    - **Validates: Requirements 3.1, 3.2, 4.1**
  - [ ]* 10.3 Write property test for HTTP link rendering
    - **Property 3: HTTP links render as anchor elements opening in a new tab**
    - Generate random message strings containing `[text](https://...)`
    - Assert rendered output contains an `<a>` with correct `href`, `target="_blank"`, and `rel="noopener noreferrer"`
    - **Validates: Requirements 3.3**
  - [ ]* 10.4 Write property test for unrecognized link targets
    - **Property 4: Unrecognized link targets render as plain text**
    - Generate random message strings with `[text](unknown-slug)` or bare `https://...` without Markdown syntax
    - Assert rendered output contains no `<a>` or `<button>` for those segments
    - **Validates: Requirements 3.4, 4.3**

- [ ] 11. Final checkpoint
  - Ensure all tests pass, ask the user if questions arise.
  - Run full test suite inside Docker: `docker build -t culinary-passport . && docker run --rm culinary-passport npx react-scripts test --watchAll=false`

## Notes

- Tasks 1.x and 2.x are already completed — the code has website URLs in the system prompt and `<a>` tag rendering for Markdown links
- Tasks marked with `*` are optional and can be skipped for faster MVP
- All tests must be run inside Docker: `docker build -t culinary-passport . && docker run --rm culinary-passport npx react-scripts test --watchAll=false`
- Files modified: `buildSystemPrompt.ts`, `formatMessage.tsx`, `ChatPanel.tsx`, `ChatWidget.tsx`, `City.tsx`
- No data model or API changes needed — `FoodPlace.id`, `FoodPlace.name`, and `FoodPlace.website` already exist
