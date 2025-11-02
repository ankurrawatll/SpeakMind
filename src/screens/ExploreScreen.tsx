// src/screens/ExploreScreen.tsx
import { useState, useMemo } from 'react'
import { IoChevronBack, IoPlay, IoTimeOutline } from 'react-icons/io5'
import type { Screen } from '../App'

interface Video {
  id: string
  title: string
  url: string
  category: string
  duration?: string
  isShort?: boolean
}

interface ExploreScreenProps {
  onNavigate: (screen: Screen) => void
}

// All YouTube links from different screens
const ALL_VIDEOS: Array<{ url: string; category: string; title: string }> = [
  // Midnight Launderette
  { url: 'https://youtu.be/9oDt2Qkc2jQ?si=TdDObmChHRDf3lVi', category: 'Focus', title: 'Deep Focus Session' },
  { url: 'https://youtu.be/DkgozEpaeLw?si=PLQqMYSokfNbXqON', category: 'Focus', title: 'Concentration Flow' },
  { url: 'https://youtu.be/8wE2EWzymL8?si=Yb0aE2WPhEuifgr5', category: 'Focus', title: 'Mindful Work' },
  { url: 'https://youtu.be/J3VV8FJL69w?si=TwJ4qlfb6VtwxdHC', category: 'Focus', title: 'Productive Focus' },
  { url: 'https://youtu.be/MCoxSL87sS4?si=B14F34paNJb6HD1Z', category: 'Focus', title: 'Deep Work Mode' },
  { url: 'https://youtu.be/czxUXS5v17g?si=T8WkNJMrEbYZx-Bq', category: 'Focus', title: 'Concentration Boost' },
  { url: 'https://youtu.be/A_n_Usx2mto?si=RIh8j7rU0HFanMb-', category: 'Focus', title: 'Focused Mindset' },
  { url: 'https://youtu.be/EXedxa9Ili0?si=Nm9SQcJbQRaodaBG', category: 'Focus', title: 'Mental Clarity' },
  { url: 'https://youtu.be/VA1HjUc5bxo?si=8vK97YeZUPzLOun0', category: 'Focus', title: 'Deep Thinking' },
  { url: 'https://youtu.be/O8WFYOEHDeQ?si=rJil7On5dDxzfmP9', category: 'Focus', title: 'Concentration Zone' },

  // Midnight Relaxation
  { url: 'https://youtu.be/OBUauvQLrQQ?si=lTE8jy0v5AgGztyZ', category: 'Sleep', title: 'Peaceful Slumber' },
  { url: 'https://youtube.com/shorts/cBQWJfSjdAw?si=dnxMPiMbMEq3G6Jx', category: 'Sleep', title: 'Quick Relaxation' },
  { url: 'https://youtu.be/ztLkLKMN5L8?si=gqRTdy7kdXFEvMiV', category: 'Sleep', title: 'Calm Night' },
  { url: 'https://youtu.be/2K4T9HmEhWE?si=E-DjqxzRz-mcZV16', category: 'Sleep', title: 'Restful Sleep' },

  // Vedic Calm
  { url: 'https://youtu.be/crCrO28e9fk?si=JDufIJuG0vbFNe7q', category: 'Philosophy', title: 'Ancient Wisdom' },
  { url: 'https://youtu.be/Ef0tk0q-ITo?si=VqlfOQBUUFfTd6Zu', category: 'Philosophy', title: 'Spiritual Calm' },
  { url: 'https://youtu.be/aa2LM2tLnlk?si=lpmt_XNq3S_4nO37', category: 'Philosophy', title: 'Inner Peace' },
  { url: 'https://youtu.be/4koR8WKxHmc?si=fnWYNG7Um_5d9LET', category: 'Philosophy', title: 'Vedic Meditation' },
  { url: 'https://youtu.be/7Zt9bCSpeRw?si=Aw5UiTo3-QBkqaQ8', category: 'Philosophy', title: 'Sacred Silence' },

  // Wisdom of the Gita
  { url: 'https://youtube.com/shorts/qf_5P2tdUfI?si=a1Fdre2SvmihRvLo', category: 'Insights', title: 'Quick Wisdom' },
  { url: 'https://youtube.com/shorts/I0W4oCfwD6U?si=OtYcBfynb11Uyndg', category: 'Insights', title: 'Daily Insight' },
  { url: 'https://youtu.be/IjMnx_X7bLg?si=guV_N5bfC96aryBO', category: 'Insights', title: 'Life Lessons' },
  { url: 'https://youtu.be/N7-9k0pDH6E?si=OH0Sq1bRf1sBNAz8', category: 'Insights', title: 'Ancient Teachings' },
  { url: 'https://youtu.be/vCmpH-qQx_w?si=WzhCLFgSriuR4DrS', category: 'Insights', title: 'Spiritual Guidance' },
  { url: 'https://youtu.be/FRTpI2Gu1KA?si=-HuyAdXd5XlK-vNt', category: 'Insights', title: 'Wisdom Talk' },
  { url: 'https://youtu.be/bvzLmm9qgGk?si=Och75czmlk6Uc97E', category: 'Insights', title: 'Deep Insights' },
]

