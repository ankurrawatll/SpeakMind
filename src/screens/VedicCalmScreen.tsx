import type { Screen } from '../App'
import VideoPlaylist from '../components/VideoPlaylist'

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

export default function VedicCalmScreen({ onNavigate }: VedicCalmScreenProps) {
  return (
    <VideoPlaylist
      title="Vedic Calm"
      subtitle="Philosophy for mental balance"
      links={VEDIC_CALM_LINKS}
      back={() => onNavigate('home')}
      videoTitles={[
        'Vedic Calm: The Quiet Mind',
        'Vedic Calm: Breath and Presence',
        'Vedic Calm: Clarity in Thought',
        'Vedic Calm: Balance and Being',
        'Vedic Calm: Joy in Stillness',
      ]}
    />
  )
}


