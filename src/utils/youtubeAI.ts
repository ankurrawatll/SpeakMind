// YouTube API integration for personalized video recommendations
// API keys are protected via serverless function

import { USE_SERVERLESS } from '../config/apiConfig'

export interface VideoSuggestion {
  videoId: string
  title: string
  channelTitle: string
  thumbnails: {
    default?: { url: string }
    medium?: { url: string }
    high?: { url: string }
  }
  url: string
}

/**
 * Recommend meditation/wellness videos based on search query
 * @param query - Search query for videos
 * @param context - Additional context (optional)
 * @param maxResults - Maximum number of results (default: 5)
 * @returns Promise<VideoSuggestion[]>
 */
export const recommendVideos = async (
  query: string,
  context: string = '',
  maxResults: number = 5
): Promise<VideoSuggestion[]> => {
  if (USE_SERVERLESS) {
    // Call serverless function (API key is protected)
    try {
      const params = new URLSearchParams({
        query,
        ...(context && { context }),
        maxResults: maxResults.toString()
      })

      const response = await fetch(`/api/youtube?${params}`)
      
      if (!response.ok) {
        console.error('YouTube API error:', response.status)
        return []
      }

      const data = await response.json()
      return data.videos || []
    } catch (error) {
      console.error('Error fetching YouTube videos:', error)
      return []
    }
  } else {
    // Direct API call (for local development only - exposes API key)
    return recommendVideosDirect(query, context, maxResults)
  }
}

// Direct API call (only for local development)
const recommendVideosDirect = async (
  query: string,
  context: string = '',
  maxResults: number = 5
): Promise<VideoSuggestion[]> => {
  const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY

  if (!YOUTUBE_API_KEY || YOUTUBE_API_KEY === 'your-youtube-api-key') {
    console.warn('YouTube API key not configured')
    return []
  }

  try {
    const searchQuery = context ? `${query} ${context}` : query
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(searchQuery)}&type=video&maxResults=${maxResults}&key=${YOUTUBE_API_KEY}`

    const response = await fetch(url)
    
    if (!response.ok) {
      console.error('YouTube API error:', response.status)
      return []
    }

    const data = await response.json()

    if (!data.items || data.items.length === 0) {
      return []
    }

    return data.items.map((item: any) => ({
      videoId: item.id.videoId,
      title: item.snippet.title,
      channelTitle: item.snippet.channelTitle,
      thumbnails: {
        default: item.snippet.thumbnails.default,
        medium: item.snippet.thumbnails.medium,
        high: item.snippet.thumbnails.high
      },
      url: `https://www.youtube.com/watch?v=${item.id.videoId}`
    }))
  } catch (error) {
    console.error('Error fetching YouTube videos:', error)
    return []
  }
}
