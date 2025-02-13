// useAssignCardsToCardHolderWithExcelFileOfCardCloud

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'

import { CARD_CLOUD_SHARED_KEYS } from '../../shared/adapters'
import { CARD_CLOUD_CARDS_KEYS } from '../adapters'
import { assignCardsToCardHolderWithFile } from '../services'

import { getErrorAPI, getNotificationTypeByErrorCode } from '@/shared/interceptors'
import { isFunction } from '@/shared/utils'

export const useAssignCardsToCardHolderWithExcelFileOfCardCloud = (options = {}) => {
  const client = useQueryClient()
  const transaction = useMutation({
    mutationFn: assignCardsToCardHolderWithFile,
    ...options
  })
  const mutate = async (formData, options) => {
    const { onSuccess, onError, mutationOptions } = options

    try {
      const data = await toast.promise(transaction.mutateAsync(formData, mutationOptions), {
        pending: 'Enviando archivo ...',
        success: {
          render({ data }) {
            client.invalidateQueries({
              queryKey: [CARD_CLOUD_SHARED_KEYS.CARDS, data?.request?.subAccountId]
            })
            client.invalidateQueries({
              queryKey: [CARD_CLOUD_CARDS_KEYS.CARD]
            })
            isFunction(onSuccess) && onSuccess(data?.response)
            if (data?.response?.length === 0) {
              return 'Se asignaron todas las tarjetas con éxito'
            } else {
              throw new Error('Error')
            }
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
    ...transaction,
    mutate,
    isLoading: transaction.isPending
  }
}
