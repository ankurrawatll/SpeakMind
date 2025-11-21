import React, { useState } from 'react'

interface UserOnboardingScreenProps {
  onComplete: (userData: { age: number; sex: string }) => void
}

interface OnboardingData {
  age: number
  sex: string
  meditationExperience: string
  goals: string[]
  preferredTime: string
  sessionLength: string
  notifications: boolean
}

const UserOnboardingScreen: React.FC<UserOnboardingScreenProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0)
  const [data, setData] = useState<OnboardingData>({
    age: 0,
    sex: '',
    meditationExperience: '',
    goals: [],
    preferredTime: '',
    sessionLength: '',
    notifications: true
  })

  const totalSteps = 6

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      // Complete onboarding - only pass age and sex to be stored
      onComplete({ age: data.age, sex: data.sex })
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const updateData = (field: keyof OnboardingData, value: any) => {
    setData(prev => ({ ...prev, [field]: value }))
  }

  const toggleGoal = (goal: string) => {
    setData(prev => ({
      ...prev,
      goals: prev.goals.includes(goal)
        ? prev.goals.filter(g => g !== goal)
        : [...prev.goals, goal]
    }))
  }

  const isStepValid = () => {
    switch (currentStep) {
      case 0: return data.age > 0
      case 1: return data.sex !== ''
      case 2: return data.meditationExperience !== ''
      case 3: return data.goals.length > 0
      case 4: return data.preferredTime !== ''
      case 5: return data.sessionLength !== ''
      default: return true
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="text-center">
            <div className="text-6xl mb-6">🎂</div>
            <h2 
              className="text-white mb-4 drop-shadow-lg"
              style={{
                fontFamily: 'Manrope, sans-serif',
                fontWeight: 800,
                fontSize: '24px',
                lineHeight: '28px',
                letterSpacing: '0px',
                textAlign: 'center'
              }}
            >
              What's your age?
            </h2>
            <p 
              className="text-white/80 mb-8"
              style={{
                fontFamily: 'Manrope, sans-serif',
                fontWeight: 600,
                fontSize: '16px',
                lineHeight: '20px',
                letterSpacing: '0px',
                textAlign: 'center'
              }}
            >
              This helps us personalize your experience
            </p>
            <div className="space-y-4">
              <input
                type="number"
                placeholder="Enter your age"
                value={data.age || ''}
                onChange={(e) => updateData('age', parseInt(e.target.value) || 0)}
                className="w-full px-4 py-4 bg-black/20 border border-white/25 rounded-xl text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/40 focus:border-white/40 transition-all duration-200 backdrop-blur-lg text-center text-xl"
                min="13"
                max="120"
              />
            </div>
          </div>
        )

      case 1:
        return (
          <div className="text-center">
            <div className="text-6xl mb-6">👤</div>
            <h2 
              className="text-white mb-4 drop-shadow-lg"
              style={{
                fontFamily: 'Manrope, sans-serif',
                fontWeight: 800,
                fontSize: '24px',
                lineHeight: '28px',
                letterSpacing: '0px',
                textAlign: 'center'
              }}
            >
              What's your gender?
            </h2>
            <p 
              className="text-white/80 mb-8"
              style={{
                fontFamily: 'Manrope, sans-serif',
                fontWeight: 600,
                fontSize: '16px',
                lineHeight: '20px',
                letterSpacing: '0px',
                textAlign: 'center'
              }}
            >
              Help us customize your meditation journey
            </p>
            <div className="space-y-3">
              {['Male', 'Female', 'Non-binary', 'Prefer not to say'].map((option) => (
                <button
                  key={option}
                  onClick={() => updateData('sex', option)}
                  className={`w-full py-4 px-6 rounded-xl font-medium transition-all duration-200 backdrop-blur-lg ${
                    data.sex === option
                      ? 'bg-white/20 text-white border-2 border-white/35'
                      : 'bg-white/6 text-white/90 border border-white/15 hover:bg-white/12'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        )

      case 2:
        return (
          <div className="text-center">
            <div className="text-6xl mb-6">🧘‍♀️</div>
            <h2 
              className="text-white mb-4 drop-shadow-lg"
              style={{
                fontFamily: 'Manrope, sans-serif',
                fontWeight: 800,
                fontSize: '24px',
                lineHeight: '28px',
                letterSpacing: '0px',
                textAlign: 'center'
              }}
            >
              Meditation experience?
            </h2>
            <p 
              className="text-white/80 mb-8"
              style={{
                fontFamily: 'Manrope, sans-serif',
                fontWeight: 600,
                fontSize: '16px',
                lineHeight: '20px',
                letterSpacing: '0px',
                textAlign: 'center'
              }}
            >
              We'll adjust the content to your level
            </p>
            <div className="space-y-3">
              {[
                { value: 'beginner', label: 'Complete beginner', desc: 'Never meditated before' },
                { value: 'some', label: 'Some experience', desc: 'Tried it a few times' },
                { value: 'regular', label: 'Regular practice', desc: 'Meditate weekly' },
                { value: 'advanced', label: 'Advanced', desc: 'Daily meditation practice' }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => updateData('meditationExperience', option.value)}
                  className={`w-full py-4 px-6 rounded-xl font-medium transition-all duration-200 text-left backdrop-blur-lg ${
                    data.meditationExperience === option.value
                      ? 'bg-white/20 text-white border-2 border-white/35'
                      : 'bg-white/6 text-white/90 border border-white/15 hover:bg-white/12'
                  }`}
                >
                  <div className="font-semibold">{option.label}</div>
                  <div className="text-sm text-white/70">{option.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )

      case 3:
        return (
          <div className="text-center">
            <div className="text-6xl mb-6">🎯</div>
            <h2 
              className="text-white mb-4 drop-shadow-lg"
              style={{
                fontFamily: 'Manrope, sans-serif',
                fontWeight: 800,
                fontSize: '24px',
                lineHeight: '28px',
                letterSpacing: '0px',
                textAlign: 'center'
              }}
            >
              What are your goals?
            </h2>
            <p 
              className="text-white/80 mb-8"
              style={{
                fontFamily: 'Manrope, sans-serif',
                fontWeight: 600,
                fontSize: '16px',
                lineHeight: '20px',
                letterSpacing: '0px',
                textAlign: 'center'
              }}
            >
              Select all that apply
            </p>
            <div className="grid grid-cols-1 gap-3">
              {[
                { value: 'stress', label: 'Reduce stress', icon: '😌' },
                { value: 'sleep', label: 'Better sleep', icon: '😴' },
                { value: 'focus', label: 'Improve focus', icon: '🎯' },
                { value: 'anxiety', label: 'Manage anxiety', icon: '🕊️' },
                { value: 'happiness', label: 'Increase happiness', icon: '😊' },
                { value: 'mindfulness', label: 'Be more mindful', icon: '🧠' }
              ].map((goal) => (
                <button
                  key={goal.value}
                  onClick={() => toggleGoal(goal.value)}
                  className={`w-full py-4 px-6 rounded-xl font-medium transition-all duration-200 flex items-center gap-3 backdrop-blur-lg ${
                    data.goals.includes(goal.value)
                      ? 'bg-white/20 text-white border-2 border-white/35'
                      : 'bg-white/6 text-white/90 border border-white/15 hover:bg-white/12'
                  }`}
                >
                  <span className="text-2xl">{goal.icon}</span>
                  <span>{goal.label}</span>
                </button>
              ))}
            </div>
          </div>
        )

      case 4:
        return (
          <div className="text-center">
            <div className="text-6xl mb-6">⏰</div>
            <h2 
              className="text-white mb-4 drop-shadow-lg"
              style={{
                fontFamily: 'Manrope, sans-serif',
                fontWeight: 800,
                fontSize: '24px',
                lineHeight: '28px',
                letterSpacing: '0px',
                textAlign: 'center'
              }}
            >
              When do you prefer to meditate?
            </h2>
            <p 
              className="text-white/80 mb-8"
              style={{
                fontFamily: 'Manrope, sans-serif',
                fontWeight: 600,
                fontSize: '16px',
                lineHeight: '20px',
                letterSpacing: '0px',
                textAlign: 'center'
              }}
            >
              We'll send gentle reminders
            </p>
            <div className="space-y-3">
              {[
                { value: 'morning', label: 'Morning', desc: '6:00 - 10:00 AM' },
                { value: 'afternoon', label: 'Afternoon', desc: '12:00 - 5:00 PM' },
                { value: 'evening', label: 'Evening', desc: '6:00 - 9:00 PM' },
                { value: 'night', label: 'Night', desc: '9:00 - 11:00 PM' },
                { value: 'flexible', label: 'Flexible', desc: 'Anytime works' }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => updateData('preferredTime', option.value)}
                  className={`w-full py-4 px-6 rounded-xl font-medium transition-all duration-200 text-left backdrop-blur-lg ${
                    data.preferredTime === option.value
                      ? 'bg-white/20 text-white border-2 border-white/35'
                      : 'bg-white/6 text-white/90 border border-white/15 hover:bg-white/12'
                  }`}
                >
                  <div className="font-semibold">{option.label}</div>
                  <div className="text-sm text-white/70">{option.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )

      case 5:
        return (
          <div className="text-center">
            <div className="text-6xl mb-6">⏱️</div>
            <h2 
              className="text-white mb-4 drop-shadow-lg"
              style={{
                fontFamily: 'Manrope, sans-serif',
                fontWeight: 800,
                fontSize: '24px',
                lineHeight: '28px',
                letterSpacing: '0px',
                textAlign: 'center'
              }}
            >
              Preferred session length?
            </h2>
            <p 
              className="text-white/80 mb-8"
              style={{
                fontFamily: 'Manrope, sans-serif',
                fontWeight: 600,
                fontSize: '16px',
                lineHeight: '20px',
                letterSpacing: '0px',
                textAlign: 'center'
              }}
            >
              You can always adjust this later
            </p>
            <div className="space-y-3">
              {[
                { value: '5', label: '5 minutes', desc: 'Quick daily practice' },
                { value: '10', label: '10 minutes', desc: 'Perfect for beginners' },
                { value: '15', label: '15 minutes', desc: 'Standard session' },
                { value: '20', label: '20 minutes', desc: 'Deep practice' },
                { value: '30', label: '30+ minutes', desc: 'Extended meditation' }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => updateData('sessionLength', option.value)}
                  className={`w-full py-4 px-6 rounded-xl font-medium transition-all duration-200 text-left backdrop-blur-lg ${
                    data.sessionLength === option.value
                      ? 'bg-white/20 text-white border-2 border-white/35'
                      : 'bg-white/6 text-white/90 border border-white/15 hover:bg-white/12'
                  }`}
                >
                  <div className="font-semibold">{option.label}</div>
                  <div className="text-sm text-white/70">{option.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-3 md:p-4 relative"
      style={{
        background: 'linear-gradient(135deg, #9F6AFF 0%, #FF91E7 100%)'
      }}
    >
      
      <div className="w-full max-w-md relative z-10">
        <div className="bg-white/6 backdrop-blur-3xl rounded-2xl md:rounded-3xl p-5 md:p-8 shadow-2xl border border-white/12 relative overflow-hidden">
          {/* Glassmorphism accent */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/12 via-transparent to-white/3 pointer-events-none"></div>
          
          <div className="relative z-10">
            {/* Progress bar */}
            <div className="mb-6 md:mb-8">
              <div className="flex justify-between items-center mb-1.5 md:mb-2">
                <span className="text-xs md:text-sm text-white/70">Step {currentStep + 1} of {totalSteps}</span>
                <span className="text-xs md:text-sm text-white/70">{Math.round(((currentStep + 1) / totalSteps) * 100)}%</span>
              </div>
              <div className="w-full bg-white/15 rounded-full h-1.5 md:h-2 backdrop-blur-sm">
                <div 
                  className="bg-gradient-to-r from-white/80 to-white/60 h-1.5 md:h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Step content */}
            <div className="min-h-[350px] md:min-h-[400px] flex flex-col justify-center">
              {renderStep()}
            </div>

            {/* Navigation buttons */}
            <div className="flex gap-3 md:gap-4 mt-6 md:mt-8">
              {currentStep > 0 && (
                <button
                  onClick={handleBack}
                  className="flex-1 bg-white/6 backdrop-blur-lg text-white/90 py-2.5 md:py-3 rounded-lg md:rounded-xl text-sm md:text-base font-medium hover:bg-white/12 transition-all duration-200 border border-white/15"
                >
                  Back
                </button>
              )}
              <button
                onClick={handleNext}
                disabled={!isStepValid()}
                className="flex-1 bg-white/12 hover:bg-white/20 backdrop-blur-lg text-white py-2.5 md:py-3 rounded-lg md:rounded-xl text-sm md:text-base font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg border border-white/20 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 group-hover:translate-x-full transition-transform duration-700"></div>
                <span className="relative z-10">
                  {currentStep === totalSteps - 1 ? 'Complete Setup' : 'Continue'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserOnboardingScreen