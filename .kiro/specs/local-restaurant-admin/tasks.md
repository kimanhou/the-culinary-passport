# Implementation Plan: Local Restaurant Admin

## Overview

Build a local-only admin tool for managing restaurant entries in The Culinary Passport app. The implementation adds REST endpoints to the existing local proxy (`worker/src/local-proxy.js`), a new `AdminService` API client, and five React components gated behind the `REACT_APP_LOCAL_ADMIN` environment variable. All file I/O goes through the proxy, which gets filesystem access to `./public` via a new Docker volume mount.

## Tasks

- [x] 1. Docker Compose and environment setup
  - [x] 1.1 Add `./public:/app/public` volume mount to the worker service in `docker-compose.yml`
    - This gives the local proxy read/write access to JSON data files and the photos directory
    - _Requirements: 10.2, 11.4, 8.3_
  - [x] 1.2 Add `REACT_APP_LOCAL_ADMIN=true` environment variable to the `the-culinary-passport` service in `docker-compose.yml`
    - _Requirements: 1.1, 1.2_

- [x] 2. Local proxy utility functions (`worker/src/local-proxy.js`)
  - [x] 2.1 Implement city-to-file mapping and JSON read/write helpers
    - Add `CITY_FILE_MAP` constant mapping city names to filenames (`data_{city}.json`)
    - Add `readCityData(city)` — validates city, reads and parses the JSON file from `/app/public/`
    - Add `writeCityData(city, data)` — writes JSON with 4-space indentation
    - Add `slugify(name)` — converts restaurant name to lowercase alphanumeric + hyphens for filenames
    - Add `parseBody(req)` — promise-based request body parser
    - _Requirements: 2.2, 10.4, 14.5, 15.4, 17.4, 11.5_
  - [x] 2.2 Write property tests for city-to-file mapping (Property 1)
    - **Property 1: City-to-file mapping**
    - Install `fast-check` as a dev dependency in `worker/package.json`
    - Create `worker/src/__tests__/admin-endpoints.test.js`
    - Test that valid cities return `data_{city}.json` and invalid cities return error/null
    - **Validates: Requirements 2.2**
  - [x] 2.3 Write property tests for filename generation (Property 5)
    - **Property 5: Unique filename generation**
    - Create `worker/src/__tests__/filename-gen.test.js`
    - Test that distinct (name, index) pairs produce different filenames and that output contains only lowercase alphanumeric, hyphens, and extension
    - **Validates: Requirements 11.5**

- [x] 3. Local proxy CRUD endpoints (`worker/src/local-proxy.js`)
  - [x] 3.1 Implement GET `/admin/restaurants` endpoint
    - Accept `city` query parameter, return JSON array from the city data file
    - Return 400 for missing/invalid city
    - Update CORS headers to allow GET, POST, PUT, DELETE, OPTIONS
    - _Requirements: 13.1, 11.1_
  - [x] 3.2 Implement POST `/admin/restaurants` endpoint (create)
    - Parse request body `{city, entry}`, assign `id = max(existing ids) + 1` (or 1 for empty array)
    - Append entry to array, write back with 4-space indentation
    - Return `{success: true, id}`
    - _Requirements: 10.2, 10.3, 10.4_
  - [x] 3.3 Implement PUT `/admin/restaurants` endpoint (update)
    - Parse request body `{city, entry}` where entry includes `id`
    - Find and replace entry by id, write back with 4-space indentation
    - Return 404 if id not found
    - _Requirements: 14.4, 14.5_
  - [x] 3.4 Implement DELETE `/admin/restaurants` endpoint (delete)
    - Accept `city` and `id` query parameters
    - Remove entry with matching id, write back with 4-space indentation
    - Return 404 if id not found
    - _Requirements: 15.3, 15.4_
  - [x] 3.5 Implement PUT `/admin/restaurants/reorder` endpoint
    - Parse request body `{city, orderedIds}`
    - Validate that orderedIds contains exactly the same ids as the file
    - Reorder array to match orderedIds, write back with 4-space indentation
    - Return 400 if ids don't match
    - _Requirements: 17.3, 17.4_
  - [x] 3.6 Write property tests for CRUD operations (Properties 6, 7, 8, 9, 10, 11)
    - **Property 6: Create restaurant round-trip** — create entry then read back, verify equality
    - **Property 7: ID assignment is max plus one** — verify new id = max(existing) + 1, or 1 for empty
    - **Property 8: JSON file formatting consistency** — verify 4-space indentation after any write
    - **Property 9: Update preserves id and modifies entry** — update entry, verify id preserved and count unchanged
    - **Property 10: Delete removes exactly one entry** — delete id, verify count decremented by 1 and correct entry removed
    - **Property 11: Reorder preserves entries and applies order** — reorder with permutation, verify order matches and data unchanged
    - Add tests to `worker/src/__tests__/admin-endpoints.test.js`
    - **Validates: Requirements 10.2, 10.3, 10.4, 14.4, 14.5, 15.3, 15.4, 17.3, 17.4**

