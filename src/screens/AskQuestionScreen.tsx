import { useState } from 'react'
import type { Screen } from '../App'

interface AskQuestionScreenProps {
  onNavigate: (screen: Screen) => void
}

export default function AskQuestionScreen({ onNavigate }: AskQuestionScreenProps) {
  const [question, setQuestion] = useState('')
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null)

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

  const handleSubmitQuestion = () => {
    if (question.trim()) {
      // Here you would typically send to AI/backend
      alert(`Question submitted: ${question}`)
      setQuestion('')
      onNavigate('conversation')
    }
  }

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
          <h1 className="text-2xl font-bold">Ask your Question</h1>
        </div>
      </div>

      <div className="px-6 -mt-4">
        {/* FAQ Section */}
        <div className="card mb-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Frequently Asked Questions</h3>
          <div className="space-y-3">
            {faqs.map((faq) => (
              <div key={faq.id} className="border border-gray-200 rounded-2xl overflow-hidden">
                <button
                  className="w-full px-4 py-3 text-left flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
                  onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                >
                  <span className="font-medium text-gray-800">{faq.question}</span>
                  <span className="text-primary-purple text-xl">
                    {expandedFAQ === faq.id ? '−' : '+'}
                  </span>
                </button>
                {expandedFAQ === faq.id && (
                  <div className="px-4 py-3 bg-white border-t border-gray-200">
                    <p className="text-gray-600 text-sm leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Ask Question Input */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Ask anything</h3>
          <div className="space-y-4">
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="What's on your mind? Ask me anything about meditation, mindfulness, or mental wellness..."
              className="input-field resize-none h-32"
              rows={4}
            />
            
            <div className="flex space-x-3">
              <button
                onClick={handleSubmitQuestion}
                disabled={!question.trim()}
                className={`flex-1 font-semibold py-3 px-6 rounded-3xl transition-all duration-300 active:scale-95 ${
                  question.trim()
                    ? 'bg-primary-purple text-white'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                Send Question
              </button>
              
              <button className="w-12 h-12 bg-primary-purple/10 rounded-full flex items-center justify-center text-primary-purple text-xl">
                🎤
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}