import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-toastify'

import { payWithCashMethod } from '../services'

import { getErrorAPI, getNotificationTypeByErrorCode } from '@/shared/interceptors'
import { isFunction } from '@/shared/utils'

export const usePayWithCashMethod = (options = {}) => {
  const cash = useMutation({
    mutationFn: payWithCashMethod,
    ...options
  })
  const mutate = async (formData, options) => {
    const { onSuccess, onError, mutationOptions } = options

    try {
      const data = await toast.promise(cash.mutateAsync(formData, mutationOptions), {
        pending: 'Generando liga de pago ...'
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
    ...cash,
    mutate,
    isLoading: cash.isPending
  }
}
