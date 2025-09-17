import { useMemo, useState } from 'react'
import type { Screen } from '../App'

interface VedicCalmScreenProps {
  onNavigate: (screen: Screen) => void
}

const VEDIC_CALM_LINKS: string[] = [
  'https://youtu.be/crCrO28e9fk?si=JDufIJuG0vbFNe7q',
  'https://youtu.be/Ef0tk0q-ITo?si=VqlfOQBUUFfTd6Zu',
  'https://youtu.be/aa2LM2tLnlk?si=lpmt_XNq3S_4nO37',
  'https://youtu.be/4koR8WKxHmc?si=fnWYNG7Um_5d9LET',
  'https://youtu.be/7Zt9bCSpeRw?si=Aw5UiTo3-QBkqaQ8',
]

const getYouTubeId = (url: string) => {
  // Handle youtu.be, youtube.com/watch, and shorts URLs
  const shorts = url.match(/shorts\/([a-zA-Z0-9_-]{6,})/)
  if (shorts) return shorts[1]
  const youtu = url.match(/youtu\.be\/([a-zA-Z0-9_-]{6,})/)
  if (youtu) return youtu[1]
  const watch = url.match(/[?&]v=([a-zA-Z0-9_-]{6,})/)
  if (watch) return watch[1]
  // Fallback: last path segment
  const seg = url.split('/').pop() || ''
  return seg.replace(/\?.*$/, '')
}

export default function VedicCalmScreen({ onNavigate }: VedicCalmScreenProps) {
  const videos = useMemo(() => VEDIC_CALM_LINKS.map(link => ({
    id: getYouTubeId(link),
    url: link,
  })), [])

  const [currentIndex, setCurrentIndex] = useState(0)
  const current = videos[currentIndex]
  const embedUrl = `https://www.youtube.com/embed/${current.id}`

  return (
    <div className="min-h-screen relative pb-24">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.pexels.com/photos/15327651/pexels-photo-15327651.jpeg"
          alt="Vedic Calm background"
          className="w-full h-full object-cover"/>
        <div className="absolute inset-0 bg-black/30"/>
      </div>

      <div className="relative z-10 px-6 pt-6 pb-3 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Vedic Calm</h1>
          <p className="text-gray-600 text-sm mt-1">Philosophy for mental balance</p>
        </div>
        <button
          onClick={() => onNavigate('home')}
          className="px-3 py-1.5 rounded-full bg-white/70 text-gray-800 text-sm hover:bg-white"
        >
          Home
        </button>
      </div>

      {/* Player */}
      <div className="relative z-10 px-6">
        <div className="bg-white/15 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden shadow-lg">
          <div className="aspect-video w-full">
            <iframe
              className="w-full h-full"
              src={embedUrl}
              title="Vedic Calm"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </div>
      </div>

      {/* Playlist */}
      <div className="relative z-10 px-6 mt-4 grid grid-cols-1 gap-3">
        {videos.map((v, i) => (
          <button
            key={v.id}
            onClick={() => setCurrentIndex(i)}
            className={`flex items-center gap-3 p-3 rounded-2xl border transition-all text-left ${
              i === currentIndex
                ? 'bg-white/50 backdrop-blur-md border-white/30 shadow'
                : 'bg-white/20 backdrop-blur-md border-white/20 hover:bg-white/30'
            }`}
          >
            <div className="w-20 h-12 rounded-lg overflow-hidden bg-black/30">
              <img
                src={`https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`}
                alt="thumbnail"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold text-gray-800 truncate">Video {i + 1}</div>
              <div className="text-xs text-gray-600 truncate">YouTube • Vedic Calm</div>
            </div>
            {i === currentIndex ? (
              <span className="text-emerald-50 bg-emerald-600/30 px-2 py-0.5 rounded-full text-xs">Now Playing</span>
            ) : (
              <span className="text-gray-800/80 text-sm">Play</span>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}


