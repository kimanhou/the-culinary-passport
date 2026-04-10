/**
 * Service module for fetching Google Places data via the Cloudflare Worker proxy.
 */

export interface GooglePlacesData {
  rating: number | null;
  userRatingCount: number | null;
  dishes: string[];
}

const API_URL = process.env.REACT_APP_PLACES_API_URL || '';

const cache = new Map<string, GooglePlacesData>();

const DEFAULT_DATA: GooglePlacesData = {
  rating: null,
  userRatingCount: null,
  dishes: [],
};

export async function fetchGooglePlacesData(
  name: string,
  city: string
): Promise<GooglePlacesData> {
  const cacheKey = `${name}|${city}`;

  const cached = cache.get(cacheKey);
  if (cached) {
    return cached;
  }

  try {
    const params = new URLSearchParams({ name, city });
    const response = await fetch(`${API_URL}?${params}`);

    if (!response.ok) {
      throw new Error(`Places API error: ${response.status}`);
    }

    const data: GooglePlacesData = await response.json();
    cache.set(cacheKey, data);
    return data;
  } catch (error) {
    console.error(`Failed to fetch Google Places data for "${name}" in "${city}":`, error);
    return { ...DEFAULT_DATA };
  }
}
