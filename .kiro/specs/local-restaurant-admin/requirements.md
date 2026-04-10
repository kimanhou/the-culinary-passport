# Requirements Document

## Introduction

A local-only admin tool for managing restaurants in The Culinary Passport app. The tool runs exclusively in the Docker-based local development environment (docker-compose on localhost) and is never deployed to production. It allows content editors to add, edit, and delete restaurant entries in the city-specific JSON data files (`public/data_{city}.json`) through a guided form with Google Places API integration for auto-filling location data. After saving, the updated JSON files are committed and pushed, and CI deploys the changes.

## Glossary

- **Admin_Form**: The local-only web interface accessible at the `/admin` route for creating, editing, and deleting restaurant entries.
- **Restaurant_List**: A list view within the Admin_Form showing all existing restaurants for the selected city, with options to edit or delete each entry.
- **City_JSON_File**: One of the static JSON data files storing restaurant entries per city (`data_montreal.json`, `data_paris.json`, `data_tokyo.json`, `data_london.json`) located in the `public/` directory.
- **FoodPlace_Entry**: A restaurant data object conforming to the existing FoodPlace model schema (id, name, tags, description, price, typeOfCuisine, neighborhood, images, googleMaps, instagram, website, coordinates, stayType).
- **Local_Proxy**: The Node.js HTTP server (`worker/src/local-proxy.js`) running in the worker Docker container with filesystem access to the `public/` directory via volume mounts.
- **Preview_Card**: A read-only rendering of the restaurant card as it will appear in the app, shown before saving.
- **Google_Places_Lookup**: A call to the Google Places API (New) (via the Local_Proxy) to retrieve coordinates, address, Google Maps link, website URL, and photo references for a restaurant by name and city.
- **Google_Places_Photo**: A photo reference returned by the Google Places API that can be fetched via the Places Photos API and saved locally to the `public/` directory.

## Requirements

### Requirement 1: Admin Route Availability

**User Story:** As a content editor, I want to access the admin form at a dedicated route when running locally, so that I can add restaurants without modifying JSON files by hand.

#### Acceptance Criteria

1. WHEN the application is running in the local Docker environment, THE Admin_Form SHALL be accessible at the `/#/admin` route.
2. WHEN the application is running in production, THE Admin_Form route SHALL not be included in the application bundle or routing configuration.
3. THE Admin_Form SHALL display a heading that identifies the page as the restaurant admin tool.

### Requirement 2: City Selection

**User Story:** As a content editor, I want to select which city the new restaurant belongs to, so that the entry is appended to the correct City_JSON_File.

#### Acceptance Criteria

1. THE Admin_Form SHALL present a city selector with the options: Montreal, Paris, Tokyo, London.
2. WHEN a city is selected, THE Admin_Form SHALL use the selected city to determine the target City_JSON_File for saving.
3. THE Admin_Form SHALL require a city selection before allowing form submission.

### Requirement 3: Restaurant Name Entry

**User Story:** As a content editor, I want to enter the restaurant name, so that the FoodPlace_Entry has a name field.

#### Acceptance Criteria

1. THE Admin_Form SHALL provide a text input for the restaurant name.
2. THE Admin_Form SHALL require a non-empty restaurant name before allowing form submission.

### Requirement 4: Google Places Auto-Fill

**User Story:** As a content editor, I want to look up a restaurant via Google Places API, so that coordinates, Google Maps link, website, and photos are auto-filled to minimize manual data entry.

#### Acceptance Criteria

1. WHEN the content editor provides a restaurant name and city and triggers a lookup, THE Admin_Form SHALL call the Google_Places_Lookup via the Local_Proxy.
2. WHEN the Google_Places_Lookup returns a result, THE Admin_Form SHALL auto-fill the coordinates field with the latitude and longitude from the `location` field.
3. WHEN the Google_Places_Lookup returns a result, THE Admin_Form SHALL auto-fill the Google Maps link field with the `googleMapsUri` from the result.
4. WHEN the Google_Places_Lookup returns a result that includes a `websiteUri`, THE Admin_Form SHALL auto-fill the website URL field with the `websiteUri` value.
5. WHEN the Google_Places_Lookup returns a result that includes `photos`, THE Local_Proxy SHALL download up to 3 photos via the Places Photos API and save them to the `public/` directory, and THE Admin_Form SHALL auto-fill the images array with the relative paths of the saved photos.
6. THE Admin_Form SHALL allow the content editor to manually override any auto-filled field (coordinates, Google Maps link, website URL, and images) after the lookup completes.
7. THE Admin_Form SHALL allow the content editor to remove any auto-filled photo from the images array before saving.
8. IF the Google_Places_Lookup fails or returns no results, THEN THE Admin_Form SHALL display an error message and allow the content editor to enter all fields manually.

### Requirement 5: Description Entry

**User Story:** As a content editor, I want to enter a free-text description for the restaurant, so that visitors can read about the restaurant.

#### Acceptance Criteria

1. THE Admin_Form SHALL provide a multi-line text input for the restaurant description.

### Requirement 6: Cuisine, Price, and Neighborhood Selection

**User Story:** As a content editor, I want to specify cuisine type, price range, and neighborhood, so that the restaurant is properly categorized.

#### Acceptance Criteria

1. THE Admin_Form SHALL provide an input for selecting one or more cuisine types (e.g., "Asian", "French", "Italian", "Japanese").
2. THE Admin_Form SHALL provide a selector for price range with options: "$", "$$", "$$$".
3. THE Admin_Form SHALL provide a text input for the neighborhood name.

### Requirement 7: External Links Entry

**User Story:** As a content editor, I want to enter the restaurant's Instagram URL and website URL, so that visitors can find the restaurant online.

#### Acceptance Criteria

1. THE Admin_Form SHALL provide a text input for the Instagram URL.
2. THE Admin_Form SHALL provide a text input for the website URL, pre-filled by the Google_Places_Lookup when available.
3. THE Admin_Form SHALL treat Instagram URL and website URL as optional fields.
4. THE Admin_Form SHALL allow the content editor to manually edit the website URL even when it was auto-filled by the Google_Places_Lookup.

### Requirement 8: Photo Management

**User Story:** As a content editor, I want to add photo URLs or upload images for the restaurant, so that the restaurant card displays photos.

#### Acceptance Criteria

1. THE Admin_Form SHALL provide an input for adding one or more image URLs to the FoodPlace_Entry images array.
2. WHEN the content editor uploads a local image file, THE Admin_Form SHALL send the file to the Local_Proxy for saving to the `public/` directory.
3. WHEN the Local_Proxy saves an uploaded image, THE Local_Proxy SHALL store the file in the `public/` directory and return the relative path to the Admin_Form.
4. THE Admin_Form SHALL add the returned relative path to the FoodPlace_Entry images array.

### Requirement 9: Preview Before Saving

**User Story:** As a content editor, I want to preview the restaurant card before saving, so that I can verify the entry looks correct.

#### Acceptance Criteria

1. WHEN the content editor requests a preview, THE Admin_Form SHALL render a Preview_Card using the current form data.
2. THE Preview_Card SHALL display the restaurant name, neighborhood, description, tags, cuisine types, price range, images, and external links in the same layout as the existing FoodPlaceCard component.
3. THE Preview_Card SHALL allow the content editor to return to the form to make edits before saving.

### Requirement 10: Save Restaurant Entry

**User Story:** As a content editor, I want to save the new restaurant entry, so that it is appended to the correct City_JSON_File and available after deployment.

#### Acceptance Criteria

1. WHEN the content editor submits the form, THE Admin_Form SHALL send the FoodPlace_Entry data to the Local_Proxy via an HTTP request.
2. WHEN the Local_Proxy receives a save request, THE Local_Proxy SHALL read the target City_JSON_File, append the new FoodPlace_Entry to the array, and write the updated array back to the file.
3. THE Local_Proxy SHALL assign the new FoodPlace_Entry an `id` equal to the current maximum id in the City_JSON_File plus one.
4. THE Local_Proxy SHALL format the updated City_JSON_File with consistent JSON indentation (4 spaces) to maintain readable diffs.
5. WHEN the save operation succeeds, THE Admin_Form SHALL display a success message to the content editor.
6. IF the save operation fails, THEN THE Admin_Form SHALL display an error message describing the failure.

### Requirement 11: Google Places Proxy Endpoint

**User Story:** As a content editor, I want the local proxy to support looking up restaurant details from Google Places and downloading photos, so that the admin form can auto-fill location data, website, and images.

#### Acceptance Criteria

1. THE Local_Proxy SHALL expose a search endpoint that accepts a restaurant name and city and returns coordinates, Google Maps link, website URL, formatted address, and photo references.
2. WHEN the search endpoint receives a valid request, THE Local_Proxy SHALL call the Google Places API (New) `searchText` method with the restaurant name and city as the query, requesting the fields: `places.location`, `places.googleMapsUri`, `places.websiteUri`, `places.formattedAddress`, `places.photos`.
3. WHEN the Google Places API returns results, THE Local_Proxy SHALL extract and return the coordinates (latitude, longitude), `googleMapsUri`, `websiteUri`, `formattedAddress`, and photo references from the first result.
4. THE Local_Proxy SHALL expose a photo download endpoint that accepts a Google Places photo `name` reference, fetches the photo via the Places Photos API, saves the image file to the `public/` directory, and returns the relative file path.
5. WHEN the photo download endpoint saves a photo, THE Local_Proxy SHALL generate a unique filename based on the restaurant name and a sequential index to avoid collisions.
6. IF the Google Places API returns no results or an error, THEN THE Local_Proxy SHALL return an appropriate error response with a descriptive message.
7. IF a photo download fails, THEN THE Local_Proxy SHALL return an error response for that photo without affecting other photo downloads.

