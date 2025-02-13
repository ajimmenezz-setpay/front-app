import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'

import { MANAGEMENT_USERS_KEYS } from '../adapters'
import { updateUserInfo } from '../services'

import { getErrorAPI, getNotificationTypeByErrorCode } from '@/shared/interceptors'
import { isFunction } from '@/shared/utils'

export const useUpdateUserInfo = (options = {}) => {
  const client = useQueryClient()
  const mutation = useMutation({
    mutationFn: updateUserInfo,
    ...options
  })
  const mutate = async (formData, options) => {
    const { onSuccess, onError, mutationOptions } = options

    try {
      const data = await toast.promise(mutation.mutateAsync(formData, mutationOptions), {
        pending: 'Actualizando información del usuario ...',
        success: {
          render({ data }) {
            client.invalidateQueries({ queryKey: [MANAGEMENT_USERS_KEYS.SPEI_USERS] })
            client.invalidateQueries({ queryKey: [MANAGEMENT_USERS_KEYS.CARD_USERS] })
            isFunction(onSuccess) && onSuccess(data)
            return 'Se actualizaron los datos con éxito'
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
    ...mutation,
    mutate,
    isLoading: mutation.isPending
  }
}
