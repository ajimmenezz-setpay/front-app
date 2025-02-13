import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'

import { CHARGE_PAYMENT_LINK } from '../adapters'
import { generateChargeFromPaymentLink } from '../services'

import { getErrorAPI, getNotificationTypeByErrorCode } from '@/shared/interceptors'

export const useCreatePaymentCharge = (paymentId, options = {}) => {
  const paymentLink = useMutation({
    mutationFn: generateChargeFromPaymentLink,
    ...options
  })
  const client = useQueryClient()
  const payment = async (formData, options) => {
    const { onSuccess, onError, mutationOptions } = options

    try {
      await toast.promise(paymentLink.mutateAsync(formData, mutationOptions), {
        pending: 'Realizando cargo ...',
        success: {
          render({ data }) {
            client.invalidateQueries({ queryKey: [CHARGE_PAYMENT_LINK.INFO] })
            onSuccess(data)
            return 'Se realizo el pago con éxito'
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
