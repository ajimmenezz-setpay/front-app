import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'

import { MANAGEMENT_USERS_KEYS } from '../adapters'
import { changeStatusOfUser } from '../services'

import { getErrorAPI, getNotificationTypeByErrorCode } from '@/shared/interceptors'
import { isFunction } from '@/shared/utils'

export const useToggleUserStatus = (options = {}) => {
  const client = useQueryClient()
  const toggleUserStatus = useMutation({
    mutationFn: changeStatusOfUser,
    ...options
  })
  const mutate = async (formData, options) => {
    const { onSuccess, onError, mutationOptions } = options

    try {
      const data = await toast.promise(toggleUserStatus.mutateAsync(formData, mutationOptions), {
        pending: 'Actualizando estado del usuario ...',
        success: {
          render({ data }) {
            const responseData = data?.response
            const requestData = data?.request
            client.invalidateQueries({ queryKey: [MANAGEMENT_USERS_KEYS.SPEI_USERS] })
            client.invalidateQueries({ queryKey: [MANAGEMENT_USERS_KEYS.CARD_USERS] })
            isFunction(onSuccess) && onSuccess(data)
            return !requestData?.isActive ? 'Se inhabilito el usuario con éxito' : 'Se habilito el usuario con éxito'
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
    ...toggleUserStatus,
    mutate,
    isLoading: toggleUserStatus.isPending
  }
}
