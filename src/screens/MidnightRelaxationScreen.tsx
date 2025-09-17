import { useMemo, useState } from 'react'
import type { Screen } from '../App'

interface MidnightRelaxationScreenProps {
  onNavigate: (screen: Screen) => void
}

const LINKS: string[] = [
  'https://youtu.be/OBUauvQLrQQ?si=lTE8jy0v5AgGztyZ',
  'https://youtube.com/shorts/cBQWJfSjdAw?si=dnxMPiMbMEq3G6Jx',
  'https://youtu.be/ztLkLKMN5L8?si=gqRTdy7kdXFEvMiV',
  'https://youtu.be/2K4T9HmEhWE?si=E-DjqxzRz-mcZV16',
]

const getYouTubeId = (url: string) => {
  const shorts = url.match(/shorts\/([a-zA-Z0-9_-]{6,})/)
  if (shorts) return shorts[1]
  const youtu = url.match(/youtu\.be\/([a-zA-Z0-9_-]{6,})/)
  if (youtu) return youtu[1]
  const watch = url.match(/[?&]v=([a-zA-Z0-9_-]{6,})/)
  if (watch) return watch[1]
  const seg = url.split('/').pop() || ''
  return seg.replace(/\?.*$/, '')
}

export default function MidnightRelaxationScreen({ onNavigate }: MidnightRelaxationScreenProps) {
  const videos = useMemo(() => LINKS.map(link => ({
    id: getYouTubeId(link),
    url: link,
    isShort: /shorts\//.test(link),
  })), [])

  const [currentIndex, setCurrentIndex] = useState(0)
  const current = videos[currentIndex]
  const embedUrl = `https://www.youtube.com/embed/${current.id}`

  return (
    <div className="min-h-screen relative pb-24">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.pexels.com/photos/18071149/pexels-photo-18071149.jpeg"
          alt="Midnight Relaxation background"
          className="w-full h-full object-cover"/>
        <div className="absolute inset-0 bg-black/35"/>
      </div>

      {/* Header */}
      <div className="relative z-10 px-6 pt-6 pb-3 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Midnight & Relaxation</h1>
          <p className="text-white/80 text-sm mt-1">Calm yoga & mental health insights</p>
        </div>
        <button
          onClick={() => onNavigate('home')}
          className="px-3 py-1.5 rounded-full bg-white/80 text-gray-800 text-sm hover:bg-white"
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
              title="Midnight & Relaxation"
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
            key={`${v.id}-${i}`}
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
              <div className="text-sm font-semibold text-white truncate">{v.isShort ? 'Short' : 'Video'} {i + 1}</div>
              <div className="text-xs text-white/80 truncate">YouTube • Relaxation</div>
            </div>
            {v.isShort && <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-600/30 text-emerald-50">Short</span>}
          </button>
        ))}
      </div>
    </div>
  )
}


