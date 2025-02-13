import { createStore } from '@/app/shared/store'

const initialState = {
  card: null,
  isMainCardSelected: false,
  cardTypeSelected: null,
  mainCard: null,
  selectedCards: [],
  openFundingOrder: false,
  fundingCard: null
}
const commerceCardDetailsStore = (set, get) => ({
  ...initialState,
  setCard: cardSelected => {
    const { card } = get()

    set(
      state => ({
        card: { ...card, ...cardSelected }
      }),
      false,
      'SET_CARD'
    )
  },
  resetCard: () => {
    set(
      state => ({
        card: null
      }),
      false,
      'RESET_CARD'
    )
  },
  setSelectedCards: cardsSelected => {
    const { card } = get()

    set(
      state => ({
        selectedCards: cardsSelected
      }),
      false,
      'SET_SELECTED_CARDS'
    )
  },
  addInfoCard: info => {
    const { card } = get()
    set(
      state => ({
        card: { ...card, ...info }
      }),
      false,
      'SET_INFO_CARD'
    )
  },
  setMainCard: card => {
    set(
      state => ({
        mainCard: card
      }),
      false,
      'SET_MAIN_CARD'
    )
  },
  setSelectedMainCard: isMainCard => {
    set(
      state => ({
        isMainCardSelected: isMainCard
      }),
      false,
      'SET_IS_MAIN_CARD_SELECTED'
    )
  },
  setOpenFundingOrder: open => {
    set(
      state => ({
        openFundingOrder: open
      }),
      false,
      'SET_OPEN_FUNDING_ORDER'
    )
  },
  setFundingCard: card => {
    set(
      state => ({
        fundingCard: card
      }),
      false,
      'SET_FUNDING_CARD'
    )
  },
  resetFundingOrder: () => {
    set(
      state => ({
        fundingCard: null,
        openFundingOrder: false
      }),
      false,
      'RESET_FUNDING_ORDER'
    )
  },
  setCardTypeSelected: cardTypeId => {
    set(
      state => ({
        cardTypeSelected: cardTypeId
      }),
      false,
      'SET_CARD_TYPE_SELECTED'
    )
  }
})

export const useCommerceDetailsCard = createStore(commerceCardDetailsStore)
