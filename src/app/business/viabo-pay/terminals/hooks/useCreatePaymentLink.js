import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-toastify'

import { createPaymentLink } from '../services'

import { getErrorAPI, getNotificationTypeByErrorCode } from '@/shared/interceptors'

export const useCreatePaymentLink = (options = {}) => {
  const paymentLink = useMutation({
    mutationFn: createPaymentLink,
    ...options
  })
  const payment = async (formData, options) => {
    const { onSuccess, onError, mutationOptions } = options

    try {
      await toast.promise(paymentLink.mutateAsync(formData, mutationOptions), {
        pending: 'generando Liga de Pago ...',
        success: {
          render({ data }) {
            onSuccess(data)
            return 'Se creó y envió la liga de pago con éxito'
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
    ...paymentLink,
    mutate: payment,
    isLoading: paymentLink.isPending
  }
}
