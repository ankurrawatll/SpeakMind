import { useState, useEffect } from 'react'
import type { Screen } from '../App'

interface MindCoachScreenProps {
  onNavigate: (screen: Screen) => void
  user: {
    name: string
    streak: number
    level: number
    timemeditated: number
    meditations: number
    points: number
  }
}

export default function MindCoachScreen({ onNavigate }: MindCoachScreenProps) {
  const [isMuted, setIsMuted] = useState(false)

  useEffect(() => {
    // Initialize Heygen avatar with correct knowledge base
    const initializeHeygen = () => {
      const script = document.createElement('script')
      script.innerHTML = `
        !function(window){
          const host="https://labs.heygen.com",
          url=host+"/guest/streaming-embed?share=eyJxdWFsaXR5IjoiaGlnaCIsImF2YXRhck5hbWUiOiI2MGY4MGVlYTk3NTM0OGZhYjZhZjcwOWU5%0D%0AZTQ0OWYzMyIsInByZXZpZXdJbWciOiJodHRwczovL2ZpbGVzMi5oZXlnZW4uYWkvYXZhdGFyL3Yz%0D%0ALzYwZjgwZWVhOTc1MzQ4ZmFiNmFmNzA5ZTllNDQ5ZjMzL2Z1bGwvMi4yL3ByZXZpZXdfdGFyZ2V0%0D%0ALndlYnAiLCJuZWVkUmVtb3ZlQmFja2dyb3VuZCI6ZmFsc2UsImtub3dsZWRnZUJhc2VJZCI6IjIx%0D%0AOGExZTA5MTRmNjQ2ZWI4OGMzMDRmMzQ2Njg2NzdiIiwidXNlcm5hbWUiOiIzZjU3Zjc1MzRlMzc0%0D%0AZjVhYTczY2MwM2IzNjM1ZTJhNCJ9&inIFrame=1",
          clientWidth=document.body.clientWidth,
          wrapDiv=document.createElement("div");
          wrapDiv.id="heygen-streaming-embed";
          const container=document.createElement("div");
          container.id="heygen-streaming-container";
          const stylesheet=document.createElement("style");
          stylesheet.innerHTML=\`
            #heygen-streaming-embed {
              z-index: 1;
              position: fixed;
              top: 80px;
              left: 20px;
              right: 20px;
              bottom: 180px;
              width: calc(100vw - 40px);
              max-width: 400px;
              margin: 0 auto;
              border-radius: 24px;
              border: 0;
              box-shadow: 0px 8px 24px 0px rgba(0, 0, 0, 0.15);
              overflow: hidden;
              opacity: 1;
              visibility: visible;
              background: linear-gradient(135deg, #4A5568 0%, #2D3748 50%, #1A202C 100%);
            }
            #heygen-streaming-container {
              width: 100%;
              height: 100%;
            }
            #heygen-streaming-container iframe {
              width: 100%;
              height: 100%;
              border: 0;
              border-radius: 24px;
            }
          \`;
          const iframe=document.createElement("iframe");
          iframe.allowFullscreen=false;
          iframe.title="Streaming Embed";
          iframe.role="dialog";
          iframe.allow="microphone";
          iframe.src=url;
          container.appendChild(iframe);
          wrapDiv.appendChild(stylesheet);
          wrapDiv.appendChild(container);
          document.body.appendChild(wrapDiv);
        }(globalThis);
      `
      document.head.appendChild(script)
    }

    initializeHeygen()

    return () => {
      // Cleanup Heygen embed on unmount
      const embed = document.getElementById('heygen-streaming-embed')
      if (embed) {
        embed.remove()
      }
    }
  }, [])

  const handleEndCall = () => {
    onNavigate('home')
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  return (
    <div className="h-screen bg-white overflow-hidden flex flex-col">
      

      {/* Header */}
      <div className="text-center py-4 pb-6 flex-shrink-0">
        <h1 className="text-black text-lg font-semibold">Mind Coach</h1>
      </div>

      {/* Main Video Area - Heygen Avatar will appear here */}
      <div className="flex-1 px-5 pb-20 overflow-hidden">
        <div className="relative mx-auto max-w-sm h-full flex items-center justify-center">
          {/* Video Container - Heygen will inject here */}
          <div className="relative aspect-[3/4] bg-white rounded-3xl overflow-hidden max-h-full">
            {/* Fallback content while Heygen loads */}
            <div className="absolute inset-0 bg-white flex items-center justify-center">
              <div className="text-black text-center">
                <div className="text-4xl mb-2">👩‍💼</div>
                <div className="text-sm opacity-80">Loading Mind Coach...</div>
              </div>
            </div>

            {/* Top Right Controls */}
            <div className="absolute top-4 right-4 flex items-center space-x-2 z-10">
              <button className="w-8 h-8 bg-black/30 rounded-full flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </button>
              <button className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                  <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="fixed bottom-20 left-0 right-0 flex-shrink-0">
        <div className="flex items-center justify-center space-x-8 px-8">
          {/* Pause/Resume Button */}
          <button className="w-14 h-14 bg-gray-600 rounded-full flex items-center justify-center shadow-lg">
            <div className="flex space-x-1">
              <div className="w-1.5 h-5 bg-white rounded"></div>
              <div className="w-1.5 h-5 bg-white rounded"></div>
            </div>
          </button>

          {/* Microphone Toggle */}
          <button 
            onClick={toggleMute}
            className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg ${
              isMuted ? 'bg-gray-600' : 'bg-gray-600'
            }`}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
              {isMuted ? (
                <path d="M19 11h-1.7c0 .74-.16 1.43-.43 2.05l1.23 1.23c.56-.98.9-2.09.9-3.28zm-4.02.17c0-.06.02-.11.02-.17V5c0-1.66-1.34-3-3-3S9 3.34 9 5v.18l5.98 5.99zM4.27 3L3 4.27l6.01 6.01V11c0 1.66 1.33 3 2.99 3 .22 0 .44-.03.65-.08l1.66 1.66c-.71.33-1.5.52-2.31.52-2.76 0-5.3-2.1-5.3-5.1H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c.91-.13 1.77-.45 2.54-.9L19.73 21 21 19.73 4.27 3z"/>
              ) : (
                <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28C16.28 17.23 19 14.41 19 11h-1.7z"/>
              )}
            </svg>
          </button>

          {/* End Call Button */}
          <button 
            onClick={handleEndCall}
            className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center shadow-lg"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
              <path d="M12 9c-1.6 0-3.15.25-4.6.72v3.1c0 .39-.23.74-.56.9-.98.49-1.87 1.12-2.66 1.85-.18.18-.43.28-.7.28-.28 0-.53-.11-.71-.29L.29 13.08c-.18-.17-.29-.42-.29-.7 0-.28.11-.53.29-.71C3.34 8.78 7.46 7 12 7s8.66 1.78 11.71 4.67c.18.18.29.43.29.71 0 .28-.11.53-.29.7l-2.48 2.48c-.18.18-.43.29-.71.29-.27 0-.52-.1-.7-.28-.79-.73-1.68-1.36-2.66-1.85-.33-.16-.56-.51-.56-.9v-3.1C15.15 9.25 13.6 9 12 9z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}