import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-toastify'

import { enableTwoAuth } from '@/app/authentication/2FA/services'
import { getErrorAPI, getNotificationTypeByErrorCode } from '@/shared/interceptors'
import { isFunction } from '@/shared/utils'

export const useEnableTwoAuth = (options = {}) => {
  const twoAuth = useMutation({
    mutationFn: enableTwoAuth,
    ...options
  })
  const mutate = async (formData, options) => {
    const { onSuccess, onError, mutationOptions } = options

    try {
      const data = await toast.promise(twoAuth.mutateAsync(formData, mutationOptions), {
        pending: 'Configurando dispositivo ...'
      })
      isFunction(onSuccess) && onSuccess(data)
    } catch (error) {
      const errorFormatted = getErrorAPI(
        error,
        `No se puede realizar esta operación en este momento. Intente nuevamente o reporte a sistemas`
      )
      isFunction(onError) && onError(errorFormatted)
      toast.error(errorFormatted, {
        type: getNotificationTypeByErrorCode(error)
      })
    }
  }

  return {
    ...twoAuth,
    isLoading: twoAuth.isPending,
    mutate
  }
}
