import type { Screen } from '../App'
import VideoPlaylist from '../components/VideoPlaylist'

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
  return (
    <VideoPlaylist
      title="Wisdom of the Gita"
      subtitle="Practical insights for equanimity"
      links={GITA_LINKS}
      back={() => onNavigate('home')}
      videoTitles={[
        'Gita Short: Equanimity in Action',
        'Gita Short: Duty without Attachment',
        'Gita Talk: The Way of Detached Action',
        'Gita Talk: Understanding the Self',
        'Gita Talk: Mastering the Mind',
        'Gita Talk: Finding Purpose',
        'Gita Talk: Inner Strength',
      ]}
    />
  )
}


