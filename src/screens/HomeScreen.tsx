import { useState } from 'react'
import type { Screen } from '../App'

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

  const moodPrompts = {
    calm: "You're feeling calm today 🌊",
    relax: "You're feeling relaxed 😌",
    focus: "You're feeling focused 🎯",
    anxious: "You're feeling anxious 😰"
  }

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

        
      </div>
    </div>
  )
}