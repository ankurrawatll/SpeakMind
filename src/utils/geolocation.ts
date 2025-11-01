// Geolocation utilities for getting user's precise location

export interface UserLocation {
  latitude: number;
  longitude: number;
  city?: string;
  accuracy: number;
}

export interface GeolocationError {
  code: number;
  message: string;
}

/**
 * Get user's current location using browser Geolocation API
 * @returns Promise<UserLocation>
 */
export const getUserLocation = (): Promise<UserLocation> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject({
        code: 0,
        message: 'Geolocation is not supported by your browser',
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const location: UserLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        };

        // Try to get city name from coordinates
        try {
          const city = await getCityFromCoordinates(
            location.latitude,
            location.longitude
          );
          location.city = city;
        } catch (error) {
          console.warn('Could not determine city from coordinates:', error);
        }

        resolve(location);
      },
      (error) => {
        let message = 'Unable to retrieve your location';

        switch (error.code) {
          case error.PERMISSION_DENIED:
            message = 'Location permission denied. Please enable location access.';
            break;
          case error.POSITION_UNAVAILABLE:
            message = 'Location information is unavailable.';
            break;
          case error.TIMEOUT:
            message = 'Location request timed out.';
            break;
        }

        reject({
          code: error.code,
          message,
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // Cache for 5 minutes
      }
    );
  });
};

/**
 * Calculate distance between two coordinates using Haversine formula
 * @param lat1 - Latitude of point 1
 * @param lon1 - Longitude of point 1
 * @param lat2 - Latitude of point 2
 * @param lon2 - Longitude of point 2
 * @returns Distance in kilometers
 */
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return Math.round(distance * 10) / 10; // Round to 1 decimal place
};

/**
 * Convert degrees to radians
 */
const toRadians = (degrees: number): number => {
  return degrees * (Math.PI / 180);
};

/**
 * Get city name from coordinates using reverse geocoding
 * Uses OpenStreetMap Nominatim API (free, no API key required)
 */
export const getCityFromCoordinates = async (
  latitude: number,
  longitude: number
): Promise<string> => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'SpeakMind-Wellness-App',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Geocoding request failed');
    }

    const data = await response.json();

    // Try to extract city name from response
    const address = data.address;
    const city =
      address.city ||
      address.town ||
      address.village ||
      address.municipality ||
      address.county ||
      address.state_district ||
      address.state;

    if (!city) {
      throw new Error('Could not determine city from coordinates');
    }

    return city;
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    throw error;
  }
};

/**
 * Get coordinates for a city name (geocoding)
 * Uses OpenStreetMap Nominatim API
 */
export const getCoordinatesFromCity = async (
  cityName: string
): Promise<{ latitude: number; longitude: number } | null> => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        cityName + ', India'
      )}&limit=1`,
      {
        headers: {
          'User-Agent': 'SpeakMind-Wellness-App',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Geocoding request failed');
    }

    const data = await response.json();

    if (data.length === 0) {
      return null;
    }

    return {
      latitude: parseFloat(data[0].lat),
      longitude: parseFloat(data[0].lon),
    };
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
};

/**
 * Format distance for display
 */
export const formatDistance = (distanceKm: number): string => {
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)}m away`;
  } else if (distanceKm < 10) {
    return `${distanceKm.toFixed(1)}km away`;
  } else {
    return `${Math.round(distanceKm)}km away`;
  }
};

/**
 * Check if location permission is granted
 */
export const checkLocationPermission = async (): Promise<boolean> => {
  if (!navigator.permissions) {
    return false;
  }

  try {
    const result = await navigator.permissions.query({ name: 'geolocation' });
    return result.state === 'granted';
  } catch (error) {
    console.error('Error checking location permission:', error);
    return false;
  }
};
