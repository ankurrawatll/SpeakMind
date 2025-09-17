import { useMemo, useState } from 'react'
import type { Screen } from '../App'

interface WisdomGitaScreenProps {
  onNavigate: (screen: Screen) => void
}

const GITA_LINKS: string[] = [
  'https://youtube.com/shorts/qf_5P2tdUfI?si=a1Fdre2SvmihRvLo',
  'https://youtube.com/shorts/I0W4oCfwD6U?si=OtYcBfynb11Uyndg',
  'https://youtu.be/IjMnx_X7bLg?si=guV_N5bfC96aryBO',
  'https://youtu.be/N7-9k0pDH6E?si=OH0Sq1bRf1sBNAz8',
  'https://youtu.be/vCmpH-qQx_w?si=WzhCLFgSriuR4DrS',
  'https://youtu.be/FRTpI2Gu1KA?si=-HuyAdXd5XlK-vNt',
  'https://youtu.be/bvzLmm9qgGk?si=Och75czmlk6Uc97E',
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

export default function WisdomGitaScreen({ onNavigate }: WisdomGitaScreenProps) {
  const videos = useMemo(() => GITA_LINKS.map(link => ({
    id: getYouTubeId(link),
    url: link,
    isShort: /shorts\//.test(link),
  })), [])

  const [currentIndex, setCurrentIndex] = useState(0)
  const current = videos[currentIndex]
  const embedUrl = current.isShort
    ? `https://www.youtube.com/embed/${current.id}`
    : `https://www.youtube.com/embed/${current.id}`

  return (
    <div className="min-h-screen relative pb-24">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg"
          alt="Wisdom of the Gita background"
          className="w-full h-full object-cover"/>
        <div className="absolute inset-0 bg-black/30"/>
      </div>

      <div className="relative z-10 px-6 pt-6 pb-3 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Wisdom of the Gita</h1>
          <p className="text-gray-600 text-sm mt-1">Practical insights for equanimity</p>
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
              title="Wisdom of the Gita"
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
              <div className="text-sm font-semibold text-gray-800 truncate">{v.isShort ? 'Short' : 'Video'} {i + 1}</div>
              <div className="text-xs text-gray-600 truncate">YouTube • Gita Insights</div>
            </div>
            {v.isShort && <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-600/30 text-emerald-50">Short</span>}
          </button>
        ))}
      </div>
    </div>
  )
}


