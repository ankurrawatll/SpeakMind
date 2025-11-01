// Events API client for fetching wellness events from scraper API

import { calculateDistance } from './geolocation';

export interface ScrapedEvent {
  title: string;
  venue: string;
  address: string;
  city: string;
  date: string;
  time: string;
  url: string;
  source: 'bookmyshow' | 'district' | 'allevents';
  category: string;
  lat?: number;
  lng?: number;
  distance?: number; // Added after distance calculation
}

export interface EventsAPIResponse {
  success: boolean;
  city: string;
  count: number;
  events: ScrapedEvent[];
  timestamp: string;
  sources: string[];
  error?: string;
}

const CACHE_KEY_PREFIX = 'speakmind_events_';
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

/**
 * Get cached events from localStorage
 */
const getCachedEvents = (city: string): EventsAPIResponse | null => {
  try {
    const cacheKey = CACHE_KEY_PREFIX + city.toLowerCase();
    const cached = localStorage.getItem(cacheKey);

    if (!cached) {
      return null;
    }

    const data = JSON.parse(cached);
    const cacheTime = new Date(data.timestamp).getTime();
    const now = Date.now();

    // Check if cache is still valid (within 1 hour)
    if (now - cacheTime < CACHE_DURATION) {
      console.log(`Using cached events for ${city} (age: ${Math.round((now - cacheTime) / 1000 / 60)} minutes)`);
      return data;
    }

    // Cache expired, remove it
    localStorage.removeItem(cacheKey);
    return null;
  } catch (error) {
    console.error('Error reading cached events:', error);
    return null;
  }
};

/**
 * Save events to cache in localStorage
 */
const setCachedEvents = (city: string, data: EventsAPIResponse): void => {
  try {
    const cacheKey = CACHE_KEY_PREFIX + city.toLowerCase();
    localStorage.setItem(cacheKey, JSON.stringify(data));
    console.log(`Cached events for ${city}`);
  } catch (error) {
    console.error('Error caching events:', error);
  }
};

/**
 * Fetch wellness events from the scraper API
 * @param city - City name to search events in
 * @param userLat - Optional user latitude for distance calculation
 * @param userLng - Optional user longitude for distance calculation
 * @returns Promise<EventsAPIResponse>
 */
export const fetchWellnessEvents = async (
  city: string,
  userLat?: number,
  userLng?: number
): Promise<EventsAPIResponse> => {
  // Check cache first
  const cached = getCachedEvents(city);
  if (cached) {
    // Calculate distances if user location provided
    if (userLat !== undefined && userLng !== undefined) {
      cached.events = calculateEventDistances(cached.events, userLat, userLng);
    }
    return cached;
  }

  try {
    // In development, the Vercel API won't work locally - show helpful message
    if (import.meta.env.DEV) {
      console.warn('Events API only works when deployed to Vercel');
      return {
        success: false,
        city,
        count: 0,
        events: [],
        timestamp: new Date().toISOString(),
        sources: [],
        error: 'Events scraping requires deployment. The scraper will work once deployed to Vercel.',
      };
    }

    // In production (Vercel), use the API endpoint
    let apiUrl = `/api/events?city=${encodeURIComponent(city)}`;

    if (userLat !== undefined && userLng !== undefined) {
      apiUrl += `&lat=${userLat}&lng=${userLng}`;
    }

    console.log(`Fetching events from API: ${apiUrl}`);

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const data: EventsAPIResponse = await response.json();

    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch events');
    }

    // Calculate distances if user location provided
    if (userLat !== undefined && userLng !== undefined) {
      data.events = calculateEventDistances(data.events, userLat, userLng);
    }

    // Cache the response
    setCachedEvents(city, data);

    return data;
  } catch (error: any) {
    console.error('Error fetching wellness events:', error);

    // Return empty result on error
    return {
      success: false,
      city,
      count: 0,
      events: [],
      timestamp: new Date().toISOString(),
      sources: [],
      error: error.message || 'Failed to fetch events',
    };
  }
};

/**
 * Calculate distances for all events based on user location
 */
const calculateEventDistances = (
  events: ScrapedEvent[],
  userLat: number,
  userLng: number
): ScrapedEvent[] => {
  return events
    .map((event) => {
      // If event has coordinates, calculate distance
      if (event.lat !== undefined && event.lng !== undefined) {
        event.distance = calculateDistance(userLat, userLng, event.lat, event.lng);
      }
      return event;
    })
    .sort((a, b) => {
      // Sort by distance (closest first)
      if (a.distance !== undefined && b.distance !== undefined) {
        return a.distance - b.distance;
      }
      // Events without distance go to the end
      if (a.distance !== undefined) return -1;
      if (b.distance !== undefined) return 1;
      return 0;
    });
};

/**
 * Clear all cached events
 */
export const clearEventsCache = (): void => {
  try {
    const keys = Object.keys(localStorage);
    keys.forEach((key) => {
      if (key.startsWith(CACHE_KEY_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
    console.log('Cleared all events cache');
  } catch (error) {
    console.error('Error clearing events cache:', error);
  }
};

/**
 * Get cache status for a city
 */
export const getCacheInfo = (city: string): { cached: boolean; age?: number } => {
  try {
    const cacheKey = CACHE_KEY_PREFIX + city.toLowerCase();
    const cached = localStorage.getItem(cacheKey);

    if (!cached) {
      return { cached: false };
    }

    const data = JSON.parse(cached);
    const cacheTime = new Date(data.timestamp).getTime();
    const age = Math.round((Date.now() - cacheTime) / 1000 / 60); // Age in minutes

    return { cached: true, age };
  } catch (error) {
    return { cached: false };
  }
};
