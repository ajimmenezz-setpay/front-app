import { createStore } from '@/app/shared/store'

const initialState = {
  selectedCompany: null,
  selectedMovement: null,
  openSupportTicket: false,
  companySubAccountInfo: null,
  openTransfer: false
}
const cardCloudSharedStore = (set, get) => ({
  ...initialState,
  setOpenSupportTicket: open => {
    set(
      state => ({
        openSupportTicket: open
      }),
      false,
      'CARD_CLOUD_SHARED:SET_CARD_CLOUD_OPEN_SUPPORT_TICKET'
    )
  },
  setSelectedMovement: movement => {
    set(
      state => ({
        selectedMovement: movement
      }),
      false,
      'CARD_CLOUD_SHARED:SET_CARD_CLOUD_SELECTED_MOVEMENT'
    )
  },
  setSelectedCompany: company => {
    set(
      state => ({
        selectedCompany: company
      }),
      false,
      'CARD_CLOUD_SHARED:SET_CARD_CLOUD_SELECTED_COMPANY'
    )
  },
  setCompanySubAccountInfo: subAccountInfo => {
    set(
      state => ({
        companySubAccountInfo: subAccountInfo
      }),
      false,
      'CARD_CLOUD_SHARED:SET_CARD_CLOUD_COMPANY_SUBACCOUNT_INFO'
    )
  },
  setOpenTransfer: open => {
    set(
      state => ({
        openTransfer: open
      }),
      false,
      'CARD_CLOUD_SHARED:SET_CARD_CLOUD_TRANSFER_SUBACCOUNT'
    )
  }
})

export const useCardCloudSharedStore = createStore(cardCloudSharedStore)
