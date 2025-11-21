// AI Analysis Report Component
// Displays the AI-generated insights from EEG meditation session

import { useState } from 'react'
import type { EEGSession } from '../utils/eegService'

interface EEGAnalysisReportProps {
  session: EEGSession
  aiAnalysis: string
  onClose: () => void
}

export default function EEGAnalysisReport({ session, aiAnalysis, onClose }: EEGAnalysisReportProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  // Calculate summary metrics
  const avgAlpha = session.dataPoints.reduce((sum, p) => sum + p.alpha, 0) / session.dataPoints.length
  const avgBeta = session.dataPoints.reduce((sum, p) => sum + p.beta, 0) / session.dataPoints.length
  const avgTheta = session.dataPoints.reduce((sum, p) => sum + p.theta, 0) / session.dataPoints.length

  const focus = Math.min(100, Math.max(0, (avgBeta / (avgAlpha + avgTheta + 1)) * 50))
  const stress = Math.min(100, Math.max(0, (avgBeta / (avgAlpha + 1)) * 30))
  const relaxation = Math.min(100, Math.max(0, (avgAlpha / (avgBeta + 1)) * 40))

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 p-6 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onClose}
          className="p-2 rounded-full bg-white/80 backdrop-blur-sm"
        >
          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-xl font-semibold text-gray-900">Session Analysis</h1>
        <div className="w-10"></div>
      </div>

      {/* Session Summary Card */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Session Summary</h2>
          <span className="text-sm text-gray-500">
            {new Date(session.startTime).toLocaleDateString()}
          </span>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600 mb-1">Duration</p>
            <p className="text-xl font-bold text-gray-900">
              {Math.floor(session.duration / 60)}m {session.duration % 60}s
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Data Points</p>
            <p className="text-xl font-bold text-gray-900">{session.dataPoints.length}</p>
          </div>
        </div>
      </div>

      {/* Quick Metrics */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 p-4 text-center">
          <p className="text-xs text-gray-600 mb-1">Focus</p>
          <p className={`text-2xl font-bold ${
            focus >= 70 ? 'text-green-600' : focus >= 50 ? 'text-yellow-600' : 'text-red-600'
          }`}>
            {focus.toFixed(0)}%
          </p>
        </div>
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 p-4 text-center">
          <p className="text-xs text-gray-600 mb-1">Relaxation</p>
          <p className={`text-2xl font-bold ${
            relaxation >= 70 ? 'text-green-600' : relaxation >= 50 ? 'text-yellow-600' : 'text-red-600'
          }`}>
            {relaxation.toFixed(0)}%
          </p>
        </div>
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 p-4 text-center">
          <p className="text-xs text-gray-600 mb-1">Stress</p>
          <p className={`text-2xl font-bold ${
            stress <= 30 ? 'text-green-600' : stress <= 60 ? 'text-yellow-600' : 'text-red-600'
          }`}>
            {stress.toFixed(0)}%
          </p>
        </div>
      </div>

      {/* AI Analysis */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-full">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-gray-900">AI Analysis</h2>
          </div>
        </div>
        
        <div className="prose prose-sm max-w-none">
          <div className={`text-gray-700 whitespace-pre-line ${!isExpanded ? 'line-clamp-6' : ''}`}>
            {aiAnalysis}
          </div>
          
          {aiAnalysis.length > 300 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-4 text-purple-600 font-medium text-sm"
            >
              {isExpanded ? 'Show Less' : 'Read More'}
            </button>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <button
          onClick={onClose}
          className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all"
        >
          Done
        </button>
        
        <button
          onClick={() => {
            // Share functionality could go here
            navigator.share?.({
              title: 'My Meditation Session Analysis',
              text: aiAnalysis.substring(0, 200) + '...',
            }).catch(() => {
              // Fallback: copy to clipboard
              navigator.clipboard.writeText(aiAnalysis)
              alert('Analysis copied to clipboard!')
            })
          }}
          className="w-full py-3 bg-white/80 backdrop-blur-sm text-gray-700 font-medium rounded-2xl border border-gray-200 hover:bg-white transition-all"
        >
          Share Analysis
        </button>
      </div>
    </div>
  )
}

