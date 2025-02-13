import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-toastify'

import { findCardByClientIdOfCardCloud } from '../services'

import { getErrorAPI, getNotificationTypeByErrorCode } from '@/shared/interceptors'
import { isFunction } from '@/shared/utils'

export const useFindCardByClientId = (options = {}) => {
  const transaction = useMutation({
    mutationFn: findCardByClientIdOfCardCloud,
    ...options
  })
  const mutate = async (formData, options) => {
    const { onSuccess, onError, mutationOptions } = options

    try {
      const data = await toast.promise(transaction.mutateAsync(formData, mutationOptions), {
        pending: 'Buscando tarjeta...'
      })
      isFunction(onSuccess) && onSuccess(data)
    } catch (error) {
      const errorFormatted = getErrorAPI(error, `No se encontró la tarjeta. Intente nuevamente o reporte a sistemas`)
      isFunction(onError) && onError(errorFormatted)
      toast.error(errorFormatted, {
        type: getNotificationTypeByErrorCode(error)
      })
    }
  }

  return {
    ...transaction,
    mutate,
    isLoading: transaction.isPending
  }
}
