import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'

import { CARD_CLOUD_STOCK_CARDS } from '../adapters'
import { assignCardsByCompanyOfCardCloud } from '../services'

import { getErrorAPI, getNotificationTypeByErrorCode } from '@/shared/interceptors'
import { isFunction } from '@/shared/utils'

export const useAssignCardsByCompanyOfCardCloud = (options = {}) => {
  const client = useQueryClient()
  const assignCards = useMutation({
    mutationFn: assignCardsByCompanyOfCardCloud,
    ...options
  })
  const mutate = async (formData, options) => {
    const { onSuccess, onError, mutationOptions } = options

    try {
      const data = await toast.promise(assignCards.mutateAsync(formData, mutationOptions), {
        pending: 'Asignando Tarjetas ...',
        success: {
          render({ data }) {
            client.invalidateQueries({ queryKey: [CARD_CLOUD_STOCK_CARDS.CARDS_LIST] })
            isFunction(onSuccess) && onSuccess(data)
            return 'Se asignaron las tarjetas con éxito'
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
    ...assignCards,
    mutate,
    isLoading: assignCards.isPending
  }
}