- [x] 4. Checkpoint — Verify proxy endpoints
  - Ensure all tests pass, ask the user if questions arise.
  - Run tests inside Docker: `docker build -t culinary-passport . && docker run --rm culinary-passport npx react-scripts test --watchAll=false`

- [x] 5. Local proxy Google Places and photo endpoints (`worker/src/local-proxy.js`)
  - [x] 5.1 Implement POST `/admin/places-lookup` endpoint
    - Parse request body `{name, city}`, call Google Places API `searchText` with `textQuery: "{name} {city}"`
    - Request fields: `places.location,places.googleMapsUri,places.websiteUri,places.formattedAddress,places.photos`
    - Extract and return coordinates, googleMapsUri, websiteUri, formattedAddress, photos from first result
    - Return 404 if no results, 502 on API error
    - _Requirements: 4.1, 11.1, 11.2, 11.3, 11.6_
  - [x] 5.2 Implement POST `/admin/download-photo` endpoint
    - Parse request body `{photoName, restaurantName, index}`
    - Fetch photo via `https://places.googleapis.com/v1/{photoName}/media?maxWidthPx=800&key=...`
    - Generate filename using slugify(restaurantName) + `-` + index + `.jpg`
    - Create `public/photos/` directory if needed, save file, return `{path: "photos/..."}`
    - Return 502 on download failure
    - _Requirements: 4.5, 11.4, 11.5, 11.7_
  - [x] 5.3 Implement POST `/admin/upload-photo` endpoint (multipart/form-data)
    - Parse multipart form data (restaurantName + file)
    - Save file to `public/photos/` with slugified name + timestamp
    - Return `{path: "photos/..."}`
    - _Requirements: 8.2, 8.3_
  - [x] 5.4 Write property tests for Google Places extraction and photo limit (Properties 3, 4)
    - **Property 3: Google Places field extraction** — generate random API response shapes, verify correct field extraction and null for missing fields
    - **Property 4: Photo download respects limit** — generate responses with 0-10 photo refs, verify at most 3 processed
    - Create `worker/src/__tests__/places-extraction.test.js`
    - **Validates: Requirements 4.2, 4.3, 4.4, 4.5, 11.1, 11.3**

- [x] 6. Admin API service (`src/api/AdminService.ts`)
  - [x] 6.1 Create the AdminService module
    - Implement all 8 async functions: `fetchRestaurants`, `createRestaurant`, `updateRestaurant`, `deleteRestaurant`, `reorderRestaurants`, `placesLookup`, `downloadPhoto`, `uploadPhoto`
    - Base URL: `http://localhost:8787/admin`
    - Use `fetch` API with proper error handling (throw on non-ok responses with error message from body)
    - _Requirements: 10.1, 13.1, 14.4, 15.2, 17.2, 4.1, 4.5, 8.2_

- [x] 7. Admin form validation and duplicate detection (`src/components/Admin/adminValidation.ts`)
  - [x] 7.1 Create validation utility
    - Implement `validateForm(data)` — returns `{valid: boolean, errors: Record<string, string>}`
    - Validate: name non-empty, city selected, coordinates present, typeOfCuisine non-empty
    - Implement `checkDuplicate(name, existingNames)` — case-insensitive name match, returns boolean
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5, 16.1, 16.2_
  - [x] 7.2 Write property tests for form validation (Property 2)
    - **Property 2: Form validation rejects incomplete data**
    - Create `src/components/Admin/__tests__/adminValidation.test.ts`
    - Generate random form data with various missing/present field combinations, verify correct accept/reject
    - **Validates: Requirements 3.2, 7.3, 12.1, 12.2, 12.3, 12.4**
  - [x] 7.3 Write property tests for duplicate detection (Property 12)
    - **Property 12: Case-insensitive duplicate detection**
    - Add to `src/components/Admin/__tests__/adminValidation.test.ts`
    - Generate random name pairs with various casing, verify symmetric case-insensitive matching
    - **Validates: Requirements 16.1**

