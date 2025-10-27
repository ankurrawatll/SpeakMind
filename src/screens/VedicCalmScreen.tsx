import { useMemo, useState } from 'react'
import { IoChevronBack } from 'react-icons/io5'
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
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 relative pb-20">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <button
          onClick={() => onNavigate('home')}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <IoChevronBack className="w-6 h-6 text-gray-700" />
        </button>
        <div className="text-center">
          <h1 className="text-lg font-semibold text-gray-900">Vedic Calm</h1>
          <p className="text-sm text-gray-500">Philosophy for mental balance</p>
        </div>
        <div className="w-16"></div>
      </div>

      {/* Main Video Player */}
      <div className="px-4 mb-6">
        <div className="bg-gray-100 rounded-2xl overflow-hidden shadow-sm">
          <div className="aspect-video w-full">
            <iframe
              className="w-full h-full"
              src={embedUrl}
              title="Midnight & Relaxation"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
          
        </div>
      </div>

      {/* Video List */}
      <div className="px-4">
        <div className="space-y-3">
          {videos.map((v, i) => (
            <button
              key={v.id}
              onClick={() => setCurrentIndex(i)}
              className={`flex items-center gap-3 p-4 rounded-2xl border transition-all text-left w-full ${
                i === currentIndex
                  ? 'bg-purple-50 border-purple-100'
                  : 'bg-white border-gray-100 hover:bg-gray-50'
              }`}
            >
              <div className="w-16 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                <img
                  src={`https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`}
                  alt="thumbnail"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-900 truncate">Vedic Calm</div>
                <div className="text-sm text-gray-500 truncate">Video {i + 1}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}


