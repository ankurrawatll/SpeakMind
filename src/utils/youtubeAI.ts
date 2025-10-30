// YouTube API integration utility for video recommendations
// This file handles fetching meditation and wellness videos from YouTube

const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY || import.meta.env.VITE_GEMINI_API_KEY

export interface VideoSuggestion {
  videoId: string
  title: string
  channelTitle: string
  url: string
  thumbnails?: {
    default?: { url: string }
    medium?: { url: string }
    high?: { url: string }
  }
}

/**
 * Recommend meditation/wellness videos based on user query and conversation context
 * @param query - User's question or request
 * @param context - Previous conversation context
 * @param maxResults - Number of videos to return (default: 4)
 * @returns Promise<VideoSuggestion[]>
 */
export const recommendVideos = async (
  query: string,
  context: string = '',
  maxResults: number = 4
): Promise<VideoSuggestion[]> => {
  try {
    // If no API key is available, return empty array
    if (!YOUTUBE_API_KEY || YOUTUBE_API_KEY === 'your_gemini_api_key_here') {
      console.warn('YouTube/Gemini API key not configured for video recommendations')
      return []
    }

    // Extract relevant keywords from query for YouTube search
    const searchQuery = extractSearchKeywords(query, context)

    // Use YouTube Data API v3 to search for videos
    const apiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(searchQuery)}&type=video&maxResults=${maxResults}&key=${YOUTUBE_API_KEY}&videoCategoryId=22&safeSearch=strict&relevanceLanguage=en`

    const response = await fetch(apiUrl)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('YouTube API error:', response.status, errorText)
      return []
    }

    const data = await response.json()

    if (!data.items || data.items.length === 0) {
      return []
    }

    // Transform YouTube API response to our VideoSuggestion format
    const videos: VideoSuggestion[] = data.items.map((item: any) => ({
      videoId: item.id.videoId,
      title: item.snippet.title,
      channelTitle: item.snippet.channelTitle,
      url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
      thumbnails: {
        default: item.snippet.thumbnails?.default,
        medium: item.snippet.thumbnails?.medium,
        high: item.snippet.thumbnails?.high,
      }
    }))

    return videos
  } catch (error) {
    console.error('Error fetching video recommendations:', error)
    return []
  }
}

/**
 * Extract relevant search keywords from user query and context
 * @param query - User's question
 * @param context - Conversation context
 * @returns Search query string optimized for YouTube
 */
const extractSearchKeywords = (query: string, context: string): string => {
  const lowerQuery = query.toLowerCase()

  // Add "meditation" or "mindfulness" prefix for better results
  let searchQuery = query

  // Check if query already contains meditation-related terms
  const hasMeditationTerms = /meditation|mindfulness|yoga|breathing|relaxation|wellness|mental health|anxiety|stress|guided|calm/i.test(query)

  if (!hasMeditationTerms) {
    // Add contextual prefix based on query content
    if (lowerQuery.includes('sleep') || lowerQuery.includes('insomnia')) {
      searchQuery = 'guided meditation for sleep ' + query
    } else if (lowerQuery.includes('anxiety') || lowerQuery.includes('stress')) {
      searchQuery = 'meditation for anxiety stress relief ' + query
    } else if (lowerQuery.includes('focus') || lowerQuery.includes('concentration')) {
      searchQuery = 'mindfulness meditation for focus ' + query
    } else if (lowerQuery.includes('beginner') || lowerQuery.includes('start')) {
      searchQuery = 'meditation for beginners ' + query
    } else {
      searchQuery = 'guided meditation mindfulness ' + query
    }
  }

  // Extract duration if mentioned (e.g., "5 minutes", "20 min", "1 hour")
  const durationMatch = query.match(/\b(\d+)\s*(m|min|mins|minute|minutes|h|hr|hrs|hour|hours)\b/i)
  if (durationMatch) {
    const duration = durationMatch[0]
    searchQuery += ` ${duration}`
  }

  return searchQuery
}

/**
 * Get curated meditation video recommendations by category
 * @param category - Category of videos (e.g., 'sleep', 'anxiety', 'beginners')
 * @param maxResults - Number of videos to return
 * @returns Promise<VideoSuggestion[]>
 */
export const getCuratedVideos = async (
  category: 'sleep' | 'anxiety' | 'beginners' | 'focus' | 'breathing',
  maxResults: number = 4
): Promise<VideoSuggestion[]> => {
  const categoryQueries = {
    sleep: 'guided meditation for deep sleep relaxation',
    anxiety: 'meditation for anxiety stress relief calm',
    beginners: 'meditation for beginners guided mindfulness',
    focus: 'mindfulness meditation for focus concentration',
    breathing: 'breathing exercises meditation pranayama'
  }

  const query = categoryQueries[category] || categoryQueries.beginners
  return recommendVideos(query, '', maxResults)
}
