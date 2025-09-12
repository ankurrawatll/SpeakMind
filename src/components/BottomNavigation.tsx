import type { Screen } from '../App'

interface BottomNavigationProps {
  currentScreen: Screen
  onNavigate: (screen: Screen) => void
}

export default function BottomNavigation({ currentScreen, onNavigate }: BottomNavigationProps) {
  const navItems = [
    { 
      id: 'home' as const, 
      label: 'Home', 
      icon: '🏠',
      activeIcon: '🏠'
    },
    { 
      id: 'meditation' as const, 
      label: 'Meditation', 
      icon: '🧘‍♀️',
      activeIcon: '🧘‍♀️'
    },
    { 
      id: 'mindCoach' as const, 
      label: 'Mind Coach', 
      icon: '🎯',
      activeIcon: '🎯'
    },
    { 
      id: 'sharing' as const, 
      label: 'Sharing', 
      icon: '👥',
      activeIcon: '👥'
    },
    { 
      id: 'profile' as const, 
      label: 'Profile', 
      icon: '👤',
      activeIcon: '👤'
    },
  ]

  return (
    <nav className="bottom-nav">
      <div className="flex justify-around items-center">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`nav-item ${
              currentScreen === item.id ? 'active' : 'inactive'
            }`}
          >
            <span className="text-2xl mb-1">
              {currentScreen === item.id ? item.activeIcon : item.icon}
            </span>
            <span className="text-xs font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  )
}