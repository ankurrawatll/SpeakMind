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
          className={`h-10 w-10 rounded-2xl flex items-center justify-center text-sm font-semibold transition-all duration-200 hover:scale-110 cursor-pointer ${
            isToday
              ? 'bg-primary-purple text-white shadow-lg ring-2 ring-primary-purple/30'
              : hasMeditation
              ? 'bg-primary-purple/20 text-primary-purple border border-primary-purple/30 backdrop-blur-sm'
              : 'text-gray-600 hover:bg-white/40 backdrop-blur-sm border border-white/20'
          }`}
        >
          {day}
          {hasMeditation && !isToday && (
            <div className="absolute w-2 h-2 bg-primary-purple rounded-full mt-8 animate-pulse"></div>
          )}
        </div>
      )
    }
    
    return days
  }

  return (
    <div className="min-h-screen relative pb-24">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.pexels.com/photos/2170729/pexels-photo-2170729.jpeg"
          alt="Inspirational streak background"
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
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
              <span>{user.streak} Day Streak</span>
              <span className="text-2xl animate-bounce">🔥</span>
            </h1>
            <p className="text-gray-600 text-sm">Keep up the amazing progress!</p>
          </div>
        </div>
      </div>

      <div className="relative z-10 px-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/70 backdrop-blur-md border border-white/30 rounded-3xl p-6 text-center shadow-lg hover:bg-white/80 transition-all duration-300">
            <div className="text-3xl mb-3">📅</div>
            <div className="text-2xl font-bold text-gray-900">{meditationDays.length}</div>
            <div className="text-sm text-gray-600 font-medium">Days Meditated</div>
          </div>
          
          <div className="bg-white/70 backdrop-blur-md border border-white/30 rounded-3xl p-6 text-center shadow-lg hover:bg-white/80 transition-all duration-300">
            <div className="text-3xl mb-3">🔥</div>
            <div className="text-2xl font-bold text-gray-900">{user.streak}</div>
            <div className="text-sm text-gray-600 font-medium">Current Streak</div>
          </div>
        </div>

        {/* Calendar */}
        <div className="bg-white/70 backdrop-blur-md border border-white/30 rounded-3xl p-6 shadow-lg hover:bg-white/80 transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
              <span>📊</span>
              <span>{monthNames[currentMonth]} {currentYear}</span>
            </h3>
            <div className="flex space-x-2">
              <button className="w-8 h-8 rounded-full bg-white/50 backdrop-blur-sm border border-white/40 flex items-center justify-center text-primary-purple hover:bg-white/70 transition-all duration-200">
                ←
              </button>
              <button className="w-8 h-8 rounded-full bg-white/50 backdrop-blur-sm border border-white/40 flex items-center justify-center text-primary-purple hover:bg-white/70 transition-all duration-200">
                →
              </button>
            </div>
          </div>
          
          {/* Day labels */}
          <div className="grid grid-cols-7 gap-1 mb-3">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
              <div key={index} className="h-8 flex items-center justify-center text-sm font-semibold text-gray-600 bg-white/30 rounded-lg">
                {day}
              </div>
            ))}
          </div>
          
          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1 relative mb-4">
            {renderCalendar()}
          </div>
          
          <div className="flex items-center justify-center space-x-6 text-sm bg-white/40 backdrop-blur-sm rounded-2xl p-3">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-primary-purple/30 rounded-full border border-primary-purple/50"></div>
              <span className="text-gray-700 font-medium">Meditation completed</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-primary-purple rounded-full shadow-lg"></div>
              <span className="text-gray-700 font-medium">Today</span>
            </div>
          </div>
        </div>

        {/* Miracle Moment CTA */}
        <div 
          className="bg-gradient-to-br from-primary-purple/80 to-primary-pink/80 backdrop-blur-md border border-white/30 rounded-3xl p-8 text-center shadow-lg cursor-pointer transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
          onClick={() => onNavigate('meditation')}
        >
          <div className="text-5xl mb-4 animate-pulse">✨</div>
          <h3 className="text-2xl font-bold text-white mb-3">Miracle Moment</h3>
          <p className="text-white/90 text-sm mb-6 leading-relaxed">
            Complete your meditation today to maintain your streak and unlock inner peace!
          </p>
          <button className="bg-white/20 backdrop-blur-sm text-white font-semibold py-3 px-8 rounded-2xl border border-white/30 hover:bg-white/30 transition-all duration-200 active:scale-95">
            Start Meditation Now 🧘‍♀️
          </button>
        </div>
      </div>
    </div>
  )
}