import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'

import { CARD_CLOUD_SHARED_KEYS } from '../../shared/adapters'
import { CARD_CLOUD_CARDS_KEYS } from '../adapters'
import { assignCardsToCardHolder } from '../services'

import { getErrorAPI, getNotificationTypeByErrorCode } from '@/shared/interceptors'
import { isFunction } from '@/shared/utils'

export const useAssignCardsToCardHolderOfCardCloud = (options = {}) => {
  const client = useQueryClient()
  const assignCards = useMutation({
    mutationFn: assignCardsToCardHolder,
    ...options
  })
  const mutate = async (formData, options) => {
    const { onSuccess, onError, mutationOptions } = options

    try {
      const data = await toast.promise(assignCards.mutateAsync(formData, mutationOptions), {
        pending: 'Asignando tarjeta ...',
        success: {
          render({ data }) {
            client.invalidateQueries({
              queryKey: [CARD_CLOUD_SHARED_KEYS.CARDS, data?.subAccountId]
            })
            client.invalidateQueries({
              queryKey: [CARD_CLOUD_CARDS_KEYS.CARD]
            })
            isFunction(onSuccess) && onSuccess(data)
            return 'Se asignó la tarjeta con éxito'
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
