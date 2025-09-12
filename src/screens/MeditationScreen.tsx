import type { Screen } from '../App'

interface MeditationScreenProps {
  onNavigate: (screen: Screen) => void
}

export default function MeditationScreen({ onNavigate }: MeditationScreenProps) {
  const meditationCategories = [
    {
      id: 'quick-calm',
      title: 'Quick Calm',
      description: 'Short sessions for instant relief',
      duration: '2–5 min sessions',
      videoCount: 12,
      languages: ['Hindi', 'English'],
      icon: '🌸',
      gradient: 'from-blue-400 to-blue-600',
      // TODO: YouTube API integration - playlistId: 'PLxxxxx'
    },
    {
      id: 'deep-focus',
      title: 'Deep Focus',
      description: 'Enhanced concentration and clarity',
      duration: '5–15 min sessions',
      videoCount: 18,
      languages: ['Hindi', 'English'],
      icon: '🎯',
      gradient: 'from-purple-400 to-purple-600',
      // TODO: YouTube API integration - playlistId: 'PLyyyyy'
    },
    {
      id: 'sleep-relaxation',
      title: 'Sleep Relaxation',
      description: 'Peaceful rest and recovery',
      duration: '10–20 min sessions',
      videoCount: 15,
      languages: ['Hindi', 'English'],
      icon: '🌙',
      gradient: 'from-indigo-400 to-indigo-600',
      // TODO: YouTube API integration - playlistId: 'PLzzzzz'
    },
    {
      id: 'subconscious-reprogramming',
      title: 'Subconscious Reprogramming',
      description: 'Transform limiting beliefs',
      duration: '8–15 min sessions',
      videoCount: 9,
      languages: ['Hindi', 'English'],
      icon: '🧠',
      gradient: 'from-emerald-400 to-emerald-600',
      // TODO: YouTube API integration - playlistId: 'PLwwwww'
    }
  ]

  // TODO: AI Recommendations - This would come from backend analysis of user's mood patterns
  const aiRecommendedCategory = meditationCategories[Math.floor(Math.random() * meditationCategories.length)]

  const handleCategoryClick = (_categoryId: string) => {
    // TODO: Navigate to video list or start session
    // For now, navigate to timer for demo
    onNavigate('timer')
  }

  return (
    <div className="min-h-screen bg-light-bg pb-24">
      {/* Header */}
      <div className="gradient-bg px-6 pt-12 pb-8 rounded-b-5xl">
        <div className="text-white">
          <h1 className="text-2xl font-bold mb-2">Meditation</h1>
          <p className="text-white/80 text-sm">AI-powered recommendations based on your mood and goals</p>
        </div>
      </div>

      <div className="px-6 -mt-4">
        {/* AI Recommendations Section */}
        <div className="card mb-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="text-2xl">🤖</div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">AI Recommendations</h3>
              <p className="text-sm text-gray-600">Personalized for you today</p>
            </div>
          </div>
          
          <div 
            className={`bg-gradient-to-r ${aiRecommendedCategory.gradient} rounded-3xl p-4 text-white cursor-pointer transition-transform active:scale-95`}
            onClick={() => handleCategoryClick(aiRecommendedCategory.id)}
          >
            <div className="flex items-center space-x-4">
              <div className="text-3xl">{aiRecommendedCategory.icon}</div>
              <div className="flex-1">
                <h4 className="font-semibold text-lg">{aiRecommendedCategory.title}</h4>
                <p className="text-white/90 text-sm mb-2">{aiRecommendedCategory.description}</p>
                <div className="flex items-center space-x-4 text-xs text-white/80">
                  <span>{aiRecommendedCategory.duration}</span>
                  <span>•</span>
                  <span>{aiRecommendedCategory.videoCount} videos</span>
                </div>
              </div>
              <div className="text-xl">▶️</div>
            </div>
          </div>
          
          <div className="mt-3 text-xs text-gray-500 text-center">
            {/* TODO: This text would be dynamic based on actual AI analysis */}
            Our AI analyzed your recent mood patterns and suggests this session for optimal wellness.
          </div>
        </div>

        {/* Meditation Categories */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 px-2">Explore Categories</h3>
          
          {meditationCategories.map((category) => (
            <div 
              key={category.id}
              className="card cursor-pointer transition-transform active:scale-95"
              onClick={() => handleCategoryClick(category.id)}
            >
              <div className="flex items-center space-x-4">
                <div className={`w-16 h-16 bg-gradient-to-br ${category.gradient} rounded-3xl flex items-center justify-center text-2xl`}>
                  {category.icon}
                </div>
                
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800 text-lg mb-1">{category.title}</h4>
                  <p className="text-gray-600 text-sm mb-2">{category.description}</p>
                  
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span className="font-medium">{category.duration}</span>
                    <span>•</span>
                    <span className="font-medium text-primary-purple">
                      [{category.videoCount} videos]
                      {/* TODO: This count would come from YouTube API response */}
                    </span>
                    <span>•</span>
                    <span>({category.languages.join(', ')})</span>
                  </div>
                </div>
                
                <div className="text-primary-purple text-xl">
                  ▶️
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* How AI Recommendations Work */}
        <div className="card mt-6 bg-gradient-to-r from-primary-purple/5 to-primary-pink/5 border-primary-purple/20">
          <div className="text-center">
            <div className="text-3xl mb-3">✨</div>
            <h3 className="font-semibold text-gray-800 mb-2">AI Recommendations</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Our AI analyzes your mood patterns, session history, and preferences to suggest 
              the most relevant meditations for your current state of mind and wellness goals.
            </p>
            {/* TODO: Add actual analytics and mood correlation insights */}
          </div>
        </div>
      </div>
    </div>
  )
}

/* 
TODO: YouTube API Integration Plan

1. Setup YouTube Data API v3:
   - Get API key from Google Cloud Console
   - Enable YouTube Data API v3

2. Fetch playlist data:
   const fetchPlaylistVideos = async (playlistId) => {
     const response = await fetch(
       `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${playlistId}&key=${API_KEY}`
     )
     return response.json()
   }

3. Update video counts dynamically:
   - Replace hardcoded videoCount with API response
   - Cache responses for better performance

4. Video player integration:
   - Create modal with YouTube iframe
   - Handle play/pause events
   - Track session completion

5. AI Backend Integration:
   - Send user mood data to backend
   - Receive recommended playlist IDs
   - Update UI with personalized suggestions

6. Session tracking:
   - Store completed sessions in localStorage/backend
   - Show progress and achievements
   - Integrate with streak system
*/