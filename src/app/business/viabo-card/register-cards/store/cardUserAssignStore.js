import { CARD_ASSIGN_PROCESS_LIST } from '@/app/business/viabo-card/register-cards/services'
import { createStore } from '@/app/shared/store'
import { axios } from '@/shared/interceptors'

const initialState = {
  step: CARD_ASSIGN_PROCESS_LIST.CARD_VALIDATION,
  user: null,
  card: null,
  token: null
}
const cardUserAssign = (set, get) => ({
  ...initialState,
  setStepAssignRegister: step => {
    set(
      state => ({
        step
      }),
      false,
      'SET_STEP_ASSIGN'
    )
  },
  setUser: value => {
    set(
      state => ({
        user: value
      }),
      false,
      'SET_USER_ASSIGN'
    )
  },
  setCard: value => {
    set(
      state => ({
        card: value
      }),
      false,
      'SET_CARD_ASSIGN'
    )
  },
  setToken: value => {
    set(
      state => ({
        token: value
      }),
      false,
      'SET_TOKEN_USER_DEMO'
    )
  },
  resetState: () => {
    set(
      state => ({
        ...initialState
      }),
      false,
      'RESET_CARD_USER_STORE'
    )
    localStorage.removeItem('token')
    delete axios.defaults.headers.common.Authorization
  }
})

export const useCardUserAssign = createStore(cardUserAssign)
