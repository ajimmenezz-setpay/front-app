import { createContext, useEffect, useMemo, useReducer } from 'react'

import PropTypes from 'prop-types'

import { NavigatorGeolocation, useUiSharedStore } from '../store'

import { UseFindModulesByUser } from '@/app/authentication/shared/hooks'
import { resetAllStores } from '@/app/shared/store'
import { API_SET_V2, axios } from '@/shared/interceptors'
import { getTokenData, isValidToken, setSession } from '@/shared/utils'

const initialState = {
  isAuthenticated: false,
  isInitialized: false,
  isFetchingModules: false,
  user: null
}

const handlers = {
  INITIALIZE: (state, action) => {
    const { isAuthenticated, user } = action.payload
    return {
      ...state,
      isAuthenticated,
      isInitialized: true,
      user
    }
  },
  LOADING: (state, action) => ({
    ...state,
    isFetchingModules: action.payload
  }),
  LOGIN: (state, action) => {
    const { user } = action.payload

    return {
      ...state,
      isAuthenticated: true,
      isFetchingModules: false,
      user
    }
  },
  LOGOUT: state => ({
    ...state,
    isAuthenticated: false,
    isFetchingModules: false,
    user: null
  }),
  TWO_AUTH: (state, action) => ({
    ...state,
    user: {
      ...state.user,
      twoAuth: Boolean(action.payload)
    }
  }),
  SET_USER: (state, action) => ({
    ...state,
    user: action.payload
  })
}

const reducer = (state, action) => (handlers[action.type] ? handlers[action.type](state, action) : state)

const AuthContext = createContext({
  ...initialState,
  method: 'jwt',
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  setTwoAuth: () => Promise.resolve(),
  refreshAccessToken: () => Promise.resolve(),
  dispatch: () => {},
  state: initialState
})

AuthProvider.propTypes = {
  children: PropTypes.node
}

function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  const validateGeoLocationPermission = useUiSharedStore(state => state.validateGeoLocationPermission)
  const isEnableLocation = useUiSharedStore(state => state.isEnableLocation)

  const {
    data: userModules,
    error,
    remove,
    isLoading
  } = UseFindModulesByUser({
    staleTime: 60 * 15000, // 15 minutos
    // cacheTime: 60 * 15000,
    refetchInterval: 60 * 15000, // 15 minutos,
    enabled: !!state.isAuthenticated
  })

  axios.interceptors.response.use(
    response => response,
    error => {
      if (error?.response?.status === 401) {
        logout(true)
      }
      return Promise.reject(error)
    }
  )

  API_SET_V2.interceptors.response.use(
    response => response,
    error => {
      if (error?.response?.status === 401) {
        logout(true)
      }
      return Promise.reject(error)
    }
  )

  axios.interceptors.request.use(
    function (config) {
      if (isEnableLocation && navigator?.geolocation && state.isAuthenticated) {
        NavigatorGeolocation()
      }

      return config
    },
    function (error) {
      return Promise.reject(error)
    }
  )
  useEffect(() => {
    if (error && state.isAuthenticated) {
      logout(true)
    }
  }, [error, state.isAuthenticated])

  useEffect(() => {
    if (userModules && state.isAuthenticated) {
      dispatch({
        type: 'INITIALIZE',
        payload: {
          isAuthenticated: true,
          user: {
            ...state.user,
            ...userModules
          }
        }
      })
    }
    dispatch({
      type: 'LOADING',
      payload: false
    })
  }, [userModules])

  useEffect(() => {
    dispatch({
      type: 'LOADING',
      payload: false
    })
    const initialize = async () => {
      try {
        validateGeoLocationPermission()
        const accessToken = localStorage.getItem('accessToken')
        if (accessToken && isValidToken(accessToken)) {
          setSession(accessToken)
          const user = getTokenData(accessToken)
          dispatch({
            type: 'INITIALIZE',
            payload: {
              isAuthenticated: true,
              user: {
                ...state.user,
                ...user,
                ...userModules
              }
            }
          })
          if (isLoading) {
            dispatch({
              type: 'LOADING',
              payload: true
            })
          }
        } else {
          dispatch({
            type: 'INITIALIZE',
            payload: {
              isAuthenticated: false,
              user: null
            }
          })
          dispatch({
            type: 'LOADING',
            payload: false
          })
        }
      } catch (err) {
        console.error(err)
        dispatch({
          type: 'LOADING',
          payload: false
        })
        dispatch({
          type: 'INITIALIZE',
          payload: {
            isAuthenticated: false,
            user: null
          }
        })
      }
    }

    initialize()
  }, [isLoading])

  const logout = async (auto = false) => {
    dispatch({ type: 'LOGOUT' })
    if (!auto) {
      localStorage.removeItem('lastPath')
      resetAllStores()
    }
    setSession(null)
  }

  const login = async () => {
    const accessToken = localStorage.getItem('accessToken')

    const user = getTokenData(accessToken)

    dispatch({
      type: 'LOGIN',
      payload: {
        user: {
          ...state.user,
          ...user
        }
      }
    })
  }

  const setTwoAuth = async isEnable => {
    dispatch({
      type: 'TWO_AUTH',
      payload: isEnable
    })
  }

  const refreshAccessToken = async accessToken => {
    if (accessToken && isValidToken(accessToken)) {
      setSession(accessToken)
      const user = getTokenData(accessToken)
      dispatch({
        type: 'SET_USER',
        payload: {
          ...state.user,
          ...user
        }
      })
    }
  }

  const values = useMemo(
    () => ({
      ...state,
      method: 'jwt',
      logout,
      login,
      setTwoAuth,
      refreshAccessToken,
      dispatch
    }),
    [state]
  )

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }
