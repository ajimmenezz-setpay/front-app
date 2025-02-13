import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'

import { ALL_COMMERCE_CARDS_KEYS } from '@/app/business/viabo-card/all-commerce-cards/adapters'
import { CARDS_COMMERCES_KEYS } from '@/app/business/viabo-card/cards/adapters'
import { assignCards } from '@/app/management/stock-cards/services'
import { getErrorAPI, getNotificationTypeByErrorCode } from '@/shared/interceptors'

export const useAssignCards = (options = {}) => {
  const client = useQueryClient()

  const transactionMutate = useMutation({
    mutationFn: assignCards,
    ...options
  })
  const transaction = async (formData, options) => {
    const { onSuccess, onError, mutationOptions } = options

    try {
      await toast.promise(transactionMutate.mutateAsync(formData, mutationOptions), {
        pending: 'Asignando Tarjetas ...',
        success: {
          render({ data }) {
            client.invalidateQueries({
              queryKey: [ALL_COMMERCE_CARDS_KEYS.LIST]
            })
            client.invalidateQueries({
              queryKey: [CARDS_COMMERCES_KEYS.CARDS_COMMERCE_LIST]
            })
            onSuccess()
            return 'Se asignaron las tarjetas con éxito'
          }
        }
      })
    } catch (error) {
      const errorFormatted = getErrorAPI(
        error,
        `No se puede realizar esta operacion en este momento. Intente nuevamente o reporte a sistemas`
      )
      onError(errorFormatted)
      toast.error(errorFormatted, {
        type: getNotificationTypeByErrorCode(error)
      })
    }
  }

  return {
    ...transactionMutate,
    mutate: transaction,
    isLoading: transactionMutate.isPending
  }
}
