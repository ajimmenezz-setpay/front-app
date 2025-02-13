import { createStore } from '@/app/shared/store'

const initialState = {
  terminal: null,
  conciliateInfo: { movements: null, total: 0, date: null },
  openConciliate: false
}

const TerminalDetailsStore = (set, get) => ({
  ...initialState,
  setTerminal: terminalSelected => {
    const { terminal } = get()

    set(
      state => ({
        terminal: { ...terminal, ...terminalSelected }
      }),
      false,
      'SET_TERMINAL_SELECTED'
    )
  },
  resetTerminal: () => {
    set(
      state => ({
        terminal: null
      }),
      false,
      'RESET_TERMINAL_SELECTED'
    )
  },

  addTerminalInfo: info => {
    const { terminal } = get()
    set(
      state => ({
        terminal: { ...terminal, ...info }
      }),
      false,
      'SET_TERMINAL_INFO'
    )
  },
  setOpenConciliate: open => {
    set(
      state => ({
        openConciliate: open
      }),
      false,
      'SET_OPEN_CONCILIATE'
    )
  },
  setConciliateMovements: movements => {
    let conciliateInfo = initialState?.conciliateInfo
    if (movements) {
      movements?.sort((a, b) => a.date - b.date)
      const oldMovement = movements?.length > 0 && movements[0]
      const total = movements.reduce((acumulador, movement) => acumulador + movement?.amount, 0)
      conciliateInfo = {
        movements,
        total,
        date: oldMovement?.date
      }
    }

    set(
      state => ({
        conciliateInfo
      }),
      false,
      'SET_CONCILIATE_MOVEMENTS'
    )
  }
})

export const useTerminalDetails = createStore(TerminalDetailsStore)
