import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'

import { CARD_CLOUD_STOCK_CARDS } from '../adapters'
import { changeStatusStockCard } from '../services'

import { getErrorAPI, getNotificationTypeByErrorCode } from '@/shared/interceptors'
import { isFunction } from '@/shared/utils'

export const useToggleStockCardStatusOfCardCloud = (options = {}) => {
  const client = useQueryClient()
  const toggleStatusCard = useMutation({
    mutationFn: changeStatusStockCard,
    ...options
  })
  const mutate = async (formData, options) => {
    const { onSuccess, onError, mutationOptions } = options

    try {
      const data = await toast.promise(toggleStatusCard.mutateAsync(formData, mutationOptions), {
        pending: 'Actualizando estado de la tarjeta ...',
        success: {
          render({ data }) {
            const responseData = data?.response
            const requestData = data?.request
            client.setQueryData([CARD_CLOUD_STOCK_CARDS.CARDS_LIST], oldCards => {
              if (!oldCards?.data) return oldCards

              const index = oldCards?.data?.findIndex(item => item?.id === responseData?.id)
              if (index === -1) return oldCards

              const newData = [...oldCards.data]
              newData[index] = responseData

              return {
                ...oldCards,
                data: newData
              }
            })
            isFunction(onSuccess) && onSuccess(data)
            return requestData?.cardON ? 'Se encendió la tarjeta con éxito' : 'Se apagó la tarjeta con éxito'
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
    ...toggleStatusCard,
    mutate,
    isLoading: toggleStatusCard.isPending
  }
}
