# Implementation Plan: Google Ratings & Dishes

## Overview

Add Google ratings and suggested dishes to restaurant cards by extending the existing Cloudflare Worker with a new `/places` route, creating client-side services/hooks, and building UI components. All tests must be run inside Docker.

## Tasks

- [ ] 1. Worker: Add Google Places handler and routing
  - [x] 1.1 Create `worker/src/extractDishes.ts` — pure function to extract up to 5 dish names from Google Places review text and editorial summary
    - Implement `extractDishes(reviews, editorialSummary?)` returning `string[]` (max 5)
    - Use lightweight keyword/heuristic extraction from review text
    - _Requirements: 4.1, 4.2, 4.3_

  - [ ]* 1.2 Write unit tests for `extractDishes`
    - Test with reviews containing dish names, empty reviews, editorial summary only, and mixed input
    - Test max 5 dishes cap
    - _Requirements: 4.1, 4.2, 4.3_

  - [x] 1.3 Create `worker/src/placesHandler.ts` — Google Places handler
    - Parse and validate `name` and `city` query parameters (return 400 on missing/invalid)
    - Build cache key from normalized name+city
    - Check Cloudflare Cache API for cached response; on hit return cached data
    - On miss: call Google Places API (New) `searchText` endpoint with `name + city`
    - Extract `rating`, `userRatingCount` from response; call `extractDishes` for dishes
    - Cache response with `Cache-Control: max-age=86400` (24h TTL)
    - Return `PlacesResponse` JSON: `{ rating, userRatingCount, dishes }`
    - Handle missing rating data (return nulls) and API errors (structured error response)
    - _Requirements: 1.1, 1.2, 1.5, 2.1, 2.2, 2.3, 2.4, 3.1, 3.2, 3.3_

  - [ ]* 1.4 Write unit tests for `placesHandler`
    - Test param validation (missing name/city → 400)
    - Test cache hit path returns cached data
    - Test cache miss path calls Google API and caches result
    - Test error handling when Google API fails
    - Test null rating/empty dishes scenarios
    - _Requirements: 1.5, 2.1, 2.2, 3.1, 3.2, 3.3_

  - [x] 1.5 Refactor `worker/src/index.ts` into a path-based router
    - Add `GOOGLE_PLACES_API_KEY` to the `Env` interface
    - Keep `POST /` → existing Mistral chat handler (unchanged behavior)
    - Add `GET /places` → new `placesHandler`
    - Update CORS headers to allow `GET` method
    - Return 404 for unmatched routes
    - Shared middleware (CORS, geo-blocking, rate limiting) runs before routing
    - Validate request origin against `ALLOWED_ORIGIN` (return 403 for non-allowed origins)
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.6_

- [ ] 2. Checkpoint — Worker implementation
  - Ensure all worker tests pass (run via Docker if test setup exists), ask the user if questions arise.

- [ ] 3. Client: Data layer and FoodPlace model
  - [x] 3.1 Extend `src/model/FoodPlace.ts` with optional runtime fields
    - Add `googleRating: number | null` (default `null`)
    - Add `googleReviewCount: number | null` (default `null`)
    - Add `suggestedDishes: string[]` (default `[]`)
    - These fields are NOT part of `deserialize` — they are set at runtime after API fetch
    - _Requirements: 5.1, 5.2_

  - [x] 3.2 Create `src/api/GooglePlacesService.ts`
    - Define `GooglePlacesData` interface: `{ rating, userRatingCount, dishes }`
    - Implement `fetchGooglePlacesData(name, city)` calling `GET <WORKER_URL>/places?name=...&city=...`
    - Maintain in-memory `Map<string, GooglePlacesData>` cache keyed by `name|city`
    - Return cached data immediately if available
    - On failure: return `{ rating: null, userRatingCount: null, dishes: [] }` and log error to console
    - Use `REACT_APP_PLACES_API_URL` env var for the worker URL
    - _Requirements: 9.2, 9.3, 8.2, 8.3_

  - [x] 3.3 Create `src/hooks/useGooglePlacesData.ts`
    - Implement `useGooglePlacesData(name, city, enabled)` hook
    - `enabled` controls when fetching starts (tied to visibility/fullscreen)
    - Return `{ data: GooglePlacesData | null, isLoading: boolean }`
    - Handle errors silently (return null data, log to console)
    - _Requirements: 9.1, 8.1, 8.2, 8.3_

  - [ ]* 3.4 Write unit tests for `GooglePlacesService`
    - Test in-memory cache returns cached data on second call
    - Test fetch failure returns default values and logs error
    - _Requirements: 9.2, 8.2, 8.3_

- [ ] 4. Client: UI components
  - [x] 4.1 Create `src/components/FoodPlaceList/Card/RatingDisplay.tsx` and `RatingDisplay.scss`
    - Render star rating as numeric value (1 decimal) with a star icon
    - Format review count: < 1000 as-is, ≥ 1000 with "k" suffix, singular "1 review"
    - Render nothing when rating is null
    - _Requirements: 6.1, 6.2, 6.3_

  - [x] 4.2 Create `src/components/FoodPlaceList/Card/DishesDisplay.tsx` and `DishesDisplay.scss`
    - Render dish names as tag chips (reuse existing Tag component pattern from `FoodPlaceTags`)
    - Accept `maxItems` prop (3 for compact, 5 for fullscreen)
    - Render nothing when dishes array is empty
    - _Requirements: 7.1, 7.2, 7.3, 7.4_

  - [ ]* 4.3 Write unit tests for `RatingDisplay`
    - Test renders rating and formatted review count
    - Test renders nothing when rating is null
    - Test review count formatting (< 1000, ≥ 1000, singular)
    - _Requirements: 6.1, 6.2, 6.3_

  - [ ]* 4.4 Write unit tests for `DishesDisplay`
    - Test renders dish chips up to maxItems
    - Test renders nothing when dishes is empty
    - _Requirements: 7.1, 7.2, 7.3, 7.4_

- [ ] 5. Client: Integration into FoodPlaceCard
  - [x] 5.1 Integrate `useGooglePlacesData` hook into `FoodPlaceCard`
    - Use IntersectionObserver to detect card visibility; set `enabled` accordingly
    - Also enable when card is opened fullscreen
    - Pass restaurant `name` and `city` to the hook
    - _Requirements: 9.1, 8.1_

  - [x] 5.2 Render `RatingDisplay` and `DishesDisplay` in `FoodPlaceCard`
    - Render `RatingDisplay` between the name (`<h3>`) and `FoodPlaceTags`
    - Render `DishesDisplay` after tags (fullscreen, max 5) or after description (compact, max 3)
    - Show subtle loading placeholder while data is being fetched
    - Hide both components on fetch failure (no error shown to user)
    - _Requirements: 6.4, 7.3, 7.4, 8.1, 8.2_

  - [x] 5.3 Add `REACT_APP_PLACES_API_URL` to `.env.example` and `.env`
    - Point to the worker URL + `/places` path
    - _Requirements: 9.1_

- [ ] 6. Final checkpoint — Full integration
  - Ensure all tests pass by running inside Docker: `docker build -t culinary-passport . && docker run --rm culinary-passport npx react-scripts test --watchAll=false`. Ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- All tests MUST be run inside Docker, not directly on the host
- The `GOOGLE_PLACES_API_KEY` worker secret must be set via `wrangler secret put` before deployment
- FoodPlace runtime fields (`googleRating`, `googleReviewCount`, `suggestedDishes`) are not persisted in JSON data files
