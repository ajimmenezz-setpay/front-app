import { create as _create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

const storeResetFns = new Set()
const persistStorage = []

export const createStore = f => {
  if (f === undefined) return createStore
  const store = _create(devtools(f))
  const initialState = store.getState()
  storeResetFns.add(() => {
    store.setState(initialState, true)
  })
  return store
}

export const createStoreWithPersist = (f, key) => {
  if (f === undefined) return createStore
  const _store = _create(
    devtools(
      persist(f, {
        name: key
      })
    )
  )
  const initialState = _store.getState()
  storeResetFns.add(() => {
    _store.setState(initialState, true)
  })

  if (!persistStorage[key]) {
    persistStorage[key] = () => _store.setState(initialState, true)
  }

  return _store
}

export const resetAllStoresWithPersist = () => {
  for (const resetKey in persistStorage) {
    localStorage.removeItem(resetKey)
  }
}
export const resetAllStores = () => {
  storeResetFns.forEach(resetFn => {
    resetFn()
  })

  resetAllStoresWithPersist()
}
