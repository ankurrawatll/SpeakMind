import type { Screen } from '../App'
import VideoPlaylist from '../components/VideoPlaylist'

interface MidnightLaunderetteScreenProps {
  onNavigate: (screen: Screen) => void
}

const LINKS: string[] = [
  'https://youtu.be/9oDt2Qkc2jQ?si=TdDObmChHRDf3lVi',
  'https://youtu.be/DkgozEpaeLw?si=PLQqMYSokfNbXqON',
  'https://youtu.be/8wE2EWzymL8?si=Yb0aE2WPhEuifgr5',
  'https://youtu.be/J3VV8FJL69w?si=TwJ4qlfb6VtwxdHC',
  'https://youtu.be/MCoxSL87sS4?si=B14F34paNJb6HD1Z',
  'https://youtu.be/czxUXS5v17g?si=T8WkNJMrEbYZx-Bq',
  'https://youtu.be/A_n_Usx2mto?si=RIh8j7rU0HFanMb-',
  'https://youtu.be/EXedxa9Ili0?si=Nm9SQcJbQRaodaBG',
  'https://youtu.be/VA1HjUc5bxo?si=8vK97YeZUPzLOun0',
  'https://youtu.be/O8WFYOEHDeQ?si=rJil7On5dDxzfmP9',
]

export default function MidnightLaunderetteScreen({ onNavigate }: MidnightLaunderetteScreenProps) {
  return (
    <VideoPlaylist
      title="Midnight Launderette"
      subtitle="Soothing late-night focus & calm videos"
      links={LINKS}
      back={() => onNavigate('home')}
      videoTitles={[
        'Ambient Night: Launderette Drift',
        'Night Cafe: Gentle Focus',
        'City Rain: Midnight Calm',
        'Window Lights: Slow Night',
        'Streetcar: Soft Motion',
        'Neon Alley: Quiet Steps',
        'Launderette Loops: Soft Whirr',
        'Warm Hums: After Hours',
        'Moonlit Corners: Unwind',
        'Closing Time: Last Cycle',
      ]}
    />
  )
}


