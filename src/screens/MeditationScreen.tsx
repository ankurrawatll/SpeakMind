import { useState } from 'react'
import type { Screen } from '../App'

interface MeditationScreenProps {
  onNavigate: (screen: Screen) => void
}

export default function MeditationScreen({ onNavigate }: MeditationScreenProps) {
  const [selectedMinutes, setSelectedMinutes] = useState(20)
  
  const timeOptions = [3, 5, 10, 20, 30, 40, 50]

  const handleTimeSelect = (minutes: number) => {
    setSelectedMinutes(minutes)
  }

  const handleStartMeditation = () => {
    onNavigate('timer')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pb-24">
      {/* Header */}
      <div className="text-center pt-16 pb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Meditation</h1>
        
        {/* Sun/Moon Illustration */}
        <div className="mx-auto mb-6 px-6">
          <img 
            src="/AppClip.png" 
            alt="Meditation illustration" 
            className="w-full max-w-xs mx-auto rounded-2xl shadow-lg"
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-6">
        <div className="max-w-sm mx-auto">
          <h3 className="text-lg font-medium text-gray-700 mb-6 text-center">Select mins</h3>
          
          {/* Time Options */}
          <div className="flex justify-center gap-3 mb-8 flex-wrap">
            {timeOptions.map((minutes) => (
              <button
                key={minutes}
                onClick={() => handleTimeSelect(minutes)}
                className={`w-12 h-12 rounded-full text-lg font-semibold transition-all duration-200 ${
                  selectedMinutes === minutes
                    ? 'bg-gradient-to-b from-purple-400 to-purple-600 text-white shadow-lg transform scale-110'
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                {minutes}
              </button>
            ))}
          </div>

          {/* Modern Slider */}
          <div className="relative mb-16 px-4">
            <div className="w-full h-3 bg-gradient-to-r from-purple-100 to-purple-200 rounded-full">
              <div 
                className="h-3 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full relative transition-all duration-300"
                style={{ width: `${(selectedMinutes / 50) * 100}%` }}
              >
                <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-7 h-7 bg-gradient-to-b from-purple-400 to-purple-600 rounded-full border-3 border-white shadow-xl flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              </div>
            </div>
            
            {/* Time indicator */}
            <div className="flex justify-center mt-4">
              <div className="bg-white px-4 py-2 rounded-full shadow-md border border-gray-100">
                <span className="text-purple-600 font-semibold">{selectedMinutes} min</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Let's Go Button - Fixed at bottom with padding for navbar */}
      <div className="px-6 pb-6">
        <div className="max-w-sm mx-auto">
          <button
            onClick={handleStartMeditation}
            className="w-full bg-gradient-to-r from-[#A78BFA] to-[#C4B5FD] text-white text-lg font-semibold py-4 rounded-2xl hover:from-purple-600 hover:to-purple-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Let's Go
          </button>
        </div>
      </div>
    </div>
  )
}
