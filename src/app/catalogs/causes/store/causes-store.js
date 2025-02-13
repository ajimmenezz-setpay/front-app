import { createStore } from '@/app/shared/store'

const initialState = {
  openNewCause: false,
  cause: null
}

const causesStore = (set, get) => ({
  ...initialState,
  setOpenNewCause: open => {
    set(
      state => ({
        openNewCause: open
      }),
      false,
      'SET_OPEN_NEW_CAUSE'
    )
  },
  setCause: cause => {
    set(
      state => ({
        cause
      }),
      false,
      'SET_CAUSE_DETAILS'
    )
  }
})

export const useCausesStore = createStore(causesStore)