const getYouTubeId = (url: string) => {
  const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)
  return match ? match[1] : ''
}

const getCategoryColor = (category: string) => {
  const colors = {
    Focus: 'from-blue-500 to-cyan-500',
    Sleep: 'from-purple-500 to-indigo-500',
    Philosophy: 'from-orange-500 to-red-500',
    Insights: 'from-green-500 to-emerald-500',
  }
  return colors[category as keyof typeof colors] || 'from-gray-500 to-gray-600'
}

export default function ExploreScreen({ onNavigate }: ExploreScreenProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  
  const videos = useMemo(() => 
    ALL_VIDEOS.map((video, index) => ({
      id: getYouTubeId(video.url),
      title: video.title,
      url: video.url,
      category: video.category,
      duration: video.isShort ? 'Short' : 'Long',
      isShort: /shorts\//.test(video.url),
    })), [])
  
  const categories = useMemo(() => 
    ['All', ...Array.from(new Set(videos.map(v => v.category)))], [videos])
  
  const filteredVideos = useMemo(() => 
    selectedCategory === 'All' 
      ? videos 
      : videos.filter(video => video.category === selectedCategory), 
    [videos, selectedCategory])

  const handleVideoClick = (video: Video) => {
    // Open video in new tab
    window.open(video.url, '_blank')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 relative pb-20">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white/80 backdrop-blur-md border-b border-white/30">
        <button
          onClick={() => onNavigate('home')}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <IoChevronBack className="w-6 h-6 text-gray-700" />
        </button>
        <div className="text-center">
          <h1 className="text-lg font-semibold text-gray-900">Explore All</h1>
          <p className="text-sm text-gray-500">{videos.length} videos available</p>
        </div>
        <div className="w-10"></div>
      </div>

      {/* Category Filter */}
      <div className="p-4">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                selectedCategory === category
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'bg-white/80 text-gray-700 hover:bg-white'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Video Grid */}
      <div className="px-4">
        <div className="grid grid-cols-1 gap-4">
          {filteredVideos.map((video) => (
            <div
              key={video.id}
              onClick={() => handleVideoClick(video)}
              className="relative rounded-2xl overflow-hidden h-32 flex items-end p-4 cursor-pointer shadow-lg group hover:shadow-xl transition-all"
            >
              {/* Background Image */}
              <div className="absolute inset-0 z-0">
                <img
                  src={`https://i.ytimg.com/vi/${video.id}/maxresdefault.jpg`}
                  alt={video.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              </div>

              {/* Content */}
              <div className="relative z-10 w-full">
                <div className="flex justify-between items-end">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white text-base font-semibold mb-1 drop-shadow truncate">
                      {video.title}
                    </h3>
                    <div className="flex items-center gap-2">
                      <div className={`inline-flex items-center text-[10px] text-white/90 bg-gradient-to-r ${getCategoryColor(video.category)} px-2 py-1 rounded-full`}>
                        {video.category}
                      </div>
                      {video.isShort && (
                        <div className="inline-flex items-center text-[10px] text-white/90 bg-white/20 backdrop-blur px-2 py-1 rounded-full">
                          <IoTimeOutline className="w-3 h-3 mr-1" />
                          Short
                        </div>
                      )}
                    </div>
                  </div>
                  {/* Play Button */}
                  <div className="bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform ml-3 flex-shrink-0">
                    <IoPlay className="text-purple-800 text-lg ml-0.5" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Empty State */}
      {filteredVideos.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 px-4">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
            <IoPlay className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No videos found</h3>
          <p className="text-gray-500 text-center">Try selecting a different category</p>
        </div>
      )}
    </div>
  )
}
