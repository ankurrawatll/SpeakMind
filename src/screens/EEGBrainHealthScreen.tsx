import { useState, useEffect } from 'react'
import type { Screen } from '../App'

interface EEGBrainHealthScreenProps {
  onNavigate: (screen: Screen) => void
}

interface BrainWaveData {
  alpha: number[]
  beta: number[]
  theta: number[]
  delta: number[]
  gamma: number[]
  timestamp: number[]
}

interface HealthMetrics {
  focus: number
  stress: number
  relaxation: number
  sleepQuality: number
  overall: number
}

export default function EEGBrainHealthScreen({ onNavigate }: EEGBrainHealthScreenProps) {
  const [isConnected, setIsConnected] = useState(false)
  const [isMonitoring, setIsMonitoring] = useState(false)
  const [currentMetrics, setCurrentMetrics] = useState<HealthMetrics>({
    focus: 75,
    stress: 25,
    relaxation: 80,
    sleepQuality: 70,
    overall: 72
  })

  // Mock brain wave data for visualization
  const [brainWaveData, setBrainWaveData] = useState<BrainWaveData>({
    alpha: [],
    beta: [],
    theta: [],
    delta: [],
    gamma: [],
    timestamp: []
  })

  // Generate mock EEG data
  const generateMockData = () => {
    const now = Date.now()
    const dataPoints = 50
    const newData: BrainWaveData = {
      alpha: [],
      beta: [],
      theta: [],
      delta: [],
      gamma: [],
      timestamp: []
    }

    for (let i = 0; i < dataPoints; i++) {
      const time = now - (dataPoints - i) * 1000 // 1 second intervals
      const t = i / dataPoints // Normalized time 0-1
      
      newData.timestamp.push(time)
      
      // Generate more realistic wave patterns with different characteristics
      // Alpha waves: 8-13 Hz, moderate amplitude, smooth
      newData.alpha.push(
        15 + 8 * Math.sin(t * Math.PI * 2 * 10) + 
        3 * Math.sin(t * Math.PI * 2 * 8) + 
        (Math.random() - 0.5) * 4
      )
      
      // Beta waves: 13-30 Hz, higher frequency, more variable
      newData.beta.push(
        18 + 6 * Math.sin(t * Math.PI * 2 * 20) + 
        4 * Math.sin(t * Math.PI * 2 * 15) + 
        (Math.random() - 0.5) * 6
      )
      
      // Theta waves: 4-8 Hz, lower amplitude, slower
      newData.theta.push(
        8 + 5 * Math.sin(t * Math.PI * 2 * 6) + 
        2 * Math.sin(t * Math.PI * 2 * 4) + 
        (Math.random() - 0.5) * 3
      )
      
      // Delta waves: 0.5-4 Hz, very slow, low amplitude
      newData.delta.push(
        3 + 2 * Math.sin(t * Math.PI * 2 * 2) + 
        1 * Math.sin(t * Math.PI * 2 * 1) + 
        (Math.random() - 0.5) * 2
      )
      
      // Gamma waves: 30-100 Hz, high frequency, small amplitude
      newData.gamma.push(
        35 + 3 * Math.sin(t * Math.PI * 2 * 40) + 
        2 * Math.sin(t * Math.PI * 2 * 60) + 
        (Math.random() - 0.5) * 4
      )
    }

    setBrainWaveData(newData)
  }

  // Update metrics based on brain wave patterns
  const updateMetrics = () => {
    if (brainWaveData.alpha.length === 0) return
    
    const avgAlpha = brainWaveData.alpha.reduce((a, b) => a + b, 0) / brainWaveData.alpha.length
    const avgBeta = brainWaveData.beta.reduce((a, b) => a + b, 0) / brainWaveData.beta.length
    const avgTheta = brainWaveData.theta.reduce((a, b) => a + b, 0) / brainWaveData.theta.length

    // Calculate metrics based on brain wave ratios with fallbacks
    const focus = Math.min(100, Math.max(0, (avgBeta / (avgAlpha + avgTheta + 1)) * 50))
    const stress = Math.min(100, Math.max(0, (avgBeta / (avgAlpha + 1)) * 30))
    const relaxation = Math.min(100, Math.max(0, (avgAlpha / (avgBeta + 1)) * 40))
    const sleepQuality = Math.min(100, Math.max(0, (avgTheta / (avgBeta + 1)) * 60))
    const overall = (focus + relaxation + sleepQuality - stress) / 3

    setCurrentMetrics({
      focus: Math.round(focus) || 75,
      stress: Math.round(stress) || 25,
      relaxation: Math.round(relaxation) || 80,
      sleepQuality: Math.round(sleepQuality) || 70,
      overall: Math.round(Math.max(0, overall)) || 72
    })
  }

  useEffect(() => {
    if (isMonitoring) {
      generateMockData()
      const interval = setInterval(() => {
        generateMockData()
        updateMetrics()
      }, 2000) // Update every 2 seconds

      return () => clearInterval(interval)
    }
  }, [isMonitoring])

  const toggleConnection = () => {
    if (!isConnected) {
      setIsConnected(true)
      setTimeout(() => {
        setIsMonitoring(true)
      }, 1000)
    } else {
      setIsMonitoring(false)
      setTimeout(() => {
        setIsConnected(false)
      }, 500)
    }
  }

  const getMetricColor = (value: number) => {
    if (value >= 80) return 'text-green-600'
    if (value >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getMetricBgColor = (value: number) => {
    if (value >= 80) return 'bg-green-100'
    if (value >= 60) return 'bg-yellow-100'
    return 'bg-red-100'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 relative pb-20">
      {/* Header */}
      <div className="px-4 pt-12 pb-6">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => onNavigate('home')}
            className="p-2 rounded-full bg-white/80 backdrop-blur-sm"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-xl font-semibold text-gray-900">Brain Health</h1>
          <button
            onClick={() => onNavigate('profile')}
            className="p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-colors"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </button>
        </div>

        {/* Hardware Requirement Notice */}
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-2xl">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-100 rounded-full">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-blue-900 mb-1">Hardware Required</h3>
              <p className="text-sm text-blue-700">
                External EEG headband and IoT hardware required to be connected via network for real-time monitoring.
                Currently showing mock data for demonstration.
              </p>
            </div>
          </div>
        </div>

        {/* Connection Status */}
        <div className="mb-6">
          <div className="flex items-center justify-between p-4 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
              <span className="font-medium text-gray-900">
                {isConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
            <button
              onClick={toggleConnection}
              className={`px-4 py-2 rounded-xl font-medium transition-all ${
                isConnected
                  ? 'bg-red-500 text-white hover:bg-red-600'
                  : 'bg-purple-500 text-white hover:bg-purple-600'
              }`}
            >
              {isConnected ? 'Disconnect' : 'Connect Device'}
            </button>
          </div>
        </div>

        {/* EEG Headband Image */}
        <div className="mb-6">
          <div className="relative overflow-hidden rounded-2xl bg-white/80 backdrop-blur-sm border border-gray-100">
            <img
              src="https://images.pexels.com/photos/12197315/pexels-photo-12197315.jpeg"
              alt="EEG Headband"
              className="w-full h-48 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            <div className="absolute bottom-4 left-4 text-white">
              <h3 className="font-semibold text-lg">EEG Monitoring</h3>
              <p className="text-sm opacity-90">Real-time brain wave analysis</p>
            </div>
          </div>
        </div>

        {/* Health Metrics */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Current Metrics</h2>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(currentMetrics).map(([key, value]) => (
              <div key={key} className={`p-4 rounded-2xl ${getMetricBgColor(value)} border border-gray-100`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 capitalize">
                    {key === 'sleepQuality' ? 'Sleep Quality' : key}
                  </span>
                  <span className={`text-lg font-bold ${getMetricColor(value)}`}>
                    {value}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${
                      value >= 80 ? 'bg-green-500' : value >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${value}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Brain Wave Visualization */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Brain Wave Patterns</h2>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 p-4">
            <div className="space-y-6">
              {Object.entries(brainWaveData).filter(([key]) => key !== 'timestamp').map(([waveType, data]) => (
                <div key={waveType} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${
                        waveType === 'alpha' ? 'bg-purple-500' : 
                        waveType === 'beta' ? 'bg-pink-500' :
                        waveType === 'theta' ? 'bg-yellow-500' :
                        waveType === 'delta' ? 'bg-orange-500' : 'bg-green-500'
                      }`}></div>
                      <span className="text-sm font-medium text-gray-700 capitalize">
                        {waveType} Wave
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-gray-500">
                        {waveType === 'alpha' ? '8-13 Hz' : 
                         waveType === 'beta' ? '13-30 Hz' :
                         waveType === 'theta' ? '4-8 Hz' :
                         waveType === 'delta' ? '0.5-4 Hz' : '30-100 Hz'}
                      </span>
                      <div className="text-xs text-gray-400">
                        Avg: {data.length > 0 ? Math.round(data.reduce((a, b) => a + b, 0) / data.length) : 0}μV
                      </div>
                    </div>
                  </div>
                  
                  {/* Wave Visualization Container */}
                  <div className="relative h-16 bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
                    <svg 
                      width="100%" 
                      height="100%" 
                      viewBox="0 0 400 64" 
                      preserveAspectRatio="none"
                      className="w-full h-full"
                    >
                      {/* Grid lines for reference */}
                      <defs>
                        <pattern id={`grid-${waveType}`} width="20" height="16" patternUnits="userSpaceOnUse">
                          <path d="M 20 0 L 0 0 0 16" fill="none" stroke="#e5e7eb" strokeWidth="0.5"/>
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill={`url(#grid-${waveType})`} />
                      
                      {/* Wave pattern */}
                      {data.length > 0 && (
                        <polyline
                          fill="none"
                          stroke={waveType === 'alpha' ? '#9D7CF3' : 
                                 waveType === 'beta' ? '#FFB8C4' :
                                 waveType === 'theta' ? '#FDC75E' :
                                 waveType === 'delta' ? '#FF9A76' : '#10B981'}
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          points={data.map((value, index) => {
                            const x = (index / (data.length - 1)) * 400
                            const y = 32 - ((value - 5) / 50) * 30 // Normalize to 0-50 range, center at 32
                            return `${x},${Math.max(2, Math.min(62, y))}`
                          }).join(' ')}
                        />
                      )}
                      
                      {/* Center line */}
                      <line x1="0" y1="32" x2="400" y2="32" stroke="#d1d5db" strokeWidth="1" strokeDasharray="2,2"/>
                    </svg>
                    
                    {/* Amplitude indicators */}
                    <div className="absolute right-2 top-1 text-xs text-gray-400">
                      <div>+50μV</div>
                      <div className="mt-4">0μV</div>
                      <div className="mt-4">-50μV</div>
                    </div>
                  </div>
                  
                  {/* Wave characteristics */}
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Frequency Range</span>
                    <span>Amplitude Range</span>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Legend */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Wave Types & Functions</h4>
              <div className="grid grid-cols-1 gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                  <span className="text-gray-600"><strong>Alpha (8-13 Hz):</strong> Relaxed awareness, meditation</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-pink-500"></div>
                  <span className="text-gray-600"><strong>Beta (13-30 Hz):</strong> Active concentration, alertness</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <span className="text-gray-600"><strong>Theta (4-8 Hz):</strong> Deep relaxation, creativity</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                  <span className="text-gray-600"><strong>Delta (0.5-4 Hz):</strong> Deep sleep, unconscious</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-gray-600"><strong>Gamma (30-100 Hz):</strong> High-level processing, insight</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Analysis Insights */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">AI Analysis</h2>
          <div className="space-y-3">
            <div className="p-4 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-purple-100 rounded-full">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Focus Analysis</h3>
                  <p className="text-sm text-gray-600">
                    {currentMetrics.focus >= 70 
                      ? "Excellent focus levels detected. Your brain shows optimal beta wave activity."
                      : currentMetrics.focus >= 50
                      ? "Moderate focus levels. Consider meditation to enhance concentration."
                      : "Low focus detected. Try breathing exercises or take a short break."
                    }
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-green-100 rounded-full">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Stress Levels</h3>
                  <p className="text-sm text-gray-600">
                    {currentMetrics.stress <= 30
                      ? "Low stress levels detected. Your alpha waves indicate a calm state."
                      : currentMetrics.stress <= 60
                      ? "Moderate stress levels. Consider relaxation techniques."
                      : "High stress detected. Deep breathing and meditation recommended."
                    }
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-100 rounded-full">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Sleep Quality</h3>
                  <p className="text-sm text-gray-600">
                    {currentMetrics.sleepQuality >= 70
                      ? "Good sleep quality indicators. Theta waves suggest healthy sleep patterns."
                      : currentMetrics.sleepQuality >= 50
                      ? "Fair sleep quality. Consider improving sleep hygiene."
                      : "Poor sleep indicators detected. Focus on sleep routine and relaxation."
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => onNavigate('meditation')}
            className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all"
          >
            Start Meditation Session
          </button>
          
          <button
            onClick={() => onNavigate('profile')}
            className="w-full py-3 bg-white/80 backdrop-blur-sm text-gray-700 font-medium rounded-2xl border border-gray-200 hover:bg-white transition-all"
          >
            View Detailed Reports
          </button>
        </div>
      </div>
    </div>
  )
}
