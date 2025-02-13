import { useState } from 'react'

import { useMutation } from '@tanstack/react-query'

import { logout } from '../services'

import { useAuth } from '@/shared/hooks'
import { getErrorAPI, getNotificationTypeByErrorCode } from '@/shared/interceptors'

export const useLogout = (options = {}) => {
  const [customError, setCustomError] = useState(null)
  const { logout: logoutContext } = useAuth()

  const register = useMutation({
    mutationFn: logout,
    onSuccess: response => {
      setCustomError(null)
      logoutContext()
      // navigate('/dashboard')
    },
    onError: error => {
      setCustomError({
        message: getErrorAPI(error, 'Ocurrio un error inesperado. Intente nuevamente o reportelo al área de sistemas'),
        code: getNotificationTypeByErrorCode(error)
      })
    },
    ...options
  })

  return {
    ...register,
    error: customError || null,
    isLoading: register.isPending
  }
}
