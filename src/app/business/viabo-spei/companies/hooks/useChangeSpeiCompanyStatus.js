import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'

import { SPEI_COMPANIES_KEYS } from '../adapters'
import { changeSpeiCompanyStatus } from '../services'

import { getErrorAPI, getNotificationTypeByErrorCode } from '@/shared/interceptors'
import { isFunction } from '@/shared/utils'

export const useChangeSpeiCompanyStatus = (options = {}) => {
  const client = useQueryClient()
  const changeStatus = useMutation({
    mutationFn: changeSpeiCompanyStatus,
    ...options
  })
  const mutate = async (formData, options) => {
    const { onSuccess, onError, ...mutationOptions } = options

    try {
      await toast.promise(changeStatus.mutateAsync(formData, mutationOptions), {
        pending: 'Actualizando estado de la empresa...',
        success: {
          render({ data }) {
            client.invalidateQueries({ queryKey: [SPEI_COMPANIES_KEYS.COMPANIES_LIST] })
            isFunction(onSuccess) && onSuccess(data)
            return 'Se actualizó el estado de la empresa con éxito'
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
