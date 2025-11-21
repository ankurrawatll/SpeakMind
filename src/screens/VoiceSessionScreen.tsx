import React, { useState } from 'react'
import { useGeminiLive } from '../hooks/useGeminiLive'
import AmbientBackground from '../components/AmbientBackground'
import Visualizer from '../components/Visualizer'
import type { Screen } from '../App'

interface VoiceSessionScreenProps {
  onNavigate: (screen: Screen) => void
}

const VoiceSessionScreen: React.FC<VoiceSessionScreenProps> = ({ onNavigate }) => {
  const { connect, disconnect, status, error, volume } = useGeminiLive()
  const [isMuted, setIsMuted] = useState(false)

  const toggleConnection = () => {
    if (status === 'connected' || status === 'connecting') {
      disconnect()
    } else {
      connect()
    }
  }

  const getStatusMessage = () => {
    switch (status) {
      case 'connected': return 'Listening...'
      case 'connecting': return 'Connecting to Mindful Guide...'
      case 'error': return 'Connection failed'
      default: return 'Ready to begin'
    }
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-between p-4 md:p-6 text-white overflow-hidden font-sans selection:bg-purple-500/30">
      <AmbientBackground />

      {/* Header */}
      <header className="z-10 w-full max-w-4xl flex items-center justify-between mt-4 md:mt-8">
        <button 
          onClick={() => {
            disconnect()
            onNavigate('home')
          }}
          className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center text-purple-200 hover:text-white transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="md:w-6 md:h-6">
            <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        <div className="text-center">
          <h1 className="text-2xl md:text-3xl font-light tracking-wider text-purple-100">Mindful Guide</h1>
          <p className="text-xs md:text-sm text-purple-300/80 mt-0.5 md:mt-1 font-light">Voice Session</p>
        </div>

        <div className="w-8 md:w-10" />
      </header>

      {/* Main Visualizer Area */}
      <main className="z-10 flex-1 flex flex-col items-center justify-center w-full">
        <Visualizer volume={volume} status={status} />
        
        <div className="mt-6 md:mt-8 text-center h-8">
          <p className={`text-base md:text-lg font-light tracking-wide transition-opacity duration-500 ${
            status === 'connected' ? 'text-purple-100' : 'text-slate-400'
          }`}>
            {getStatusMessage()}
          </p>
          {error && (
            <p className="text-xs md:text-sm text-red-400 mt-1 md:mt-2">{error}</p>
          )}
        </div>
      </main>

      {/* Controls */}
      <footer className="z-10 w-full max-w-4xl mb-4 md:mb-8">
        <div className="flex items-center justify-center gap-4 md:gap-8 p-4 md:p-6 rounded-2xl md:rounded-3xl bg-white/5 backdrop-blur-lg border border-white/10 shadow-2xl">
          
          {/* Mute Button */}
          <button 
            onClick={() => setIsMuted(!isMuted)}
            disabled={status !== 'connected'}
            className={`p-3 md:p-4 rounded-full transition-all duration-300 ${
              status !== 'connected' ? 'opacity-30 cursor-not-allowed' : 
              isMuted ? 'bg-red-500/20 text-red-200' : 'hover:bg-white/10 text-purple-100'
            }`}
            aria-label="Mute Microphone"
          >
            {isMuted ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 md:w-6 md:h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 9.75 19.5 12m0 0 2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6 4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 md:w-6 md:h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" />
              </svg>
            )}
          </button>

          {/* Main Action Button */}
          <button
            onClick={toggleConnection}
            className={`w-16 h-16 md:w-20 md:h-20 flex items-center justify-center rounded-full shadow-lg transition-all duration-500 transform hover:scale-105 active:scale-95 ${
              status === 'connected' 
                ? 'bg-red-500/80 hover:bg-red-600 text-white shadow-red-900/30' 
                : status === 'connecting'
                ? 'bg-purple-500/50 cursor-wait text-purple-100'
                : 'bg-purple-600 hover:bg-purple-500 text-white shadow-purple-900/50'
            }`}
          >
            {status === 'connected' ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 md:w-6 md:h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 7.5A2.25 2.25 0 0 1 7.5 5.25h9a2.25 2.25 0 0 1 2.25 2.25v9a2.25 2.25 0 0 1-2.25 2.25h-9a2.25 2.25 0 0 1-2.25-2.25v-9Z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 md:w-6 md:h-6 ml-0.5 md:ml-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
              </svg>
            )}
          </button>

          {/* Info Button */}
          <button 
            className="p-3 md:p-4 rounded-full hover:bg-white/10 text-purple-100 transition-all duration-300 opacity-50 hover:opacity-100"
            title="About"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 md:w-6 md:h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
            </svg>
          </button>

        </div>
      </footer>
    </div>
  )
}

export default VoiceSessionScreen
