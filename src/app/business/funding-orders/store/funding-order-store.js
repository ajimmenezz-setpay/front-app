import { createStore } from '@/app/shared/store'

const initialState = {
  openConciliateModal: false,
  openCancelFundingOrder: false,
  openDetailsFundingOrder: false,
  fundingOrder: null
}

const fundingOrderStore = (set, get) => ({
  ...initialState,
  setOpenConciliateModal: open => {
    set(
      state => ({
        openConciliateModal: open
      }),
      false,
      'SET_OPEN_CONCILIATE_MODAL'
    )
  },
  setFundingOrder: order => {
    set(
      state => ({
        fundingOrder: order
      }),
      false,
      'SET_FUNDING_ORDER'
    )
  },
  setOpenCancelFundingOrder: open => {
    set(
      state => ({
        openCancelFundingOrder: open
      }),
      false,
      'SET_OPEN_CANCEL_FUNDING_ORDER'
    )
  },
  setOpenDetailsFundingOrder: open => {
    set(
      state => ({
        openDetailsFundingOrder: open
      }),
      false,
      'SET_OPEN_DETAILS_FUNDING_ORDER'
    )
  }
})

export const useFundingOrderStore = createStore(fundingOrderStore)
