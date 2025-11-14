import type { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';
import * as cheerio from 'cheerio';

interface Place {
  name: string;
  address: string;
  website?: string;
  city: string;
  locality: string;
  category: 'yoga' | 'religious' | 'meditation';
  lat?: number;
  lng?: number;
}

// Search queries for each category
const SEARCH_QUERIES = {
  yoga: (locality: string, city: string) => `yoga meditation centers near ${locality} ${city}`,
  religious: (locality: string, city: string) => `temples gurudwaras churches near ${locality} ${city}`,
  meditation: (locality: string, city: string) => `Osho Art of Living Sadhguru Brahma Kumaris near ${locality} ${city}`,
};

// Parse Google Search results to extract places
async function scrapeGoogleSearchResults(
  query: string,
  city: string,
  locality: string,
  category: 'yoga' | 'religious' | 'meditation'
): Promise<Place[]> {
  const places: Place[] = [];

  try {
    // Construct Google Search URL
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
    console.log(`Scraping Google Search for: ${query}`);

    const response = await axios.get(searchUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      timeout: 15000,
    });

    const $ = cheerio.load(response.data);

    // Extract places from Google Search results
    // Google structures results in div containers with specific classes
    $('div[data-sokoban-container] div')
      .slice(0, 10) // Limit to top 10 results
      .each((_, element) => {
        const $el = $(element);

        // Extract name (usually in h3 or title)
        const name = $el.find('h3').text().trim() || $el.find('a').first().text().trim();

        // Extract address (usually in text following the name)
        const address = $el.find('span').text().trim();

        // Extract website link
        const websiteUrl = $el.find('a[href*="http"]').first().attr('href') || undefined;

        if (name && name.length > 2) {
          places.push({
            name,
            address: address || 'Address not available',
            website: websiteUrl,
            city,
            locality,
            category,
          });
        }
      });

    // If Google search doesn't return enough results, try alternative scraping methods
    if (places.length < 3) {
      console.log(`Low results for ${category}. Trying alternative sources...`);
      // Additional fallback scraping could be added here
    }

    console.log(`Found ${places.length} places for ${category} in ${locality}, ${city}`);
    return places;
  } catch (error) {
    console.error(`Error scraping Google Search for ${category}:`, error);
    return [];
  }
}

// Main handler
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const { city, locality, category, lat, lng } = req.query;

    // Validate required parameters
    if (!city || !locality || !category) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameters: city, locality, category',
      });
    }

    // Validate category
    if (!['yoga', 'religious', 'meditation'].includes(category as string)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid category. Must be: yoga, religious, or meditation',
      });
    }

    const categoryType = category as 'yoga' | 'religious' | 'meditation';
    const searchQuery = SEARCH_QUERIES[categoryType](locality as string, city as string);

    // Scrape places from Google Search
    const places = await scrapeGoogleSearchResults(
      searchQuery,
      city as string,
      locality as string,
      categoryType
    );

    return res.status(200).json({
      success: true,
      city,
      locality,
      category: categoryType,
      count: places.length,
      places,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Places search API error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
