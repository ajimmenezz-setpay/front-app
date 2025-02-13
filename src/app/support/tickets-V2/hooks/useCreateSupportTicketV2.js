import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'

import { SUPPORT_TICKETS_V2_KEYS } from '../adapters'
import { generateNewTicketSupportV2 } from '../services'

import { getErrorAPI, getNotificationTypeByErrorCode } from '@/shared/interceptors'
import { isFunction } from '@/shared/utils'

export const useCreateSupportTicketV2 = (options = {}) => {
  const client = useQueryClient()
  const ticket = useMutation({
    mutationFn: generateNewTicketSupportV2,
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
      client.invalidateQueries({ queryKey: [SUPPORT_TICKETS_V2_KEYS.TICKETS] })
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
