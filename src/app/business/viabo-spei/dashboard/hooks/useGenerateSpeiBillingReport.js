import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-toastify'

import { getSpeiBillingReport } from '../services'

import { getErrorAPI, getNotificationTypeByErrorCode } from '@/shared/interceptors'

export const useGenerateSpeiBillingReport = (options = {}) => {
  const mutation = useMutation({
    mutationFn: getSpeiBillingReport,
    ...options
  })

  const mutate = async (formData, options) => {
    const { onSuccess, onError, mutationOptions } = options

    try {
      await toast.promise(mutation.mutateAsync(formData, mutationOptions), {
        pending: 'Generando Estado de Cuenta...',
        success: {
          render({ data }) {
            onSuccess()
            return 'Comienza la descarga del archivo'
          }
        }
      })
    } catch (error) {
      const errorFormatted = getErrorAPI(
        error,
        `No se puede realizar esta operación en este momento. Intente nuevamente o reporte a sistemas`
      )
      onError(errorFormatted)
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
