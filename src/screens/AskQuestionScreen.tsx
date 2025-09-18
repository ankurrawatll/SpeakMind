import { useState } from 'react'
import type { Screen } from '../App'
import { callGeminiAPI } from '../utils/geminiAPI'

interface AskQuestionScreenProps {
  onNavigate: (screen: Screen) => void
}

export default function AskQuestionScreen({ onNavigate }: AskQuestionScreenProps) {
  const [question, setQuestion] = useState('')
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [aiResponse, setAiResponse] = useState('')
  const [showResponse, setShowResponse] = useState(false)

  const faqs = [
    {
      id: 1,
      question: "How can I start my meditation journey?",
      answer: "Begin with just 5 minutes a day. Choose a quiet space, sit comfortably, and focus on your breath. Our guided sessions will help you build this habit gradually."
    },
    {
      id: 2,
      question: "What's the best time to meditate?",
      answer: "The best time is when you can be consistent. Many find morning meditation helps set a positive tone for the day, while evening sessions can help with relaxation and sleep."
    },
    {
      id: 3,
      question: "How do I deal with racing thoughts?",
      answer: "Racing thoughts are normal! Don't fight them. Acknowledge them gently and return your focus to your breath. With practice, you'll find it easier to observe thoughts without getting caught up in them."
    },
    {
      id: 4,
      question: "Can meditation help with anxiety?",
      answer: "Yes! Regular meditation practice can help reduce anxiety by teaching you to observe your thoughts and feelings without being overwhelmed by them. It promotes a sense of calm and centeredness."
    }
  ]

  const handleSubmitQuestion = async () => {
    if (question.trim()) {
      setIsLoading(true)
      setShowResponse(false)
      
      try {
        const response = await callGeminiAPI(question.trim())
        
        if (response.success && response.text) {
          setAiResponse(response.text)
          setShowResponse(true)
          setQuestion('')
        } else {
          setAiResponse(response.error || 'Unable to get response. Please try again.')
          setShowResponse(true)
        }
      } catch (error) {
        setAiResponse('I apologize, but I\'m having trouble connecting right now. Please try again in a moment, or browse our FAQ section below for common questions.')
        setShowResponse(true)
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <div className="min-h-screen relative pb-24">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.pexels.com/photos/3408744/pexels-photo-3408744.jpeg"
          alt="Peaceful meditation background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-white/50" />
      </div>

      {/* Header */}
      <div className="relative z-10 px-6 pt-12 pb-6">
        <div className="flex items-center space-x-4 text-gray-900">
          <button 
            onClick={() => onNavigate('home')}
            className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-gray-700 hover:bg-white/30 transition-all duration-200"
          >
            ←
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Ask Your Question</h1>
            <p className="text-gray-600 text-sm">Get personalized wellness guidance</p>
          </div>
        </div>
      </div>

      <div className="relative z-10 px-6 space-y-6">
        {/* AI Response Section */}
        {showResponse && (
          <div className="bg-white/70 backdrop-blur-md border border-white/30 rounded-3xl p-6 shadow-lg">
            <div className="flex items-start space-x-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-primary-purple to-primary-pink rounded-full flex items-center justify-center">
                <span className="text-white text-sm">🧠</span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-2">AI Wellness Coach</h3>
                <div className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                  {aiResponse}
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowResponse(false)}
              className="text-primary-purple text-sm font-medium hover:text-primary-purple/80 transition-colors"
            >
              Ask another question ↻
            </button>
          </div>
        )}

        {/* Ask Question Input */}
        <div className="bg-white/70 backdrop-blur-md border border-white/30 rounded-3xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">Ask Anything</h3>
          <div className="space-y-4">
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="What's on your mind? Ask me about meditation, mindfulness, stress, anxiety, or any wellness topic..."
              className="w-full p-4 bg-white/50 backdrop-blur-sm border border-white/40 rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-purple/40 focus:border-primary-purple/40 transition-all duration-200 resize-none h-32"
              rows={4}
              disabled={isLoading}
            />
            
            <div className="flex space-x-3">
              <button
                onClick={handleSubmitQuestion}
                disabled={!question.trim() || isLoading}
                className={`flex-1 font-semibold py-3 px-6 rounded-2xl transition-all duration-300 active:scale-95 flex items-center justify-center space-x-2 ${
                  question.trim() && !isLoading
                    ? 'bg-gradient-to-r from-primary-purple to-primary-pink text-white shadow-lg'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Thinking...</span>
                  </>
                ) : (
                  <>
                    <span>Send Question</span>
                    <span>💬</span>
                  </>
                )}
              </button>
              
              <button className="w-12 h-12 bg-primary-purple/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-primary-purple text-xl border border-primary-purple/30 hover:bg-primary-purple/30 transition-all duration-200">
                🎤
              </button>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white/70 backdrop-blur-md border border-white/30 rounded-3xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 flex items-center space-x-2">
            <span>💡</span>
            <span>Frequently Asked Questions</span>
          </h3>
          <div className="space-y-3">
            {faqs.map((faq) => (
              <div key={faq.id} className="bg-white/50 backdrop-blur-sm border border-white/40 rounded-2xl overflow-hidden">
                <button
                  className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-white/70 transition-colors"
                  onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                >
                  <span className="font-medium text-gray-800 text-sm">{faq.question}</span>
                  <span className="text-primary-purple text-xl">
                    {expandedFAQ === faq.id ? '−' : '+'}
                  </span>
                </button>
                {expandedFAQ === faq.id && (
                  <div className="px-4 py-3 bg-white/60 border-t border-white/40">
                    <p className="text-gray-600 text-sm leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}