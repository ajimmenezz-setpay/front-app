import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'

import { TICKETS_SUPPORT_LIST_KEYS } from '../adapters'
import { finishSupportTicket } from '../services'

import { getErrorAPI, getNotificationTypeByErrorCode } from '@/shared/interceptors'
import { isFunction } from '@/shared/utils'

export const useFinishSupportTicket = (options = {}) => {
  const client = useQueryClient()
  const finishTicket = useMutation({
    mutationFn: finishSupportTicket,
    ...options
  })
  const mutate = async (formData, options) => {
    const { onSuccess, onError, ...mutationOptions } = options

    try {
      await toast.promise(finishTicket.mutateAsync(formData, mutationOptions), {
        pending: 'Finalizando Ticket...',
        success: {
          render({ data }) {
            client.invalidateQueries({ queryKey: [TICKETS_SUPPORT_LIST_KEYS.ASSIGNED_LIST] })
            client.invalidateQueries({ queryKey: [TICKETS_SUPPORT_LIST_KEYS.GENERATED_LIST] })
            isFunction(onSuccess) && onSuccess(data)
            return 'Se finalizo el ticket con éxito'
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
    ...finishTicket,
    mutate,
    isLoading: finishTicket.isPending
  }
}
