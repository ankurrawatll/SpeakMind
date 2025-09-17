import { useAuth } from '../contexts/AuthContext'
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
  const { currentUser, logout } = useAuth()
  
  // Get stored user data
  const getUserData = () => {
    if (currentUser) {
      const storedData = localStorage.getItem(`speakmind_user_data_${currentUser.uid}`)
      return storedData ? JSON.parse(storedData) : null
    }
    return null
  }

  const userData = getUserData()
  
  const achievements = [
    { id: 1, title: 'Dark Night', icon: '🌙', earned: true },
    { id: 2, title: 'The Big Bang', icon: '💥', earned: true },
    { id: 3, title: 'Zen Master', icon: '🧘‍♀️', earned: false },
    { id: 4, title: 'Mindful Warrior', icon: '⚔️', earned: false },
  ]

  const handleLogout = async () => {
    try {
      await logout()
      // Clear user-specific data
      if (currentUser) {
        localStorage.removeItem(`speakmind_user_onboarding_${currentUser.uid}`)
        localStorage.removeItem(`speakmind_user_data_${currentUser.uid}`)
      }
    } catch (error) {
      console.error('Failed to log out:', error)
    }
  }

  return (
    <div className="min-h-screen relative pb-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img src="https://images.pexels.com/photos/1671325/pexels-photo-1671325.jpeg" alt="Profile background" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/35" />
      </div>

      {/* Header */}
      <div className="relative z-10 px-6 pt-12 pb-4">
        <div className="bg-white/15 backdrop-blur-xl border border-white/20 rounded-2xl p-6 text-white text-center">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
            👤
          </div>
          <h1 className="text-2xl font-bold">{currentUser?.displayName || currentUser?.email || user.name}</h1>
          <p className="text-white/80">Level {user.level} Meditator</p>
        </div>
      </div>

      <div className="relative z-10 px-6 -mt-2">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white/15 backdrop-blur-xl border border-white/20 rounded-2xl p-4 text-center text-white">
            <div className="text-2xl mb-2">🔥</div>
            <div className="text-2xl font-bold">{user.streak}</div>
            <div className="text-sm text-white/80">Day Streak</div>
          </div>
          
          <div className="bg-white/15 backdrop-blur-xl border border-white/20 rounded-2xl p-4 text-center text-white">
            <div className="text-2xl mb-2">⏱️</div>
            <div className="text-2xl font-bold">{user.timemeditated}</div>
            <div className="text-sm text-white/80">Minutes</div>
          </div>
          
          <div className="bg-white/15 backdrop-blur-xl border border-white/20 rounded-2xl p-4 text-center text-white">
            <div className="text-2xl mb-2">🧘‍♀️</div>
            <div className="text-2xl font-bold">{user.meditations}</div>
            <div className="text-sm text-white/80">Sessions</div>
          </div>
          
          <div className="bg-white/15 backdrop-blur-xl border border-white/20 rounded-2xl p-4 text-center text-white">
            <div className="text-2xl mb-2">⭐</div>
            <div className="text-2xl font-bold">{user.points}</div>
            <div className="text-sm text-white/80">Points</div>
          </div>
        </div>

        {/* Weekly Insights */}
        <div className="bg-white/15 backdrop-blur-xl border border-white/20 rounded-2xl p-5 mb-6 text-white">
          <h3 className="text-lg font-semibold mb-4">Weekly Insights</h3>
          <div className="bg-white/10 rounded-2xl p-4">
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
            <div className="flex justify-between text-xs text-white/80">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                <span key={day}>{day}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="bg-white/15 backdrop-blur-xl border border-white/20 rounded-2xl p-5 mb-6 text-white">
          <h3 className="text-lg font-semibold mb-4">Achievements</h3>
          <div className="grid grid-cols-2 gap-3">
            {achievements.map((achievement) => (
              <div 
                key={achievement.id}
                className={`p-4 rounded-2xl text-center transition-all duration-200 ${achievement.earned ? 'bg-white/15 border border-white/20' : 'bg-white/10 border border-white/10 grayscale opacity-70'}`}
              >
                <div className={`text-3xl mb-2 ${achievement.earned ? '' : 'grayscale opacity-50'}`}>
                  {achievement.icon}
                </div>
                <div className={`text-sm font-medium`}>
                  {achievement.title}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Account Actions */}
        <div className="bg-white/15 backdrop-blur-xl border border-white/20 rounded-2xl p-5 text-white">
          <h3 className="text-lg font-semibold mb-4">Account</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2">
              <span className="text-white/80">Email</span>
              <span className="text-white text-sm">{currentUser?.email}</span>
            </div>
            {userData && (
              <>
                <div className="flex items-center justify-between py-2">
                  <span className="text-white/80">Age</span>
                  <span className="text-white text-sm">{userData.age}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-white/80">Gender</span>
                  <span className="text-white text-sm">{userData.sex}</span>
                </div>
              </>
            )}
            <hr className="border-white/20" />
            <button
              onClick={handleLogout}
              className="w-full bg-rose-500 text-white py-3 rounded-xl font-semibold hover:bg-rose-600 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}