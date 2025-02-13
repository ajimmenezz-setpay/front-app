import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'

import { MANAGEMENT_STOCK_CARDS_KEYS } from '@/app/management/stock-cards/adapters'
import { createNewStockCard } from '@/app/management/stock-cards/services'
import { getErrorAPI, getNotificationTypeByErrorCode } from '@/shared/interceptors'

export const useCreateNewStockCard = (options = {}) => {
  const client = useQueryClient()

  const registerMutation = useMutation({
    mutationFn: createNewStockCard,
    ...options
  })

  const registerCard = async (formData, options) => {
    const { onSuccess, onError, mutationOptions } = options

    try {
      await toast.promise(registerMutation.mutateAsync(formData, mutationOptions), {
        pending: 'Registrando tarjeta ...',
        success: {
          render({ data }) {
            client.invalidateQueries({ queryKey: [MANAGEMENT_STOCK_CARDS_KEYS.STOCK_CARDS_LIST] })
            onSuccess(data)
            return data?.isAssigned ? 'Se agrego una nueva tarjeta al comercio' : 'Se agrego una nueva tarjeta al stock'
          }
        }
      })
    } catch (error) {
      const errorFormatted = getErrorAPI(error, 'No se puede agregar la tarjeta al stock')
      onError(errorFormatted)
      toast.error(errorFormatted, {
        type: getNotificationTypeByErrorCode(error)
      })
    }
  }

  return {
    ...registerMutation,
    registerCard,
    isLoading: registerMutation.isPending
  }
}
