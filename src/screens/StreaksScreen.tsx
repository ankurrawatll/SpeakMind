import type { Screen } from '../App'
import { IoChevronBack } from 'react-icons/io5'

interface StreaksScreenProps {
  onNavigate: (screen: Screen) => void
  user?: {
    name: string
    streak: number
    level: number
    timemeditated: number
    meditations: number
    points: number
  }
}

export default function StreaksScreen({ onNavigate }: StreaksScreenProps) {
  // Mock calendar data
  const currentDate = new Date()
  const currentMonth = currentDate.getMonth()
  const currentYear = currentDate.getFullYear()
  
  // Days with meditation sessions (mock data) - highlight day 5 (today)
  const meditationDays = [1, 3, 5, 8, 10, 12, 15, 18, 20, 22, 25, 28]
  
  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate()
  }
  
  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay()
  }
  
  const daysInMonth = getDaysInMonth(currentMonth, currentYear)
  const firstDay = getFirstDayOfMonth(currentMonth, currentYear)

  const renderCalendar = () => {
    const days = []
    
    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-8"></div>)
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const hasMeditation = meditationDays.includes(day)
      const isToday = day === 5 // Set day 5 as today to match screenshot
      
      days.push(
        <div
          key={day}
          className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium ${
            isToday
              ? 'bg-purple-500 text-white'
              : hasMeditation
              ? 'bg-gray-100 text-gray-700'
              : 'text-gray-400'
          }`}
        >
          {day}
        </div>
      )
    }
    
    return days
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 relative pb-20">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <button
          onClick={() => onNavigate('home')}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <IoChevronBack className="w-6 h-6 text-gray-700" />
        </button>
        <div className="text-center">
          <h1 className="text-lg font-semibold text-gray-900">1 Day Streak</h1>
          <p className="text-sm text-gray-500">Keep building your momentum</p>
        </div>
        <div className="w-10"></div>
      </div>

      <div className="px-4 space-y-6">
        {/* Miracle Moment card */}
        <div 
          className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-6 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => onNavigate('meditation')}
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <span className="text-white text-2xl">⭐</span>
            </div>
            <div className="flex-1">
              <div className="text-xl font-bold text-white mb-1">Miracle Moment</div>
              <div className="text-white/90 text-sm">2 days until your next milestone</div>
            </div>
          </div>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-2xl flex items-center justify-center mb-3">
                <span className="text-yellow-600 text-xl">📅</span>
              </div>
              <div className="text-sm text-gray-600 mb-1">Days Meditated</div>
              <div className="text-3xl font-bold text-gray-900">2</div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-pink-100 rounded-2xl flex items-center justify-center mb-3">
                <span className="text-pink-600 text-xl">🛡️</span>
              </div>
              <div className="text-sm text-gray-600 mb-1">Shields Used</div>
              <div className="text-3xl font-bold text-gray-900">1</div>
            </div>
          </div>
        </div>

        {/* Calendar */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <button className="text-gray-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h3 className="font-medium text-gray-900">September 2025</h3>
            <button className="text-gray-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-sm text-gray-500 mb-3">
            {['S','M','T','W','T','F','S'].map((day, index) => (
              <div key={index} className="py-2 font-medium">{day}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {renderCalendar()}
          </div>
        </div>
      </div>
    </div>
  )
}
