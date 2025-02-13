import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'

import { VIABO_SPEI_SHARED_KEYS } from '../adapters'
import { payConcentratorCommissions } from '../services'

import { getErrorAPI, getNotificationTypeByErrorCode } from '@/shared/interceptors'
import { isFunction } from '@/shared/utils'

export const usePayConcentratorCommissions = (options = {}) => {
  const client = useQueryClient()
  const mutation = useMutation({
    mutationFn: payConcentratorCommissions,
    ...options
  })
  const mutate = async (formData, options) => {
    const { onSuccess, onError, mutationOptions } = options

    try {
      const data = await toast.promise(mutation.mutateAsync(formData, mutationOptions), {
        pending: 'Generando Transacción ...',
        success: 'Se generó con éxito el pago de comisiones'
      })
      client.invalidateQueries({ queryKey: [VIABO_SPEI_SHARED_KEYS.ACCOUNTS_INFO] })
      client.invalidateQueries({ queryKey: [VIABO_SPEI_SHARED_KEYS.BALANCE_RESUME] })
      client.invalidateQueries({ queryKey: [VIABO_SPEI_SHARED_KEYS.MOVEMENTS] })
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
    ...mutation,
    mutate,
    isLoading: mutation.isPending
  }
}
