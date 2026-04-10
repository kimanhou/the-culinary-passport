# Requirements Document

## Introduction

This feature adds Google ratings (star rating and review count) and suggested/popular dishes to each restaurant in the Culinary Passport app. The data is fetched dynamically from the Google Places API via a Cloudflare Worker proxy (similar to the existing Mistral chat proxy), ensuring ratings and dishes stay current as reviews change over time. The information is displayed on restaurant cards in both compact and fullscreen views.

## Glossary

- **App**: The Culinary Passport React front-end application
- **Restaurant_Card**: The FoodPlaceCard component that displays restaurant details in compact and fullscreen views
- **Worker_Proxy**: A Cloudflare Worker that proxies requests to the Google Places API, keeping the API key server-side
- **Google_Places_API**: The Google Places API (New) used to retrieve rating, review count, and editorial summary or review-based dish information for a restaurant
- **Rating_Display**: The UI element on a Restaurant_Card showing the star rating and number of reviews
- **Dishes_Display**: The UI element on a Restaurant_Card showing suggested or popular dishes for a restaurant
- **FoodPlace_Model**: The TypeScript class representing a restaurant, currently containing id, name, description, price, typeOfCuisine, neighborhood, images, googleMaps, instagram, website, and coordinates
- **Cache**: A caching layer (Cloudflare Cache API or KV) used by the Worker_Proxy to avoid redundant Google Places API calls

## Requirements

### Requirement 1: Worker Proxy for Google Places API

**User Story:** As a developer, I want a Cloudflare Worker that proxies requests to the Google Places API, so that the API key is never exposed to the client.

#### Acceptance Criteria

1. THE Worker_Proxy SHALL accept requests containing a restaurant name and city, and return rating data and dish data from the Google_Places_API
2. THE Worker_Proxy SHALL store the Google Places API key as a server-side secret, inaccessible to the client
3. WHEN the Worker_Proxy receives a request, THE Worker_Proxy SHALL validate the request origin against the allowed origin configuration
4. WHEN the Worker_Proxy receives a request from a non-allowed origin, THE Worker_Proxy SHALL return a 403 response
5. WHEN the Worker_Proxy receives a request with missing or invalid parameters, THE Worker_Proxy SHALL return a 400 response with a descriptive error message
6. THE Worker_Proxy SHALL enforce rate limiting per client IP to prevent abuse of the Google_Places_API quota

### Requirement 2: Caching of Google Places Data

**User Story:** As a developer, I want Google Places responses to be cached, so that the app minimizes API calls and stays within quota limits.

#### Acceptance Criteria

1. WHEN the Worker_Proxy receives a request for a restaurant that has a cached response, THE Worker_Proxy SHALL return the cached data without calling the Google_Places_API
2. WHEN the Worker_Proxy receives a request for a restaurant with no cached response, THE Worker_Proxy SHALL fetch from the Google_Places_API and store the result in the Cache
3. THE Cache SHALL store responses with a time-to-live of 24 hours to balance freshness with quota usage
4. WHEN a cached entry expires, THE Worker_Proxy SHALL fetch fresh data from the Google_Places_API on the next request

### Requirement 3: Google Rating Data Retrieval

**User Story:** As a user, I want to see the Google star rating and number of reviews for each restaurant, so that I can gauge how well-reviewed a place is.

#### Acceptance Criteria

1. THE Worker_Proxy SHALL return the star rating (1.0 to 5.0) and total number of user ratings for each requested restaurant
2. WHEN the Google_Places_API returns no rating data for a restaurant, THE Worker_Proxy SHALL return a response indicating that no rating is available
3. IF the Google_Places_API returns an error, THEN THE Worker_Proxy SHALL return a structured error response with the appropriate HTTP status code

### Requirement 4: Suggested Dishes Data Retrieval

**User Story:** As a user, I want to see popular or suggested dishes for each restaurant, so that I can decide what to order before visiting.

#### Acceptance Criteria

1. THE Worker_Proxy SHALL return a list of suggested dishes for each requested restaurant, extracted from Google Places review data or editorial summaries
2. WHEN the Google_Places_API returns no dish-related data for a restaurant, THE Worker_Proxy SHALL return an empty dishes list
3. THE Worker_Proxy SHALL return a maximum of 5 suggested dishes per restaurant to keep the display concise

### Requirement 5: FoodPlace Model Extension

**User Story:** As a developer, I want the FoodPlace model to include rating and dishes fields, so that the UI can display this data.

#### Acceptance Criteria

1. THE FoodPlace_Model SHALL include optional fields for star rating (number), review count (number), and suggested dishes (list of strings)
2. WHEN rating or dishes data is not available, THE FoodPlace_Model SHALL use default values of null for rating, null for review count, and an empty list for dishes

### Requirement 6: Rating Display on Restaurant Card

**User Story:** As a user, I want to see the Google star rating and review count on each restaurant card, so that I can quickly compare restaurants.

#### Acceptance Criteria

1. WHEN a restaurant has rating data, THE Restaurant_Card SHALL display the star rating as a numeric value with one decimal place and a visual star indicator
2. WHEN a restaurant has rating data, THE Restaurant_Card SHALL display the total number of reviews in a human-readable format (e.g., "1.2k reviews")
3. WHEN a restaurant has no rating data, THE Restaurant_Card SHALL hide the Rating_Display element rather than showing empty or zero values
4. THE Rating_Display SHALL be visible in both compact and fullscreen views of the Restaurant_Card

### Requirement 7: Dishes Display on Restaurant Card

**User Story:** As a user, I want to see suggested dishes on the restaurant card, so that I know what the restaurant is known for.

#### Acceptance Criteria

1. WHEN a restaurant has suggested dishes, THE Restaurant_Card SHALL display the dishes as a list of tags or chips below the description
2. WHEN a restaurant has no suggested dishes, THE Restaurant_Card SHALL hide the Dishes_Display element
3. THE Dishes_Display SHALL be visible in the fullscreen view of the Restaurant_Card
4. WHILE the Restaurant_Card is in compact view, THE Dishes_Display SHALL show a maximum of 3 dishes to conserve space

### Requirement 8: Loading and Error States

**User Story:** As a user, I want clear feedback while rating and dish data is loading or if it fails, so that I understand the current state of the information.

#### Acceptance Criteria

1. WHILE rating and dishes data is being fetched, THE Restaurant_Card SHALL display a subtle loading indicator in place of the Rating_Display and Dishes_Display
2. IF the fetch for rating and dishes data fails, THEN THE Restaurant_Card SHALL hide the Rating_Display and Dishes_Display without showing an error to the user
3. IF the fetch for rating and dishes data fails, THEN THE App SHALL log the error to the browser console for debugging purposes

### Requirement 9: Client-Side Data Fetching

**User Story:** As a developer, I want the front-end to fetch Google Places data efficiently, so that the page loads quickly and API usage is minimized.

#### Acceptance Criteria

1. THE App SHALL fetch rating and dishes data from the Worker_Proxy only when a restaurant card becomes visible or is opened in fullscreen view
2. THE App SHALL cache fetched rating and dishes data in memory for the duration of the user session to avoid redundant requests
3. WHEN the App fetches data for a restaurant, THE App SHALL use the restaurant name and city as the lookup key
