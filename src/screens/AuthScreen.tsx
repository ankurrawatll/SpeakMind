import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'

interface AuthScreenProps {
  onAuth: (wasSignup?: boolean, user?: any) => void
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onAuth }) => {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const { login, signup, loginWithGoogle } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (isLogin) {
        const result = await login(email, password)
        onAuth(false, result?.user) // This was a login
      } else {
        const result = await signup(email, password, displayName)
        onAuth(true, result?.user) // This was a signup
      }
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setError('')
    setLoading(true)

    try {
      const result = await loginWithGoogle()
      // For Google login, we'll treat it as a signup if it's a new user
      // In a real app, you'd check if this is the user's first time
      onAuth(true, result?.user) // Assuming Google users go through onboarding
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex flex-col relative"
      style={{
        background: 'linear-gradient(135deg, #9F6AFF 0%, #FF91E7 100%)'
      }}
    >
      {/* Top Section - Logo and SpeakMind */}
      <div className="flex flex-col items-center pt-16 pb-8">
        <img
          src="/onboarding/speakmindlogoupscaled.png"
          alt="SpeakMind Logo"
          className="w-28 h-28 mb-4"
        />
        <h1
          className="text-white drop-shadow-lg"
          style={{
            fontFamily: 'Manrope, sans-serif',
            fontWeight: 800,
            fontSize: '32px',
            lineHeight: '24px',
            letterSpacing: '0px',
            textAlign: 'center'
          }}
        >
          SpeakMind
        </h1>
      </div>

      {/* Center Section - Welcome message */}
      <div className="flex-1 flex items-center justify-center px-6">
        <p
          className="text-white/90 transition-all duration-500 ease-in-out"
          style={{
            fontFamily: 'Manrope, sans-serif',
            fontWeight: 600,
            fontSize: '17px',
            lineHeight: '22px',
            letterSpacing: '0px',
            textAlign: 'center',
            verticalAlign: 'middle'
          }}
        >
          {isLogin ? 'Welcome back to serenity!' : 'Begin your mindful journey!'}
        </p>
      </div>

      {/* Bottom Section - Auth Form */}
      <div className="px-6 pb-8">
        <div className="bg-white/8 backdrop-blur-2xl rounded-3xl p-6 shadow-2xl border border-white/15 relative overflow-hidden transition-all duration-500 ease-in-out">
          {/* Glassmorphism accent */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/15 via-transparent to-white/3 pointer-events-none"></div>

          <div className="relative z-10">

            {error && (
              <div className="bg-red-500/20 border border-red-400/50 rounded-xl p-3 mb-4 backdrop-blur-md">
                <p className="text-red-100 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className={`relative transition-all duration-500 ease-in-out ${!isLogin ? 'max-h-20 opacity-100 mb-3' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full px-4 py-3 bg-white/8 border border-white/20 rounded-xl text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/40 focus:border-white/40 transition-all duration-200 backdrop-blur-lg"
                  required={!isLogin}
                />
              </div>

              <div className="relative">
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-white/8 border border-white/20 rounded-xl text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/40 focus:border-white/40 transition-all duration-200 backdrop-blur-lg"
                  required
                  autoComplete="username"
                />
              </div>

              <div className="relative">
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-white/8 border border-white/20 rounded-xl text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/40 focus:border-white/40 transition-all duration-200 backdrop-blur-lg"
                  required
                  minLength={6}
                  autoComplete="current-password"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-white/15 hover:bg-white/25 backdrop-blur-lg text-white py-3 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 shadow-lg border border-white/20 relative overflow-hidden group mt-4"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 group-hover:translate-x-full transition-transform duration-700"></div>
                <span className="relative z-10">
                  {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Sign Up')}
                </span>
              </button>
            </form>

            <div className="my-4 flex items-center">
              <div className="flex-1 border-t border-white/30"></div>
              <span className="px-3 text-white/80 text-sm font-medium">or continue with</span>
              <div className="flex-1 border-t border-white/30"></div>
            </div>

            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full bg-white/85 backdrop-blur-lg text-gray-800 py-3 rounded-xl font-semibold hover:bg-white/95 transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-3 shadow-lg border border-white/40 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 group-hover:translate-x-full transition-transform duration-700"></div>
              <svg className="w-5 h-5 relative z-10" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              <span className="relative z-10">Google</span>
            </button>

            <div className="text-center mt-6">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-white/80 hover:text-white transition-colors font-medium"
              >
                {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthScreen