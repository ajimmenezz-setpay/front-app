import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-toastify'

import { changePassword } from '@/app/authentication/user-change-password/services'
import { getErrorAPI, getNotificationTypeByErrorCode } from '@/shared/interceptors'
import { isFunction } from '@/shared/utils'

export const useChangePassword = (options = {}) => {
  const password = useMutation({
    mutationFn: changePassword,
    ...options
  })
  const mutate = async (formData, options) => {
    const { onSuccess, onError, mutationOptions } = options

    try {
      await toast.promise(password.mutateAsync(formData, mutationOptions), {
        pending: 'Actualizando Contraseña ...',
        success: {
          render({ data }) {
            isFunction(onSuccess) && onSuccess(data)

            return 'Se actualizo la contraseña con éxito'
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
    ...password,
    isLoading: password.isPending,
    mutate
  }
}
