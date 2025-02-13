import { useEffect, useState } from 'react'

import { useIsFetching, useMutation, useQuery } from '@tanstack/react-query'
import { jwtDecode } from 'jwt-decode'

import { AUTHENTICATION_KEYS } from '../../shared/adapters'
import { getUserModules, signIn } from '../../shared/services'

import { axios, getErrorAPI, getNotificationTypeByErrorCode } from '@/shared/interceptors'
import { setSession } from '@/shared/utils'

export const useSignIn = (options = {}) => {
  const [customError, setCustomError] = useState(null)
  const [tokenExists, setTokenExists] = useState(false)
  const [isTwoAuth, setIsTwoAuth] = useState(false)
  const [token, setToken] = useState(null)

  const isFetching = useIsFetching({
    queryKey: [AUTHENTICATION_KEYS.USER_MODULES]
  })

  const signInMutation = useMutation({
    mutationFn: signIn,
    onSuccess: response => {
      setCustomError(null)
      const token = response?.token
      const decoded = jwtDecode(token)
      const twoAuth = decoded?.authenticatorFactors || false
      if (!twoAuth) {
        setSession(token)
      } else {
        axios.defaults.headers.common.Authorization = `Bearer ${token}`
      }
      setToken(token)
      setIsTwoAuth(twoAuth)
      setTokenExists(true)
    },
    onError: error => {
      setTokenExists(false)
      setSession(null)
      setCustomError({
        message: getErrorAPI(error, 'Ocurrio un error inesperado. Intente nuevamente o reportelo al área de sistemas'),
        code: getNotificationTypeByErrorCode(error)
      })
    },
    ...options
  })
  const userModules = useQuery({
    queryKey: [AUTHENTICATION_KEYS.USER_MODULES],
    queryFn: getUserModules,
    enabled: !!tokenExists,
    retry: false
  })

  useEffect(() => {
    if (userModules?.isError) {
      setTokenExists(false)
      setSession(null)
      setCustomError({
        message: getErrorAPI(
          userModules.error,
          'Ocurrio un error inesperado. Intente nuevamente o reportelo al área de sistemas'
        ),
        code: getNotificationTypeByErrorCode(userModules.error)
      })
    }
  }, [userModules.isError, userModules.error])

  useEffect(() => {
    if (userModules?.isSuccess) {
      setCustomError(null)
      setTokenExists(false)
    }
  }, [userModules.isSuccess])

  return {
    ...signInMutation,
    setCustomError,
    isError: signInMutation.isError || userModules.isError,
    isSuccess: signInMutation.isSuccess && userModules.isSuccess,
    isLoading: signInMutation.isPending || isFetching === 1,
    error: customError ?? null,
    token,
    isTwoAuth
  }
}
