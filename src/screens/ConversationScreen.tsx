import { useState } from 'react'
import type { Screen } from '../App'

interface ConversationScreenProps {
  onNavigate: (screen: Screen) => void
}

export default function ConversationScreen({ onNavigate }: ConversationScreenProps) {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "How can I focus better during meditation?",
      isUser: true,
      timestamp: new Date(Date.now() - 5000)
    },
    {
      id: 2,
      text: "Great question! Here are some effective techniques to improve focus during meditation:\n\n1. **Start with short sessions** - Begin with 5-10 minutes\n2. **Use guided meditations** - Let an instructor lead you\n3. **Focus on your breath** - This gives your mind an anchor\n4. **Don't judge wandering thoughts** - Simply notice and return to breath\n\nWould you like me to guide you through a quick focus exercise?",
      isUser: false,
      timestamp: new Date(Date.now() - 2000)
    }
  ])

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        id: messages.length + 1,
        text: message,
        isUser: true,
        timestamp: new Date()
      }
      
      setMessages([...messages, newMessage])
      setMessage('')
      
      // Simulate AI response
      setTimeout(() => {
        const aiResponse = {
          id: messages.length + 2,
          text: "I understand your concern. Let me help you with that. Can you tell me more about what specifically you're struggling with?",
          isUser: false,
          timestamp: new Date()
        }
        setMessages(prev => [...prev, aiResponse])
      }, 1000)
    }
  }

  return (
    <div className="min-h-screen bg-light-bg pb-24">
      {/* Header */}
      <div className="gradient-bg px-6 pt-12 pb-6 rounded-b-5xl">
        <div className="flex items-center space-x-4 text-white">
          <button 
            onClick={() => onNavigate('home')}
            className="text-2xl"
          >
            ←
          </button>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-lg">
              🤖
            </div>
            <div>
              <h1 className="text-lg font-semibold">AI Coach</h1>
              <p className="text-white/80 text-sm">Always here to help</p>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 px-6 py-4 space-y-4 pb-32">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs lg:max-w-md ${
              msg.isUser 
                ? 'chat-bubble-user' 
                : 'chat-bubble-ai'
            }`}>
              <p className="whitespace-pre-line">{msg.text}</p>
              <p className={`text-xs mt-2 ${
                msg.isUser ? 'text-white/70' : 'text-gray-500'
              }`}>
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 w-full max-w-md px-6">
        <div className="card p-4">
          <div className="flex space-x-3">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask anything..."
              className="flex-1 p-3 bg-gray-50 rounded-2xl border-2 border-gray-200 focus:border-primary-purple focus:outline-none"
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            
            <button className="w-12 h-12 bg-primary-purple/10 rounded-full flex items-center justify-center text-primary-purple text-xl">
              🎤
            </button>
            
            <button 
              onClick={handleSendMessage}
              className="w-12 h-12 bg-primary-purple rounded-full flex items-center justify-center text-white"
            >
              ➤
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}