import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'

import { SPEI_COMPANIES_KEYS } from '../adapters'
import { newSpeiCompany } from '../services'

import { getErrorAPI, getNotificationTypeByErrorCode } from '@/shared/interceptors'
import { isFunction } from '@/shared/utils'

export const useCreateNewSpeiCompany = (options = {}) => {
  const client = useQueryClient()
  const company = useMutation({
    mutationFn: newSpeiCompany,
    ...options
  })
  const mutate = async (formData, options) => {
    const { onSuccess, onError, mutationOptions } = options

    try {
      await toast.promise(company.mutateAsync(formData, mutationOptions), {
        pending: 'Creando empresa...',
        success: {
          render({ data }) {
            client.invalidateQueries({ queryKey: [SPEI_COMPANIES_KEYS.COMPANIES_LIST] })
            isFunction(onSuccess) && onSuccess(data)

            return 'Se creó la empresa con éxito'
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
    ...company,
    mutate,
    isLoading: company.isPending
  }
}
