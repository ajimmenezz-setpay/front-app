import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-toastify'

import { sharedChargeKeys } from '@/app/business/viabo-card/cards/services'
import { getErrorAPI, getNotificationTypeByErrorCode } from '@/shared/interceptors'

export const useSharedChargeKeys = (options = {}) => {
  const sharedKeys = useMutation({
    mutationFn: sharedChargeKeys,
    ...options
  })
  const shared = async (formData, options) => {
    const { onSuccess, onError, mutationOptions } = options

    try {
      await toast.promise(sharedKeys.mutateAsync(formData, mutationOptions), {
        pending: 'Enviando Correo ...',
        success: {
          render({ data }) {
            onSuccess(data)
            return 'Se compartio con éxito la información'
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
    ...sharedKeys,
    mutate: shared,
    isLoading: sharedKeys.isPending
  }
}
