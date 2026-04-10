import { extractDishes, GoogleReview } from "./extractDishes";

const GOOGLE_PLACES_SEARCH_URL =
  "https://places.googleapis.com/v1/places:searchText";

const FIELD_MASK =
  "places.rating,places.userRatingCount,places.editorialSummary,places.reviews";

interface PlacesResponse {
  rating: number | null;
  userRatingCount: number | null;
  dishes: string[];
}

interface GooglePlaceResult {
  places?: Array<{
    displayName?: { text: string };
    rating?: number;
    userRatingCount?: number;
    editorialSummary?: { text: string };
    reviews?: GoogleReview[];
  }>;
}

/**
 * Normalize a string for use in cache keys: lowercase, trim, collapse whitespace.
 */
function normalize(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, "-");
}

/**
 * Build a deterministic cache key URL from restaurant name and city.
 */
function buildCacheKey(name: string, city: string): string {
  return `https://cache.internal/places/${encodeURIComponent(normalize(name))}/${encodeURIComponent(normalize(city))}`;
}

/**
 * Handles GET /places?name=...&city=... requests.
 * Looks up Google Places data with Cloudflare Cache API caching.
 */
export async function placesHandler(
  request: Request,
  env: { GOOGLE_PLACES_API_KEY: string },
  headers: Record<string, string>
): Promise<Response> {
  const url = new URL(request.url);
  const name = url.searchParams.get("name")?.trim() || "";
  const city = url.searchParams.get("city")?.trim() || "";

  if (!name || !city) {
    return new Response(
      JSON.stringify({
        error: "Missing required query parameters: name and city",
      }),
      { status: 400, headers: { ...headers, "Content-Type": "application/json" } }
    );
  }

  const cacheKey = buildCacheKey(name, city);
  const cache = caches.default;

  // Check cache
  const cachedResponse = await cache.match(cacheKey);
  if (cachedResponse) {
    // Return cached data with CORS headers
    const body = await cachedResponse.text();
    return new Response(body, {
      status: 200,
      headers: { ...headers, "Content-Type": "application/json" },
    });
  }

  // Cache miss — call Google Places API
  try {
    const googleResponse = await fetch(GOOGLE_PLACES_SEARCH_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": env.GOOGLE_PLACES_API_KEY,
        "X-Goog-FieldMask": FIELD_MASK,
      },
      body: JSON.stringify({ textQuery: `${name} ${city}` }),
    });

    if (!googleResponse.ok) {
      return new Response(
        JSON.stringify({
          error: "Google Places API error",
          status: googleResponse.status,
        }),
        {
          status: googleResponse.status,
          headers: { ...headers, "Content-Type": "application/json" },
        }
      );
    }

    const data = (await googleResponse.json()) as GooglePlaceResult;
    const place = data.places?.[0];

    const result: PlacesResponse = {
      rating: place?.rating ?? null,
      userRatingCount: place?.userRatingCount ?? null,
      dishes: extractDishes(
        place?.reviews ?? [],
        place?.editorialSummary?.text
      ),
    };

    const responseBody = JSON.stringify(result);

    // Store in cache with 24h TTL
    const cacheResponse = new Response(responseBody, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "max-age=86400",
      },
    });
    await cache.put(cacheKey, cacheResponse);

    return new Response(responseBody, {
      status: 200,
      headers: { ...headers, "Content-Type": "application/json" },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...headers, "Content-Type": "application/json" } }
    );
  }
}
