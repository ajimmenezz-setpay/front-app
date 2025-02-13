import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'

import { SPEI_THIRD_ACCOUNTS_KEYS } from '../adapters'
import { newSpeiThirdAccount } from '../services'

import { getErrorAPI, getNotificationTypeByErrorCode } from '@/shared/interceptors'
import { isFunction } from '@/shared/utils'

export const useCreateNewSpeiThirdAccount = (options = {}) => {
  const client = useQueryClient()
  const speiThirdAccount = useMutation({
    mutationFn: newSpeiThirdAccount,
    ...options
  })
  const mutate = async (formData, options) => {
    const { onSuccess, onError, mutationOptions } = options

    try {
      await toast.promise(speiThirdAccount.mutateAsync(formData, mutationOptions), {
        pending: 'Agregando Cuenta ...',
        success: {
          render({ data }) {
            client.invalidateQueries({ queryKey: [SPEI_THIRD_ACCOUNTS_KEYS.THIRD_ACCOUNTS_LIST] })
            isFunction(onSuccess) && onSuccess(data)

            return 'Se agrego la cuenta con éxito'
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
    ...speiThirdAccount,
    mutate,
    isLoading: speiThirdAccount.isPending
  }
}
