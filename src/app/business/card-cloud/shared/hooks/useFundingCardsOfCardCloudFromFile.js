import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'

import { CARD_CLOUD_CARDS_KEYS } from '../../cards/adapters'
import { CARD_CLOUD_SHARED_KEYS } from '../adapters'
import { uploadFundingCardsFileOfCardCloud } from '../services'

import { getErrorAPI, getNotificationTypeByErrorCode } from '@/shared/interceptors'
import { isFunction } from '@/shared/utils'

export const useFundingCardsOfCardCloudFromFile = (options = {}) => {
  const client = useQueryClient()
  const transaction = useMutation({
    mutationFn: uploadFundingCardsFileOfCardCloud,
    ...options
  })
  const mutate = async (formData, options) => {
    const { onSuccess, onError, mutationOptions } = options

    try {
      const data = await toast.promise(transaction.mutateAsync(formData, mutationOptions), {
        pending: 'Enviando archivo de fondeo ...',
        success: {
          render({ data }) {
            if (data?.subAccountId) {
              client.invalidateQueries({ queryKey: [CARD_CLOUD_CARDS_KEYS.CARD] })
              client.invalidateQueries({ queryKey: [CARD_CLOUD_CARDS_KEYS.CARD_MOVEMENTS] })
              client.setQueryData([CARD_CLOUD_SHARED_KEYS.SUBACCOUNT_INFO, data?.subAccountId], oldData => ({
                ...oldData,
                ...data
              }))
            }
            isFunction(onSuccess) && onSuccess(data)
            return 'Se generó la dispersión con éxito'
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
