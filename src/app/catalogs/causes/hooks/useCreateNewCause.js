import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'

import { CAUSES_KEYS } from '../adapters'
import { newCause } from '../services'

import { getErrorAPI, getNotificationTypeByErrorCode } from '@/shared/interceptors'
import { isFunction } from '@/shared/utils'

export const useCreateNewCause = (options = {}) => {
  const client = useQueryClient()
  const cause = useMutation({
    mutationFn: newCause,
    ...options
  })
  const mutate = async (formData, options) => {
    const { onSuccess, onError, mutationOptions } = options

    try {
      const data = await toast.promise(cause.mutateAsync(formData, mutationOptions), {
        pending: 'Guardando nueva causa ...',
        success: 'Se creó la causa con éxito'
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
