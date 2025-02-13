import { useState } from 'react'

import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-toastify'

import { validateGoogleAuthCode } from '@/app/authentication/2FA/services'
import { getErrorAPI, getNotificationTypeByErrorCode } from '@/shared/interceptors'
import { isFunction } from '@/shared/utils'

export const useValidateGoogleAuthCode = (options = {}) => {
  const [customError, setCustomError] = useState(null)
  const googleAuth = useMutation({
    mutationFn: validateGoogleAuthCode,
    ...options
  })
  const mutate = async (formData, options) => {
    const { onSuccess, onError, mutationOptions } = options

    try {
      const data = await toast.promise(googleAuth.mutateAsync(formData, mutationOptions), {
        pending: 'Validando Código'
      })
      isFunction(onSuccess) && onSuccess(data)
    } catch (error) {
      const errorFormatted = getErrorAPI(
        error,
        `No se puede realizar esta operación en este momento. Intente nuevamente o reporte a sistemas`
      )
      setCustomError(errorFormatted)
      isFunction(onError) && onError(errorFormatted)
      toast.error(errorFormatted, {
        type: getNotificationTypeByErrorCode(error)
      })
    }
  }

  return {
    ...googleAuth,
    mutate,
    error: customError,
    isLoading: googleAuth.isPending
  }
}
