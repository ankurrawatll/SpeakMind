import { useState, useRef, useEffect } from 'react'
import type { Screen } from '../App'
import { callGeminiAPI } from '../utils/geminiAPI'

interface ConversationScreenProps {
  onNavigate: (screen: Screen) => void
}

interface Msg {
  id: number
  text: string
  isUser: boolean
  timestamp: Date
}

export default function ConversationScreen({ onNavigate }: ConversationScreenProps) {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<Msg[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const messageIdRef = useRef(1)

  const listRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    // auto scroll to bottom
    listRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages])

  const handleSendMessage = async () => {
    if (!message.trim() || isLoading) return
    
    const userMsg: Msg = { 
      id: messageIdRef.current++, 
      text: message.trim(), 
      isUser: true, 
      timestamp: new Date() 
    }
    setMessages(prev => [...prev, userMsg])
    setMessage('')
    setIsLoading(true)
    
    try {
      const response = await callGeminiAPI(userMsg.text)
      
      const aiMsg: Msg = { 
        id: messageIdRef.current++, 
        text: response.text || 'Sorry, I could not process that request.', 
        isUser: false, 
        timestamp: new Date() 
      }
      setMessages(prev => [...prev, aiMsg])
    } catch (error) {
      console.error('Error getting AI response:', error)
      const errorMsg: Msg = { 
        id: messageIdRef.current++, 
        text: 'Sorry, there was an error processing your message. Please try again.', 
        isUser: false, 
        timestamp: new Date() 
      }
      setMessages(prev => [...prev, errorMsg])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 flex flex-col max-w-md mx-auto">
      {/* Header */}
      <div className="relative px-4 pt-12 pb-4 bg-white border-b border-gray-100">
        <div className="flex items-center justify-between gap-2">
          <button 
            onClick={() => onNavigate?.('home')} 
            className="w-10 h-10 flex items-center justify-center text-purple-500 flex-shrink-0"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          <h2 className="text-xl font-semibold text-gray-900 flex-1 text-center">Conversation</h2>

          <div className="flex items-center gap-1 flex-shrink-0">
            {/* Translate button placeholder - if you have a translate feature, add it here */}
            <button 
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              title="Translate"
            >
              <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" className="w-5 h-5 text-gray-700" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                <path d="M478.33 433.6l-90-218a22 22 0 00-40.67 0l-90 218a22 22 0 1040.67 16.79L316.66 406h102.67l18.33 44.39A22 22 0 00458 464a22 22 0 0020.32-30.4zM334.83 362L368 281.65 401.17 362zm-66.99-19.08a22 22 0 00-4.89-30.7c-.2-.15-15-11.13-36.49-34.73 39.65-53.68 62.11-114.75 71.27-143.49H330a22 22 0 000-44H214V70a22 22 0 00-44 0v20H54a22 22 0 000 44h197.25c-9.52 26.95-27.05 69.5-53.79 108.36-31.41-41.68-43.08-68.65-43.17-68.87a22 22 0 00-40.58 17c.58 1.38 14.55 34.23 52.86 83.93.92 1.19 1.83 2.35 2.74 3.51-39.24 44.35-77.74 71.86-93.85 80.74a22 22 0 1021.07 38.63c2.16-1.18 48.6-26.89 101.63-85.59 22.52 24.08 38 35.44 38.93 36.1a22 22 0 0030.75-4.9z"></path>
              </svg>
            </button>
            
            {/* Voice session button */}
            <button 
              onClick={() => onNavigate('voiceSession')}
              className="p-2 hover:bg-purple-50 rounded-full transition-colors"
              title="Start voice session"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-purple-600">
                <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
                <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 px-4 py-6 overflow-y-auto bg-gray-50">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center px-6">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-3xl">✨</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Welcome to Mindful Guide</h3>
            <p className="text-sm text-gray-600 mb-6">
              Start a conversation with your AI wellness coach
            </p>
            
            {/* Voice Session Button */}
            <button
              onClick={() => onNavigate('voiceSession')}
              className="flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 mb-4"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
                <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
              </svg>
              <div className="text-left">
                <div className="font-semibold">Start Voice Session</div>
                <div className="text-xs text-purple-100">Immersive audio experience</div>
              </div>
            </button>

            <div className="text-xs text-gray-500">or type a message below</div>
          </div>
        )}
        <div className="space-y-6">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex items-end gap-3 ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
              {!msg.isUser && (
                <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
                  ✨
                </div>
              )}

              <div className={`max-w-[280px] px-4 py-3 rounded-2xl relative ${
                msg.isUser 
                  ? 'bg-purple-100 text-gray-900 rounded-br-sm' 
                  : 'bg-white text-gray-900 rounded-bl-sm shadow-sm border border-gray-100'
              }`}>
                <div className="text-sm leading-relaxed whitespace-pre-line">{msg.text}</div>
              </div>

              {msg.isUser && (
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
                  <div className="w-8 h-8 bg-gray-400 rounded-full"></div>
                </div>
              )}
            </div>
          ))}

          <div ref={listRef} />
        </div>
      </div>

      {/* Voice Session Button - Always Visible */}
      <div className="px-4 py-3 bg-white border-t border-gray-100">
        <button
          onClick={() => onNavigate('voiceSession')}
          className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
            <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
          </svg>
          <div className="text-left">
            <div className="font-semibold text-base">Start Voice Session</div>
            <div className="text-xs text-purple-100">Immersive audio experience</div>
          </div>
        </button>
      </div>

      {/* Input area */}
      <div className="px-4 pb-8 bg-white border-t border-gray-100">
        <div className="pt-4">
          <div className="flex items-center bg-gray-50 border border-gray-200 rounded-full px-4 py-3">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
              placeholder="Type a message..."
              disabled={isLoading}
              className="flex-1 bg-transparent text-gray-700 placeholder-gray-400 focus:outline-none text-sm disabled:opacity-50"
            />
            <button 
              onClick={handleSendMessage} 
              disabled={isLoading || !message.trim()}
              className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center ml-3 hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M2 21l21-9L2 3v7l15 2-15 2v7z" fill="white"/>
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
