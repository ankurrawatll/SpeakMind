import type { Screen } from '../App'

// Import mood images from public folder
import calmImg from '/Homescreen/Moods/calm.png'
import relaxImg from '/Homescreen/Moods/relax.png'
import focusImg from '/Homescreen/Moods/focus.png'
import anxiousImg from '/Homescreen/Moods/Anxious.png'
import meditativeInsightsImg from '/Homescreen/Meditative Insights.png'

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

export default function HomeScreen({ onNavigate, user }: HomeScreenProps) {
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
      onClick: () => onNavigate('aiCoach')
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 pb-20">
      {/* Header with Greeting */}
      <div className="px-6 pt-12 pb-6">
        <div className="text-gray-900">
          <h1 className="text-2xl font-semibold mb-2">Hi {user.name}</h1>
          <p className="text-gray-700 text-base">How are you feeling today?</p>
        </div>
      </div>

      <div className="px-6">
        {/* Mood Selector */}
        <div className="mb-8 bg-white/40 backdrop-blur-md border border-white/30 rounded-2xl p-4 shadow">
          <div className="flex justify-between items-center gap-4">
            {moods.map((mood) => (
              <button
                key={mood.value}
                className="flex flex-col items-center space-y-2 flex-1"
              >
                <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                  <img 
                    src={mood.emoji} 
                    alt={mood.label}
                    className="w-12 h-12 object-contain"
                  />
                </div>
                <span className="text-xs font-medium text-gray-700">{mood.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Meditative Insights Card */}
        <div className="mb-8">
          <div 
            className="relative rounded-3xl overflow-hidden cursor-pointer border border-white/30 bg-white/30 backdrop-blur-md"
            // clicking anywhere navigates to Ask Question, button also works
            onClick={() => onNavigate('askQuestion')}
          >
            <img 
              src={meditativeInsightsImg} 
              alt="Meditative Insights"
              className="w-full h-auto object-cover"
            />
            {/* subtle gradient for contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"/>
            {/* overlay container */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-full h-full flex items-center justify-center px-6">
                <div className="relative w-full max-w-md">
                  {/* keep pointer-events on button so click works */}
                  
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Coach Sessions */}
        <div className="mb-6 bg-white/40 backdrop-blur-md border border-white/30 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Meditation & Relaxation</h3>
            <button 
              className="text-blue-600 text-sm font-medium flex items-center"
              onClick={() => onNavigate('aiCoach')}
            >
              <span>Load More</span>
              <span className="ml-1">→</span>
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {aiCoachSessions.map((session) => (
              <div 
                key={session.id}
                className="relative rounded-2xl overflow-hidden cursor-pointer group"
                onClick={session.onClick}
              >
                <img 
                  src={session.image} 
                  alt={session.title}
                  className="w-full h-32 sm:h-36 object-cover"
                />
                {/* subtle gradient to ensure text contrast */}
                <div className="absolute inset-0 bg-black/20"/>

                {/* Title text at top-left */}
                <div className="absolute inset-0 p-4 flex flex-col justify-start">
                  <h4 className="text-white text-sm font-semibold leading-tight drop-shadow-md">
                    {session.title}
                  </h4>
                </div>

                {/* No play button to avoid overlap */}
              </div>
            ))}
          </div>
        </div>

        {/* Streak Widget */}
        <div className="bg-gradient-to-r from-orange-400 to-pink-400 rounded-2xl p-4 mb-6 border border-white/40 backdrop-blur-md">
          <div className="flex items-center justify-between text-white">
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-2xl">🔥</span>
                <h3 className="text-lg font-semibold">Streak: {user.streak} day</h3>
              </div>
              <p className="text-white/90 text-sm">Miracle moment in 2 days!</p>
            </div>
            <button 
              className="text-white/80 hover:text-white"
              onClick={() => onNavigate('streaks')}
            >
              →
            </button>
          </div>
        </div>

        {/* Wellness Activities Cards */}
        <div className="grid grid-cols-1 gap-4 mb-6">
          {/* Journal Card */}
          <div 
            className="bg-gradient-to-r from-blue-400 to-purple-500 rounded-2xl p-5 cursor-pointer transform transition-transform active:scale-95 border border-white/40 backdrop-blur-sm"
            onClick={() => onNavigate('journal')}
          >
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">📖</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">AI Journal</h3>
                  <p className="text-white/90 text-sm">Reflect with personalized prompts</p>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <button className="text-white/80 hover:text-white text-xl">→</button>
                <span className="text-xs text-white/70 mt-1">+50 XP</span>
              </div>
            </div>
          </div>

          
        </div>
      </div>
    </div>
  )
}