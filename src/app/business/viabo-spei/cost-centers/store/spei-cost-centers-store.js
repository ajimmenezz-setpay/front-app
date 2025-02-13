import { createStore } from '@/app/shared/store'

const initialState = {
  costCenter: null,
  openNewCostCenter: false
}
const speiCostCentersStore = (set, get) => ({
  ...initialState,
  setSpeiCostCenter: costCenter => {
    set(
      state => ({
        costCenter
      }),
      false,
      'SET_SPEI_COST_CENTER'
    )
  },
  setOpenNewSpeiCostCenter: open => {
    set(
      state => ({
        openNewCostCenter: open
      }),
      false,
      'SET_OPEN_SPEI_NEW_COST_CENTER'
    )
  }
})

export const useSpeiCostCentersStore = createStore(speiCostCentersStore)
