import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-toastify'

import { payWithTerminalMethod } from '../services'

import { getErrorAPI, getNotificationTypeByErrorCode } from '@/shared/interceptors'
import { isFunction } from '@/shared/utils'

export const usePayWithTerminalMethod = (options = {}) => {
  const terminal = useMutation({
    mutationFn: payWithTerminalMethod,
    ...options
  })
  const mutate = async (formData, options) => {
    const { onSuccess, onError, mutationOptions } = options

    try {
      const data = await toast.promise(terminal.mutateAsync(formData, mutationOptions), {
        pending: 'Realizando Transacción ...'
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
    ...terminal,
    mutate,
    isLoading: terminal.isPending
  }
}