### Requirement 12: Form Data Validation

**User Story:** As a content editor, I want the form to validate my input before saving, so that only well-formed FoodPlace_Entry data is written to the City_JSON_File.

#### Acceptance Criteria

1. THE Admin_Form SHALL validate that the restaurant name is non-empty before allowing submission.
2. THE Admin_Form SHALL validate that a city is selected before allowing submission.
3. THE Admin_Form SHALL validate that coordinates are present (either from Google_Places_Lookup or manual entry) before allowing submission.
4. THE Admin_Form SHALL validate that the typeOfCuisine array contains at least one entry before allowing submission.
5. IF validation fails, THEN THE Admin_Form SHALL highlight the invalid fields and display specific validation error messages.

### Requirement 13: Restaurant List View

**User Story:** As a content editor, I want to see all existing restaurants for a selected city, so that I can find entries to edit or delete.

#### Acceptance Criteria

1. WHEN a city is selected, THE Admin_Form SHALL fetch and display a Restaurant_List showing all existing entries from the corresponding City_JSON_File.
2. THE Restaurant_List SHALL display the restaurant name, neighborhood, and cuisine type for each entry.
3. THE Restaurant_List SHALL provide an "Edit" action for each entry that loads the entry data into the form for editing.
4. THE Restaurant_List SHALL provide a "Delete" action for each entry that removes the entry after confirmation.

### Requirement 14: Edit Existing Restaurant

**User Story:** As a content editor, I want to edit an existing restaurant entry, so that I can update its information without manually editing JSON.

#### Acceptance Criteria

1. WHEN the content editor selects "Edit" on a restaurant, THE Admin_Form SHALL populate all form fields with the existing entry data.
2. THE Admin_Form SHALL allow the content editor to modify any field of the existing entry.
3. THE Admin_Form SHALL allow the content editor to trigger a new Google_Places_Lookup to refresh auto-filled fields.
4. WHEN the content editor submits an edited entry, THE Local_Proxy SHALL update the matching entry in the City_JSON_File by `id`, preserving the original `id` value.
5. THE Local_Proxy SHALL format the updated City_JSON_File with consistent JSON indentation (4 spaces).

### Requirement 15: Delete Existing Restaurant

**User Story:** As a content editor, I want to delete a restaurant entry, so that I can remove outdated or incorrect entries.

#### Acceptance Criteria

1. WHEN the content editor selects "Delete" on a restaurant, THE Admin_Form SHALL display a confirmation dialog before proceeding.
2. WHEN the content editor confirms deletion, THE Admin_Form SHALL send a delete request to the Local_Proxy with the restaurant `id` and city.
3. WHEN the Local_Proxy receives a delete request, THE Local_Proxy SHALL remove the entry with the matching `id` from the City_JSON_File and write the updated array back to the file.
4. THE Local_Proxy SHALL format the updated City_JSON_File with consistent JSON indentation (4 spaces).
5. WHEN the delete operation succeeds, THE Admin_Form SHALL remove the entry from the Restaurant_List and display a success message.
6. IF the delete operation fails, THEN THE Admin_Form SHALL display an error message describing the failure.


### Requirement 16: Duplicate Detection

**User Story:** As a content editor, I want to be warned if a restaurant with the same name already exists in the city, so that I don't accidentally create duplicate entries.

#### Acceptance Criteria

1. WHEN the content editor enters a restaurant name, THE Admin_Form SHALL check the existing entries in the selected City_JSON_File for a case-insensitive name match.
2. IF a duplicate name is detected, THEN THE Admin_Form SHALL display a warning message indicating that a restaurant with that name already exists.
3. THE Admin_Form SHALL still allow the content editor to proceed with saving despite the warning (in case the duplicate is intentional, e.g., different locations).

### Requirement 17: Reorder Restaurants

**User Story:** As a content editor, I want to reorder restaurants in the list, so that I can control the display order on the city page.

#### Acceptance Criteria

1. THE Restaurant_List SHALL provide move up and move down actions for each entry to change its position in the list.
2. WHEN the content editor moves a restaurant, THE Admin_Form SHALL send the updated order to the Local_Proxy.
3. WHEN the Local_Proxy receives a reorder request, THE Local_Proxy SHALL rewrite the City_JSON_File with the entries in the new order.
4. THE Local_Proxy SHALL format the updated City_JSON_File with consistent JSON indentation (4 spaces).
5. THE Restaurant_List SHALL visually reflect the new order immediately after a move action.
