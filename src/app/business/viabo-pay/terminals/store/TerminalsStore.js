import { createStore } from '@/app/shared/store'

const initialState = {
  terminals: [],
  isOpenList: true,
  isCollapse: false,
  balance: { amount: '$0.00', month: null },
  globalBalance: { amount: '$0.00', month: null }
}

const TerminalsStore = (set, get) => ({
  ...initialState,
  setTerminals: terminals => {
    set(
      state => ({
        terminals
      }),
      false,
      'SET_TERMINALS'
    )
  },
  setOpenList: open => {
    set(
      state => ({
        isOpenList: open
      }),
      false,
      'SET_OPEN_LIST'
    )
  },
  setCollapse: collapse => {
    set(
      state => ({
        isCollapse: collapse
      }),
      false,
      'SET_COLLAPSE'
    )
  },
  setBalance: balance => {
    set(
      state => ({
        balance
      }),
      false,
      'SET_BALANCE'
    )
  },
  setGlobalBalance: globalBalance => {
    set(
      state => ({
        globalBalance
      }),
      false,
      'SET_GLOBAL_BALANCE'
    )
  },

  resetBalance: () => {
    set(
      state => ({
        balance: initialState.balance
      }),
      false,
      'RESET_BALANCE'
    )
  },
  resetGlobalBalance: () => {
    set(
      state => ({
        globalBalance: initialState.globalBalance
      }),
      false,
      'RESET_BALANCE'
    )
  }
})

export const useTerminals = createStore(TerminalsStore)
