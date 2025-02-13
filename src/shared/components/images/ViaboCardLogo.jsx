import ViaboCard from '@/shared/assets/img/viabo-card.png'
import { Image } from '@/shared/components/images/Image'

export function ViaboCardLogo({ sx, color }) {
  return <Image disabledEffect visibleByDefault alt="logo" src={ViaboCard} sx={{ maxWidth: 150, width: 70 }} />
}
