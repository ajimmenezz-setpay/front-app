import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'

import { ALL_COMMERCE_CARDS_KEYS } from '@/app/business/viabo-card/all-commerce-cards/adapters'
import { updateUserInfo } from '@/app/business/viabo-card/all-commerce-cards/services'
import { getErrorAPI, getNotificationTypeByErrorCode } from '@/shared/interceptors'
import { isFunction } from '@/shared/utils'

export const useUpdateUserInfo = (options = {}) => {
  const client = useQueryClient()

  const userMutate = useMutation({
    mutationFn: updateUserInfo,
    ...options
  })
  const mutate = async (formData, options = {}) => {
    const { onSuccess, onError, ...mutationOptions } = options

    try {
      await toast.promise(userMutate.mutateAsync(formData, mutationOptions), {
        pending: 'Actualizando información ...',
        success: {
          render({ data }) {
            client.invalidateQueries({
              queryKey: [ALL_COMMERCE_CARDS_KEYS.LIST]
            })
            isFunction(onSuccess) && onSuccess(data)
            return 'Se actualizo con éxito'
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
    ...userMutate,
    mutate,
    isLoading: userMutate.isPending
  }
}
