import { VIABO_SPEI_PERMISSIONS } from '../../shared/constants'

import { createStore } from '@/app/shared/store'

const initialState = {
  stpAccounts: null,
  selectedAccount: null,
  balanceResume: null,
  balanceFilter: null,
  openSpeiOut: false,
  isOpenTransactions: false,
  filterMovements: null,
  transaction: null,
  isOpenDetailsTransaction: false,
  openPayCommissions: false,
  companies: []
}
const adminDashboardSpeiStore = (set, get) => ({
  ...initialState,
  setStpAccountsByPermissions: (accounts, permissions) => {
    let stpAccounts = null
    if (permissions?.includes(VIABO_SPEI_PERMISSIONS.DASHBOARD_ADMIN)) {
      stpAccounts = {
        type: accounts?.type,
        accounts: accounts?.concentrators || []
      }
    }

    if (permissions?.includes(VIABO_SPEI_PERMISSIONS.DASHBOARD_COST_CENTERS)) {
      stpAccounts = {
        type: accounts?.type,
        accounts: accounts?.costCenters || []
      }
    }

    if (permissions?.includes(VIABO_SPEI_PERMISSIONS.DASHBOARD)) {
      stpAccounts = {
        type: accounts?.type,
        accounts: accounts?.companies || []
      }
    }

    set(
      state => ({
        selectedAccount: stpAccounts?.accounts?.[0] || null,
        stpAccounts
      }),
      false,
      'SET_ADMIN_DASHBOARD_SPEI_STP_ACCOUNTS'
    )
  },
  setOpenSpeiOut: open => {
    set(
      state => ({
        openSpeiOut: open
      }),
      false,
      'SET_ADMIN_DASHBOARD_OPEN_SPEI_OUT'
    )
  },
  setOpenTransactions: open => {
    set(
      state => ({
        isOpenTransactions: open
      }),
      false,
      'SET_ADMIN_DASHBOARD_OPEN_TRANSACTIONS_DETAILS'
    )
  },
  setOpenPayCommissions: open => {
    set(
      state => ({
        openPayCommissions: open
      }),
      false,
      'SET_ADMIN_DASHBOARD_OPEN_PAY_COMMISSIONS'
    )
  },
  setFilterMovements: filters => {
    set(
      state => ({
        filterMovements: filters
      }),
      false,
      'SET_ADMIN_DASHBOARD_FILTERS_MOVEMENTS'
    )
  },
  setTransaction: transaction => {
    set(
      state => ({
        transaction
      }),
      false,
      'SET_ADMIN_DASHBOARD_TRANSACTION_INFO'
    )
  },
  setOpenDetailsTransaction: open => {
    set(
      state => ({
        isOpenDetailsTransaction: open
      }),
      false,
      'SET_ADMIN_DASHBOARD_OPEN_TRANSACTION_DETAILS'
    )
  },
  setBalanceResume: balance => {
    set(
      state => ({
        balanceResume: balance
      }),
      false,
      'SET_ADMIN_DASHBOARD_BALANCE_RESUME'
    )
  },
  setBalanceFilter: filter => {
    set(
      state => ({
        balanceFilter: filter
      }),
      false,
      'SET_ADMIN_DASHBOARD_BALANCE_FILTER'
    )
  },
  setSelectedAccount: account => {
    set(
      state => ({
        selectedAccount: account
      }),
      false,
      'SET_ADMIN_DASHBOARD_SELECTED_ACCOUNT'
    )
  },
  setCompanies: companies => {
    set(
      state => ({
        companies
      }),
      false,
      'SET_ADMIN_DASHBOARD_COMPANIES'
    )
  }
})

export const useAdminDashboardSpeiStore = createStore(adminDashboardSpeiStore)
