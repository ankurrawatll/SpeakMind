// Places API client for fetching yoga centers, religious places, and meditation organizations
// Uses web scraping from Google Search results

import { calculateDistance } from './geolocation';

export interface Place {
  name: string;
  address: string;
  website?: string;
  city: string;
  locality: string;
  category: 'yoga' | 'religious' | 'meditation';
  lat?: number;
  lng?: number;
  distance?: number;
}

export interface PlacesAPIResponse {
  success: boolean;
  city: string;
  locality: string;
  category: 'yoga' | 'religious' | 'meditation';
  count: number;
  places: Place[];
  timestamp: string;
  error?: string;
}

const CACHE_KEY_PREFIX = 'speakmind_places_';
const CACHE_DURATION = 4 * 60 * 60 * 1000; // 4 hours in milliseconds

/**
 * Get cached places from localStorage
 */
const getCachedPlaces = (city: string, locality: string, category: string): PlacesAPIResponse | null => {
  try {
    const cacheKey = `${CACHE_KEY_PREFIX}${city.toLowerCase()}_${locality.toLowerCase()}_${category}`;
    const cached = localStorage.getItem(cacheKey);

    if (!cached) {
      return null;
    }

    const data = JSON.parse(cached);
    const cacheTime = new Date(data.timestamp).getTime();
    const now = Date.now();

    // Check if cache is still valid (within 4 hours)
    if (now - cacheTime < CACHE_DURATION) {
      return data;
    }

    // Cache expired, remove it
    localStorage.removeItem(cacheKey);
    return null;
  } catch (error) {
    console.error('Error reading places cache:', error);
    return null;
  }
};

/**
 * Save places to cache in localStorage
 */
const setCachedPlaces = (city: string, locality: string, category: string, data: PlacesAPIResponse): void => {
  try {
    const cacheKey = `${CACHE_KEY_PREFIX}${city.toLowerCase()}_${locality.toLowerCase()}_${category}`;
    localStorage.setItem(cacheKey, JSON.stringify(data));
    console.log(`Cached places for ${city}/${locality}/${category}`);
  } catch (error) {
    console.error('Error caching places:', error);
  }
};

/**
 * Calculate distances for places
 */
const calculatePlaceDistances = (places: Place[], userLat: number, userLng: number): Place[] => {
  return places
    .map(place => ({
      ...place,
      distance: place.lat && place.lng ? calculateDistance(userLat, userLng, place.lat, place.lng) : undefined,
    }))
    .sort((a, b) => {
      if (a.distance && b.distance) return a.distance - b.distance;
      if (a.distance) return -1;
      if (b.distance) return 1;
      return 0;
    });
};

/**
 * Fetch places from the API endpoint
 */
export const fetchPlaces = async (
  city: string,
  locality: string,
  category: 'yoga' | 'religious' | 'meditation',
  userLat?: number,
  userLng?: number
): Promise<PlacesAPIResponse> => {
  // Check cache first
  const cached = getCachedPlaces(city, locality, category);
  if (cached) {
    console.log(`Using cached places for ${city}/${locality}/${category}`);
    // Calculate distances if user location provided
    if (userLat !== undefined && userLng !== undefined) {
      cached.places = calculatePlaceDistances(cached.places, userLat, userLng);
    }
    return cached;
  }

  try {
    // Only skip API in true local development (vite dev server)
    // Allow it to work with vercel dev and production Vercel
    const isLocalDev = import.meta.env.DEV && !process.env.VERCEL;

    if (isLocalDev) {
      console.warn('Places scraping only works when deployed to Vercel');
      return {
        success: false,
        city,
        locality,
        category,
        count: 0,
        places: [],
        timestamp: new Date().toISOString(),
        error: 'Places scraping requires Vercel deployment.',
      };
    }

    // In production (Vercel), use the API endpoint
    let apiUrl = `/api/placesSearch?city=${encodeURIComponent(city)}&locality=${encodeURIComponent(locality)}&category=${encodeURIComponent(category)}`;

    if (userLat !== undefined && userLng !== undefined) {
      apiUrl += `&lat=${userLat}&lng=${userLng}`;
    }

    console.log(`Fetching places from API: ${apiUrl}`);
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data: PlacesAPIResponse = await response.json();

    if (data.success) {
      // Calculate distances if user location provided
      if (userLat !== undefined && userLng !== undefined) {
        data.places = calculatePlaceDistances(data.places, userLat, userLng);
      }

      // Cache the response
      setCachedPlaces(city, locality, category, data);
    }

    return data;
  } catch (error) {
    console.error('Error fetching places:', error);
    return {
      success: false,
      city,
      locality,
      category,
      count: 0,
      places: [],
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};

/**
 * Fetch all three categories in parallel
 */
export const fetchAllPlaces = async (
  city: string,
  locality: string,
  userLat?: number,
  userLng?: number
): Promise<{ yoga: PlacesAPIResponse; religious: PlacesAPIResponse; meditation: PlacesAPIResponse }> => {
  const [yoga, religious, meditation] = await Promise.all([
    fetchPlaces(city, locality, 'yoga', userLat, userLng),
    fetchPlaces(city, locality, 'religious', userLat, userLng),
    fetchPlaces(city, locality, 'meditation', userLat, userLng),
  ]);

  return { yoga, religious, meditation };
};

/**
 * Clear all places cache
 */
export const clearPlacesCache = (): void => {
  try {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(CACHE_KEY_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
    console.log('Cleared all places cache');
  } catch (error) {
    console.error('Error clearing places cache:', error);
  }
};
