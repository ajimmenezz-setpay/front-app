import ViaboCard from '@/shared/assets/img/viabo-card.png'
import ViaboPay from '@/shared/assets/img/viabo-pay.png'

export const SERVICES_NAMES = {
  VIABO_CARD: 'Viabo Card',
  VIABO_PAY: 'Viabo Pay'
}

export const SERVICES_LIST = [
  {
    type: 1,
    name: SERVICES_NAMES.VIABO_PAY,
    description: 'Herramienta de cobro/pago por pefiles,transparencia transaccional y alertas.',
    image: ViaboPay
  },
  {
    type: 2,
    name: SERVICES_NAMES.VIABO_CARD,
    description:
      'Tarjeta CARNET X VIABO para control de gastos, pago de compensaciones, cash-back y fidelización por perfiles.',
    image: ViaboCard
  }
]
