// YouTube AI utility for video recommendations
export interface VideoSuggestion {
  videoId: string;
  title: string;
  channelTitle: string;
  url: string;
  thumbnails?: {
    default?: { url: string };
    medium?: { url: string };
    high?: { url: string };
  };
  duration?: string;
  viewCount?: string;
  publishedAt?: string;
}

// Mock video recommendations for meditation and wellness content
const mockVideos: VideoSuggestion[] = [
  {
    videoId: "1",
    title: "10 Minute Morning Meditation for Beginners",
    channelTitle: "Mindful Living",
    url: "https://youtube.com/watch?v=1",
    thumbnails: {
      default: { url: "https://img.youtube.com/vi/1/default.jpg" },
      medium: { url: "https://img.youtube.com/vi/1/mqdefault.jpg" }
    },
    duration: "10:30",
    viewCount: "1.2M",
    publishedAt: "2024-01-15"
  },
  {
    videoId: "2", 
    title: "Guided Meditation for Anxiety Relief",
    channelTitle: "Calm Mind",
    url: "https://youtube.com/watch?v=2",
    thumbnails: {
      default: { url: "https://img.youtube.com/vi/2/default.jpg" },
      medium: { url: "https://img.youtube.com/vi/2/mqdefault.jpg" }
    },
    duration: "15:45",
    viewCount: "856K",
    publishedAt: "2024-01-10"
  },
  {
    videoId: "3",
    title: "Breathing Exercises for Stress Management",
    channelTitle: "Wellness Hub",
    url: "https://youtube.com/watch?v=3",
    thumbnails: {
      default: { url: "https://img.youtube.com/vi/3/default.jpg" },
      medium: { url: "https://img.youtube.com/vi/3/mqdefault.jpg" }
    },
    duration: "8:20",
    viewCount: "432K",
    publishedAt: "2024-01-05"
  },
  {
    videoId: "4",
    title: "Mindfulness Meditation for Better Sleep",
    channelTitle: "Sleep Well",
    url: "https://youtube.com/watch?v=4",
    thumbnails: {
      default: { url: "https://img.youtube.com/vi/4/default.jpg" },
      medium: { url: "https://img.youtube.com/vi/4/mqdefault.jpg" }
    },
    duration: "20:00",
    viewCount: "2.1M",
    publishedAt: "2023-12-28"
  }
];

/**
 * Recommends videos based on user question and conversation context
 * @param question - User's question
 * @param context - Previous conversation context
 * @param maxResults - Maximum number of videos to return
 * @returns Promise<VideoSuggestion[]> - Array of recommended videos
 */
export async function recommendVideos(
  question: string,
  context: string = "",
  maxResults: number = 4
): Promise<VideoSuggestion[]> {
  try {
    // For now, return mock data based on keywords in the question
    // In a real implementation, this would call YouTube API or AI service
    const lowerQuestion = question.toLowerCase();
    
    // Filter videos based on question keywords
    let filteredVideos = mockVideos;
    
    if (lowerQuestion.includes('anxiety') || lowerQuestion.includes('stress')) {
      filteredVideos = mockVideos.filter(v => 
        v.title.toLowerCase().includes('anxiety') || 
        v.title.toLowerCase().includes('stress')
      );
    } else if (lowerQuestion.includes('sleep') || lowerQuestion.includes('bedtime')) {
      filteredVideos = mockVideos.filter(v => 
        v.title.toLowerCase().includes('sleep')
      );
    } else if (lowerQuestion.includes('breathing') || lowerQuestion.includes('breath')) {
      filteredVideos = mockVideos.filter(v => 
        v.title.toLowerCase().includes('breathing')
      );
    } else if (lowerQuestion.includes('beginner') || lowerQuestion.includes('start')) {
      filteredVideos = mockVideos.filter(v => 
        v.title.toLowerCase().includes('beginner')
      );
    }
    
    // If no specific matches, return all videos
    if (filteredVideos.length === 0) {
      filteredVideos = mockVideos;
    }
    
    // Return up to maxResults videos
    return filteredVideos.slice(0, maxResults);
    
  } catch (error) {
    console.error('Error recommending videos:', error);
    // Return empty array on error
    return [];
  }
}

/**
 * Search for videos by specific keywords
 * @param keywords - Search keywords
 * @param maxResults - Maximum number of results
 * @returns Promise<VideoSuggestion[]> - Array of search results
 */
export async function searchVideos(
  keywords: string,
  maxResults: number = 10
): Promise<VideoSuggestion[]> {
  try {
    // Mock search implementation
    // In a real app, this would call YouTube Search API
    const lowerKeywords = keywords.toLowerCase();
    const results = mockVideos.filter(video => 
      video.title.toLowerCase().includes(lowerKeywords) ||
      video.channelTitle.toLowerCase().includes(lowerKeywords)
    );
    
    return results.slice(0, maxResults);
  } catch (error) {
    console.error('Error searching videos:', error);
    return [];
  }
}

/**
 * Get video details by ID
 * @param videoId - YouTube video ID
 * @returns Promise<VideoSuggestion | null> - Video details or null if not found
 */
export async function getVideoDetails(videoId: string): Promise<VideoSuggestion | null> {
  try {
    // Mock implementation
    const video = mockVideos.find(v => v.videoId === videoId);
    return video || null;
  } catch (error) {
    console.error('Error getting video details:', error);
    return null;
  }
}
