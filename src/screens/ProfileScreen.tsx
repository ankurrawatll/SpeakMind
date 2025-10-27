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
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 relative pb-20">
      {/* Header */}
      <div className="px-4 pt-12 pb-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-semibold text-gray-900">Profile</h1>
          <button className="text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
        
        {/* Profile Card */}
        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-orange-200 rounded-full flex items-center justify-center mx-auto mb-4 overflow-hidden">
            <img 
              src="https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=2" 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-1">
            {currentUser?.displayName || currentUser?.email?.split('@')[0] || user.name}
          </h2>
          <p className="text-purple-500 font-medium">Level {user.level}</p>
        </div>
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6 px-4">
          <div className="bg-yellow-50 rounded-2xl p-4 text-center">
            <div className="text-sm text-gray-600 mb-1">Streak</div>
            <div className="text-2xl font-bold text-gray-900">{user.streak} Day{user.streak !== 1 ? 's' : ''}</div>
          </div>
          
          <div className="bg-pink-50 rounded-2xl p-4 text-center">
            <div className="text-sm text-gray-600 mb-1">Time Meditated</div>
            <div className="text-2xl font-bold text-gray-900">{user.timemeditated} mins</div>
          </div>
          
          <div className="bg-blue-50 rounded-2xl p-4 text-center">
            <div className="text-sm text-gray-600 mb-1">Meditation</div>
            <div className="text-2xl font-bold text-gray-900">{user.meditations}</div>
          </div>
          
          <div className="bg-green-50 rounded-2xl p-4 text-center">
            <div className="text-sm text-gray-600 mb-1">Points</div>
            <div className="text-2xl font-bold text-gray-900">{user.points}</div>
          </div>
        </div>

        {/* Weekly Insights */}
        <div className="px-4 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Insights</h3>
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl p-6">
            <div className="flex justify-between items-end h-32 mb-4">
              {[30, 45, 25, 50, 35, 40, 60].map((height, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div 
                    className="bg-white/80 rounded-t-lg w-8 transition-all duration-300"
                    style={{ height: `${height}px` }}
                  ></div>
                </div>
              ))}
              
            </div>
            <div className="flex justify-between text-sm text-white/90">
              {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map((day) => (
                <span key={day}>{day}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="px-4 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Achievements</h3>
            <button className="text-purple-500">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          <div className="flex space-x-3 overflow-x-auto pb-2">
            <div className="bg-teal-100 rounded-2xl p-4 text-center min-w-[100px]">
              <div className="w-12 h-12 bg-teal-200 rounded-xl flex items-center justify-content mx-auto mb-2 overflow-hidden">
                <img 
                  src="https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2" 
                  alt="Dark Night" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-xs font-medium text-gray-700">Dark Night</div>
            </div>
            
            <div className="bg-green-100 rounded-2xl p-4 text-center min-w-[100px]">
              <div className="w-12 h-12 bg-green-200 rounded-xl flex items-center justify-center mx-auto mb-2 overflow-hidden">
                <img 
                  src="https://images.pexels.com/photos/1167021/pexels-photo-1167021.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2" 
                  alt="The Big Bang" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-xs font-medium text-gray-700">The Big Bang</div>
            </div>
            
            <div className="bg-purple-100 rounded-2xl p-4 text-center min-w-[100px]">
              <div className="w-12 h-12 bg-purple-200 rounded-xl flex items-center justify-center mx-auto mb-2 overflow-hidden">
                <img 
                  src="https://images.pexels.com/photos/1029604/pexels-photo-1029604.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2" 
                  alt="Solid Foundation" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-xs font-medium text-gray-700">Solid Fou...</div>
            </div>
          </div>
        </div>

        {/* Account Details */}
        <div className="px-4 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Details</h3>
          <div className="bg-gray-50 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between py-2">
              <span className="text-gray-600">Email</span>
              <span className="text-gray-900 text-sm font-medium">{currentUser?.email || 'Not provided'}</span>
            </div>
            {userData && (
              <>
                <div className="flex items-center justify-between py-2">
                  <span className="text-gray-600">Age</span>
                  <span className="text-gray-900 text-sm font-medium">{userData.age}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-gray-600">Gender</span>
                  <span className="text-gray-900 text-sm font-medium">{userData.sex}</span>
                </div>
              </>
            )}
            <hr className="border-gray-200" />
            <button
              onClick={handleLogout}
              className="w-full bg-red-500 text-white py-3 rounded-xl font-semibold hover:bg-red-600 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
