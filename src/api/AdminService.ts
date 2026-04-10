const ADMIN_API_URL = 'http://localhost:8787/admin';

export interface PlacesLookupResponse {
  coordinates: [number, number] | null;
  googleMapsUri: string | null;
  websiteUri: string | null;
  formattedAddress: string | null;
  photos: Array<{ name: string; widthPx: number; heightPx: number }>;
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text);
  }
  return response.json();
}

export async function fetchRestaurants(city: string): Promise<any[]> {
  const params = new URLSearchParams({ city });
  const response = await fetch(`${ADMIN_API_URL}/restaurants?${params}`);
  return handleResponse<any[]>(response);
}

export async function createRestaurant(city: string, entry: Record<string, any>): Promise<{ id: number }> {
  const response = await fetch(`${ADMIN_API_URL}/restaurants`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ city, entry }),
  });
  return handleResponse<{ id: number }>(response);
}

export async function updateRestaurant(city: string, entry: Record<string, any>): Promise<void> {
  const response = await fetch(`${ADMIN_API_URL}/restaurants`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ city, entry }),
  });
  await handleResponse<any>(response);
}

export async function deleteRestaurant(city: string, id: number): Promise<void> {
  const params = new URLSearchParams({ city, id: String(id) });
  const response = await fetch(`${ADMIN_API_URL}/restaurants?${params}`, {
    method: 'DELETE',
  });
  await handleResponse<any>(response);
}

export async function reorderRestaurants(city: string, orderedIds: number[]): Promise<void> {
  const response = await fetch(`${ADMIN_API_URL}/restaurants/reorder`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ city, orderedIds }),
  });
  await handleResponse<any>(response);
}

export async function placesLookup(name: string, city: string): Promise<PlacesLookupResponse> {
  const response = await fetch(`${ADMIN_API_URL}/places-lookup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, city }),
  });
  return handleResponse<PlacesLookupResponse>(response);
}

export async function downloadPhoto(photoName: string, restaurantName: string, index: number): Promise<{ path: string }> {
  const response = await fetch(`${ADMIN_API_URL}/download-photo`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ photoName, restaurantName, index }),
  });
  return handleResponse<{ path: string }>(response);
}

export async function uploadPhoto(restaurantName: string, file: File): Promise<{ path: string }> {
  const formData = new FormData();
  formData.append('restaurantName', restaurantName);
  formData.append('file', file);

  const response = await fetch(`${ADMIN_API_URL}/upload-photo`, {
    method: 'POST',
    body: formData,
  });
  return handleResponse<{ path: string }>(response);
}
