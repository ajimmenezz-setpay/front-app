import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'

import { MANAGEMENT_COMMERCES_KEYS } from '../adapters'
import { updateCommerceService } from '../services'

import { getErrorAPI, getNotificationTypeByErrorCode } from '@/shared/interceptors'
import { isFunction } from '@/shared/utils'

export const useUpdateCommerceService = (options = {}) => {
  const client = useQueryClient()
  const updateService = useMutation({
    mutationFn: updateCommerceService,
    ...options
  })
  const commerceService = async (formData, options) => {
    const { onSuccess, onError, mutationOptions } = options

    try {
      await toast.promise(updateService.mutateAsync(formData, mutationOptions), {
        pending: 'Actualizando Servicio ...',
        success: {
          render({ data }) {
            client.invalidateQueries({ queryKey: [MANAGEMENT_COMMERCES_KEYS.COMMERCE_LIST] })
            isFunction(onSuccess) && onSuccess(data)

            return 'Se actualizo el servicio del comercio con éxito'
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
    ...updateService,
    mutate: commerceService,
    isLoading: updateService.isPending
  }
}
