import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-toastify'

import { sharedFundingOrder } from '../services'

import { getErrorAPI, getNotificationTypeByErrorCode } from '@/shared/interceptors'
import { isFunction } from '@/shared/utils'

export const useSharedFundingOrder = (options = {}) => {
  const password = useMutation({
    mutationFn: sharedFundingOrder,
    ...options
  })
  const mutate = async (formData, options) => {
    const { onSuccess, onError, mutationOptions } = options

    try {
      await toast.promise(password.mutateAsync(formData, mutationOptions), {
        pending: 'Enviando Orden de Fondeo ...',
        success: {
          render({ data }) {
            isFunction(onSuccess) && onSuccess(data)

            return 'Se envió la orden de fondeo con éxito'
          }
        }
      })
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
    ...password,
    mutate,
    isLoading: password.isPending
  }
}
