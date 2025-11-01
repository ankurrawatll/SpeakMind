import type { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';
import * as cheerio from 'cheerio';

interface Event {
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
}

// Keywords to filter for mental health & wellness events
const WELLNESS_KEYWORDS = [
  'meditation', 'mindfulness', 'mental health', 'wellness', 'yoga',
  'breathing', 'therapy', 'self-care', 'anxiety', 'stress relief',
  'healing', 'chakra', 'spiritual', 'counseling', 'workshop',
  'well-being', 'relaxation', 'calm', 'peace', 'inner peace'
];

function isWellnessEvent(title: string, description: string = ''): boolean {
  const text = (title + ' ' + description).toLowerCase();
  return WELLNESS_KEYWORDS.some(keyword => text.includes(keyword));
}

async function scrapeAllEvents(city: string): Promise<Event[]> {
  const events: Event[] = [];

  try {
    // AllEvents.in has better wellness event listings
    const cityFormatted = city.toLowerCase().replace(/\s+/g, '-');
    const alleventsUrl = `https://allevents.in/${cityFormatted}/health-wellness`;

    console.log(`Fetching AllEvents.in: ${alleventsUrl}`);

    const response = await axios.get(alleventsUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      timeout: 15000,
    });

    const $ = cheerio.load(response.data);

    // AllEvents.in structure based on their CSS classes
    $('.event-card, [class*="event"]').each((_, element) => {
      const $el = $(element);

      // Extract title
      const title = $el.find('.title, .event-title, h2, h3, a[class*="title"]').first().text().trim();

      // Extract venue/location
      const venue = $el.find('.subtitle, .venue, .location, [class*="venue"], [class*="location"]').first().text().trim();

      // Extract date
      const date = $el.find('.date, [class*="date"], time').first().text().trim();

      // Extract URL
      let eventUrl = $el.find('a').first().attr('href') || '';
      if (eventUrl && !eventUrl.startsWith('http')) {
        eventUrl = `https://allevents.in${eventUrl}`;
      }

      // Only add if we have at least a title and URL
      if (title && eventUrl && title.length > 5) {
        events.push({
          title,
          venue: venue || 'Venue TBA',
          address: venue || city,
          city,
          date: date || 'Date TBA',
          time: '',
          url: eventUrl,
          source: 'allevents',
          category: 'wellness',
        });
      }
    });

    console.log(`AllEvents.in: Found ${events.length} wellness events`);
  } catch (error: any) {
    console.error('AllEvents.in scraping error:', error.message);
  }

  return events;
}

async function scrapeDistrict(city: string): Promise<Event[]> {
  const events: Event[] = [];

  try {
    // District.in (by Zomato) - try activities page
    const districtUrl = `https://www.district.in/${city.toLowerCase()}/activities`;

    console.log(`Fetching District: ${districtUrl}`);

    const response = await axios.get(districtUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml',
      },
      timeout: 10000,
    });

    const $ = cheerio.load(response.data);

    // District structure - adjust selectors based on actual HTML
    $('.activity-card, .event-card, [data-activity], .card').each((_, element) => {
      const $el = $(element);
      const title = $el.find('.title, h3, h2, .activity-title').first().text().trim();
      const venue = $el.find('.venue, .location, .address').first().text().trim();
      const eventUrl = $el.find('a').first().attr('href') || '';

      if (title && isWellnessEvent(title)) {
        events.push({
          title,
          venue: venue || 'Venue TBA',
          address: venue || 'Address TBA',
          city,
          date: 'Check website for dates',
          time: '',
          url: eventUrl.startsWith('http') ? eventUrl : `https://www.district.in${eventUrl}`,
          source: 'district',
          category: 'wellness',
        });
      }
    });

    console.log(`District: Found ${events.length} wellness events`);
  } catch (error: any) {
    console.error('District scraping error:', error.message);
  }

  return events;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { city, lat, lng } = req.query;

  if (!city || typeof city !== 'string') {
    return res.status(400).json({ error: 'City parameter is required' });
  }

  try {
    console.log(`Fetching events for city: ${city}`);

    // Scrape from all sources in parallel
    const [alleventsData, districtEvents] = await Promise.all([
      scrapeAllEvents(city),
      scrapeDistrict(city),
    ]);

    // Combine and deduplicate events
    const allEvents = [...alleventsData, ...districtEvents];

    // Remove duplicates based on title similarity
    const uniqueEvents = allEvents.filter((event, index, self) =>
      index === self.findIndex(e =>
        e.title.toLowerCase().trim() === event.title.toLowerCase().trim()
      )
    );

    console.log(`Total unique events found: ${uniqueEvents.length}`);

    // Return events with metadata
    return res.status(200).json({
      success: true,
      city,
      count: uniqueEvents.length,
      events: uniqueEvents,
      timestamp: new Date().toISOString(),
      sources: ['allevents', 'district'],
    });

  } catch (error: any) {
    console.error('Error fetching events:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch events',
      message: error.message,
    });
  }
}
