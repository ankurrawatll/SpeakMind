import React from 'react'

interface VisualizerProps {
  volume: number // 0.0 to 1.0
  status: string
}

const Visualizer: React.FC<VisualizerProps> = ({ volume, status }) => {
  // Scale volume slightly to make it more visible
  const scale = 1 + Math.min(volume * 3, 1.5)
  const opacity = 0.3 + Math.min(volume * 2, 0.7)

  const isConnected = status === 'connected'
  const isConnecting = status === 'connecting'

  return (
    <div className="relative flex items-center justify-center w-64 h-64 mx-auto my-12">
      {/* Core Circle */}
      <div
        className={`absolute w-32 h-32 rounded-full transition-all duration-100 ease-out
          ${isConnected ? 'bg-purple-100 shadow-[0_0_50px_rgba(168,85,247,0.3)]' : 'bg-slate-700'}
          ${isConnecting ? 'animate-ping bg-purple-400' : ''}
        `}
        style={{
          transform: isConnected ? `scale(${scale})` : 'scale(1)',
        }}
      />

      {/* Outer Ring 1 */}
      <div
        className={`absolute border border-purple-500/30 rounded-full w-48 h-48 transition-all duration-300 ease-out
          ${isConnected ? 'opacity-100' : 'opacity-0'}
        `}
        style={{
          transform: `scale(${1 + (scale - 1) * 0.5})`,
          opacity: opacity * 0.8
        }}
      />

      {/* Outer Ring 2 */}
      <div
        className={`absolute border border-purple-400/20 rounded-full w-64 h-64 transition-all duration-500 ease-out
          ${isConnected ? 'opacity-100' : 'opacity-0'}
        `}
        style={{
          transform: `scale(${1 + (scale - 1) * 0.2})`,
          opacity: opacity * 0.5
        }}
      />
    </div>
  )
}

export default Visualizer
