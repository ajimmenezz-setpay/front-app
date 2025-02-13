import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-toastify'

import { changeCardNIP } from '../services'

import { getErrorAPI, getNotificationTypeByErrorCode } from '@/shared/interceptors'
import { isFunction } from '@/shared/utils'

export const useChangeCardNIP = (options = {}) => {
  const mutation = useMutation({
    mutationFn: changeCardNIP,
    ...options
  })
  const mutate = async (formData, options) => {
    const { onSuccess, onError, mutationOptions } = options

    try {
      const data = await toast.promise(mutation.mutateAsync(formData, mutationOptions), {
        pending: 'Actualizando NIP de la tarjeta ...',
        success: {
          render({ data }) {
            isFunction(onSuccess) && onSuccess(data)
            return 'Se actualizó el NIP la tarjeta con éxito'
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
    ...mutation,
    mutate,
    isLoading: mutation.isPending
  }
}
