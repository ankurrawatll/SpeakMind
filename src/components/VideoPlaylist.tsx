import { useMemo, useState } from 'react'

interface VideoPlaylistProps {
  title: string
  subtitle?: string
  links: string[]
  back: () => void
  headerIcon?: React.ReactNode
  videoTitles?: string[]
}

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

export default function VideoPlaylist({ title, subtitle, links, back, headerIcon, videoTitles }: VideoPlaylistProps) {
  const videos = useMemo(() => links.map(link => ({
    id: getYouTubeId(link),
    url: link,
  })), [links])

  const [currentIndex, setCurrentIndex] = useState(0)
  const current = videos[currentIndex]
  const currentTitle = videoTitles?.[currentIndex] || `${title} • Video ${currentIndex + 1}`
  const embedUrl = `https://www.youtube.com/embed/${current.id}`

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 relative pb-20">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <button onClick={back} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          {headerIcon || (
            <svg className="w-6 h-6 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          )}
        </button>
        <div className="text-center">
          <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>
        <div className="w-10" />
      </div>

      {/* Main Video Player */}
      <div className="px-4 mb-4">
        <div className="bg-white/80 backdrop-blur-md rounded-2xl overflow-hidden shadow-sm border border-white/50">
          <div className="aspect-video w-full">
            <iframe
              className="w-full h-full"
              src={embedUrl}
              title={currentTitle}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
          <div className="p-4">
            <div className="text-gray-900 font-medium truncate">{currentTitle}</div>
            <a href={current.url} target="_blank" rel="noreferrer" className="text-xs text-blue-600">Open on YouTube →</a>
          </div>
        </div>
      </div>

      {/* Video Grid */}
      <div className="px-4 pb-2">
        <div className="grid grid-cols-2 gap-3">
          {videos.map((v, i) => (
            <button
              key={`${v.id}-${i}`}
              onClick={() => setCurrentIndex(i)}
              className={`group rounded-2xl overflow-hidden border transition-all text-left ${
                i === currentIndex ? 'bg-purple-50 border-purple-100' : 'bg-white border-gray-100 hover:bg-gray-50'
              }`}
            >
              <div className="relative">
                <img
                  src={`https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`}
                  alt="thumbnail"
                  className="w-full h-28 object-cover"
                />
                <div className={`absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors`} />
              </div>
              <div className="p-3">
                <div className="text-sm font-medium text-gray-900 line-clamp-2">
                  {videoTitles?.[i] || `${title} • Video ${i + 1}`}
                </div>
                <div className="text-xs text-gray-500 mt-1">Tap to play</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}


