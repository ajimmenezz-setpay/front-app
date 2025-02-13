import { createStore } from '@/app/shared/store'

const initialState = {
  originAccount: 'ALL_COMPANIES',
  filterDate: null
}
const speiCommissionsReportStore = (set, get) => ({
  ...initialState,
  setOriginAccount: origin => {
    set(
      state => ({
        originAccount: origin
      }),
      false,
      'SPEI_COMMISSIONS_REPORT:SET_ORIGIN_ACCOUNT'
    )
  },
  setFilterDate: filter => {
    set(
      state => ({
        filterDate: filter
      }),
      false,
      'SPEI_COMMISSIONS_REPORT:SET_FILTER_DATE'
    )
  }
})

export const useSpeiCommissionsReportStore = createStore(speiCommissionsReportStore)
