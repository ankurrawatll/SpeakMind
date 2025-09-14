import type { Screen } from '../App'

interface ProfileScreenProps {
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

export default function ProfileScreen({ user }: ProfileScreenProps) {
  const achievements = [
    { id: 1, title: 'Dark Night', icon: '🌙', earned: true },
    { id: 2, title: 'The Big Bang', icon: '💥', earned: true },
    { id: 3, title: 'Zen Master', icon: '🧘‍♀️', earned: false },
    { id: 4, title: 'Mindful Warrior', icon: '⚔️', earned: false },
  ]

  return (
    <div className="min-h-screen bg-light-bg pb-24">
      {/* Header */}
      <div className="gradient-bg px-6 pt-12 pb-8 rounded-b-5xl">
        <div className="text-white text-center">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
            👤
          </div>
          <h1 className="text-2xl font-bold">{user.name} </h1>
          <p className="text-white/80">Level {user.level} Meditator</p>
        </div>
      </div>

      <div className="px-6 -mt-4">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="card text-center">
            <div className="text-2xl mb-2">🔥</div>
            <div className="text-2xl font-bold text-gray-800">{user.streak}</div>
            <div className="text-sm text-gray-600">Day Streak</div>
          </div>
          
          <div className="card text-center">
            <div className="text-2xl mb-2">⏱️</div>
            <div className="text-2xl font-bold text-gray-800">{user.timemeditated}</div>
            <div className="text-sm text-gray-600">Minutes</div>
          </div>
          
          <div className="card text-center">
            <div className="text-2xl mb-2">🧘‍♀️</div>
            <div className="text-2xl font-bold text-gray-800">{user.meditations}</div>
            <div className="text-sm text-gray-600">Sessions</div>
          </div>
          
          <div className="card text-center">
            <div className="text-2xl mb-2">⭐</div>
            <div className="text-2xl font-bold text-gray-800">{user.points}</div>
            <div className="text-sm text-gray-600">Points</div>
          </div>
        </div>

        {/* Weekly Insights */}
        <div className="card mb-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Weekly Insights</h3>
          <div className="bg-gray-50 rounded-2xl p-4">
            <div className="flex justify-between items-end h-24 mb-2">
              {[20, 35, 15, 40, 25, 30, 45].map((height, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div 
                    className="bg-primary-purple rounded-t-lg w-6 transition-all duration-300"
                    style={{ height: `${height}px` }}
                  ></div>
                </div>
              ))}
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                <span key={day}>{day}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Achievements</h3>
          <div className="grid grid-cols-2 gap-3">
            {achievements.map((achievement) => (
              <div 
                key={achievement.id}
                className={`p-4 rounded-2xl text-center transition-all duration-200 ${
                  achievement.earned 
                    ? 'bg-primary-purple/10 border-2 border-primary-purple/20' 
                    : 'bg-gray-100 border-2 border-gray-200'
                }`}
              >
                <div className={`text-3xl mb-2 ${achievement.earned ? '' : 'grayscale opacity-50'}`}>
                  {achievement.icon}
                </div>
                <div className={`text-sm font-medium ${
                  achievement.earned ? 'text-primary-purple' : 'text-gray-500'
                }`}>
                  {achievement.title}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}