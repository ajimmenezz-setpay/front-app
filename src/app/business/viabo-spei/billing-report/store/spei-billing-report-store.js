import { VIABO_SPEI_PERMISSIONS } from '../../shared/constants'

import { createStore } from '@/app/shared/store'

const initialState = {
  originAccount: null,
  stpAccounts: null,
  filterDate: null,
  selectedCompany: null
}
const speiBillingReportStore = (set, get) => ({
  ...initialState,
  setOriginAccount: origin => {
    set(
      state => ({
        originAccount: origin
      }),
      false,
      'SPEI_BILLING_REPORT:SET_ORIGIN_ACCOUNT'
    )
  },
  setSelectedCompany: origin => {
    set(
      state => ({
        selectedCompany: origin
      }),
      false,
      'SPEI_BILLING_REPORT:SET_SELECTED_COMPANY'
    )
  },
  setOriginAccountByPermissions: (accounts, permissions) => {
    let stpAccounts = null
    let selectedCompany = null
    if (permissions?.includes(VIABO_SPEI_PERMISSIONS.DASHBOARD_ADMIN)) {
      stpAccounts = {
        type: accounts?.type,
        accounts: accounts?.concentrators || []
      }
      selectedCompany = stpAccounts?.accounts?.[0]?.companies?.[0]
    }

    if (permissions?.includes(VIABO_SPEI_PERMISSIONS.DASHBOARD_COST_CENTERS)) {
      stpAccounts = {
        type: accounts?.type,
        accounts: accounts?.costCenters || []
      }
      selectedCompany = stpAccounts?.accounts?.[0]?.companies?.[0]
    }

    if (permissions?.includes(VIABO_SPEI_PERMISSIONS.DASHBOARD)) {
      stpAccounts = {
        type: accounts?.type,
        accounts: accounts?.companies || []
      }
      selectedCompany = stpAccounts?.accounts?.[0]
    }

    set(
      state => ({
        originAccount: stpAccounts?.accounts?.[0] || null,
        stpAccounts,
        selectedCompany
      }),
      false,
      'SPEI_BILLING_REPORT:SET_SPEI_STP_ORIGIN_ACCOUNT'
    )
  },
  setFilterDate: filter => {
    set(
      state => ({
        filterDate: filter
      }),
      false,
      'SPEI_BILLING_REPORT:SET_FILTER_DATE'
    )
  }
})

export const useSpeiBillingReportStore = createStore(speiBillingReportStore)
