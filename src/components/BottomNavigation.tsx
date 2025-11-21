import type { Screen } from '../App'
import { AiOutlineHome } from 'react-icons/ai'
import { PiFlowerLotusLight, PiHandsPrayingLight } from 'react-icons/pi'
import { HiOutlineChatAlt2 } from 'react-icons/hi'
import { FaBrain } from 'react-icons/fa'
import { GlassFilter, type DockIcon } from './ui/liquid-glass'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface BottomNavigationProps {
  currentScreen: Screen
  onNavigate: (screen: Screen) => void
}

export default function BottomNavigation({ currentScreen, onNavigate }: BottomNavigationProps) {
  const [isHovered, setIsHovered] = useState(false)

  const navItems: DockIcon[] = [
    {
      icon: AiOutlineHome,
      label: 'Home',
      onClick: () => onNavigate('home'),
      isActive: currentScreen === 'home'
    },
    {
      icon: PiFlowerLotusLight,
      label: 'Meditation',
      onClick: () => onNavigate('meditation'),
      isActive: currentScreen === 'meditation'
    },
    {
      icon: PiHandsPrayingLight,
      label: 'Mind Coach',
      onClick: () => onNavigate('mindCoach'),
      isActive: currentScreen === 'mindCoach'
    },
    {
      icon: HiOutlineChatAlt2,
      label: 'Sharing',
      onClick: () => onNavigate('sharing'),
      isActive: currentScreen === 'sharing'
    },
    {
      icon: FaBrain,
      label: 'Brain Health',
      onClick: () => onNavigate('eegBrainHealth'),
      isActive: currentScreen === 'eegBrainHealth'
    },
  ]

  const activeItem = navItems.find(item => item.isActive) || navItems[0]

  return (
    <>
      <GlassFilter />
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
        <motion.div
          className="relative flex items-center justify-center overflow-hidden bg-white/40 backdrop-blur-md border border-white/30 shadow-2xl"
          initial={false}
          animate={{
            width: isHovered ? 'auto' : '60px',
            height: '60px',
            borderRadius: isHovered ? '24px' : '30px',
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={{
            boxShadow: "0 6px 6px rgba(0, 0, 0, 0.2), 0 0 20px rgba(0, 0, 0, 0.1)",
            willChange: "transform, width, height, border-radius",
          }}
        >
          {/* Glass Layers */}
          <div
            className="absolute inset-0 z-0 overflow-hidden rounded-inherit"
            style={{
              backdropFilter: "blur(3px)",
              filter: "url(#glass-distortion)",
              isolation: "isolate",
            }}
          />
          <div
            className="absolute inset-0 z-10 rounded-inherit"
            style={{ background: "rgba(255, 255, 255, 0.25)" }}
          />
          <div
            className="absolute inset-0 z-20 rounded-inherit overflow-hidden"
            style={{
              boxShadow:
                "inset 2px 2px 1px 0 rgba(255, 255, 255, 0.5), inset -1px -1px 1px 1px rgba(255, 255, 255, 0.5)",
            }}
          />

          {/* Content */}
          <div className="relative z-30 flex items-center px-2 h-full">
            <AnimatePresence mode="wait">
              {!isHovered ? (
                <motion.div
                  key="active-icon"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center justify-center w-full h-full"
                >
                  <activeItem.icon className="text-2xl text-purple-700" />
                </motion.div>
              ) : (
                <motion.div
                  key="full-menu"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2, delay: 0.1 }}
                  className="flex items-center gap-4 px-2"
                >
                  {navItems.map((item, index) => (
                    <div
                      key={index}
                      className={`flex flex-col items-center justify-center gap-1 cursor-pointer transition-all duration-300 hover:scale-110 p-1 rounded-xl ${item.isActive ? "text-purple-700" : "text-gray-700 hover:text-purple-900"
                        }`}
                      onClick={item.onClick}
                    >
                      <item.icon className="text-2xl" />
                      <span className="text-[10px] font-medium whitespace-nowrap">{item.label}</span>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </>
  )
}