import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'

import { CAUSES_KEYS } from '../adapters'
import { updateCause } from '../services'

import { getErrorAPI, getNotificationTypeByErrorCode } from '@/shared/interceptors'
import { isFunction } from '@/shared/utils'

export const useUpdateCause = (options = {}) => {
  const client = useQueryClient()
  const cause = useMutation({
    mutationFn: updateCause,
    ...options
  })
  const mutate = async (formData, options) => {
    const { onSuccess, onError, mutationOptions } = options

    try {
      const data = await toast.promise(cause.mutateAsync(formData, mutationOptions), {
        pending: 'Actualizando causa ...',
        success: 'Se actualizó la causa con éxito'
      })
      client.invalidateQueries({ queryKey: [CAUSES_KEYS.LIST] })
      isFunction(onSuccess) && onSuccess(data)
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
    ...cause,
    mutate,
    isLoading: cause.isPending
  }
}
