// Real-time EEG Visualizer Component
// Displays live brain wave patterns during meditation session

import { useEffect, useRef, useState } from 'react'
import type { EEGDataPoint } from '../utils/eegService'

interface EEGVisualizerProps {
  data: EEGDataPoint | null
  isActive: boolean
}

export default function EEGVisualizer({ data, isActive }: EEGVisualizerProps) {
  const [waveHistory, setWaveHistory] = useState<{
    alpha: number[]
    beta: number[]
    theta: number[]
    delta: number[]
    gamma: number[]
  }>({
    alpha: [],
    beta: [],
    theta: [],
    delta: [],
    gamma: []
  })

  const maxDataPoints = 100 // Show last 100 data points
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!data || !isActive) return

    setWaveHistory(prev => {
      const update = (arr: number[], value: number) => {
        const newArr = [...arr, value]
        return newArr.slice(-maxDataPoints)
      }

      return {
        alpha: update(prev.alpha, data.alpha),
        beta: update(prev.beta, data.beta),
        theta: update(prev.theta, data.theta),
        delta: update(prev.delta, data.delta),
        gamma: update(prev.gamma, data.gamma)
      }
    })
  }, [data, isActive])

  const renderWave = (
    values: number[],
    color: string,
    height: number,
    yOffset: number
  ) => {
    if (values.length === 0) return null

    const width = 400
    const maxAmplitude = 50
    const normalizedValues = values.map(v => Math.max(-maxAmplitude, Math.min(maxAmplitude, v)))
    
    const points = normalizedValues.map((value, index) => {
      const x = (index / (maxDataPoints - 1)) * width
      const y = height / 2 - (value / maxAmplitude) * (height / 2) + yOffset
      return `${x},${y}`
    }).join(' ')

    return (
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        points={points}
      />
    )
  }

  const waveConfigs = [
    { key: 'alpha' as const, color: '#9D7CF3', label: 'Alpha', freq: '8-13 Hz' },
    { key: 'beta' as const, color: '#FFB8C4', label: 'Beta', freq: '13-30 Hz' },
    { key: 'theta' as const, color: '#FDC75E', label: 'Theta', freq: '4-8 Hz' },
    { key: 'delta' as const, color: '#FF9A76', label: 'Delta', freq: '0.5-4 Hz' },
    { key: 'gamma' as const, color: '#10B981', label: 'Gamma', freq: '30-100 Hz' }
  ]

  if (!isActive) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 p-6">
        <div className="text-center text-gray-500">
          <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <p className="text-sm">EEG visualization will appear when session starts</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 p-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Live Brain Waves</h3>
      
      <div className="space-y-4">
        {waveConfigs.map((config, index) => {
          const values = waveHistory[config.key]
          const currentValue = data ? data[config.key] : 0
          
          return (
            <div key={config.key} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: config.color }}
                  ></div>
                  <span className="text-sm font-medium text-gray-700">{config.label}</span>
                  <span className="text-xs text-gray-500">({config.freq})</span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold text-gray-600">
                    {currentValue.toFixed(1)}μV
                  </span>
                </div>
              </div>
              
              <div className="relative h-20 bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
                <svg
                  ref={svgRef}
                  width="100%"
                  height="100%"
                  viewBox="0 0 400 80"
                  preserveAspectRatio="none"
                  className="w-full h-full"
                >
                  {/* Grid pattern */}
                  <defs>
                    <pattern id={`grid-${config.key}`} width="20" height="20" patternUnits="userSpaceOnUse">
                      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e5e7eb" strokeWidth="0.5"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill={`url(#grid-${config.key})`} />
                  
                  {/* Center line */}
                  <line x1="0" y1="40" x2="400" y2="40" stroke="#d1d5db" strokeWidth="1" strokeDasharray="2,2"/>
                  
                  {/* Wave visualization */}
                  {values.length > 0 && renderWave(values, config.color, 80, 0)}
                </svg>
              </div>
            </div>
          )
        })}
      </div>
      
      {/* Connection status indicator */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs text-gray-600">Receiving live data</span>
        </div>
      </div>
    </div>
  )
}

