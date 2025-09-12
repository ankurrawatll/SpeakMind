import type { Screen } from '../App'

interface SharingScreenProps {
  onNavigate: (screen: Screen) => void
}

export default function SharingScreen({ onNavigate }: SharingScreenProps) {
  const friends = [
    { id: 1, name: 'Shweta', status: 'Just completed a 15-min session', avatar: '👩‍💼', online: true },
    { id: 2, name: 'Priya', status: 'On a 5-day streak!', avatar: '👩‍🎓', online: true },
    { id: 3, name: 'Anita', status: 'Feeling grateful today', avatar: '👩‍💻', online: false },
    { id: 4, name: 'Tannu', status: 'Morning meditation done ✨', avatar: '👩‍🎨', online: true },
  ]

  return (
    <div className="min-h-screen bg-light-bg pb-24">
      {/* Header */}
      <div className="gradient-bg px-6 pt-12 pb-8 rounded-b-5xl">
        <div className="text-white">
          <h1 className="text-2xl font-bold mb-2">Community</h1>
          <p className="text-white/80 text-sm">Connect with fellow meditators</p>
        </div>
      </div>

      <div className="px-6 -mt-4">
        {/* Friends List */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Friends</h3>
          <div className="space-y-4">
            {friends.map((friend) => (
              <div key={friend.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-2xl">
                <div className="relative">
                  <div className="w-12 h-12 bg-primary-purple/20 rounded-full flex items-center justify-center text-2xl">
                    {friend.avatar}
                  </div>
                  {friend.online && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800">{friend.name}</h4>
                  <p className="text-sm text-gray-600">{friend.status}</p>
                </div>
                
                <button 
                  onClick={() => onNavigate('conversation')}
                  className="bg-primary-purple text-white px-4 py-2 rounded-full text-sm font-medium"
                >
                  Talk Now
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}