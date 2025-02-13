import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'

import { FUNDING_ORDERS_KEYS } from '../adapters'
import { cancelFundingOrder } from '../services'

import { getErrorAPI, getNotificationTypeByErrorCode } from '@/shared/interceptors'
import { isFunction } from '@/shared/utils'

export const useCancelFundingOrder = (options = {}) => {
  const client = useQueryClient()

  const cancelOrder = useMutation({
    mutationFn: cancelFundingOrder,
    ...options
  })

  const cancel = async (formData, options = {}) => {
    const { onSuccess, onError, mutationOptions } = options

    try {
      await toast.promise(cancelOrder.mutateAsync(formData, mutationOptions), {
        pending: 'Cancelando orden de fondeo ...',
        success: {
          render({ data }) {
            client.invalidateQueries({
              queryKey: [FUNDING_ORDERS_KEYS.LIST]
            })
            isFunction(onSuccess) && onSuccess(data)
            return 'Se canceló la orden de fondeo con éxito'
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
    ...cancelOrder,
    mutate: cancel,
    isLoading: cancelOrder.isPending
  }
}
