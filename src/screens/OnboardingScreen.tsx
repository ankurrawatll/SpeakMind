interface OnboardingScreenProps {
  onAuth: () => void
}

export default function OnboardingScreen({ onAuth }: OnboardingScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FF91E7] to-[#9F6AFF] flex flex-col">
      {/* Top Section with Logo */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pt-6 pb-6">
        {/* Logo */}
        <div className="mb-4 flex flex-col items-center">
          <img 
            src="/onboarding/speakmindlogo.png" 
            alt="SpeakMind Logo"
            className="w-150 h-150 object-contain"
          />

          {/* App Name */}
          <h1 className="text-4xl font-bold text-white mt-2">SpeakMind</h1>
          <p className="text-lg text-white/90 mt-1">Meditate With Us!</p>
        </div>

        {/* Meditation Illustration (reduce height to fit one screen) */}
        <div className="mb-4 w-full flex items-center justify-center">
          <img 
            src="/onboarding/meditation.png" 
            alt="Meditation Illustration"
            className="w-10/12 max-w-sm h-[30vh] object-contain"
          />
        </div>
      </div>

      {/* Bottom Section with Buttons */}
      <div className="px-6 pb-8">
        <div className="space-y-4">
          {/* Sign in with Gmail Button */}
          <button 
            onClick={onAuth}
            className="w-full bg-white text-gray-700 font-semibold py-4 px-6 rounded-2xl flex items-center justify-center space-x-3 shadow-lg transition-all duration-200 hover:shadow-xl"
            aria-label="Sign in with Gmail"
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span>Sign in with Gmail</span>
          </button>
          
          {/* Continue with Email or Phone Button */}
          <button 
            onClick={onAuth}
            className="w-full bg-white/20 backdrop-blur-sm border border-white/30 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-200 hover:bg-white/30"
            aria-label="Continue with Email or Phone"
          >
            Continue with Email or Phone
          </button>
        </div>
      </div>
    </div>
  )
}