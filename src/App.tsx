import { useState, useEffect } from 'react'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import AuthScreen from './screens/AuthScreen'
import UserOnboardingScreen from './screens/UserOnboardingScreen'
import HomeScreen from './screens/HomeScreen'
import MeditationScreen from './screens/MeditationScreen'
import JournalScreen from './screens/JournalScreen'
import EmotionalReleaseScreen from './screens/EmotionalReleaseScreen'
import AskQuestionScreen from './screens/AskQuestionScreen'
import StreaksScreen from './screens/StreaksScreen'
import MeditationTimerScreen from './screens/MeditationTimerScreen'
import AICoachScreen from './screens/AICoachScreen'
import ProfileScreen from './screens/ProfileScreen'
import SharingScreen from './screens/SharingScreen'
import MindCoachScreen from './screens/MindCoachScreen'
import ConversationScreen from './screens/ConversationScreen'
import BottomNavigation from './components/BottomNavigation'

export type Screen = 
  | 'auth'
  | 'userOnboarding'
  | 'home'
  | 'meditation'
  | 'journal'
  | 'emotionalRelease'
  | 'askQuestion'
  | 'streaks'
  | 'timer'
  | 'aiCoach'
  | 'profile'
  | 'sharing'
  | 'mindCoach'
  | 'conversation'

const AppContent = () => {
  const { currentUser } = useAuth()
  const [currentScreen, setCurrentScreen] = useState<Screen>('auth')
  const [isNewUser, setIsNewUser] = useState(false)
  const [user] = useState({
    name: 'User',
    streak: 1,
    level: 3,
    timemeditated: 45,
    meditations: 12,
    points: 850
  })

  useEffect(() => {
    // Only handle the case when user logs out or app first loads
    if (currentUser === null && currentScreen !== 'userOnboarding') {
      setCurrentScreen('auth')
    }
    // For login/signup, we handle navigation immediately in handleAuthComplete
    // to avoid delays from Firebase auth state changes
  }, [currentUser])

  const handleAuthComplete = (wasSignup: boolean = false, user?: any) => {
    setIsNewUser(wasSignup)
    
    // Immediately navigate based on signup status to avoid delay
    if (wasSignup) {
      // New user - check if they need onboarding
      const completedUserOnboarding = user ? localStorage.getItem(`speakmind_user_onboarding_${user.uid}`) : null
      if (!completedUserOnboarding) {
        setCurrentScreen('userOnboarding')
      } else {
        setCurrentScreen('home')
      }
    } else {
      // Existing user - go directly to home
      setCurrentScreen('home')
    }
  }

  const handleUserOnboardingComplete = (userData: { age: number; sex: string }) => {
    // Store user data in localStorage (in a real app, you'd store this in Firebase)
    if (currentUser) {
      localStorage.setItem(`speakmind_user_data_${currentUser.uid}`, JSON.stringify(userData))
      localStorage.setItem(`speakmind_user_onboarding_${currentUser.uid}`, 'true')
      setCurrentScreen('home')
    }
  }

  const navigateToScreen = (screen: Screen) => {
    setCurrentScreen(screen)
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case 'auth':
        return <AuthScreen onAuth={handleAuthComplete} />
      case 'userOnboarding':
        return <UserOnboardingScreen onComplete={handleUserOnboardingComplete} />
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
      case 'sharing':
        return <SharingScreen onNavigate={navigateToScreen} />
      case 'mindCoach':
        return <MindCoachScreen onNavigate={navigateToScreen} user={user} />
      case 'conversation':
        return <ConversationScreen onNavigate={navigateToScreen} />
      default:
        return <HomeScreen onNavigate={navigateToScreen} user={user} />
    }
  }

  const showBottomNav = currentUser && currentScreen !== 'auth' && currentScreen !== 'userOnboarding' && currentScreen !== 'timer' && currentScreen !== 'conversation'

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

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App