- [x] 8. Checkpoint — Verify service and validation logic
  - Ensure all tests pass, ask the user if questions arise.
  - Run tests inside Docker: `docker build -t culinary-passport . && docker run --rm culinary-passport npx react-scripts test --watchAll=false`

- [x] 9. React components — AdminPhotoManager and AdminPreview
  - [x] 9.1 Create AdminPhotoManager component (`src/components/Admin/AdminPhotoManager.tsx`)
    - Display current images as thumbnails
    - Add image URL input with add button
    - Upload local file button (calls `AdminService.uploadPhoto`)
    - Remove button per image
    - Show Google Places photos after lookup with add/remove
    - _Requirements: 4.5, 4.6, 4.7, 8.1, 8.2, 8.4_
  - [x] 9.2 Create AdminPreview component (`src/components/Admin/AdminPreview.tsx`)
    - Render a read-only preview using the existing `FoodPlaceCard` component with current form data as props
    - Provide a "Back to Edit" button to return to the form
    - _Requirements: 9.1, 9.2, 9.3_

- [x] 10. React components — AdminForm
  - [x] 10.1 Create AdminForm component (`src/components/Admin/AdminForm.tsx`)
    - All form fields: name, description, cuisine types (multi-input), price range (select), neighborhood, coordinates (lat/lng), Google Maps URL, website URL, Instagram URL, tags (multi-input)
    - Google Places lookup button — calls `AdminService.placesLookup`, auto-fills coordinates, googleMapsUri, websiteUri, and triggers photo download (up to 3)
    - Integrate AdminPhotoManager for images management
    - Integrate validation from `adminValidation.ts` — show inline errors on invalid fields
    - Duplicate detection warning (non-blocking) when name matches existing entry
    - Preview mode toggle — show AdminPreview when requested
    - Support both create (no existing entry) and edit (existing entry populates fields) modes
    - Allow manual override of all auto-filled fields
    - _Requirements: 3.1, 3.2, 4.1, 4.2, 4.3, 4.4, 4.6, 4.8, 5.1, 6.1, 6.2, 6.3, 7.1, 7.2, 7.3, 7.4, 12.5, 14.1, 14.2, 14.3, 16.2, 16.3_
  - [x] 10.2 Create AdminForm SCSS styles (`src/components/Admin/AdminForm.scss`)
    - Form layout, field styling, validation error highlights, duplicate warning styling
    - _Requirements: 12.5_

- [x] 11. React components — AdminRestaurantList and AdminPage
  - [x] 11.1 Create AdminRestaurantList component (`src/components/Admin/AdminRestaurantList.tsx`)
    - Display name, neighborhood, cuisine type per entry
    - Edit, Delete, Move Up, Move Down buttons per row
    - Delete triggers confirmation dialog before proceeding
    - Move up on first item and move down on last item are no-ops
    - _Requirements: 13.1, 13.2, 13.3, 13.4, 15.1, 17.1, 17.5_
  - [x] 11.2 Create AdminPage component (`src/components/Admin/AdminPage.tsx`)
    - City selector dropdown (Montreal, Paris, Tokyo, London)
    - Fetches restaurant list via `AdminService.fetchRestaurants` on city change
    - Left/top panel: AdminRestaurantList
    - Right/bottom panel: AdminForm (create or edit mode)
    - Handles save (create/update), delete, and reorder operations via AdminService
    - Displays success/error messages using existing `ToastNotificationEnum` pattern
    - Page heading identifying the admin tool
    - _Requirements: 1.3, 2.1, 2.2, 2.3, 10.1, 10.5, 10.6, 15.2, 15.5, 15.6, 17.2_
  - [x] 11.3 Create AdminPage SCSS styles (`src/components/Admin/AdminPage.scss`)
    - Page layout, city selector, list/form panel arrangement
    - _Requirements: 1.3_

- [x] 12. Routing and conditional rendering
  - [x] 12.1 Add conditional admin route in `src/App.tsx`
    - Import AdminPage
    - Add `<Route path="/admin" element={<AdminPage />} />` inside a conditional check for `process.env.REACT_APP_LOCAL_ADMIN === 'true'`
    - _Requirements: 1.1, 1.2_

- [x] 13. Checkpoint — Verify full integration
  - Ensure all tests pass, ask the user if questions arise.
  - Run tests inside Docker: `docker build -t culinary-passport . && docker run --rm culinary-passport npx react-scripts test --watchAll=false`

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- All tests must be run inside Docker, not directly on the host
- Property tests use `fast-check` and reference specific design properties
- The admin tool is local-only — never deployed to production
- The existing `FoodPlaceCard` component is reused for preview rendering
