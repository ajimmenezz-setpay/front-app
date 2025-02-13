import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'

import { CARD_CLOUD_SHARED_KEYS } from '../../shared/adapters'
import { CARD_CLOUD_CARDS_KEYS } from '../adapters'
import { changeStatusCard } from '../services'

import { getErrorAPI, getNotificationTypeByErrorCode } from '@/shared/interceptors'
import { isFunction } from '@/shared/utils'

export const useToggleCardStatusOfCardCloud = (options = {}) => {
  const client = useQueryClient()
  const toggleStatusCard = useMutation({
    mutationFn: changeStatusCard,
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

            client.setQueryData([CARD_CLOUD_CARDS_KEYS.CARD, responseData?.id], oldCard => responseData)
            client.setQueryData(
              [CARD_CLOUD_SHARED_KEYS.CARDS, requestData?.subAccountId],
              oldCards => oldCards?.map(item => (item?.id === responseData?.id ? responseData : item)) || []
            )
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
