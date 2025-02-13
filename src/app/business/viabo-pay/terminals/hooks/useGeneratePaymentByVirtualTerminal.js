import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'

import { TERMINALS_KEYS } from '../adapters'
import { generatePaymentByVirtualTerminal } from '../services'

import { getErrorAPI, getNotificationTypeByErrorCode } from '@/shared/interceptors'

export const useGeneratePaymentByVirtualTerminal = (options = {}) => {
  const client = useQueryClient()
  const payment = useMutation({
    mutationFn: generatePaymentByVirtualTerminal,
    ...options
  })
  const transaction = async (formData, options) => {
    const { onSuccess, onError, mutationOptions } = options

    try {
      await toast.promise(payment.mutateAsync(formData, mutationOptions), {
        pending: 'Realizando Pago ...',
        success: {
          render({ data }) {
            onSuccess(data)
            client.invalidateQueries({ queryKey: [TERMINALS_KEYS.MOVEMENTS] })
            return 'Se completó la transacción y se envió el comprobante con éxito'
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
      client.invalidateQueries({ queryKey: [TERMINALS_KEYS.MOVEMENTS] })
    }
  }

  return {
    ...payment,
    mutate: transaction,
    isLoading: payment.isPending
  }
}
