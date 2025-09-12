import { useState, useEffect, useRef } from 'react'
import type { Screen } from '../App'

interface EmotionalReleaseScreenProps {
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

interface BreathingSession {
  duration: number // in minutes
  xp: number
  label: string
  icon: string
}

type SessionState = 'selection' | 'active' | 'paused' | 'completed'

export default function EmotionalReleaseScreen({ onNavigate, user: _user }: EmotionalReleaseScreenProps) {
  const [sessionState, setSessionState] = useState<SessionState>('selection')
  const [selectedSession, setSelectedSession] = useState<BreathingSession | null>(null)
  const [timeRemaining, setTimeRemaining] = useState(0) // in seconds
  const [isBreathingIn, setIsBreathingIn] = useState(true)
  const [breathCycle, setBreathCycle] = useState(0)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  
  const timerRef = useRef<number | null>(null)
  const breathingRef = useRef<number | null>(null)

  const breathingSessions: BreathingSession[] = [
    { duration: 1, xp: 5, label: '1 Minute', icon: '🌱' },
    { duration: 3, xp: 10, label: '3 Minutes', icon: '🌿' },
    { duration: 5, xp: 10, label: '5 Minutes', icon: '🍃' },
    { duration: 10, xp: 15, label: '10 Minutes', icon: '🌳' }
  ]

  const breathingTips = [
    "Follow the circle as it expands and contracts",
    "Inhale slowly as the circle grows larger",
    "Exhale gently as the circle shrinks",
    "Focus on releasing tension with each breath",
    "Let your mind be present in this moment"
  ]

  useEffect(() => {
    // Cleanup timers on unmount
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      if (breathingRef.current) clearInterval(breathingRef.current)
    }
  }, [])

