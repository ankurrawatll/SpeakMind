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

      {/* Avatar with Microphone Icon - White Background */}
      <div className="absolute z-10 w-24 h-24 rounded-full bg-white flex items-center justify-center shadow-lg">
        <svg 
          fill="#6366f1" 
          viewBox="0 0 300 300" 
          className="w-12 h-12"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M149.996,0C67.157,0,0.001,67.161,0.001,149.997S67.157,300,149.996,300s150.003-67.163,150.003-150.003
            S232.835,0,149.996,0z M109.368,100.055c0-21.018,17.1-38.115,38.115-38.115s38.115,17.099,38.115,38.115v45.782
            c0,21.016-17.1,38.113-38.115,38.113c-21.015,0-38.115-17.1-38.115-38.113V100.055z M209.384,147.282
            c0,31.662-23.905,57.832-54.613,61.452v20.915h12.802v15.562H126.41v-15.562h12.802v-21.042
            c-30.231-4.056-53.628-30.003-53.628-61.328v-21.742h15.562v21.742c0,25.549,20.788,46.334,46.337,46.334
            s46.34-20.788,46.34-46.334v-21.742h15.562C209.384,125.537,209.384,147.282,209.384,147.282z"/>
          <path d="M147.483,168.391c12.436,0,22.554-10.115,22.554-22.551v-12.991h-45.108v12.991
            C124.929,158.274,135.047,168.391,147.483,168.391z"/>
        </svg>
      </div>

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
