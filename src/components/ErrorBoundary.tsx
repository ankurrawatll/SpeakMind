import React, { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    
    // In production, you would send this to an error tracking service
    // Example: Sentry.captureException(error, { extra: errorInfo })
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 flex items-center justify-center p-6">
          <div className="bg-white/90 backdrop-blur-lg rounded-3xl p-8 shadow-2xl max-w-md w-full border border-white/20">
            <div className="text-center">
              <div className="text-6xl mb-4">😔</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Oops! Something went wrong
              </h2>
              <p className="text-gray-600 mb-6">
                We encountered an unexpected error. Don't worry, your data is safe.
              </p>
              
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-left">
                  <p className="text-sm font-mono text-red-800 break-all">
                    {this.state.error.toString()}
                  </p>
                </div>
              )}

              <button
                onClick={this.handleReset}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-lg"
              >
                Try Again
              </button>
              
              <button
                onClick={() => window.location.href = '/'}
                className="w-full mt-3 bg-white/50 text-gray-700 py-3 rounded-xl font-semibold hover:bg-white/70 transition-all duration-200"
              >
                Go to Home
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
