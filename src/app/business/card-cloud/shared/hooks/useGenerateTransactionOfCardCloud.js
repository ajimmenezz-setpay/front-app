import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-toastify'

import { newTransactionsOfCardCloud } from '../services'

import { getErrorAPI, getNotificationTypeByErrorCode } from '@/shared/interceptors'
import { isFunction } from '@/shared/utils'

export const useGenerateTransactionOfCardCloud = (options = {}) => {
  const transaction = useMutation({
    mutationFn: newTransactionsOfCardCloud,
    ...options
  })
  const mutate = async (formData, options) => {
    const { onSuccess, onError, mutationOptions } = options

    try {
      const data = await toast.promise(transaction.mutateAsync(formData, mutationOptions), {
        pending: 'Generando transacción ...',
        success: {
          render({ data }) {
            isFunction(onSuccess) && onSuccess(data)
            return 'Se generó la transacción con éxito'
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
