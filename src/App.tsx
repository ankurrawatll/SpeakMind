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
import SharingScreen from './screens/SharingScreen'
import MindCoachScreen from './screens/MindCoachScreen'
import ConversationScreen from './screens/ConversationScreen'
import BottomNavigation from './components/BottomNavigation'
// Exercise components
import QuickCalm from './components/exercises/QuickCalm'
import StretchAndFocus from './components/exercises/StretchAndFocus'
import MindBodySync from './components/exercises/MindBodySync'
import ReflectionJournal from './components/exercises/ReflectionJournal'
import { ExerciseLayout } from './components/exercises/ExerciseLayout'

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
  | 'sharing'
  | 'mindCoach'
  | 'conversation'
  | 'exercise-quick-calm'
  | 'exercise-stretch-focus'
  | 'exercise-mind-body-sync'
  | 'exercise-reflection-journal'

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

  // Exercise data for proper routing
  const exerciseData = {
    'exercise-quick-calm': {
      title: 'Quick Calm',
      subtitle: '5-minute breathing exercise',
      backgroundImage: 'https://images.pexels.com/photos/4056535/pexels-photo-4056535.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=2',
      overlayColor: 'from-teal-500/90 to-emerald-600/90'
    },
    'exercise-stretch-focus': {
      title: 'Stretch & Focus',
      subtitle: 'Gentle stretching with mindfulness',
      backgroundImage: 'https://images.pexels.com/photos/3768918/pexels-photo-3768918.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=2',
      overlayColor: 'from-amber-500/90 to-orange-600/90'
    },
    'exercise-mind-body-sync': {
      title: 'Mind Body Sync',
      subtitle: 'Connect your mind and body',
      backgroundImage: 'https://images.pexels.com/photos/4056723/pexels-photo-4056723.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=2',
      overlayColor: 'from-indigo-500/90 to-violet-600/90'
    },
    'exercise-reflection-journal': {
      title: 'Reflection Journal',
      subtitle: 'Write one thought to clear your mind',
      backgroundImage: 'https://images.pexels.com/photos/5273009/pexels-photo-5273009.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=2',
      overlayColor: 'from-rose-500/90 to-pink-600/90'
    }
  }

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
      case 'sharing':
        return <SharingScreen onNavigate={navigateToScreen} />
      case 'mindCoach':
        return <MindCoachScreen onNavigate={navigateToScreen} user={user} />
      case 'conversation':
        return <ConversationScreen onNavigate={navigateToScreen} />
      case 'exercise-quick-calm':
        return (
          <ExerciseLayout 
            {...exerciseData['exercise-quick-calm']}
            onBack={() => navigateToScreen('meditation')}
          >
            <QuickCalm onNavigate={() => navigateToScreen('meditation')} />
          </ExerciseLayout>
        )
      case 'exercise-stretch-focus':
        return (
          <ExerciseLayout 
            {...exerciseData['exercise-stretch-focus']}
            onBack={() => navigateToScreen('meditation')}
          >
            <StretchAndFocus />
          </ExerciseLayout>
        )
      case 'exercise-mind-body-sync':
        return (
          <ExerciseLayout 
            {...exerciseData['exercise-mind-body-sync']}
            onBack={() => navigateToScreen('meditation')}
          >
            <MindBodySync onNavigate={() => navigateToScreen('meditation')} />
          </ExerciseLayout>
        )
      case 'exercise-reflection-journal':
        return (
          <ExerciseLayout 
            {...exerciseData['exercise-reflection-journal']}
            onBack={() => navigateToScreen('meditation')}
          >
            <ReflectionJournal />
          </ExerciseLayout>
        )
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
