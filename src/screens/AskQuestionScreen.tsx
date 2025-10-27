import { useState } from 'react'
import type { Screen } from '../App'
import { callGeminiAPI } from '../utils/geminiAPI'
import { recommendVideos } from '../utils/youtubeAI'
import type { VideoSuggestion } from '../utils/youtubeAI'
import { BsEmojiSmile } from 'react-icons/bs'
import { CiCamera, CiImageOn } from 'react-icons/ci'
import { FaMicrophone } from 'react-icons/fa6'
import { IoSendSharp, IoChevronBack, IoVolumeHigh, IoLanguage } from 'react-icons/io5'
import { useEffect, useRef } from 'react'

interface AskQuestionScreenProps {
  onNavigate: (screen: Screen) => void
}

export default function AskQuestionScreen({ onNavigate }: AskQuestionScreenProps) {
  const [question, setQuestion] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [aiResponse, setAiResponse] = useState<string | null>(null)
  const [videoSuggestions, setVideoSuggestions] = useState<VideoSuggestion[] | null>(null)
  const [convoHistory, setConvoHistory] = useState<Array<{q: string; a: string}>>([])
  const [isRecording, setIsRecording] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState('en')
  const [showLanguageMenu, setShowLanguageMenu] = useState(false)
  const recognitionRef = useRef<any>(null)

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
    { code: 'bn', name: 'বাংলা', flag: '��' },
    { code: 'te', name: 'తెలుగు', flag: '🇮🇳' },
    { code: 'mr', name: 'मराठी', flag: '🇮🇳' },
    { code: 'ta', name: 'தமிழ்', flag: '��' },
    { code: 'gu', name: 'ગુજરાતી', flag: '🇮🇳' },
    { code: 'kn', name: 'ಕನ್ನಡ', flag: '🇮🇳' },
    { code: 'ml', name: 'മലയാളം', flag: '🇮🇳' },
    { code: 'pa', name: 'ਪੰਜਾਬੀ', flag: '��' },
    { code: 'or', name: 'ଓଡ଼ିଆ', flag: '🇮🇳' },
    { code: 'ur', name: 'اردو', flag: '🇵🇰' },
    { code: 'es', name: 'Español', flag: '��' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '��' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
    { code: 'pt', name: 'Português', flag: '🇵�' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' }
  ]

  const quickQuestions = [
    {
      question: "How can I start my meditation journey?",
      answer: "Starting your meditation journey is simple and rewarding. Begin with just 5-10 minutes daily in a quiet space. Focus on your breath - inhale slowly through your nose, hold briefly, then exhale through your mouth. Use guided meditation apps or videos initially. Create a consistent routine, preferably at the same time each day. Start with basic techniques like mindfulness or body scan meditation. Remember, it's normal for your mind to wander - gently bring attention back to your breath. Consistency matters more than duration. Set realistic goals and gradually increase your practice time as you become more comfortable."
    },
    {
      question: "How do I improve focus during meditation?",
      answer: "Improving focus during meditation requires patience and practice. Start with shorter sessions (5-10 minutes) and gradually extend them. Use anchor techniques like counting breaths from 1 to 10, then repeat. When your mind wanders, acknowledge the thought without judgment and gently return to your anchor. Try different meditation styles: guided meditations, mantra repetition, or visualization. Create a dedicated meditation space free from distractions. Practice at the same time daily to build a habit. Use meditation apps with background sounds or music. Remember, wandering thoughts are normal - the practice is in noticing and returning to focus, not achieving perfect concentration."
    },
    {
      question: "How to deal with stress and anxiety?",
      answer: "Managing stress and anxiety involves multiple strategies. Practice deep breathing exercises: inhale for 4 counts, hold for 4, exhale for 6. Try progressive muscle relaxation - tense and release each muscle group. Use mindfulness techniques to stay present rather than worrying about future events. Regular exercise releases endorphins and reduces stress hormones. Maintain a consistent sleep schedule and limit caffeine. Practice gratitude by writing down 3 things you're thankful for daily. Set boundaries and learn to say no. Break large tasks into smaller, manageable steps. Consider talking to a therapist if anxiety persists. Remember, seeking help is a sign of strength, not weakness."
    },
    {
      question: "What are the benefits of daily meditation?",
      answer: "Daily meditation offers numerous physical and mental benefits. It reduces stress by lowering cortisol levels and activating the parasympathetic nervous system. Regular practice improves focus, attention span, and cognitive function. It enhances emotional regulation, helping you respond rather than react to situations. Meditation can lower blood pressure, improve immune function, and reduce inflammation. It promotes better sleep quality and can help with insomnia. Many practitioners report increased self-awareness, compassion, and overall life satisfaction. It can reduce symptoms of anxiety and depression. Even 10 minutes daily can create positive changes in brain structure, particularly in areas related to attention and emotional processing."
    }
  ]

  const handleSend = async () => {
    const q = question.trim()
    if (!q) return
    setIsLoading(true)
    setAiResponse(null)
    setVideoSuggestions(null)
    // Determine if this question requests video recommendations so we can call the recommender
    const lowerQ = q.toLowerCase()
    const videoTriggers = [
      'recommend', 'recommendation', 'recommend videos', 'recommend a video', 'recommend some videos',
      'show videos', 'show me', 'youtube', 'video', 'videos', 'watch', 'play', 'tutorial', 'tutorials',
      'class', 'classes', 'session', 'sessions', 'practice', 'guided', 'guided practice', 'flow', 'vinyasa',
      'meditation video', 'find', 'search', 'look up', 'suggest'
    ]
    const timePattern = /\b\d+\s*(m|min|mins|minute|minutes|h|hr|hrs|hour|hours)\b/
    const wantsVideos = videoTriggers.some(t => lowerQ.includes(t)) || timePattern.test(lowerQ)

    try {
      const languagePrompt = selectedLanguage !== 'en' 
        ? `Please respond in ${languages.find(l => l.code === selectedLanguage)?.name || 'English'}. ` 
        : ''
      const res = await callGeminiAPI(languagePrompt + q)
      if (res.success && res.text) {
        setAiResponse(res.text)
        setQuestion('')
        // push to conversation history for richer context and build next context immediately
        const nextConvo = [...convoHistory, { q, a: res.text as string }]
        setConvoHistory(nextConvo.slice(-8))

        if (wantsVideos) {
          try {
            // build a conversation context from recent history (q/a pairs)
            const context = nextConvo.map(c => `User: ${c.q}\nBot: ${c.a}`).join('\n')
            const vids = await recommendVideos(q, context, 4)
            setVideoSuggestions(vids)
          } catch (err: any) {
            // eslint-disable-next-line no-console
            console.error('recommendVideos error', err)
            // show no videos but keep AI response
            setVideoSuggestions([])
          }
        }
      } else {
        setAiResponse(res.error || 'Unable to get response. Please try again.')
        // Even if the AI text failed, if user asked for videos try to fetch suggestions
        if (wantsVideos) {
          try {
            const context = convoHistory.map(c => `User: ${c.q}\nBot: ${c.a}`).join('\n')
            const vids = await recommendVideos(q, context, 4)
            setVideoSuggestions(vids)
          } catch (err: any) {
            // eslint-disable-next-line no-console
            console.error('recommendVideos error (fallback)', err)
            setVideoSuggestions([])
          }
        }
      }
    } catch (err) {
      setAiResponse('I\'m having trouble connecting to the AI right now. Please try again later.')
    } finally {
      setIsLoading(false)
    }
  }

  const speakResponse = (text: string) => {
    if ('speechSynthesis' in window) {
      // Stop any ongoing speech
      speechSynthesis.cancel()
      setIsSpeaking(true)

  const utterance = new SpeechSynthesisUtterance(text)
      
  // Set language for speech synthesis
  utterance.lang = selectedLanguage === 'zh' ? 'zh-CN' : 
                      selectedLanguage === 'ar' ? 'ar-SA' :
                      selectedLanguage === 'hi' ? 'hi-IN' :
                      selectedLanguage === 'bn' ? 'bn-IN' :
                      selectedLanguage === 'te' ? 'te-IN' :
                      selectedLanguage === 'mr' ? 'mr-IN' :
                      selectedLanguage === 'ta' ? 'ta-IN' :
                      selectedLanguage === 'gu' ? 'gu-IN' :
                      selectedLanguage === 'kn' ? 'kn-IN' :
                      selectedLanguage === 'ml' ? 'ml-IN' :
                      selectedLanguage === 'pa' ? 'pa-IN' :
                      selectedLanguage === 'or' ? 'or-IN' :
                      selectedLanguage === 'ur' ? 'ur-PK' :
                      selectedLanguage + '-' + selectedLanguage.toUpperCase()
      
      utterance.rate = 0.8
      utterance.pitch = 1
      utterance.volume = 1

      utterance.onend = () => setIsSpeaking(false)
      utterance.onerror = () => setIsSpeaking(false)

      speechSynthesis.speak(utterance)
    } else {
      alert('Text-to-speech is not supported in this browser.')
    }
  }

  const handleQuickQuestion = (questionObj: typeof quickQuestions[0]) => {
    setQuestion(questionObj.question)
    setAiResponse(questionObj.answer)
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
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <button
          onClick={() => onNavigate('home')}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <IoChevronBack className="w-6 h-6 text-gray-700" />
        </button>
        <div className="text-center">
          <h1 className="text-lg font-semibold text-gray-900">Ask your Question</h1>
          <p className="text-sm text-gray-500">Get AI-powered guidance</p>
        </div>
        <div className="relative">
          <button
            onClick={() => setShowLanguageMenu(!showLanguageMenu)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <IoLanguage className="w-6 h-6 text-gray-700" />
          </button>
          {showLanguageMenu && (
            <div className="absolute right-0 top-12 bg-white border border-gray-200 rounded-2xl shadow-lg z-50 w-48 max-h-64 overflow-y-auto">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setSelectedLanguage(lang.code)
                    setShowLanguageMenu(false)
                  }}
                  className={`w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center space-x-3 ${
                    selectedLanguage === lang.code ? 'bg-purple-50 text-purple-700' : 'text-gray-700'
                  }`}
                >
                  <span className="text-lg">{lang.flag}</span>
                  <span className="text-sm font-medium">{lang.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="px-4 space-y-4">
        {/* Quick Questions */}
        {quickQuestions.map((questionObj, index) => (
          <button
            key={index}
            onClick={() => handleQuickQuestion(questionObj)}
            className="w-full bg-purple-50 rounded-2xl p-4 flex items-center justify-between hover:bg-purple-100 transition-colors text-left"
          >
            <span className="text-gray-800 text-sm font-medium flex-1">{questionObj.question}</span>
            <span className="text-gray-500 text-lg ml-2">›</span>
          </button>
        ))}

        {/* Load More Button */}
        <div className="py-4">
          <button className="w-full bg-white border border-gray-200 rounded-2xl py-3 text-purple-600 text-sm font-medium hover:bg-gray-50 transition-colors">
            Load More Questions
          </button>
        </div>

        {/* AI Response Card */}
        {aiResponse && (
          <div className="bg-purple-50 rounded-2xl p-4 border border-purple-100">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">AI</span>
                </div>
                <span className="text-gray-900 font-medium text-sm">AI Response</span>
              </div>
              <button
                onClick={() => speakResponse(aiResponse)}
                className="p-2 hover:bg-purple-100 rounded-full transition-colors"
                disabled={isSpeaking}
              >
                <IoVolumeHigh className={`w-5 h-5 ${isSpeaking ? 'text-purple-600' : 'text-gray-600'}`} />
              </button>
            </div>
            <div className="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap">{aiResponse}</div>
            {/* Video suggestions (if any) */}
            {videoSuggestions && (
              <div className="mt-4">
                {videoSuggestions.length > 0 ? (
                  <div className="grid grid-cols-1 gap-2">
                    {videoSuggestions.map(v => (
                      <a key={v.videoId} href={v.url} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-2 bg-white rounded-lg border border-gray-100 hover:shadow">
                        <img src={v.thumbnails?.default?.url || v.thumbnails?.medium?.url || ''} alt={v.title} className="w-24 h-14 object-cover rounded" />
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900">{v.title}</div>
                          <div className="text-xs text-gray-500">{v.channelTitle}</div>
                        </div>
                      </a>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-gray-500">No video suggestions found.</div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Ask Question Section */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
              <span className="text-purple-600 text-xs">💬</span>
            </div>
            <span className="text-gray-900 font-medium">Ask your question</span>
            <span className="text-xs text-gray-500">
              ({languages.find(l => l.code === selectedLanguage)?.flag} {languages.find(l => l.code === selectedLanguage)?.name})
            </span>
          </div>

          {/* Example placeholder to surface video recommendation capability */}
          <div className="mb-3">
            <div className="text-xs text-gray-500 mb-2">Tip: You can ask the chatbot for video recommendations. Try:</div>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setQuestion('Suggest me videos to deal with anxiety')}
                className="text-xs px-3 py-1 bg-purple-50 text-purple-700 rounded-full border border-purple-100"
              >
                Suggest me videos to deal with anxiety
              </button>
              <button
                onClick={() => setQuestion('Recommend a 20 minute mindfulness meditation for anxiety')}
                className="text-xs px-3 py-1 bg-gray-50 text-gray-700 rounded-full border border-gray-100"
              >
                20 minute mindfulness meditation
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm">
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder={`Ask anything in ${languages.find(l => l.code === selectedLanguage)?.name || 'English'}...`}
              className="w-full text-gray-700 placeholder-gray-400 bg-transparent border-none outline-none text-sm resize-none"
              rows={3}
            />
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
              <div className="flex space-x-4 text-gray-400 items-center">
                <button aria-label="emoji" className="hover:text-gray-600 transition-colors">
                  <BsEmojiSmile className="w-5 h-5" />
                </button>
                <button aria-label="camera" className="hover:text-gray-600 transition-colors">
                  <CiCamera className="w-5 h-5" />
                </button>
                <button aria-label="image" className="hover:text-gray-600 transition-colors">
                  <CiImageOn className="w-5 h-5" />
                </button>
                <button 
                  aria-label="microphone" 
                  onClick={toggleRecording} 
                  className={`hover:text-gray-600 transition-colors ${isRecording ? 'text-purple-600' : ''}`}
                >
                  <FaMicrophone className="w-5 h-5" />
                </button>
              </div>
              <button
                onClick={handleSend}
                disabled={isLoading || !question.trim()}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                  isLoading || !question.trim() 
                    ? 'bg-gray-300 cursor-not-allowed' 
                    : 'bg-purple-500 hover:bg-purple-600'
                }`}
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
