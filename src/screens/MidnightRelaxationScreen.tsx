import type { Screen } from '../App'
import VideoPlaylist from '../components/VideoPlaylist'

interface MidnightRelaxationScreenProps {
  onNavigate: (screen: Screen) => void
}

const LINKS: string[] = [
  'https://youtu.be/OBUauvQLrQQ?si=lTE8jy0v5AgGztyZ',
  'https://youtube.com/shorts/cBQWJfSjdAw?si=dnxMPiMbMEq3G6Jx',
  'https://youtu.be/ztLkLKMN5L8?si=gqRTdy7kdXFEvMiV',
  'https://youtu.be/2K4T9HmEhWE?si=E-DjqxzRz-mcZV16',
]

export default function MidnightRelaxationScreen({ onNavigate }: MidnightRelaxationScreenProps) {
  return (
    <VideoPlaylist
      title="Midnight & Relaxation"
      subtitle="Calm yoga & mental health insights"
      links={LINKS}
      back={() => onNavigate('home')}
      videoTitles={[
        'Night Yoga Flow for Relaxation',
        'Short: Breathing for Sleep',
        'Guided Body Scan for Night',
        'Soothing Music for Deep Rest',
      ]}
    />
  )
}