  useEffect(() => {
    if (sessionState === 'active' && timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleSessionComplete()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [sessionState, timeRemaining])

  useEffect(() => {
    if (sessionState === 'active') {
      // Breathing animation cycle: 4s in, 4s out
      breathingRef.current = setInterval(() => {
        setIsBreathingIn(prev => !prev)
        setBreathCycle(prev => prev + 1)
      }, 4000)
    } else {
      if (breathingRef.current) {
        clearInterval(breathingRef.current)
        breathingRef.current = null
      }
    }

    return () => {
      if (breathingRef.current) clearInterval(breathingRef.current)
    }
  }, [sessionState])

  const startSession = (session: BreathingSession) => {
    setSelectedSession(session)
    setTimeRemaining(session.duration * 60) // Convert to seconds
    setSessionState('active')
    setIsBreathingIn(true)
    setBreathCycle(0)
  }

  const pauseSession = () => {
    setSessionState('paused')
  }

  const resumeSession = () => {
    setSessionState('active')
  }

  const stopSession = () => {
    setSessionState('selection')
    setSelectedSession(null)
    setTimeRemaining(0)
  }

  const handleSessionComplete = () => {
    setSessionState('completed')
    
    // Simulate API call for logging session
    setTimeout(() => {
      if (selectedSession) {
        const xpEarned = selectedSession.xp
        setToastMessage(`🎉 +${xpEarned} XP earned! Breathing session completed.`)
        setShowToast(true)
        
        // Hide toast after 3 seconds
        setTimeout(() => setShowToast(false), 3000)
      }
    }, 500)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const BreathingAnimation = () => (
    <div className="flex items-center justify-center mb-8">
      <div className="relative">
        <div 
          className={`w-48 h-48 rounded-full bg-gradient-to-br from-primary-purple to-primary-pink transition-all duration-4000 ease-in-out ${
            isBreathingIn ? 'scale-100 opacity-80' : 'scale-75 opacity-60'
          }`}
          style={{
            transitionDuration: '4000ms',
            boxShadow: isBreathingIn 
              ? '0 0 50px rgba(157, 124, 243, 0.6)' 
              : '0 0 20px rgba(157, 124, 243, 0.3)'
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <div className="text-lg font-semibold mb-1">
              {isBreathingIn ? 'Breathe In' : 'Breathe Out'}
            </div>
            <div className="text-sm opacity-90">
              {isBreathingIn ? 'Inhale slowly' : 'Exhale gently'}
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  if (sessionState === 'selection') {
    return (
      <div className="min-h-screen bg-light-bg pb-24">
        {/* Header */}
        <div className="gradient-bg px-6 pt-12 pb-6 rounded-b-5xl">
          <div className="flex items-center justify-between mb-4">
            <button 
              onClick={() => onNavigate('home')}
              className="text-white/80 hover:text-white"
            >
              ← Back
            </button>
            <h1 className="text-xl font-bold text-white">Emotional Release</h1>
            <div></div>
          </div>
        </div>

        <div className="px-6 -mt-4">
          {/* Description Card */}
          <div className="card mb-6">
            <div className="text-center">
              <div className="text-4xl mb-4">🫁</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Guided Breathing</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Release stress and tension through mindful breathing exercises. 
                Choose your session duration and let the gentle guide help you find calm.
              </p>
            </div>
          </div>

          {/* Session Options */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Choose Your Session</h3>
            <div className="grid grid-cols-2 gap-3">
              {breathingSessions.map((session) => (
                <div
                  key={session.duration}
                  className="card p-4 cursor-pointer transition-transform active:scale-95 text-center"
                  onClick={() => startSession(session)}
                >
                  <div className="text-3xl mb-2">{session.icon}</div>
                  <h4 className="font-semibold text-gray-800 mb-1">{session.label}</h4>
                  <p className="text-xs text-gray-600 mb-2">Guided breathing</p>
                  <p className="text-xs text-green-600 font-medium">+{session.xp} XP</p>
                </div>
              ))}
            </div>
          </div>

          {/* Tips */}
          <div className="card">
            <h3 className="font-semibold text-gray-800 mb-4">🌸 Breathing Tips</h3>
            <div className="space-y-2">
              {breathingTips.map((tip, index) => (
                <div key={index} className="text-sm text-gray-600 leading-relaxed">
                  • {tip}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (sessionState === 'completed') {
    return (
      <div className="min-h-screen bg-light-bg pb-24">
        {/* Header */}
        <div className="gradient-bg px-6 pt-12 pb-6 rounded-b-5xl">
          <div className="flex items-center justify-between mb-4">
            <button 
              onClick={() => onNavigate('home')}
              className="text-white/80 hover:text-white"
            >
              ← Back
            </button>
            <h1 className="text-xl font-bold text-white">Session Complete</h1>
            <div></div>
          </div>
        </div>

        <div className="px-6 -mt-4">
          {/* Completion Card */}
          <div className="card mb-6 text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Well Done!</h3>
            <p className="text-gray-600 mb-4">
              You completed a {selectedSession?.label.toLowerCase()} breathing session
            </p>
            <div className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-4">
              <div className="text-green-600 font-semibold">
                +{selectedSession?.xp} XP Earned
              </div>
              <div className="text-sm text-green-600 mt-1">
                Total breaths: ~{Math.floor((selectedSession?.duration || 1) * 7.5)}
              </div>
            </div>
          </div>

          {/* Session Summary */}
          <div className="card mb-6">
            <h3 className="font-semibold text-gray-800 mb-4">Session Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Duration</span>
                <span className="font-medium">{selectedSession?.label}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">XP Earned</span>
                <span className="font-medium text-green-600">+{selectedSession?.xp}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Breath Cycles</span>
                <span className="font-medium">{Math.floor(breathCycle / 2)}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => setSessionState('selection')}
              className="btn-primary w-full"
            >
              Start Another Session
            </button>
            <button
              onClick={() => onNavigate('home')}
              className="btn-secondary w-full"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Active or Paused Session
  return (
    <div className="min-h-screen bg-light-bg pb-24">
      {/* Header */}
      <div className="gradient-bg px-6 pt-12 pb-6 rounded-b-5xl">
        <div className="flex items-center justify-between mb-4">
          <button 
            onClick={stopSession}
            className="text-white/80 hover:text-white"
          >
            ✕ Stop
          </button>
          <h1 className="text-xl font-bold text-white">Breathing Session</h1>
          <div className="text-white/80 text-sm">
            {selectedSession?.label}
          </div>
        </div>
      </div>

      <div className="px-6 -mt-4">
        {/* Timer */}
        <div className="card mb-6 text-center">
          <div className="text-4xl font-bold text-gray-800 mb-2 font-mono">
            {formatTime(timeRemaining)}
          </div>
          <p className="text-sm text-gray-600">
            {sessionState === 'paused' ? 'Session Paused' : 'Time Remaining'}
          </p>
        </div>

        {/* Breathing Animation */}
        {sessionState === 'active' && <BreathingAnimation />}
        
        {sessionState === 'paused' && (
          <div className="text-center mb-8">
            <div className="w-48 h-48 mx-auto rounded-full bg-gray-200 flex items-center justify-center">
              <div className="text-gray-500">
                <div className="text-2xl mb-2">⏸️</div>
                <div className="text-sm">Session Paused</div>
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="card mb-6 text-center">
          <h3 className="font-semibold text-gray-800 mb-3">
            {sessionState === 'active' ? 'Focus on Your Breath' : 'Session Paused'}
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            {sessionState === 'active' 
              ? isBreathingIn 
                ? 'Inhale slowly and deeply, letting your belly expand'
                : 'Exhale gently, releasing all tension and stress'
              : 'Take your time. Resume when you\'re ready to continue.'
            }
          </p>
        </div>

        {/* Controls */}
        <div className="flex space-x-3">
          {sessionState === 'active' ? (
            <button
              onClick={pauseSession}
              className="btn-secondary flex-1"
            >
              ⏸️ Pause
            </button>
          ) : (
            <button
              onClick={resumeSession}
              className="btn-primary flex-1"
            >
              ▶️ Resume
            </button>
          )}
          <button
            onClick={stopSession}
            className="btn-secondary px-6"
          >
            ⏹️ Stop
          </button>
        </div>
      </div>

      {/* Success Toast */}
      {showToast && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 toast-enter">
          <div className="flex items-center space-x-2">
            <span>✨</span>
            <span className="font-medium">{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  )
}