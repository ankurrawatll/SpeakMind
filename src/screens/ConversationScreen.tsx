import { useState, useRef, useEffect } from 'react'
import type { Screen } from '../App'

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
  const [messages, setMessages] = useState<Msg[]>([
    { id: 1, text: 'How can I focus better during meditation?', isUser: true, timestamp: new Date(Date.now() - 60000) },
    { id: 2, text: "When you sit for meditation, don't try to fight your thoughts.\nJust let them pass, like clouds in the sky.\nBring your attention gently back to your breath.", isUser: false, timestamp: new Date(Date.now() - 50000) },
    { id: 3, text: 'Sometimes I still feel restless. What should I do?', isUser: true, timestamp: new Date(Date.now() - 30000) },
    { id: 4, text: 'Restlessness is natural in the beginning. Start with shorter meditations even 5 minutes.\nWith practice, your mind will settle on its own. 🌱', isUser: false, timestamp: new Date(Date.now() - 15000) }
  ])

  const listRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    // auto scroll to bottom
    listRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages])

  const handleSendMessage = () => {
    if (!message.trim()) return
    const m: Msg = { id: messages.length + 1, text: message.trim(), isUser: true, timestamp: new Date() }
    setMessages(prev => [...prev, m])
    setMessage('')

    // simulate reply
    setTimeout(() => {
      const reply: Msg = { id: messages.length + 2, text: "Thanks for sharing. Try a 3-minute grounding exercise: 3 deep breaths, notice 3 things around you.", isUser: false, timestamp: new Date() }
      setMessages(prev => [...prev, reply])
    }, 900)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 flex flex-col max-w-md mx-auto">
      {/* Header */}
      <div className="relative px-4 pt-12 pb-4 bg-white border-b border-gray-100">
        <div className="flex items-center justify-between">
          <button onClick={() => onNavigate?.('home')} className="w-10 h-10 flex items-center justify-center text-purple-500">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          <h2 className="text-xl font-semibold text-gray-900">Conversation</h2>

          <button className="w-10 h-10 flex items-center justify-center text-gray-600">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 px-4 py-6 overflow-y-auto bg-gray-50">
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

      {/* Input area */}
      <div className="px-4 pb-8 bg-white border-t border-gray-100">
        <div className="pt-4">
          <div className="flex items-center bg-gray-50 border border-gray-200 rounded-full px-4 py-3">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask anything"
              className="flex-1 bg-transparent text-gray-700 placeholder-gray-400 focus:outline-none text-sm"
            />
            <button 
              onClick={handleSendMessage} 
              className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center ml-3 hover:bg-purple-600 transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M2 21l21-9L2 3v7l15 2-15 2v7z" fill="white"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
