import { createStore } from '@/app/shared/store'

const initialState = {
  dashboardTitle: 'Dashboard'
}
const sharedViaboSpeiStore = (set, get) => ({
  ...initialState,
  setDashboardTitle: title => {
    set(
      state => ({
        dashboardTitle: title
      }),
      false,
      'SET_SHARED_VIABO_SPEI_DASHBOARD_TITLE'
    )
  }
})

export const useSharedViaboSpeiStore = createStore(sharedViaboSpeiStore)
