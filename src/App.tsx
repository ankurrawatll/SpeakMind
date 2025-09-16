import { useState, useEffect } from 'react'
import OnboardingScreen from './screens/OnboardingScreen'
import HomeScreen from './screens/HomeScreen'
import MeditationScreen from './screens/MeditationScreen'
import JournalScreen from './screens/JournalScreen'
import EmotionalReleaseScreen from './screens/EmotionalReleaseScreen'
import AskQuestionScreen from './screens/AskQuestionScreen'
import StreaksScreen from './screens/StreaksScreen'
import MeditationTimerScreen from './screens/MeditationTimerScreen'
import AICoachScreen from './screens/AICoachScreen'
import ProfileScreen from './screens/ProfileScreen'
import CommunityScreen from './screens/CommunityScreen'
import MindCoachScreen from './screens/MindCoachScreen'
import ConversationScreen from './screens/ConversationScreen'
import BottomNavigation from './components/BottomNavigation'

export type Screen = 
  | 'onboarding'
  | 'home'
  | 'meditation'
  | 'journal'
  | 'emotionalRelease'
  | 'askQuestion'
  | 'streaks'
  | 'timer'
  | 'aiCoach'
  | 'profile'
  | 'community'
  | 'mindCoach'
  | 'conversation'

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('onboarding')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user] = useState({
    name: 'User',
    streak: 1,
    level: 3,
    timemeditated: 45,
    meditations: 12,
    points: 850
  })

  useEffect(() => {
    // Force clear any existing auth for testing onboarding
    // TODO: Remove these lines when onboarding is working properly
    localStorage.removeItem('speakmind_auth')
    localStorage.removeItem('speakmind_onboarding_complete')
    
    // Check if user has completed onboarding and is authenticated
    const savedAuth = localStorage.getItem('speakmind_auth')
    const completedOnboarding = localStorage.getItem('speakmind_onboarding_complete')
    
    // Development helper: Add global function to reset onboarding
    if (typeof window !== 'undefined') {
      (window as any).resetOnboarding = () => {
        localStorage.removeItem('speakmind_auth')
        localStorage.removeItem('speakmind_onboarding_complete')
        setIsAuthenticated(false)
        setCurrentScreen('onboarding')
        console.log('Onboarding reset! Refresh the page to see onboarding screen.')
      }
    }
    
    if (savedAuth && completedOnboarding) {
      setIsAuthenticated(true)
      setCurrentScreen('home')
    } else {
      // Always start with onboarding for new users or if onboarding wasn't completed
      setCurrentScreen('onboarding')
      setIsAuthenticated(false)
    }
  }, [])

  const handleAuth = () => {
    setIsAuthenticated(true)
    setCurrentScreen('home')
    localStorage.setItem('speakmind_auth', 'true')
    localStorage.setItem('speakmind_onboarding_complete', 'true')
  }

  const navigateToScreen = (screen: Screen) => {
    setCurrentScreen(screen)
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case 'onboarding':
        return <OnboardingScreen onAuth={handleAuth} />
      case 'home':
        return <HomeScreen onNavigate={navigateToScreen} user={user} />
      case 'meditation':
        return <MeditationScreen onNavigate={navigateToScreen} />
      case 'journal':
        return <JournalScreen onNavigate={navigateToScreen} user={user} />
      case 'emotionalRelease':
        return <EmotionalReleaseScreen onNavigate={navigateToScreen} user={user} />
      case 'askQuestion':
        return <AskQuestionScreen onNavigate={navigateToScreen} />
      case 'streaks':
        return <StreaksScreen onNavigate={navigateToScreen} user={user} />
      case 'timer':
        return <MeditationTimerScreen onNavigate={navigateToScreen} />
      case 'aiCoach':
        return <AICoachScreen onNavigate={navigateToScreen} />
      case 'profile':
        return <ProfileScreen onNavigate={navigateToScreen} user={user} />
      case 'community':
        return <CommunityScreen onNavigate={navigateToScreen} />
      case 'mindCoach':
        return <MindCoachScreen onNavigate={navigateToScreen} user={user} />
      case 'conversation':
        return <ConversationScreen onNavigate={navigateToScreen} />
      default:
        return <HomeScreen onNavigate={navigateToScreen} user={user} />
    }
  }

  const showBottomNav = isAuthenticated && currentScreen !== 'onboarding' && currentScreen !== 'timer' && currentScreen !== 'conversation'

  return (
    <div className="mobile-container">
      {renderScreen()}
      {showBottomNav && (
        <BottomNavigation 
          currentScreen={currentScreen} 
          onNavigate={navigateToScreen} 
        />
      )}
    </div>
  )
}

export default App
