import { useState } from 'react'
import type { Screen } from '../App'

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
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="px-6 pt-12 pb-6">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => onNavigate('home')}
            className="text-gray-600 text-2xl"
          >
            ←
          </button>
          <div className="flex-1 text-center">
            <h1 className="text-xl font-semibold text-gray-900">Reflection Journal</h1>
            <p className="text-gray-500 text-sm">Write one thought to clear your mind</p>
          </div>
        </div>
      </div>

      <div className="px-6 space-y-6">
        {/* Mood Selector */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Today I feel</h3>
          <div className="flex justify-between gap-2">
            {moods.map((mood) => (
              <button
                key={mood.label}
                onClick={() => setSelectedMood(mood.label)}
                className={`flex flex-col items-center space-y-2 ${
                  selectedMood === mood.label ? 'opacity-100' : 'opacity-70'
                }`}
              >
                <div className={`w-16 h-16 rounded-full ${mood.color} flex items-center justify-center text-2xl border-2 ${
                  selectedMood === mood.label ? 'border-purple-400' : 'border-transparent'
                }`}>
                  {mood.emoji}
                </div>
                <span className="text-xs font-medium text-gray-700">{mood.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Journal Input */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Write your mind today ?</h3>
          <textarea
            value={currentEntry}
            onChange={(e) => setCurrentEntry(e.target.value)}
            placeholder="Today I feel..."
            className="w-full h-64 p-4 bg-white border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 resize-none"
          />
        </div>

        {/* Save Button */}
        <div className="pt-8">
          <button
            onClick={handleSaveReflection}
            className="w-full bg-purple-500 text-white font-semibold py-4 rounded-2xl hover:bg-purple-600 transition-colors"
          >
            Save Reflection
          </button>
        </div>
      </div>
    </div>
  )
}