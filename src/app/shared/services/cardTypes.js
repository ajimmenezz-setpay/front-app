import { AmexLogo, CarnetLogo, MasterCardLogo, VisaLogo } from '@/shared/components/images'

const CARD_TYPES = [
  {
    name: 'MASTER CARD',
    otherNames: ['MASTERCARD'],
    component: MasterCardLogo
  },
  {
    name: 'CARNET',
    otherNames: [],
    component: CarnetLogo
  },
  {
    name: 'VISA',
    otherNames: [],
    component: VisaLogo
  },
  {
    name: 'AMEX',
    otherNames: [],
    component: AmexLogo
  }
]

const getCardTypeByName = name =>
  CARD_TYPES.find(
    card => card?.name === name?.toUpperCase().trim() || card.otherNames.includes(name?.toUpperCase().trim())
  )

const getNameCardsTypes = () => CARD_TYPES.map(cardType => cardType?.name) || []

export { getCardTypeByName, getNameCardsTypes }
