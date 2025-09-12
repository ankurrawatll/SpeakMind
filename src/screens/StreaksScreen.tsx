import type { Screen } from '../App'

interface StreaksScreenProps {
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

export default function StreaksScreen({ onNavigate, user }: StreaksScreenProps) {
  // Mock calendar data
  const currentDate = new Date()
  const currentMonth = currentDate.getMonth()
  const currentYear = currentDate.getFullYear()
  
  // Days with meditation sessions (mock data)
  const meditationDays = [1, 3, 5, 8, 10, 12, 15, 18, 20, 22, 25, 28]
  
  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate()
  }
  
  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay()
  }
  
  const daysInMonth = getDaysInMonth(currentMonth, currentYear)
  const firstDay = getFirstDayOfMonth(currentMonth, currentYear)
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const renderCalendar = () => {
    const days = []
    
    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-10"></div>)
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const hasMeditation = meditationDays.includes(day)
      const isToday = day === currentDate.getDate()
      
      days.push(
        <div
          key={day}
          className={`h-10 w-10 rounded-full flex items-center justify-center text-sm font-medium ${
            isToday
              ? 'bg-primary-purple text-white'
              : hasMeditation
              ? 'bg-primary-purple/20 text-primary-purple'
              : 'text-gray-600'
          }`}
        >
          {day}
          {hasMeditation && !isToday && (
            <div className="absolute w-2 h-2 bg-primary-purple rounded-full mt-8"></div>
          )}
        </div>
      )
    }
    
    return days
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
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{user.streak} Day Streak</h1>
            <p className="text-white/80 text-sm">Keep up the great work!</p>
          </div>
          <div className="text-4xl">🔥</div>
        </div>
      </div>

      <div className="px-6 -mt-4">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="card text-center">
            <div className="text-2xl mb-2">📅</div>
            <div className="text-2xl font-bold text-gray-800">{meditationDays.length}</div>
            <div className="text-sm text-gray-600">Days Meditated</div>
          </div>
          
          <div className="card text-center">
            <div className="text-2xl mb-2">🔥</div>
            <div className="text-2xl font-bold text-gray-800">{user.streak}</div>
            <div className="text-sm text-gray-600">Current Streak</div>
          </div>
        </div>

        {/* Calendar */}
        <div className="card mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              {monthNames[currentMonth]} {currentYear}
            </h3>
            <div className="flex space-x-2">
              <button className="text-primary-purple">←</button>
              <button className="text-primary-purple">→</button>
            </div>
          </div>
          
          {/* Day labels */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
              <div key={index} className="h-8 flex items-center justify-center text-sm font-medium text-gray-500">
                {day}
              </div>
            ))}
          </div>
          
          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1 relative">
            {renderCalendar()}
          </div>
          
          <div className="mt-4 flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-primary-purple/20 rounded-full"></div>
              <span className="text-gray-600">Meditation completed</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-primary-purple rounded-full"></div>
              <span className="text-gray-600">Today</span>
            </div>
          </div>
        </div>

        {/* Miracle Moment CTA */}
        <div 
          className="streak-card cursor-pointer transition-transform active:scale-95"
          onClick={() => onNavigate('timer')}
        >
          <div className="text-center">
            <div className="text-4xl mb-3">✨</div>
            <h3 className="text-xl font-bold mb-2">Miracle Moment</h3>
            <p className="text-white/90 text-sm mb-4">
              Complete your meditation today to maintain your streak!
            </p>
            <button className="bg-white/20 backdrop-blur-sm text-white font-semibold py-3 px-6 rounded-3xl border border-white/30">
              Start Now
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}