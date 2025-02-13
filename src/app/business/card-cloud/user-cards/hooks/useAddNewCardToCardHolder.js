import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'

import { CARD_CLOUD_USER_CARDS_KEYS } from '../adapters'
import { addCardToCardHolderOfCardCloud } from '../services'

import { getErrorAPI, getNotificationTypeByErrorCode } from '@/shared/interceptors'
import { isFunction } from '@/shared/utils'

export const useAddNewCardToCardHolder = (options = {}) => {
  const client = useQueryClient()
  const transaction = useMutation({
    mutationFn: addCardToCardHolderOfCardCloud,
    ...options
  })
  const mutate = async (formData, options) => {
    const { onSuccess, onError, mutationOptions } = options

    try {
      const data = await toast.promise(transaction.mutateAsync(formData, mutationOptions), {
        pending: 'Agregando tarjeta ...',
        success: {
          render({ data }) {
            client.invalidateQueries({ queryKey: [CARD_CLOUD_USER_CARDS_KEYS.CARDS] })
            isFunction(onSuccess) && onSuccess(data)
            return 'Se agrego tarjeta con éxito'
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
