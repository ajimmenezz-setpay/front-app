import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'

import { MANAGEMENT_COMMERCES_KEYS } from '../adapters'
import { updateCommerceCommissions } from '../services'

import { getErrorAPI, getNotificationTypeByErrorCode } from '@/shared/interceptors'

export const useUpdateCommerceCommissions = (options = {}) => {
  const client = useQueryClient()
  const updateCommissions = useMutation({
    mutationFn: updateCommerceCommissions,
    ...options
  })
  const commissions = async (formData, options) => {
    const { onSuccess, onError, mutationOptions } = options

    try {
      await toast.promise(updateCommissions.mutateAsync(formData, mutationOptions), {
        pending: 'Actualizando Comisiones ...',
        success: {
          render({ data }) {
            client.invalidateQueries({ queryKey: [MANAGEMENT_COMMERCES_KEYS.COMMERCE_LIST] })
            onSuccess(data)

            return 'Se actualizaron las comisiones con éxito'
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
    ...updateCommissions,
    mutate: commissions,
    isLoading: updateCommissions.isPending
  }
}
