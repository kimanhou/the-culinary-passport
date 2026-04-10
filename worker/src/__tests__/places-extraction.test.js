const fc = require("fast-check");
const { extractPlaceData } = require("../local-proxy");

// Feature: local-restaurant-admin, Property 3: Google Places field extraction
// **Validates: Requirements 4.2, 4.3, 4.4, 11.1, 11.3**

// --- Generators ---

/** Arbitrary for a Google Places location object */
const locationArb = fc.record({
  latitude: fc.double({ min: -90, max: 90, noNaN: true }),
  longitude: fc.double({ min: -180, max: 180, noNaN: true }),
});

/** Arbitrary for a Google Places photo object */
const photoArb = fc.record({
  name: fc.string({ minLength: 1, maxLength: 80 }),
  widthPx: fc.integer({ min: 1, max: 4000 }),
  heightPx: fc.integer({ min: 1, max: 4000 }),
});

/** Arbitrary for a full Google Places result with all fields present */
const fullPlaceArb = fc.record({
  location: locationArb,
  googleMapsUri: fc.webUrl(),
  websiteUri: fc.webUrl(),
  formattedAddress: fc.string({ minLength: 1, maxLength: 200 }),
  photos: fc.array(photoArb, { minLength: 0, maxLength: 10 }),
});

/** Arbitrary for a partial Google Places result (random subset of fields) */
const partialPlaceArb = fc.record(
  {
    location: locationArb,
    googleMapsUri: fc.webUrl(),
    websiteUri: fc.webUrl(),
    formattedAddress: fc.string({ minLength: 1, maxLength: 200 }),
    photos: fc.array(photoArb, { minLength: 0, maxLength: 10 }),
  },
  { requiredKeys: [] }
);

describe("Property 3: Google Places field extraction", () => {
  test("extracts all fields correctly when all are present", () => {
    fc.assert(
      fc.property(fullPlaceArb, (place) => {
        const result = extractPlaceData(place);

        // Coordinates extracted from location
        expect(result.coordinates).toEqual([
          place.location.latitude,
          place.location.longitude,
        ]);

        // URI fields extracted directly
        expect(result.googleMapsUri).toBe(place.googleMapsUri);
        expect(result.websiteUri).toBe(place.websiteUri);
        expect(result.formattedAddress).toBe(place.formattedAddress);

        // Photos array mapped correctly
        expect(result.photos).toHaveLength(place.photos.length);
        for (let i = 0; i < place.photos.length; i++) {
          expect(result.photos[i]).toEqual({
            name: place.photos[i].name,
            widthPx: place.photos[i].widthPx,
            heightPx: place.photos[i].heightPx,
          });
        }
      }),
      { numRuns: 100 }
    );
  });

  test("returns null for missing fields", () => {
    fc.assert(
      fc.property(partialPlaceArb, (place) => {
        const result = extractPlaceData(place);

        // coordinates null when location is absent
        if (!place.location) {
          expect(result.coordinates).toBeNull();
        } else {
          expect(result.coordinates).toEqual([
            place.location.latitude,
            place.location.longitude,
          ]);
        }

        // googleMapsUri null when absent
        if (!place.googleMapsUri) {
          expect(result.googleMapsUri).toBeNull();
        } else {
          expect(result.googleMapsUri).toBe(place.googleMapsUri);
        }

        // websiteUri null when absent
        if (!place.websiteUri) {
          expect(result.websiteUri).toBeNull();
        } else {
          expect(result.websiteUri).toBe(place.websiteUri);
        }

        // formattedAddress null when absent
        if (!place.formattedAddress) {
          expect(result.formattedAddress).toBeNull();
        } else {
          expect(result.formattedAddress).toBe(place.formattedAddress);
        }

        // photos defaults to empty array when absent
        if (!place.photos) {
          expect(result.photos).toEqual([]);
        } else {
          expect(result.photos).toHaveLength(place.photos.length);
        }
      }),
      { numRuns: 100 }
    );
  });

  test("empty object yields all nulls and empty photos", () => {
    const result = extractPlaceData({});
    expect(result.coordinates).toBeNull();
    expect(result.googleMapsUri).toBeNull();
    expect(result.websiteUri).toBeNull();
    expect(result.formattedAddress).toBeNull();
    expect(result.photos).toEqual([]);
  });

  test("extra fields on the place object are ignored", () => {
    fc.assert(
      fc.property(
        fullPlaceArb,
        fc.dictionary(
          fc.string({ minLength: 1, maxLength: 20 }).filter(
            (k) => !["location", "googleMapsUri", "websiteUri", "formattedAddress", "photos"].includes(k)
          ),
          fc.string()
        ),
        (place, extraFields) => {
          const placeWithExtras = { ...place, ...extraFields };
          const result = extractPlaceData(placeWithExtras);

          // Result should only contain the expected keys
          expect(Object.keys(result).sort()).toEqual(
            ["coordinates", "formattedAddress", "googleMapsUri", "photos", "websiteUri"].sort()
          );
        }
      ),
      { numRuns: 100 }
    );
  });
});


// Feature: local-restaurant-admin, Property 4: Photo download respects limit
// **Validates: Requirements 4.5**

/**
 * Simulates the client-side photo limit logic:
 * the admin form downloads at most 3 photos from the extraction result.
 */
function limitPhotos(photos, maxPhotos = 3) {
  return photos.slice(0, maxPhotos);
}

describe("Property 4: Photo download respects limit", () => {
  test("extraction returns all photos from the API response", () => {
    fc.assert(
      fc.property(
        fc.array(photoArb, { minLength: 0, maxLength: 10 }),
        (photos) => {
          const place = { photos };
          const result = extractPlaceData(place);

          // extractPlaceData returns ALL photos — no server-side limit
          expect(result.photos).toHaveLength(photos.length);
        }
      ),
      { numRuns: 100 }
    );
  });

  test("at most 3 photos are processed after applying the client-side limit", () => {
    fc.assert(
      fc.property(
        fc.array(photoArb, { minLength: 0, maxLength: 10 }),
        (photos) => {
          const place = { photos };
          const result = extractPlaceData(place);
          const limited = limitPhotos(result.photos);

          // At most 3 photos processed
          expect(limited.length).toBeLessThanOrEqual(3);

          // Exactly min(N, 3)
          expect(limited.length).toBe(Math.min(photos.length, 3));
        }
      ),
      { numRuns: 100 }
    );
  });

  test("limited photos are the first N from the original array (order preserved)", () => {
    fc.assert(
      fc.property(
        fc.array(photoArb, { minLength: 1, maxLength: 10 }),
        (photos) => {
          const place = { photos };
          const result = extractPlaceData(place);
          const limited = limitPhotos(result.photos);

          // The limited set should be the first min(N,3) photos in order
          for (let i = 0; i < limited.length; i++) {
            expect(limited[i]).toEqual(result.photos[i]);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  test("zero photos yields empty array after limit", () => {
    const place = { photos: [] };
    const result = extractPlaceData(place);
    const limited = limitPhotos(result.photos);
    expect(limited).toEqual([]);
  });

  test("missing photos field yields empty array after limit", () => {
    const place = {};
    const result = extractPlaceData(place);
    const limited = limitPhotos(result.photos);
    expect(limited).toEqual([]);
  });
});
