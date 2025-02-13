import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'

import { MANAGEMENT_COMMERCES_KEYS } from '../adapters'
import { updateCommerceInformation } from '../services'

import { getErrorAPI, getNotificationTypeByErrorCode } from '@/shared/interceptors'
import { isFunction } from '@/shared/utils'

export const useUpdateCommerceInfo = (options = {}) => {
  const client = useQueryClient()
  const updateCommerce = useMutation({
    mutationFn: updateCommerceInformation,
    ...options
  })
  const commerce = async (formData, options) => {
    const { onSuccess, onError, mutationOptions } = options

    try {
      await toast.promise(updateCommerce.mutateAsync(formData, mutationOptions), {
        pending: 'Actualizando Comercio ...',
        success: {
          render({ data }) {
            client.invalidateQueries({ queryKey: [MANAGEMENT_COMMERCES_KEYS.COMMERCE_LIST] })
            isFunction(onSuccess) && onSuccess(data)

            return 'Se actualizo la información del comercio con éxito'
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
    ...updateCommerce,
    mutate: commerce,
    isLoading: updateCommerce.isPending
  }
}
