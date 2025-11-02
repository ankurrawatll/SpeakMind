import { useState, useEffect } from 'react'
import { IoPlay } from 'react-icons/io5'
import type { Screen } from '../App'
import { recommendVideos, type VideoSuggestion } from '../utils/youtubeAI'
import { getContextualSearchQuery } from '../utils/userContext'

// Import mood images from public folder
import calmImg from '/Homescreen/Calm.gif'
import relaxImg from '/Homescreen/Relax.gif'
import focusImg from '/Homescreen/Focus.gif'
import anxiousImg from '/Homescreen/Anxious.gif'

interface HomeScreenProps {
  onNavigate: (screen: Screen) => void
  user: {
    name: string
    streak: number
    level: number
    timemeditated: number
    meditations: number
    points: number
  }
}

type MoodValue = 'calm' | 'relax' | 'focus' | 'anxious' | null

export default function HomeScreen({ onNavigate, user }: HomeScreenProps) {
  const [isStreakExpanded, setIsStreakExpanded] = useState(false)
  const [selectedMood, setSelectedMood] = useState<MoodValue>(null)
  const [videoSuggestions, setVideoSuggestions] = useState<VideoSuggestion[]>([])
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  const [isLoadingVideos, setIsLoadingVideos] = useState(false)
  const [videoSourceContext, setVideoSourceContext] = useState<'context' | 'mood' | 'default'>('default')

  // Mood to search query mapping
  const moodToQuery: Record<Exclude<MoodValue, null>, string> = {
    calm: 'calming meditation music peaceful relaxation nature sounds calm songs ambient music',
    relax: 'relaxing music yoga meditation gentle music stress relief spa music chill songs',
    focus: 'focus music meditation concentration study music deep focus binaural beats lofi',
    anxious: 'anxiety relief music calming songs breathing meditation peaceful music stress relief'
  }

  const moodPrompts = {
    calm: "You're feeling calm today 🌊",
    relax: "You're feeling relaxed 😌",
    focus: "You're feeling focused 🎯",
    anxious: "You're feeling anxious 😰"
  }

  // Fetch videos when mood changes or on initial load
  useEffect(() => {
    const fetchVideos = async () => {
      setIsLoadingVideos(true)
      try {
        let query: string
        let source: 'context' | 'mood' | 'default'
        
        // Priority 1: Use context from chatbot conversations (if available)
        const contextQuery = getContextualSearchQuery()
        
        if (contextQuery) {
          // User has shared problems in chatbot - use that context
          query = contextQuery
          source = 'context'
          console.log('Using chatbot context for videos:', contextQuery)
        } else if (selectedMood) {
          // Priority 2: Use selected mood
          query = moodToQuery[selectedMood]
          source = 'mood'
        } else {
          // Priority 3: Default meditation videos and music
          query = 'meditation music mindfulness relaxation guided meditation calm music peaceful songs ambient sounds'
          source = 'default'
        }
        
        setVideoSourceContext(source)
        
        const videos = await recommendVideos(query, '', 6) // Fetch 6 videos
        setVideoSuggestions(videos)
        setCurrentVideoIndex(0)
      } catch (error) {
        console.error('Error fetching videos:', error)
        setVideoSuggestions([])
      } finally {
        setIsLoadingVideos(false)
      }
    }

    fetchVideos()
  }, [selectedMood])

  // Auto-rotate videos every 5 seconds
  useEffect(() => {
    if (videoSuggestions.length === 0) return

    const interval = setInterval(() => {
      setCurrentVideoIndex((prev) => (prev + 1) % videoSuggestions.length)
    }, 5000) // Rotate every 5 seconds

    return () => clearInterval(interval)
  }, [videoSuggestions])

  const moods = [
    { emoji: calmImg, label: 'Calm', value: 'calm' },
    { emoji: relaxImg, label: 'Relax', value: 'relax' },
    { emoji: focusImg, label: 'Focus', value: 'focus' },
    { emoji: anxiousImg, label: 'Anxious', value: 'anxious' },
  ]

  const aiCoachSessions = [
    {
      id: 'midnight-relax',
      title: 'Midnight & Relaxation',
      image: 'https://images.pexels.com/photos/18554368/pexels-photo-18554368.jpeg',
      category: 'Sleep',
      onClick: () => onNavigate('midnightRelaxation')
    },
    {
      id: 'vedic-calm',
      title: 'Vedic Calm',
      image: 'https://images.pexels.com/photos/15327651/pexels-photo-15327651.jpeg',
      category: 'Philosophy',
      onClick: () => onNavigate('vedicCalm')
    },
    {
      id: 'midnight-launderette',
      title: 'Midnight Launderette',
      image: 'https://images.pexels.com/photos/3125171/pexels-photo-3125171.jpeg',
      category: 'Focus',
      onClick: () => onNavigate('midnightLaunderette')
    },
    {
      id: 'wisdom-gita',
      title: 'Wisdom of the Gita',
      image: 'https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg',
      category: 'Insights',
      onClick: () => onNavigate('wisdomGita')
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 pb-20">
      {/* Header with Greeting and Streak Flame */}
      <div className="px-6 pt-12 pb-6">
        <div className="flex items-start justify-between">
          <div className="text-gray-900">
            <h1 className="text-2xl font-semibold mb-2">Hi {user?.name || 'Guest'}</h1>
            <p className="text-gray-700 text-base">How are you feeling today?</p>
          </div>
          
          {/* Streak Flame Icon */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('profile')}
              className="p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-colors"
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </button>
            <button
              onClick={() => setIsStreakExpanded(!isStreakExpanded)}
              className="relative flex items-center justify-center w-12 h-12 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <span className="text-2xl">🔥</span>
              <div className="absolute -bottom-1 -right-1 bg-white rounded-full w-6 h-6 flex items-center justify-center shadow-md">
                <span className="text-xs font-bold text-orange-600">{user.streak}</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Expandable Streak Section - Small Banner */}
      <div 
        className={`transition-all duration-300 ease-out overflow-hidden ${
          isStreakExpanded ? 'max-h-40' : 'max-h-0'
        }`}
      >
        <div className="px-6 pb-6">
          <div className="bg-gradient-to-r from-orange-400 to-pink-500 rounded-2xl p-4 shadow-lg">
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                <span className="text-3xl">🔥</span>
                <div>
                  <h3 className="text-lg font-semibold">{user.streak} Day Streak</h3>
                  <p className="text-white/90 text-sm">Miracle moment in 2 days!</p>
                </div>
              </div>
              <button 
                className="text-white/80 hover:text-white transition-colors"
                onClick={(e) => {
                  e.stopPropagation()
                  onNavigate('streaks')
                }}
              >
                <span className="text-sm">View Details →</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6">
        {/* Integrated Mood Selector & Banner */}
        <div className="mb-8 bg-white/40 backdrop-blur-md border border-white/30 rounded-2xl shadow overflow-hidden">
          {/* Mood Selector */}
          <div className="p-4">
            <div className="flex justify-between items-center gap-4">
              {moods.map((mood) => (
                <button
                  key={mood.value}
                  onClick={() => setSelectedMood(mood.value as MoodValue)}
                  className={`flex flex-col items-center space-y-2 flex-1 transition-all ${
                    selectedMood === mood.value ? 'scale-110' : selectedMood ? 'opacity-50 scale-95' : ''
                  }`}
                >
                  <div className={`w-16 h-16 rounded-full overflow-hidden flex items-center justify-center ${
                    selectedMood === mood.value ? 'ring-4 ring-purple-400' : 'bg-gray-100'
                  }`}>
                    <img 
                      src={mood.emoji} 
                      alt={mood.label}
                      className="w-12 h-12 object-contain"
                    />
                  </div>
                  <span className={`text-xs font-medium ${
                    selectedMood === mood.value ? 'text-purple-600' : 'text-gray-700'
                  }`}>{mood.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Expandable Banner */}
          <div 
            className={`transition-all duration-300 ease-out overflow-hidden ${
              selectedMood ? 'max-h-32' : 'max-h-0'
            }`}
          >
            {selectedMood && (
              <div 
                className="bg-gradient-to-r from-purple-500 via-purple-400 to-pink-400 p-6 cursor-pointer hover:from-purple-600 hover:via-purple-500 hover:to-pink-500 transition-all"
                onClick={() => onNavigate('askQuestion')}
              >
                <p className="text-white font-medium text-center mb-2">
                  {moodPrompts[selectedMood]}
                </p>
                <p className="text-white/90 text-sm text-center font-medium">
                  Tap to share your thoughts →
                </p>
              </div>
            )}
          </div>
        </div>

        {/* AI Coach Sessions - 2x2 Grid with rectangles */}
        <div className="mb-6">
          <div className="px-1 flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-900">Curated Sessions</h3>
            <button 
              className="text-purple-600 text-sm font-medium flex items-center"
              onClick={() => onNavigate('explore')}
            >
              <span>Explore</span>
              <span className="ml-1">→</span>
            </button>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {aiCoachSessions.map((session) => (
              <div
                key={session.id}
                onClick={session.onClick}
                className="relative rounded-2xl overflow-hidden h-28 flex items-end p-3 cursor-pointer shadow-lg group hover:shadow-xl transition-shadow"
              >
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                  <img
                    src={session.image}
                    alt={session.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
                </div>

                {/* Content */}
                <div className="relative z-10 w-full">
                  <div className="flex justify-between items-end">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white text-sm font-semibold mb-1 drop-shadow truncate">{session.title}</h4>
                      <div className="inline-flex items-center text-[10px] text-white/90 bg-white/15 backdrop-blur px-2 py-0.5 rounded-full border border-white/20">
                        {session.category}
                      </div>
                    </div>
                    {/* Play Button */}
                    <div className="bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform ml-2 flex-shrink-0">
                      <svg 
                        width="12" 
                        height="12" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        className="text-purple-800 ml-0.5"
                      >
                        <path 
                          d="M8 5v14l11-7z" 
                          fill="currentColor"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* YouTube Video Recommendations - Rolling Thumbnails */}
        <div className="mb-6">
          <div className="px-1 flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-900">
              {videoSourceContext === 'context' && '✨ Personalized for You'}
              {videoSourceContext === 'mood' && selectedMood && 
                `${selectedMood.charAt(0).toUpperCase() + selectedMood.slice(1)} Music & Videos`
              }
              {videoSourceContext === 'default' && 'Meditation Music & Videos'}
            </h3>
            {videoSuggestions.length > 0 && (
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  {videoSuggestions.slice(0, 3).map((_, index) => (
                    <div
                      key={index}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        index === currentVideoIndex % 3
                          ? 'w-6 bg-purple-600'
                          : 'w-1.5 bg-purple-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-gray-500">
                  {currentVideoIndex + 1}/{videoSuggestions.length}
                </span>
              </div>
            )}
          </div>

            {/* Loading State */}
            {isLoadingVideos && (
              <div className="relative rounded-3xl overflow-hidden h-52 bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
                  <p className="text-purple-600 font-medium">
                    {videoSourceContext === 'context' 
                      ? 'Finding videos based on your conversations...'
                      : 'Finding perfect videos for you...'
                    }
                  </p>
                </div>
              </div>
            )}

            {/* Video Display */}
            {!isLoadingVideos && videoSuggestions.length > 0 && (
              <div className="relative">
                {/* Main Video Thumbnail */}
                <div
                  onClick={() => window.open(videoSuggestions[currentVideoIndex].url, '_blank')}
                  className="relative rounded-3xl overflow-hidden h-52 cursor-pointer group shadow-xl hover:shadow-2xl transition-all duration-300"
                >
                  {/* Thumbnail Image */}
                  <img
                    src={videoSuggestions[currentVideoIndex].thumbnails?.high?.url || videoSuggestions[currentVideoIndex].thumbnails?.medium?.url}
                    alt={videoSuggestions[currentVideoIndex].title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  {/* Play Button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-white/95 rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:bg-white transition-all duration-300">
                      <IoPlay className="text-purple-600 text-3xl ml-1" />
                    </div>
                  </div>
                  
                  {/* Video Info */}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h4 className="text-white font-semibold text-base mb-1 line-clamp-2 drop-shadow-lg">
                      {videoSuggestions[currentVideoIndex].title}
                    </h4>
                    <p className="text-white/90 text-xs line-clamp-1 drop-shadow">
                      {videoSuggestions[currentVideoIndex].channelTitle}
                    </p>
                  </div>

                  {/* YouTube Logo Badge */}
                  <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-lg">
                    YouTube
                  </div>

                  {/* Personalized Badge */}
                  {videoSourceContext === 'context' && (
                    <div className="absolute top-4 left-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-lg flex items-center gap-1">
                      <span>✨</span>
                      <span>For You</span>
                    </div>
                  )}
                </div>

                {/* Thumbnail Preview Strip */}
                <div className="mt-3 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  {videoSuggestions.map((video, index) => (
                    <button
                      key={video.videoId}
                      onClick={() => setCurrentVideoIndex(index)}
                      className={`relative flex-shrink-0 w-32 h-20 rounded-xl overflow-hidden transition-all duration-300 ${
                        index === currentVideoIndex
                          ? 'ring-3 ring-purple-500 scale-105 shadow-lg'
                          : 'opacity-60 hover:opacity-100 hover:scale-105'
                      }`}
                    >
                      <img
                        src={video.thumbnails?.medium?.url || video.thumbnails?.default?.url}
                        alt={video.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      {index === currentVideoIndex && (
                        <div className="absolute inset-0 border-2 border-purple-500 rounded-xl" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* No Videos State */}
            {!isLoadingVideos && videoSuggestions.length === 0 && (
              <div className="relative rounded-3xl overflow-hidden h-52 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <div className="text-center px-6">
                  <p className="text-gray-600 font-medium mb-2">No videos found</p>
                  <p className="text-gray-500 text-sm">
                    Please check your YouTube API configuration
                  </p>
                </div>
              </div>
            )}
          </div>

        
      </div>
    </div>
  )
}