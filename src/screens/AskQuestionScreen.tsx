import { useState } from 'react'
import type { Screen } from '../App'
import { callGeminiAPI } from '../utils/geminiAPI'
import { BsEmojiSmile } from 'react-icons/bs'
import { CiCamera, CiImageOn } from 'react-icons/ci'
import { FaMicrophone } from 'react-icons/fa6'
import { IoSendSharp } from 'react-icons/io5'
import { useEffect, useRef } from 'react'

interface AskQuestionScreenProps {
  onNavigate: (screen: Screen) => void
}

export default function AskQuestionScreen({ onNavigate }: AskQuestionScreenProps) {
  const [question, setQuestion] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [aiResponse, setAiResponse] = useState<string | null>(null)
  const [isRecording, setIsRecording] = useState(false)
  const recognitionRef = useRef<any>(null)

  const quickQuestions = [
    "How can I start my meditation journey?",
    "How can I start my meditation journey?",
    "How do I improve focus during meditation?",
    "How to deal with stress and anxiety?"
  ]

  const handleSend = async () => {
    const q = question.trim()
    if (!q) return
    setIsLoading(true)
    setAiResponse(null)

    try {
      const res = await callGeminiAPI(q)
      if (res.success && res.text) {
        setAiResponse(res.text)
        setQuestion('')
      } else {
        setAiResponse(res.error || 'Unable to get response. Please try again.')
      }
    } catch (err) {
      setAiResponse('I\'m having trouble connecting to the AI right now. Please try again later.')
    } finally {
      setIsLoading(false)
    }
  }

  const toggleRecording = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) {
      // Browser doesn't support SpeechRecognition
      alert('Speech recognition is not supported in this browser.')
      return
    }

    if (!recognitionRef.current) {
      const r = new SpeechRecognition()
      r.lang = 'en-US'
      r.interimResults = false
      r.maxAlternatives = 1

      r.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((res: any) => res[0].transcript)
          .join('')

        // Append or set transcript
        setQuestion(prev => (prev ? prev + ' ' + transcript : transcript))
      }

      r.onerror = (e: any) => {
        console.error('SpeechRecognition error', e)
      }

      r.onend = () => {
        setIsRecording(false)
      }

      recognitionRef.current = r
    }

    try {
      if (isRecording) {
        recognitionRef.current.stop()
        setIsRecording(false)
      } else {
        recognitionRef.current.start()
        setIsRecording(true)
      }
    } catch (err) {
      console.error('SpeechRecognition toggle error', err)
    }
  }

  useEffect(() => {
    return () => {
      try {
        if (recognitionRef.current) recognitionRef.current.stop()
      } catch {
        /* noop */
      }
    }
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="px-6 pt-12 pb-6">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => onNavigate('home')}
            className="text-gray-600 text-2xl"
          >
            ←
          </button>
          <h1 className="text-xl font-semibold text-gray-900">Ask your Question</h1>
        </div>
      </div>

      <div className="px-6 space-y-4">
        {/* Quick Questions */}
        {quickQuestions.map((q, index) => (
          <div key={index} className="bg-purple-100 rounded-2xl p-4 flex items-center justify-between">
            <span className="text-gray-800 text-sm font-medium flex-1">{q}</span>
            <button className="text-gray-500 text-lg">›</button>
          </div>
        ))}

        {/* Load More Button */}
        <div className="py-4">
          <button className="w-full bg-white border border-gray-200 rounded-2xl py-3 text-purple-600 text-sm font-medium">
            Load More
          </button>
        </div>

        {/* Ask Question Section */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
              <span className="text-purple-600 text-xs">💬</span>
            </div>
            <span className="text-gray-900 font-medium">Ask your question</span>
          </div>

          {/* AI Response Card */}
          {aiResponse && (
            <div className="bg-white rounded-2xl p-4 border border-gray-200">
              <div className="text-gray-800 text-sm whitespace-pre-wrap">{aiResponse}</div>
            </div>
          )}

          <div className="bg-white rounded-2xl p-4 border border-gray-200">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask anything"
              className="w-full text-gray-600 placeholder-gray-400 bg-transparent border-none outline-none text-sm"
            />
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
              <div className="flex space-x-4 text-gray-400 items-center">
                <button aria-label="emoji"><BsEmojiSmile className="w-5 h-5" /></button>
                <button aria-label="camera"><CiCamera className="w-5 h-5" /></button>
                <button aria-label="image"><CiImageOn className="w-5 h-5" /></button>
                <button aria-label="microphone" onClick={toggleRecording} className={`${isRecording ? 'text-primary-purple' : ''}`}>
                  <FaMicrophone className="w-5 h-5" />
                </button>
              </div>
              <button
                onClick={handleSend}
                disabled={isLoading || !question.trim()}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isLoading || !question.trim() ? 'bg-gray-300' : 'bg-gray-400'}`}
                aria-label="send"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <IoSendSharp className="text-white w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}