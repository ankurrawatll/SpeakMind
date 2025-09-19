import type { Screen } from '../App'
import { AiOutlineHome } from 'react-icons/ai'
import { PiFlowerLotusLight, PiHandsPrayingLight } from 'react-icons/pi'
import { GoPerson } from 'react-icons/go'
import { HiOutlineChatAlt2 } from 'react-icons/hi'

interface BottomNavigationProps {
  currentScreen: Screen
  onNavigate: (screen: Screen) => void
}

export default function BottomNavigation({ currentScreen, onNavigate }: BottomNavigationProps) {
  const navItems = [
    { id: 'home' as const, label: 'Home', Icon: AiOutlineHome },
    { id: 'meditation' as const, label: 'Meditation', Icon: PiFlowerLotusLight },
    { id: 'mindCoach' as const, label: 'Mind Coach', Icon: PiHandsPrayingLight },
    { id: 'sharing' as const, label: 'Sharing', Icon: HiOutlineChatAlt2 },
    { id: 'profile' as const, label: 'Profile', Icon: GoPerson },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 border-t border-gray-100 backdrop-blur-sm pb-safe" style={{paddingBottom: 'max(1rem, env(safe-area-inset-bottom))'}}>
      <div className="max-w-lg mx-auto px-4">
        <div className="flex justify-between items-center py-2">
          {navItems.map((item) => {
            const Active = currentScreen === item.id
            const Icon = item.Icon
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className="flex flex-col items-center justify-center gap-1 flex-1 py-2"
                aria-current={Active ? 'page' : undefined}
              >
                <span className={`text-2xl ${Active ? 'text-purple-600' : 'text-gray-400'}`}>
                  <Icon />
                </span>
                <span className={`text-xs font-medium ${Active ? 'text-purple-600' : 'text-gray-400'}`}>
                  {item.label}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </nav>
  )
}