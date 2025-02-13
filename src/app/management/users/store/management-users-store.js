import { VIABO_SPEI_PERMISSIONS } from '@/app/business/viabo-spei/shared/constants'
import { createStore } from '@/app/shared/store'

const initialState = {
  stpAccounts: null,
  originAccount: null,
  selectedUser: null,
  openEditUser: false
}
const managementUsersStore = (set, get) => ({
  ...initialState,

  setOriginAccount: origin => {
    set(
      state => ({
        originAccount: origin
      }),
      false,
      'MANAGEMENT-USERS:SET_ORIGIN_ACCOUNT_SPEI'
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
      'MANAGEMENT-USERS:SET_SPEI_STP_ORIGIN_ACCOUNT'
    )
  },
  setOpenEditUser: open => {
    set(
      state => ({
        openEditUser: open
      }),
      false,
      'MANAGEMENT-USERS:SET_OPEN_EDIT_USER'
    )
  },
  setSelectedUser: user => {
    set(
      state => ({
        selectedUser: user
      }),
      false,
      'MANAGEMENT-USERS:SET_SELECTED_USER'
    )
  }
})

export const useManagementUsersStore = createStore(managementUsersStore)
