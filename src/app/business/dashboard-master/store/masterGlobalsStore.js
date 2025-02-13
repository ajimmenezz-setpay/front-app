import { createStore } from '@/app/shared/store'

const initialState = {
  card: null,
  isMaster: true,
  movements: [],
  balanceMovements: '$0.00',
  income: '$0.00',
  expenses: '$0.00',
  expensesWithInvoice: '$0.00',
  expensesWithoutInvoice: '$0.00',
  expensesWithoutChecked: '$0.00',
  totalExpensesOtherCharges: '$0.00',
  filterPaymentProcessor: null,
  filterDate: null
}

const masterGlobalsStore = (set, get) => ({
  ...initialState,
  setGlobalCard: cardSelected => {
    const { card } = get()

    set(
      state => ({
        card: cardSelected
      }),
      false,
      'SET_GLOBAL_CARD'
    )
  },
  resetGlobalCard: () => {
    set(
      state => ({
        card: null
      }),
      false,
      'RESET_GLOBAL_CARD'
    )
  },
  setIsMaster: isMaster => {
    set(
      state => ({
        isMaster
      }),
      false,
      'SET_IS_MASTER'
    )
  },
  setMovements: movements => {
    set(
      state => ({
        movements: movements?.movements || [],
        balanceMovements: movements?.balanceMovements || '$0.00',
        expenses: movements?.expenses || '$0.00',
        income: movements?.income || '$0.00',
        expensesWithInvoice: movements?.expensesWithInvoice || '$0.00',
        expensesWithoutInvoice: movements?.expensesWithoutInvoice || '$0.00',
        expensesWithoutChecked: movements?.expensesWithoutChecked || '$0.00',
        totalExpensesOtherCharges: movements?.totalExpensesOtherCharges || '$0.00'
      }),
      false,
      'SET_MASTER_MOVEMENTS'
    )
  },
  getBalance: () => {
    const {
      balanceMovements,
      income,
      expenses,
      expensesWithInvoice,
      expensesWithoutInvoice,
      expensesWithoutChecked,
      totalExpensesOtherCharges
    } = get()
    return {
      balanceMovements,
      income,
      expenses,
      expensesWithInvoice,
      expensesWithoutInvoice,
      expensesWithoutChecked,
      totalExpensesOtherCharges
    }
  },
  setFilterPaymentProcessor: filterPaymentProcessor => {
    set(
      state => ({
        filterPaymentProcessor
      }),
      false,
      'SET_FILTER_PAYMENT_PROCESSOR'
    )
  },
  setFilterDate: filterDate => {
    set(
      state => ({
        filterDate
      }),
      false,
      'SET_FILTER_DATE'
    )
  }
})

export const useMasterGlobalStore = createStore(masterGlobalsStore)
