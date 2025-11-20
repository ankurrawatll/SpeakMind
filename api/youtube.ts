import type { VercelRequest, VercelResponse } from '@vercel/node'

const YOUTUBE_API_KEY = process.env.VITE_YOUTUBE_API_KEY

interface YouTubeVideo {
  videoId: string
  title: string
  channelTitle: string
  thumbnails: {
    default: { url: string; width: number; height: number }
    medium: { url: string; width: number; height: number }
    high: { url: string; width: number; height: number }
  }
  url: string
}

interface YouTubeApiResponse {
  videos?: YouTubeVideo[]
  error?: string
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { query, context, maxResults = '5' } = req.query

  if (!query || typeof query !== 'string') {
    return res.status(400).json({ error: 'Query parameter is required' })
  }

  if (!YOUTUBE_API_KEY) {
    return res.status(500).json({ error: 'YouTube API key not configured on server' })
  }

  try {
    const searchQuery = context && typeof context === 'string' ? `${query} ${context}` : query
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(searchQuery)}&type=video&maxResults=${maxResults}&key=${YOUTUBE_API_KEY}`

    const response = await fetch(url)
    
    if (!response.ok) {
      console.error('YouTube API error:', response.status)
      return res.status(response.status).json({ error: 'YouTube API error' })
    }

    const data = await response.json()

    if (!data.items || data.items.length === 0) {
      const emptyResponse: YouTubeApiResponse = { videos: [] }
      return res.status(200).json(emptyResponse)
    }

    const videos: YouTubeVideo[] = data.items.map((item: any) => ({
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

    const successResponse: YouTubeApiResponse = { videos }
    return res.status(200).json(successResponse)
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch videos'
    console.error('Error fetching YouTube videos:', errorMessage)
    const errorResponse: YouTubeApiResponse = { error: errorMessage }
    return res.status(500).json(errorResponse)
  }
}
