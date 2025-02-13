import { toast } from 'react-toastify'

import { axios } from '../interceptors'
import { isFunction } from '../utils'

import { createStore } from '@/app/shared/store'

const initialState = {
  openChangePassword: false,
  openTwoAuthConfig: false,
  isEnableLocation: false
}

export const NavigatorGeolocation = (onCallback, showAlert = true) => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      position => {
        axios.defaults.headers.common['App-Location-Latitude'] = position.coords.latitude
        axios.defaults.headers.common['App-Location-Longitude'] = position.coords.longitude
        axios.defaults.headers.common['App-Location-Timestamp'] = position.timestamp
        isFunction(onCallback) && onCallback(true)
      },
      error => {
        if (error.code === 1 && showAlert) {
          toast.warning('Debe desbloquear el acceso a la ubicación')
        }
        console.error('Error obteniendo la ubicación', error)
        isFunction(onCallback) && onCallback(false)
      }
    )
  } else {
    onCallback(false)
    console.error('Geolocalización no soportada por el navegador.')
  }
}

const uiSharedStore = (set, get) => ({
  ...initialState,
  setOpenChangePassword: open => {
    set(
      state => ({
        openChangePassword: open
      }),
      false,
      'UI_SHARED_STORE:SET_OPEN_CHANGE_PASSWORD'
    )
  },
  setOpenTwoAuthConfig: open => {
    set(
      state => ({
        openTwoAuthConfig: open
      }),
      false,
      'UI_SHARED_STORE:SET_OPEN_2FA_CONFIG'
    )
  },
  setEnableLocation: isEnable => {
    if (isEnable) {
      NavigatorGeolocation(validate => {
        set(
          state => ({
            isEnableLocation: Boolean(validate)
          }),
          false,
          'UI_SHARED_STORE:SET_OPEN_2FA_CONFIG'
        )
      })
    } else {
      set(
        state => ({
          isEnableLocation: false
        }),
        false,
        'UI_SHARED_STORE:SET_OPEN_2FA_CONFIG'
      )
    }
  },
  validateGeoLocationPermission: (isOnlyValidate = false) => {
    const { setEnableLocation } = get()
    navigator.permissions.query({ name: 'geolocation' }).then(result => {
      result.onchange = () => {
        if (result.state === 'granted') {
          setEnableLocation(true)
        } else {
          setEnableLocation(false)
        }
      }
      if (result.state === 'granted') {
        setEnableLocation(true)
      } else if (isOnlyValidate && result.state === 'prompt') {
        NavigatorGeolocation()
      } else if (isOnlyValidate && result.state === 'denied') {
        NavigatorGeolocation()
      } else {
        setEnableLocation(false)
      }
    })
  }
})

export const useUiSharedStore = createStore(uiSharedStore)
