import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-toastify'

import { sendMessageCards } from '@/app/business/viabo-card/cards/services'
import { getErrorAPI, getNotificationTypeByErrorCode } from '@/shared/interceptors'

export const useSendMessageCards = (options = {}) => {
  const sendMessage = useMutation({
    mutationFn: sendMessageCards,
    ...options
  })
  const send = async (formData, options) => {
    const { onSuccess, onError, mutationOptions } = options

    try {
      await toast.promise(sendMessage.mutateAsync(formData, mutationOptions), {
        pending: 'Enviando Mensaje ...',
        success: {
          render({ data }) {
            onSuccess(data)
            return 'Se envió el mensaje con éxito'
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
    ...sendMessage,
    mutate: send,
    isLoading: sendMessage.isPending
  }
}
