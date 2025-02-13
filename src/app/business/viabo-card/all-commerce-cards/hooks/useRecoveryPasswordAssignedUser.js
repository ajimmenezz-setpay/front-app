import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-toastify'

import { recoveryPasswordAssignedUser } from '../services'

import { getErrorAPI, getNotificationTypeByErrorCode } from '@/shared/interceptors'
import { isFunction } from '@/shared/utils'

export const useRecoveryPasswordAssignedUser = (options = {}) => {
  const userMutate = useMutation({
    mutationFn: recoveryPasswordAssignedUser,
    ...options
  })
  const mutate = async (formData, options = {}) => {
    const { onSuccess, onError, ...mutationOptions } = options

    try {
      await toast.promise(userMutate.mutateAsync(formData, mutationOptions), {
        pending: 'Restableciendo Contraseña ...',
        success: {
          render({ data }) {
            isFunction(onSuccess) && onSuccess(data)
            return 'Se restableció la contraseña con éxito'
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
