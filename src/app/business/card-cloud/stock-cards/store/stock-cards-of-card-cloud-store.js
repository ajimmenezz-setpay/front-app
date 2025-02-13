import { createStore } from '@/app/shared/store'

const initialState = {
  openAssignCards: false
}

const StockCardsOfCardCloudStore = (set, get) => ({
  ...initialState,
  setOpenAssignCards: open => {
    set(
      state => ({
        openAssignCards: open
      }),
      false,
      'CARD_CLOUD_STOCK_CARDS:SET_OPEN_ASSIGN_CARDS'
    )
  }
})

export const useStockCardsOfCardCloudStore = createStore(StockCardsOfCardCloudStore)
