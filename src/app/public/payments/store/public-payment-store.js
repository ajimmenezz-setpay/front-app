import { createStore } from '@/app/shared/store'

const initialState = {
  commerce: null
}

const publicPaymentStore = (set, get) => ({
  ...initialState,
  setCommerceInfo: commerce => {
    set(
      state => ({
        commerce
      }),
      false,
      'SET_PUBLIC_PAYMENT_COMMERCE_INFO'
    )
  }
})

export const usePublicPaymentStore = createStore(publicPaymentStore)
