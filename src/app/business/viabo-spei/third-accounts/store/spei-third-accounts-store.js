import { VIABO_SPEI_PERMISSIONS } from '../../shared/constants'

import { createStore } from '@/app/shared/store'

const initialState = {
  account: null,
  openNewAccount: false,
  openDeleteAccount: false,
  openTransfer: false,
  selectedThirdAccounts: [],
  stpAccounts: null,
  originAccount: null
}
const speiThirdAccountsStore = (set, get) => ({
  ...initialState,
  setSpeiThirdAccount: account => {
    set(
      state => ({
        account
      }),
      false,
      'SPEI:SET_THIRD_ACCOUNT'
    )
  },
  setOpenNewSpeiThirdAccount: open => {
    set(
      state => ({
        openNewAccount: open
      }),
      false,
      'SPEI:SET_OPEN_NEW_THIRD_ACCOUNT'
    )
  },
  setOpenDeleteSpeiThirdAccount: open => {
    set(
      state => ({
        openDeleteAccount: open
      }),
      false,
      'SPEI:SET_OPEN_DELETE_THIRD_ACCOUNT'
    )
  },
  setOpenTransfer: open => {
    set(
      state => ({
        openTransfer: open
      }),
      false,
      'SPEI:SET_OPEN_TRANSFER'
    )
  },
  setSelectedThirdAccounts: accounts => {
    set(
      state => ({
        selectedThirdAccounts: accounts
      }),
      false,
      'SPEI:SET_SELECTED_THIRD_ACCOUNTS_TRANSFER'
    )
  },
  setOriginAccount: origin => {
    set(
      state => ({
        originAccount: origin
      }),
      false,
      'SPEI:SET_ORIGIN_ACCOUNT'
    )
  },
  setOriginAccountByPermissions: (accounts, permissions) => {
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
        originAccount: stpAccounts?.accounts?.[0] || null,
        stpAccounts
      }),
      false,
      'SPEI:SET_SPEI_STP_ORIGIN_ACCOUNT'
    )
  }
})

export const useSpeiThirdAccounts = createStore(speiThirdAccountsStore)
