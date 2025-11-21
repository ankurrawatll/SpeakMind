import { useState } from 'react'
import type { Screen } from '../App'
import { IoChevronBack } from 'react-icons/io5';

interface JournalScreenProps {
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

export default function JournalScreen({ onNavigate, user: _user }: JournalScreenProps) {
  const [currentEntry, setCurrentEntry] = useState('')
  const [selectedMood, setSelectedMood] = useState<string | null>(null)

  const moods = [
    { emoji: '😊', label: 'Happy', color: 'bg-orange-100' },
    { emoji: '😌', label: 'Calm', color: 'bg-yellow-100' },
    { emoji: '😐', label: 'Neutral', color: 'bg-gray-100' },
    { emoji: '😕', label: 'Unsure', color: 'bg-blue-100' },
    { emoji: '😞', label: 'Down', color: 'bg-purple-100' },
  ]

  const handleSaveReflection = () => {
    if (currentEntry.trim()) {
      // Handle save logic here
      console.log('Saving reflection:', currentEntry, 'Mood:', selectedMood)
      // You could navigate back or show success message
      onNavigate('home')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between p-3 md:p-4">
        <button
          onClick={() => onNavigate('meditation')}
          className="p-1.5 md:p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <IoChevronBack className="w-5 h-5 md:w-6 md:h-6 text-gray-700" />
        </button>
        <div className="text-center">
          <h1 className="text-base md:text-lg font-semibold text-gray-900">Reflection Journal</h1>
          <p className="text-xs md:text-sm text-gray-500">Write one thought to clear your mind</p>
        </div>
        <div className="w-8 md:w-10"></div>
      </div>

      <div className="px-4 md:px-8 lg:px-12">
        <div className="max-w-4xl mx-auto space-y-4 md:space-y-6">
        {/* Mood Selector */}
        <div>
          <h3 className="text-base md:text-lg font-medium text-gray-900 mb-3 md:mb-4">Today I feel</h3>
          <div className="flex justify-between gap-1.5 md:gap-2">
            {moods.map((mood) => (
              <button
                key={mood.label}
                onClick={() => setSelectedMood(mood.label)}
                className={`flex flex-col items-center space-y-1 md:space-y-2 ${
                  selectedMood === mood.label ? 'opacity-100' : 'opacity-70'
                }`}
              >
                <div className={`w-12 h-12 md:w-16 md:h-16 rounded-full ${mood.color} flex items-center justify-center text-xl md:text-2xl border-2 ${
                  selectedMood === mood.label ? 'border-purple-400' : 'border-transparent'
                }`}>
                  {mood.emoji}
                </div>
                <span className="text-[10px] md:text-xs font-medium text-gray-700">{mood.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Journal Input */}
        <div>
          <h3 className="text-base md:text-lg font-medium text-gray-900 mb-3 md:mb-4">Write your mind today ?</h3>
          <textarea
            value={currentEntry}
            onChange={(e) => setCurrentEntry(e.target.value)}
            placeholder="Today I feel..."
            className="w-full h-48 md:h-64 p-3 md:p-4 bg-white border border-gray-200 rounded-xl md:rounded-2xl text-sm md:text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 resize-none"
          />
        </div>

        {/* Save Button */}
        <div className="pt-4 md:pt-8">
          <button
            onClick={handleSaveReflection}
            className="w-full bg-purple-500 text-white font-semibold py-3 md:py-4 rounded-xl md:rounded-2xl hover:bg-purple-600 transition-colors text-sm md:text-base"
          >
            Save Reflection
          </button>
        </div>
        </div>
      </div>
    </div>
  )
}
