import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-toastify'

import { assignCardOfCardCloud } from '../services'

import { getErrorAPI, getNotificationTypeByErrorCode } from '@/shared/interceptors'
import { isFunction } from '@/shared/utils'

export const useAssignCardToCardHolder = (options = {}) => {
  const card = useMutation({
    mutationFn: assignCardOfCardCloud,
    ...options
  })
  const mutate = async (formData, options) => {
    const { onSuccess, onError, mutationOptions } = options

    try {
      const data = await toast.promise(card.mutateAsync(formData, mutationOptions), {
        pending: 'Asignando tarjeta ...',
        success: {
          render({ data }) {
            isFunction(onSuccess) && onSuccess(data)
            return 'Tarjeta asignada con éxito'
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
    ...card,
    mutate,
    isLoading: card.isPending
  }
}
