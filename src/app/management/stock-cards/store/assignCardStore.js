import { createStore } from '@/app/shared/store'

const initialState = {
  open: false,
  card: null,
  isReadyToAssign: false
}
const assignCardStore = (set, get) => ({
  ...initialState,
  setCard: card => {
    set(
      state => ({
        card
      }),
      false,
      'SET_CARD'
    )
  },
  setReadyToAssign: ready => {
    set(
      state => ({
        isReadyToAssign: ready
      }),
      false,
      'SET_READY_TO_ASSIGN'
    )
  },
  setOpen: open => {
    set(
      state => ({
        open
      }),
      false,
      'SET_OPEN'
    )
  }
})

export const useAssignCardStore = createStore(assignCardStore)
