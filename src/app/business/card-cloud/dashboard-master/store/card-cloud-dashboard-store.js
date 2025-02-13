import { createStore } from '@/app/shared/store'

const initialState = {
  dashboardTitle: 'Dashboard Master',
  isOpenMovements: null,
  filterMovements: null,
  enableTransferSubaccounts: false
}
const cardCloudDashboardStore = (set, get) => ({
  ...initialState,
  setDashboardTitle: title => {
    set(
      state => ({
        dashboardTitle: title
      }),
      false,
      'CARD_CLOUD_DASHBOARD:SET_CARD_CLOUD_DASHBOARD_TITLE'
    )
  },
  setFilterMovements: filters => {
    set(
      state => ({
        filterMovements: filters
      }),
      false,
      'CARD_CLOUD_DASHBOARD:SET_CARD_CLOUD_DASHBOARD_FILTERS_MOVEMENTS'
    )
  },
  setOpenMovements: open => {
    set(
      state => ({
        isOpenMovements: open
      }),
      false,
      'CARD_CLOUD_DASHBOARD:SET_CARD_CLOUD_COMPANY_IS_OPEN_MOVEMENTS'
    )
  },
  setEnableTransferSubAccounts: enableTransfer => {
    set(
      state => ({
        enableTransferSubaccounts: enableTransfer
      }),
      false,
      'CARD_CLOUD_DASHBOARD:SET_ENABLE_TRANSFER_SUBACCOUNTS'
    )
  }
})

export const useCardCloudDashboardStore = createStore(cardCloudDashboardStore)
