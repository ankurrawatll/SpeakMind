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
    { emoji: '😌', label: 'Calm', value: 'calm' },
    { emoji: '😴', label: 'Relax', value: 'relax' },
    { emoji: '🎯', label: 'Focus', value: 'focus' },
    { emoji: '😰', label: 'Anxious', value: 'anxious' },
  ]

  const aiCoachSessions = [
    {
      id: 1,
      title: 'Midnight & Relaxation',
      duration: '15 min',
      thumbnail: '🌙',
      category: 'Sleep'
    },
    {
      id: 2,
      title: 'Jogging & Cycling',
      duration: '10 min',
      thumbnail: '🏃‍♂️',
      category: 'Active'
    },
    {
      id: 3,
      title: 'Morning Clarity',
      duration: '20 min',
      thumbnail: '🌅',
      category: 'Focus'
    },
    {
      id: 4,
      title: 'Stress Relief',
      duration: '12 min',
      thumbnail: '💆‍♀️',
      category: 'Calm'
    }
  ]

  return (
    <div className="min-h-screen bg-light-bg pb-24">
      {/* Header with Greeting */}
      <div className="gradient-bg px-6 pt-12 pb-8 rounded-b-5xl">
        <div className="text-white">
          <h1 className="text-2xl font-bold mb-2">
            Hi {user.name}, How are you feeling today?
          </h1>
          <p className="text-white/80 text-sm">Let's start your mindfulness journey</p>
        </div>
      </div>

      <div className="px-6 -mt-4">
        {/* Mood Selector */}
        <div className="card mb-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Select your mood</h3>
          <div className="grid grid-cols-4 gap-3">
            {moods.map((mood) => (
              <button
                key={mood.value}
                className="mood-emoji flex flex-col items-center space-y-2 bg-gray-50 hover:bg-primary-purple/10"
              >
                <span className="text-3xl">{mood.emoji}</span>
                <span className="text-xs font-medium text-gray-600">{mood.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Wellness Activities */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Wellness Activities</h3>
          <div className="grid grid-cols-2 gap-3">
            {/* Meditation Card */}
            <div 
              className="card p-4 cursor-pointer transition-transform active:scale-95 relative"
              onClick={() => onNavigate('meditation')}
            >
              <div className="absolute top-2 right-2">
                <span className="bg-green-100 text-green-600 text-xs px-2 py-1 rounded-full font-medium">
                  Recommended
                </span>
              </div>
              <div className="text-3xl mb-3">🧘‍♀️</div>
              <h4 className="font-semibold text-gray-800 mb-1">Meditation</h4>
              <p className="text-xs text-gray-600 mb-2">Quick calm to deep focus sessions</p>
              <p className="text-xs text-primary-purple font-medium">2–20 min sessions</p>
            </div>

            {/* Journal Card */}
            <div 
              className="card p-4 cursor-pointer transition-transform active:scale-95 relative"
              onClick={() => onNavigate('journal')}
            >
              <div className="absolute top-2 right-2">
                <span className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full font-medium">
                  AI Powered
                </span>
              </div>
              <div className="text-3xl mb-3">📖</div>
              <h4 className="font-semibold text-gray-800 mb-1">Journal</h4>
              <p className="text-xs text-gray-600 mb-2">Reflect with AI-generated prompts</p>
              <p className="text-xs text-primary-purple font-medium">Smart prompts based on mood</p>
            </div>

            {/* Emotional Release Card */}
            <div 
              className="card p-4 cursor-pointer transition-transform active:scale-95"
              onClick={() => onNavigate('emotionalRelease')}
            >
              <div className="text-3xl mb-3">🫁</div>
              <h4 className="font-semibold text-gray-800 mb-1">Emotional Release</h4>
              <p className="text-xs text-gray-600 mb-2">Guided breathing & relaxation</p>
              <p className="text-xs text-primary-purple font-medium">1–10 min sessions</p>
            </div>

            {/* Progress Hub Card */}
            <div 
              className="card p-4 cursor-pointer transition-transform active:scale-95 relative"
              onClick={() => onNavigate('streaks')}
            >
              <div className="absolute top-2 right-2">
                <span className="bg-purple-100 text-purple-600 text-xs px-2 py-1 rounded-full font-medium">
                  Level {user.level}
                </span>
              </div>
              <div className="text-3xl mb-3">🏆</div>
              <h4 className="font-semibold text-gray-800 mb-1">Progress Hub</h4>
              <p className="text-xs text-gray-600 mb-2">XP, streaks & achievement badges</p>
              <p className="text-xs text-primary-purple font-medium">0 badges earned</p>
            </div>
          </div>
        </div>

        {/* Ask a Question Card */}
        <div 
          className="card mb-6 cursor-pointer transition-transform active:scale-95"
          onClick={() => onNavigate('askQuestion')}
        >
          <div className="flex items-center space-x-4">
            <div className="text-4xl">💭</div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800 mb-1">Ask a Question</h3>
              <p className="text-sm text-gray-600">Got burning questions on your mind?</p>
            </div>
            <div className="text-primary-purple">→</div>
          </div>
        </div>

        {/* AI Coach Sessions */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">AI Coach</h3>
            <button className="text-primary-purple text-sm font-medium">See All</button>
          </div>
          
          <div className="space-y-3">
            {aiCoachSessions.slice(0, 2).map((session) => (
              <div 
                key={session.id}
                className="meditation-card flex items-center space-x-4"
                onClick={() => onNavigate('aiCoach')}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-primary-purple to-primary-pink rounded-2xl flex items-center justify-center text-2xl">
                  {session.thumbnail}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800">{session.title}</h4>
                  <p className="text-sm text-gray-600">{session.category} • {session.duration}</p>
                </div>
                <button className="w-10 h-10 bg-primary-purple/10 rounded-full flex items-center justify-center text-primary-purple">
                  ▶️
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Streak Widget */}
        <div 
          className="streak-card cursor-pointer transition-transform active:scale-95"
          onClick={() => onNavigate('streaks')}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold mb-1">Streak: {user.streak} day</h3>
              <p className="text-white/90 text-sm">Miracle moment in 2 days!</p>
            </div>
            <div className="text-4xl">🔥</div>
          </div>
        </div>
      </div>
    </div>
  )
}