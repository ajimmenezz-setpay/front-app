import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'

import { CAUSES_KEYS } from '../adapters'
import { changeStatusCause } from '../services'

import { getErrorAPI, getNotificationTypeByErrorCode } from '@/shared/interceptors'
import { isFunction } from '@/shared/utils'

export const useChangeStatusCause = (options = {}) => {
  const client = useQueryClient()
  const changeStatus = useMutation({
    mutationFn: changeStatusCause,
    ...options
  })
  const mutate = async (formData, options) => {
    const { onSuccess, onError, ...mutationOptions } = options

    try {
      await toast.promise(changeStatus.mutateAsync(formData, mutationOptions), {
        pending: 'Actualizando estado de la causa...',
        success: {
          render({ data }) {
            client.invalidateQueries({ queryKey: [CAUSES_KEYS.LIST] })
            isFunction(onSuccess) && onSuccess(data)
            return 'Se actualizó el estado de la causa con éxito'
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
    ...changeStatus,
    mutate,
    isLoading: changeStatus.isPending
  }
}
