import { createStore } from '@/app/shared/store'

const initialState = {
  cards: [],
  rows: [],
  openAssign: false
}
const commerceCards = (set, get) => ({
  ...initialState,
  setSelectedCard: cardSelected => {
    const { cards } = get()
    const selectedIndex = cards.indexOf(cardSelected)

    let newSelected = []

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(cards, cardSelected)
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(cards.slice(1))
    } else if (selectedIndex === cards.length - 1) {
      newSelected = newSelected.concat(cards.slice(0, -1))
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(cards.slice(0, selectedIndex), cards.slice(selectedIndex + 1))
    }

    set(
      state => ({
        cards: newSelected
      }),
      false,
      'SET_SELECTED_INACTIVE_CARDS'
    )
  },
  setAllCards: cards => {
    set(
      state => ({
        cards
      }),
      false,
      'SET_SELECTED_ALL_INACTIVE_CARDS'
    )
  },
  setIndexCards: rows => {
    set(
      state => ({
        rows
      }),
      false,
      'SET_SELECTED_ALL_INACTIVE_ROWS'
    )
  },
  setOpenAssign: value => {
    set(
      state => ({
        openAssign: value
      }),
      false,
      'SET_OPEN_ASSIGN_SIDEBAR'
    )
  },
  resetCards: () => {
    set(
      state => ({
        cards: [],
        rows: []
      }),
      false,
      'RESET_SELECTED_INACTIVE_CARDS'
    )
  }
})

export const useCommerceCards = createStore(commerceCards)
