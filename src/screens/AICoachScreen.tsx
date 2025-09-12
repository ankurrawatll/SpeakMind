import type { Screen } from '../App'

interface AICoachScreenProps {
  onNavigate: (screen: Screen) => void
}

export default function AICoachScreen({ onNavigate }: AICoachScreenProps) {
  return (
    <div className="min-h-screen bg-light-bg pb-24">
      {/* Header */}
      <div className="gradient-bg px-6 pt-12 pb-8 rounded-b-5xl">
        <div className="flex items-center space-x-4 text-white">
          <button 
            onClick={() => onNavigate('home')}
            className="text-2xl"
          >
            ←
          </button>
          <h1 className="text-2xl font-bold">Midnight & Relaxation</h1>
        </div>
      </div>

      <div className="px-6 -mt-4">
        {/* Media Player */}
        <div className="card mb-6">
          <div className="text-center">
            <div className="text-8xl mb-6">🌙</div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Midnight & Relaxation</h2>
            <p className="text-gray-600 mb-6">A calming session to help you unwind</p>
            
            {/* Progress Bar */}
            <div className="bg-gray-200 rounded-full h-2 mb-4">
              <div className="bg-primary-purple rounded-full h-2 w-1/3"></div>
            </div>
            
            <div className="flex justify-between text-sm text-gray-500 mb-6">
              <span>3:45</span>
              <span>15:00</span>
            </div>
            
            {/* Player Controls */}
            <div className="flex items-center justify-center space-x-6">
              <button className="text-3xl text-primary-purple">⏮️</button>
              <button className="text-5xl text-primary-purple">⏸️</button>
              <button className="text-3xl text-primary-purple">⏭️</button>
            </div>
          </div>
        </div>

        {/* Session Info */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">About this session</h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            This relaxing meditation is designed to help you unwind and prepare for a peaceful night's sleep. 
            Focus on releasing the tension from your day and allowing your mind to settle into tranquility.
          </p>
        </div>
      </div>
    </div>
  )
}