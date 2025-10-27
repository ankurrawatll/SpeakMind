import { useMemo, useState } from 'react'
import { IoChevronBack } from 'react-icons/io5'
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
          <h1 className="text-lg font-semibold text-gray-900">Wisdom of the Gita</h1>
          <p className="text-sm text-gray-500">Practical insights for equanimity</p>
        </div>
        <div className="w-10"></div>
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
              key={`${v.id}-${i}`}
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
                <div className="font-medium text-gray-900 truncate">Gita insights</div>
                <div className="text-sm text-gray-500 truncate">Video {i + 1}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}


