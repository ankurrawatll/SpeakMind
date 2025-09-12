interface OnboardingScreenProps {
  onAuth: () => void
}

export default function OnboardingScreen({ onAuth }: OnboardingScreenProps) {
  return (
    <div className="min-h-screen gradient-bg flex flex-col items-center justify-center px-6 text-white">
      {/* Logo and Branding */}
      <div className="text-center mb-16">
        <div className="text-8xl mb-6">🪷</div>
        <h1 className="text-4xl font-bold font-heading mb-3">SpeakMind</h1>
        <p className="text-xl text-white/90 font-medium">Meditate With Us!</p>
      </div>

      {/* Meditation Illustration */}
      <div className="mb-16 text-center">
        <div className="text-6xl mb-4">🧘‍♀️</div>
        <div className="w-32 h-1 bg-white/30 rounded-full mx-auto mb-2"></div>
        <div className="w-24 h-1 bg-white/20 rounded-full mx-auto"></div>
      </div>

      {/* CTA Buttons */}
      <div className="w-full max-w-sm space-y-4">
        <button 
          onClick={onAuth}
          className="w-full bg-white text-primary-purple font-semibold py-4 px-6 rounded-4xl flex items-center justify-center space-x-3 shadow-button transition-all duration-300 active:scale-95"
        >
          <span className="text-xl">📧</span>
          <span>Sign in with Gmail</span>
        </button>
        
        <button 
          onClick={onAuth}
          className="w-full bg-white/20 backdrop-blur-sm text-white font-semibold py-4 px-6 rounded-4xl border-2 border-white/30 transition-all duration-300 active:scale-95"
        >
          Continue with Email or Phone
        </button>
      </div>

      {/* Footer */}
      <div className="mt-16 text-center">
        <p className="text-white/70 text-sm">
          By continuing, you agree to our Terms & Privacy Policy
        </p>
      </div>
    </div>
  )
}