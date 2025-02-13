import { createStore } from '@/app/shared/store'

const initialState = {
  cards: [],
  isOpenSidebar: false,
  isCollapse: false,
  selectedCard: null,
  selectedCards: [],
  filterCards: [],
  filterMovements: null,
  openSecurityDetails: false,
  openTransfer: false,
  openAssignCards: false,
  openAddNewCard: false,
  openTransferToCards: false,
  openChangeNIP: false,
  openBuyVirtualCard: false,
  filterKeyMovements: null,
  isListView: true
}

const CardsOfCardCloudStore = (set, get) => ({
  ...initialState,
  setCards: cards => {
    set(
      state => ({
        cards
      }),
      false,
      'CARD_CLOUD_CARDS:SET_CARDS'
    )
  },
  setOpenSidebar: open => {
    set(
      state => ({
        isOpenSidebar: open
      }),
      false,
      'CARD_CLOUD_CARDS:SET_OPEN_SIDE_BAR'
    )
  },
  setCollapse: collapse => {
    set(
      state => ({
        isCollapse: collapse
      }),
      false,
      'CARD_CLOUD_CARDS:SET_COLLAPSE'
    )
  },
  setSelectedCard: card => {
    set(
      state => ({
        selectedCard: card
      }),
      false,
      'CARD_CLOUD_CARDS:SET_SELECTED_CARD'
    )
  },
  updateSelectedCardInfo: card => {
    const { selectedCard } = get()
    set(
      state => ({
        selectedCard: { ...selectedCard, ...card }
      }),
      false,
      'CARD_CLOUD_CARDS:UPDATE_SELECTED_CARD_INFO'
    )
  },
  setFilterMovements: filter => {
    set(
      state => ({
        filterMovements: filter
      }),
      false,
      'CARD_CLOUD_CARDS:SET_FILTER_MOVEMENTS_DATE'
    )
  },
  setOpenSecurityDetails: open => {
    set(
      state => ({
        openSecurityDetails: open
      }),
      false,
      'CARD_CLOUD_CARDS:SET_SECURITY_DETAILS'
    )
  },
  setOpenTransfer: open => {
    set(
      state => ({
        openTransfer: open
      }),
      false,
      'CARD_CLOUD_CARDS:SET_OPEN_TRANSFER'
    )
  },
  setOpenAssignCards: open => {
    set(
      state => ({
        openAssignCards: open
      }),
      false,
      'CARD_CLOUD_CARDS:SET_OPEN_ASSIGN_CARDS'
    )
  },
  setOpenChangeNIP: open => {
    set(
      state => ({
        openChangeNIP: !!open
      }),
      false,
      'CARD_CLOUD_CARDS:SET_OPEN_CHANGE_NIP'
    )
  },
  setFilterKeyMovements: filter => {
    set(
      state => ({
        filterKeyMovements: filter
      }),
      false,
      'CARD_CLOUD_CARDS:SET_FILTER_MOVEMENTS_DATE_KEY'
    )
  },
  setIsListView: isListView => {
    set(
      state => ({
        isListView
      }),
      false,
      'CARD_CLOUD_CARDS:SET_IS_LIST_VIEW'
    )
  },
  setSelectedCards: cards => {
    set(
      state => ({
        selectedCards: cards
      }),
      false,
      'CARD_CLOUD_CARDS:SET_SELECTED_CARDS'
    )
  },
  setFilterCards: cards => {
    set(
      state => ({
        filterCards: cards
      }),
      false,
      'CARD_CLOUD_CARDS:SET_FILTER_CARDS'
    )
  },
  setOpenAddNewCard: open => {
    set(
      state => ({
        openAddNewCard: open
      }),
      false,
      'CARD_CLOUD_CARDS:SET_OPEN_ADD_NEW_CARD'
    )
  },
  setOpenTransferToCards: open => {
    set(
      state => ({
        openTransferToCards: open
      }),
      false,
      'CARD_CLOUD_CARDS:SET_OPEN_TRANSFER_TO_CARDS'
    )
  },
  setOpenBuyVirtualCard: open => {
    set(
      state => ({
        openBuyVirtualCard: open
      }),
      false,
      'CARD_CLOUD_CARDS:SET_OPEN_BUY_VIRTUAL_CARD'
    )
  }
})

export const useCardsOfCardCloudStore = createStore(CardsOfCardCloudStore)
