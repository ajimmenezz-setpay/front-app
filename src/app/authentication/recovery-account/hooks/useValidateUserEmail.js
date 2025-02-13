import { useState } from 'react'

import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-toastify'

import { validateUserEmail } from '@/app/authentication/recovery-account/services'
import { getErrorAPI, getNotificationTypeByErrorCode } from '@/shared/interceptors'

export const useValidateUserEmail = (options = {}) => {
  const [customError, setCustomError] = useState(null)

  const validateEmail = useMutation({
    mutationFn: validateUserEmail,

    onError: error => {
      const errorMessage = getErrorAPI(
        error,
        'No se puede validar el correo del usuario. Intente nuevamente o reporte a sistemas'
      )
      setCustomError(errorMessage)

      toast.error(errorMessage, {
        type: getNotificationTypeByErrorCode(error)
      })
    },
    ...options
  })

  return {
    ...validateEmail,
    error: customError || null,
    isLoading: validateEmail.isPending
  }
}
