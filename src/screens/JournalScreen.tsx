import { useState, useEffect } from 'react'
import type { Screen } from '../App'

interface JournalScreenProps {
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

interface JournalEntry {
  id: string
  content: string
  wordCount: number
  date: string
  xpEarned: number
}

export default function JournalScreen({ onNavigate, user: _user }: JournalScreenProps) {
  const [currentEntry, setCurrentEntry] = useState('')
  const [wordCount, setWordCount] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [aiPrompt, setAiPrompt] = useState('')
  const [recentEntries, setRecentEntries] = useState<JournalEntry[]>([])

  // AI-generated prompts based on mood/time (mock data)
  const aiPrompts = [
    "What moment today made you feel most grateful, and why did it resonate with you?",
    "Describe a challenge you faced recently and how you grew from the experience.",
    "What emotions are you experiencing right now, and what might be causing them?",
    "If you could give your past self advice about today, what would you say?",
    "What are three things that brought you joy this week, no matter how small?",
    "How has your perspective on a particular situation changed over time?",
    "What would you like to let go of, and what would you like to embrace moving forward?",
    "Describe a person who inspires you and what qualities you admire in them.",
    "What does self-care look like for you right now, and how can you prioritize it?",
    "What are you looking forward to most, and what steps can you take to get there?"
  ]

  // Mock recent entries
  const mockRecentEntries: JournalEntry[] = [
    {
      id: '1',
      content: 'Today was a beautiful day. I spent time in nature and felt really peaceful. The meditation session helped me center myself and I felt more focused throughout the day.',
      wordCount: 28,
      date: '2025-09-11',
      xpEarned: 15
    },
    {
      id: '2', 
      content: 'Feeling grateful for my morning coffee and the quiet moments before the day begins.',
      wordCount: 15,
      date: '2025-09-10',
      xpEarned: 5
    },
    {
      id: '3',
      content: 'Had an interesting conversation with a friend today about mindfulness. It made me realize how much I have grown in my practice over the past few months.',
      wordCount: 26,
      date: '2025-09-09', 
      xpEarned: 15
    }
  ]

  // Writing tips
  const writingTips = [
    "💡 Write at least 20 words to earn +15 XP (vs +5 XP for shorter entries)",
    "🎯 Be specific about emotions and experiences for deeper reflection",
    "⭐ Daily journaling builds your streak and unlocks achievement badges",
    "🔄 Try the AI prompt if you're unsure what to write about",
    "✨ Honest self-reflection leads to the most meaningful insights"
  ]

  useEffect(() => {
    // Generate random AI prompt on component mount
    const randomPrompt = aiPrompts[Math.floor(Math.random() * aiPrompts.length)]
    setAiPrompt(randomPrompt)
    
    // Load mock recent entries
    setRecentEntries(mockRecentEntries)
  }, [])

  useEffect(() => {
    // Update word count
    const words = currentEntry.trim().split(/\s+/).filter(word => word.length > 0)
    setWordCount(words.length)
  }, [currentEntry])

  const calculateXP = (wordCount: number) => {
    return wordCount >= 20 ? 15 : 5
  }

  const handleSubmit = async () => {
    if (currentEntry.trim().length === 0) return
    
    setIsSubmitting(true)
    
    // Simulate API call
    setTimeout(() => {
      const xpEarned = calculateXP(wordCount)
      const newEntry: JournalEntry = {
        id: Date.now().toString(),
        content: currentEntry,
        wordCount: wordCount,
        date: new Date().toISOString().split('T')[0],
        xpEarned: xpEarned
      }
      
      // Add to recent entries (simulate)
      setRecentEntries(prev => [newEntry, ...prev.slice(0, 2)])
      
      // Show success toast
      setToastMessage(`+${xpEarned} XP earned! Entry saved successfully.`)
      setShowToast(true)
      
      // Clear form
      setCurrentEntry('')
      setIsSubmitting(false)
      
      // Hide toast after 3 seconds
      setTimeout(() => setShowToast(false), 3000)
    }, 1000)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    })
  }

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
          <h1 className="text-xl font-bold text-white">AI Journal</h1>
          <div></div>
        </div>
      </div>

      <div className="px-6 -mt-4">
        {/* AI Prompt Card */}
        <div className="card mb-6">
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-purple to-primary-pink rounded-full flex items-center justify-center text-white font-bold text-sm">
              AI
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800 mb-2">Today's Reflection Prompt</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{aiPrompt}</p>
            </div>
          </div>
        </div>

        {/* Journal Entry Form */}
        <div className="card mb-6">
          <h3 className="font-semibold text-gray-800 mb-4">Write Your Entry</h3>
          
          <textarea
            value={currentEntry}
            onChange={(e) => setCurrentEntry(e.target.value)}
            placeholder="Start writing your thoughts here..."
            className="w-full h-32 p-3 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-primary-purple/20 focus:border-primary-purple"
          />
          
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {wordCount} word{wordCount !== 1 ? 's' : ''}
              </span>
              <span className={`text-sm font-medium ${wordCount >= 20 ? 'text-green-600' : 'text-yellow-600'}`}>
                +{calculateXP(wordCount)} XP
              </span>
            </div>
            
            <button
              onClick={handleSubmit}
              disabled={currentEntry.trim().length === 0 || isSubmitting}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Saving...' : 'Save Entry'}
            </button>
          </div>
        </div>

        {/* Recent Entries */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Entries</h3>
          <div className="space-y-3">
            {recentEntries.map((entry) => (
              <div key={entry.id} className="card">
                <div className="flex items-start justify-between mb-2">
                  <span className="text-sm text-gray-500">{formatDate(entry.date)}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500">{entry.wordCount} words</span>
                    <span className="text-xs font-medium text-green-600">+{entry.xpEarned} XP</span>
                  </div>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed line-clamp-3">
                  {entry.content}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Writing Tips */}
        <div className="card">
          <h3 className="font-semibold text-gray-800 mb-4">💭 Writing Tips</h3>
          <div className="space-y-2">
            {writingTips.map((tip, index) => (
              <div key={index} className="text-sm text-gray-600 leading-relaxed">
                {tip}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Success Toast */}
      {showToast && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 toast-enter">
          <div className="flex items-center space-x-2">
            <span>🎉</span>
            <span className="font-medium">{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  )
}