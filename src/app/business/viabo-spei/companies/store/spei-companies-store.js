import { VIABO_SPEI_PERMISSIONS } from '../../shared/constants'

import { createStore } from '@/app/shared/store'

const initialState = {
  company: null,
  openNewCompany: false,
  selectedCompanies: [],
  openTransfer: false,
  stpAccounts: null,
  originAccount: null
}
const speiCompaniesStore = (set, get) => ({
  ...initialState,
  setSpeiCompany: company => {
    set(
      state => ({
        company
      }),
      false,
      'SET_SPEI_COMPANY'
    )
  },
  setOpenNewSpeiCompany: open => {
    set(
      state => ({
        openNewCompany: open
      }),
      false,
      'SET_OPEN_SPEI_NEW_COMPANY'
    )
  },
  setSelectedCompanies: companies => {
    set(
      state => ({
        selectedCompanies: companies
      }),
      false,
      'SET_SELECTED_COMPANIES'
    )
  },
  setOpenTransfer: open => {
    set(
      state => ({
        openTransfer: open
      }),
      false,
      'SET_OPEN_TRANSFERS'
    )
  },
  setOriginAccount: origin => {
    set(
      state => ({
        originAccount: origin
      }),
      false,
      'SET_ORIGIN_ACCOUNT'
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

export const useSpeiCompaniesStore = createStore(speiCompaniesStore)
