import React from 'react'

const AmbientBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900">
      <div 
        className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-purple-600/20 blur-[120px] animate-pulse" 
        style={{ animationDuration: '8s' }}
      />
      <div 
        className="absolute bottom-[-10%] right-[-10%] w-[70%] h-[70%] rounded-full bg-pink-600/20 blur-[120px] animate-pulse" 
        style={{ animationDuration: '12s', animationDelay: '1s' }}
      />
      <div 
        className="absolute top-[30%] left-[30%] w-[40%] h-[40%] rounded-full bg-indigo-600/10 blur-[100px] animate-pulse" 
        style={{ animationDuration: '15s', animationDelay: '2s' }}
      />
    </div>
  )
}

export default AmbientBackground
