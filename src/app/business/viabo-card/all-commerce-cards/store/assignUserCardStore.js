import { createStore } from '@/app/shared/store'

const initialState = {
  cardInfo: null,
  openUserInfo: false,
  hoverInfo: null,
  hoverElement: null
}
const assignUserInfo = (set, get) => ({
  ...initialState,
  setOpenUserInfo: open => {
    set(
      state => ({
        openUserInfo: open
      }),
      false,
      'SET_OPEN_USER_INFO_MODAL'
    )
  },
  setCardInfo: card => {
    set(
      state => ({
        cardInfo: card
      }),
      false,
      'SET_CARD_INFO'
    )
  },
  setHoverInfo: info => {
    set(
      state => ({
        hoverInfo: info
      }),
      false,
      'SET_HOVER_INFO'
    )
  },
  setHoverElement: element => {
    set(
      state => ({
        hoverElement: element
      }),
      false,
      'SET_HOVER_ElEMENT'
    )
  }
})

export const useAssignUserCard = createStore(assignUserInfo)
