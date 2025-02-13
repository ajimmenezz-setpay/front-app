import {
  PayCashLogo,
  SpeiLogo,
  ViaboCardLogo,
  ViaboCoin,
  ViaboPayLogo,
  ViaboSpeiLogo
} from '@/shared/components/images'

const OPERATION_TYPES = [
  {
    name: 'VIABO CARD',
    component: ViaboCardLogo
  },
  {
    name: 'VIABO PAY',
    component: ViaboPayLogo
  },
  {
    name: 'VIABO SPEI',
    component: ViaboSpeiLogo
  },
  {
    name: 'SPEI',
    component: SpeiLogo
  },
  {
    name: 'PAYCASH',
    component: PayCashLogo
  },
  {
    name: 'NUBE',
    component: ViaboCoin
  }
]

const getOperationTypeByName = name => OPERATION_TYPES.find(card => card?.name === name?.toUpperCase().trim())

const getNameOperationTypes = () => OPERATION_TYPES.map(cardType => cardType?.name) || []

export { getNameOperationTypes, getOperationTypeByName }
