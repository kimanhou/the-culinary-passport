import { useState, useEffect } from 'react';
import {
  GooglePlacesData,
  fetchGooglePlacesData,
} from 'api/GooglePlacesService';

interface UseGooglePlacesDataResult {
  data: GooglePlacesData | null;
  isLoading: boolean;
}

export function useGooglePlacesData(
  name: string,
  city: string,
  enabled: boolean
): UseGooglePlacesDataResult {
  const [data, setData] = useState<GooglePlacesData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!enabled || !name || !city) {
      return;
    }

    let cancelled = false;
    setIsLoading(true);

    fetchGooglePlacesData(name, city)
      .then((result) => {
        if (!cancelled) {
          setData(result);
        }
      })
      .catch((error) => {
        console.error('useGooglePlacesData error:', error);
        if (!cancelled) {
          setData(null);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [name, city, enabled]);

  return { data, isLoading };
}
