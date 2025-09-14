import type { Screen } from '../App'

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
    { emoji: '/Homescreen/Moods/calm.png', label: 'Calm', value: 'calm' },
    { emoji: '/Homescreen/Moods/relax.png', label: 'Relax', value: 'relax' },
    { emoji: '/Homescreen/Moods/focus.png', label: 'Focus', value: 'focus' },
    { emoji: '/Homescreen/Moods/Anxious.png', label: 'Anxious', value: 'anxious' },
  ]

  const aiCoachSessions = [
    {
      id: 1,
      title: 'Midnight & Relaxation',
      image: '/Homescreen/Ai coach/Midnightandrelaxation.png',
      category: 'Sleep'
    },
    {
      id: 2,
      title: 'Jogging and Cycling',
      image: '/Homescreen/Ai coach/JoggingandCycling.png',
      category: 'Active'
    },
    {
      id: 3,
      title: 'Midnight Launderette',
      image: '/Homescreen/Ai coach/MidnightLaunderetee.png',
      category: 'Focus'
    },
    {
      id: 4,
      title: 'Jogging',
      image: '/Homescreen/Ai coach/jogging.png',
      category: 'Calm'
    }
  ]

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header with Greeting */}
      <div className="px-6 pt-12 pb-6">
        <div className="text-gray-900">
          <h1 className="text-2xl font-semibold mb-2">
            Hi {user.name}
          </h1>
          <p className="text-gray-600 text-base">How are you feeling today?</p>
        </div>
      </div>

      <div className="px-6">
        {/* Mood Selector */}
        <div className="mb-8">
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
            className="relative rounded-3xl overflow-hidden cursor-pointer"
            // clicking anywhere navigates to Ask Question, button also works
            onClick={() => onNavigate('askQuestion')}
          >
            <img 
              src="/Homescreen/Meditative Insights.png" 
              alt="Meditative Insights"
              className="w-full h-auto object-cover"
            />
            {/* overlay with CTA positioned exactly on image */}
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
        <div className="mb-6">
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
                onClick={() => onNavigate('aiCoach')}
              >
                <img 
                  src={session.image} 
                  alt={session.title}
                  className="w-full h-32 sm:h-36 object-cover"
                />

                {/* subtle gradient to ensure text contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-95"></div>

                {/* Title text at top-left */}
                <div className="absolute inset-0 p-4 flex flex-col justify-start">
                  <h4 className="text-white text-sm font-semibold leading-tight drop-shadow-md">
                    {session.title}
                  </h4>
                </div>

                {/* centered play button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <button
                    onClick={(e) => { e.stopPropagation(); onNavigate('aiCoach') }}
                    className="pointer-events-auto bg-white/90 w-12 h-12 rounded-full flex items-center justify-center shadow-md transform transition group-hover:scale-105"
                    aria-label={`Play ${session.title}`}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-purple-600">
                      <path d="M8 5v14l11-7L8 5z" fill="#7C3AED"></path>
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Streak Widget */}
        <div className="bg-gradient-to-r from-orange-400 to-pink-400 rounded-2xl p-4 mb-6">
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
            className="bg-gradient-to-r from-blue-400 to-purple-500 rounded-2xl p-5 cursor-pointer transform transition-transform active:scale-95"
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