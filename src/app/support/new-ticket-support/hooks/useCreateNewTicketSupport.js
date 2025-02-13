import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'

import { TICKETS_SUPPORT_LIST_KEYS } from '../../ticket-support-list/adapters'
import { newTicketSupport } from '../services'

import { getErrorAPI, getNotificationTypeByErrorCode } from '@/shared/interceptors'
import { isFunction } from '@/shared/utils'

export const useCreateNewTicketSupport = (options = {}) => {
  const client = useQueryClient()
  const ticket = useMutation({
    mutationFn: newTicketSupport,
    ...options
  })
  const mutate = async (formData, options) => {
    const { onSuccess, onError, mutationOptions } = options

    try {
      const data = await toast.promise(ticket.mutateAsync(formData, mutationOptions), {
        pending: 'Generando ticket de soporte ...',
        success: {
          render({ data }) {
            isFunction(onSuccess) && onSuccess(data)
            return 'Se genero el ticket con éxito'
          }
        }
      })
      client.invalidateQueries({ queryKey: [TICKETS_SUPPORT_LIST_KEYS.ASSIGNED_LIST] })
      client.invalidateQueries({ queryKey: [TICKETS_SUPPORT_LIST_KEYS.GENERATED_LIST] })
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
    ...ticket,
    mutate,
    isLoading: ticket.isPending
  }
}
