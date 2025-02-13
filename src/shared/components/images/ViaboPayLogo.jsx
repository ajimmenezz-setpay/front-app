import ViaboPay from '@/shared/assets/img/viabo-pay.png'
import { Image } from '@/shared/components/images/Image'

export function ViaboPayLogo({ sx, color }) {
  return <Image disabledEffect visibleByDefault alt="logo" src={ViaboPay} sx={{ maxWidth: 150, width: 70 }} />
}
