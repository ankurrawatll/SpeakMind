import { useState, useEffect, useRef } from 'react'
import type { Screen } from '../App'

interface MindCoachScreenProps {
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

interface ChatMessage {
  id: string
  type: 'user' | 'coach'
  content: string
  timestamp: Date
  hasAudio?: boolean
  isTyping?: boolean
}

type CoachMode = 'voice' | 'text'

export default function MindCoachScreen({ onNavigate, user }: MindCoachScreenProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputText, setInputText] = useState('')
  const [isCoachTyping, setIsCoachTyping] = useState(false)
  const [coachMode, setCoachMode] = useState<CoachMode>('voice')
  const [sessionTime, setSessionTime] = useState(0)
  const [isCoachSpeaking, setIsCoachSpeaking] = useState(false)
  
  const chatScrollRef = useRef<HTMLDivElement>(null)
  const sessionTimerRef = useRef<number | null>(null)
  
  // TODO: Heygen Avatar Integration Refs (uncomment when implementing)
  // const heygenVideoRef = useRef<HTMLVideoElement>(null)
  // const heygenIframeRef = useRef<HTMLIFrameElement>(null)
  // const [isAvatarLoaded, setIsAvatarLoaded] = useState(false)
  // const [avatarError, setAvatarError] = useState(false)

  const quickSuggestions = [
    "I feel stressed 😰",
    "Need focus tips 🎯", 
    "Help me relax 😌",
    "I'm anxious 💭"
  ]

  const initialMessages: ChatMessage[] = [
    {
      id: '1',
      type: 'coach',
      content: `Hello ${user.name}! I'm your personal mind coach. I'm here to help you with stress, anxiety, focus, and emotional well-being. How are you feeling today?`,
      timestamp: new Date(),
      hasAudio: true
    }
  ]

  useEffect(() => {
    // Initialize with welcome message
    setMessages(initialMessages)
    
    // Start session timer
    sessionTimerRef.current = window.setInterval(() => {
      setSessionTime(prev => prev + 1)
    }, 1000)

    // Simulate coach speaking for welcome message
    setIsCoachSpeaking(true)
    setTimeout(() => setIsCoachSpeaking(false), 3000)

    return () => {
      if (sessionTimerRef.current) {
        clearInterval(sessionTimerRef.current)
      }
    }
  }, [user.name])

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight
    }
  }, [messages, isCoachTyping])

  const sendMessage = (content: string) => {
    if (!content.trim()) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: content.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputText('')
    
    // Show coach typing indicator
    setIsCoachTyping(true)
    
    // Simulate coach response after delay
    setTimeout(() => {
      const coachResponse = generateCoachResponse(content.trim())
      const coachMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'coach',
        content: coachResponse,
        timestamp: new Date(),
        hasAudio: coachMode === 'voice'
      }
      
      setMessages(prev => [...prev, coachMessage])
      setIsCoachTyping(false)
      
      // TODO: Integrate with Heygen Avatar for voice responses
      if (coachMode === 'voice') {
        setIsCoachSpeaking(true)
        // await speakWithAvatar(coachResponse) // Uncomment when implementing Heygen
        setTimeout(() => setIsCoachSpeaking(false), 2000) // Remove when using real avatar
      }
    }, 1500 + Math.random() * 1000)
  }

  const generateCoachResponse = (userInput: string): string => {
    const input = userInput.toLowerCase()
    
    if (input.includes('stress') || input.includes('stressed')) {
      return "I understand you're feeling stressed. Let's start with a simple breathing exercise. Take a deep breath in for 4 counts, hold for 4, then exhale for 6. This activates your parasympathetic nervous system and helps reduce stress hormones."
    }
    
    if (input.includes('focus') || input.includes('concentration')) {
      return "Focus challenges are common in our busy world. Try the 25-minute Pomodoro technique: work intensely for 25 minutes, then take a 5-minute break. Also, minimize distractions and start with just one task at a time."
    }
    
    if (input.includes('anxious') || input.includes('anxiety')) {
      return "Anxiety can feel overwhelming, but remember - you're safe right now. Try the 5-4-3-2-1 grounding technique: name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, and 1 you taste. This brings you back to the present moment."
    }
    
    if (input.includes('relax') || input.includes('calm')) {
      return "Creating calm is a beautiful intention. Progressive muscle relaxation works wonders - tense each muscle group for 5 seconds, then release. Start with your toes and work up to your head. Feel the contrast between tension and relaxation."
    }
    
    if (input.includes('sleep') || input.includes('tired')) {
      return "Good sleep is foundational to mental health. Create a wind-down routine 1 hour before bed: dim lights, avoid screens, try gentle stretching or reading. Your bedroom should be cool, dark, and quiet for optimal rest."
    }
    
    if (input.includes('motivation') || input.includes('motivated')) {
      return "Motivation comes and goes, but systems create lasting change. Break your goals into tiny, manageable steps. Celebrate small wins - they compound into major transformations. What's one small step you could take today?"
    }
    
    // Default responses
    const defaultResponses = [
      "That's a valuable insight. Tell me more about what you're experiencing - the more specific you can be, the better I can help guide you.",
      "I hear you. These feelings are valid and normal. Let's explore some techniques that might help you feel more centered and balanced.",
      "Thank you for sharing that with me. Building awareness of our thoughts and feelings is the first step toward positive change. What would feel most helpful right now?",
      "It takes courage to reach out for support. You're taking an important step in your mental wellness journey. How would you like to work through this together?"
    ]
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)]
  }

  const formatSessionTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const playAudioMessage = (messageId: string) => {
    // Simulate audio playback
    setIsCoachSpeaking(true)
    setTimeout(() => setIsCoachSpeaking(false), 2000)
    console.log('Playing audio for message:', messageId)
  }

  // TODO: Heygen Avatar Integration Helper Functions
  // Uncomment and implement when integrating Heygen Avatar
  
  /*
  const initializeHeygenAvatar = async () => {
    try {
      // Initialize Heygen Avatar
      // setIsAvatarLoaded(true)
      // setAvatarError(false)
    } catch (error) {
      console.error('Failed to initialize Heygen Avatar:', error)
      // setAvatarError(true)
    }
  }

  const speakWithAvatar = async (text: string) => {
    try {
      setIsCoachSpeaking(true)
      // Send text to Heygen Avatar for speech
      // await heygenAPI.speak(text)
      // Monitor speaking completion
    } catch (error) {
      console.error('Avatar speaking error:', error)
      setIsCoachSpeaking(false)
    }
  }

  const handleAvatarLoadComplete = () => {
    setIsAvatarLoaded(true)
    setAvatarError(false)
  }

  const handleAvatarError = () => {
    setIsAvatarLoaded(false)
    setAvatarError(true)
  }
  */

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/5 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-10 w-16 h-16 bg-purple-400/10 rounded-full animate-bounce"></div>
        <div className="absolute bottom-40 left-5 w-12 h-12 bg-pink-400/10 rounded-full animate-pulse"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between p-6 pt-12">
        <button 
          onClick={() => onNavigate('home')}
          className="text-white/80 hover:text-white transition-colors"
        >
          ← Back
        </button>
        <h1 className="text-xl font-bold">Mind Coach</h1>
        <div className="flex items-center space-x-2">
          <span className="text-orange-400">🔥</span>
          <span className="text-sm font-medium">{user.streak}d</span>
        </div>
      </div>

      {/* Avatar Video Section - Heygen Integration Ready */}
      <div className="relative z-10 px-6 mb-4">
        <div className="relative aspect-video bg-black/20 rounded-3xl overflow-hidden backdrop-blur-sm border border-white/10">
          {/* Heygen Avatar Container - Ready for Integration */}
          <div className="absolute inset-0 w-full h-full">
            {/* 
              TODO: Replace this placeholder with Heygen Avatar
              
              Integration Example:
              <iframe 
                src="YOUR_HEYGEN_AVATAR_URL"
                className="w-full h-full"
                frameBorder="0"
                allow="microphone; camera"
              />
              
              OR
              
              <video 
                ref={heygenVideoRef}
                className="w-full h-full object-cover"
                autoPlay
                muted={!isCoachSpeaking}
              />
            */}
            
            {/* Placeholder Content - Remove when integrating Heygen */}
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-purple-800/50 to-pink-800/50">
              <div className="text-center">
                {/* Heygen Avatar Placeholder */}
                <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-purple-400/30 to-pink-400/30 rounded-full flex items-center justify-center border-2 border-white/20">
                  <div className="text-3xl">🎭</div>
                </div>
                <div className="text-white/60 text-sm">Heygen Avatar Space</div>
                <div className="text-white/40 text-xs mt-1">Ready for Integration</div>
              </div>
            </div>
          </div>

          {/* Coach Status Overlay */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
            <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full backdrop-blur-md border transition-all ${
              isCoachSpeaking 
                ? 'bg-green-500/20 border-green-400/40 text-green-300' 
                : 'bg-black/30 border-white/20 text-white/80'
            }`}>
              <div className={`w-2 h-2 rounded-full ${isCoachSpeaking ? 'bg-green-400 animate-pulse' : 'bg-white/50'}`}></div>
              <span className="text-sm font-medium">
                {isCoachSpeaking ? 'Coach is speaking...' : 'Coach is listening'}
              </span>
            </div>
          </div>

          {/* Mode Toggle - Top Right */}
          <div className="absolute top-4 right-4">
            <div className="flex bg-black/30 rounded-full p-1 backdrop-blur-md border border-white/10">
              <button
                onClick={() => setCoachMode('voice')}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                  coachMode === 'voice' 
                    ? 'bg-white text-purple-900 shadow-lg' 
                    : 'text-white/70 hover:text-white'
                }`}
              >
                🎵 Voice
              </button>
              <button
                onClick={() => setCoachMode('text')}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                  coachMode === 'text' 
                    ? 'bg-white text-purple-900 shadow-lg' 
                    : 'text-white/70 hover:text-white'
                }`}
              >
                💬 Text
              </button>
            </div>
          </div>

          {/* Session Timer - Top Left */}
          <div className="absolute top-4 left-4">
            <div className="bg-black/30 px-3 py-2 rounded-full backdrop-blur-md border border-white/10">
              <span className="text-xs font-medium text-white">⏱️ {formatSessionTime(sessionTime)}</span>
            </div>
          </div>

          {/* Heygen Integration Notes Overlay (Development Only) */}
          <div className="absolute top-1/2 right-4 transform -translate-y-1/2">
            <div className="bg-blue-500/10 border border-blue-400/20 rounded-lg p-2 backdrop-blur-sm max-w-xs">
              <div className="text-blue-300 text-xs font-medium mb-1">🔧 Heygen Integration Notes:</div>
              <ul className="text-blue-200/80 text-xs space-y-1">
                <li>• Full container ready for iframe/video</li>
                <li>• Aspect ratio: 16:9 optimized</li>
                <li>• Status indicators integrated</li>
                <li>• Audio sync with isCoachSpeaking</li>
                <li>• Responsive design maintained</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Section */}
      <div className="relative z-10 flex-1 flex flex-col">
        {/* Messages */}
        <div 
          ref={chatScrollRef}
          className="flex-1 px-6 pb-4 overflow-y-auto max-h-64 space-y-4"
        >
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[75%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                {message.type === 'coach' && (
                  <div className="flex items-center space-x-2 mb-1">
                    <div className="w-6 h-6 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                      <span className="text-xs">🧠</span>
                    </div>
                    <span className="text-xs text-white/60">Mind Coach</span>
                  </div>
                )}
                
                <div className={`p-4 rounded-2xl ${
                  message.type === 'user'
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-br-lg'
                    : 'bg-white/10 backdrop-blur-sm text-white border border-white/10 rounded-bl-lg'
                }`}>
                  <p className="text-sm leading-relaxed">{message.content}</p>
                  
                  {message.hasAudio && message.type === 'coach' && (
                    <button
                      onClick={() => playAudioMessage(message.id)}
                      className="mt-2 flex items-center space-x-1 text-xs text-white/70 hover:text-white transition-colors"
                    >
                      <span>🔊</span>
                      <span>Play audio</span>
                    </button>
                  )}
                </div>
                
                <div className={`text-xs text-white/40 mt-1 ${
                  message.type === 'user' ? 'text-right' : 'text-left'
                }`}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}
          
          {/* Typing Indicator */}
          {isCoachTyping && (
            <div className="flex justify-start">
              <div className="max-w-[75%]">
                <div className="flex items-center space-x-2 mb-1">
                  <div className="w-6 h-6 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                    <span className="text-xs">🧠</span>
                  </div>
                  <span className="text-xs text-white/60">Mind Coach</span>
                </div>
                <div className="bg-white/10 backdrop-blur-sm border border-white/10 p-4 rounded-2xl rounded-bl-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Suggestions */}
        <div className="px-6 py-2">
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {quickSuggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => sendMessage(suggestion)}
                className="flex-shrink-0 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-sm text-white/80 hover:text-white hover:bg-white/20 transition-all"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>

        {/* Input Area */}
        <div className="px-6 pb-6">
          <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full p-2">
            <button className="p-2 text-white/60 hover:text-white transition-colors">
              🎤
            </button>
            
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage(inputText)}
              placeholder="Type your message here..."
              className="flex-1 bg-transparent text-white placeholder-white/50 text-sm focus:outline-none"
            />
            
            <button
              onClick={() => sendMessage(inputText)}
              disabled={!inputText.trim()}
              className={`p-2 rounded-full transition-all ${
                inputText.trim()
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600'
                  : 'text-white/40 cursor-not-allowed'
              }`}
            >
              ➤
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}