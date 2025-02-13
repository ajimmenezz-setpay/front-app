import { useState } from 'react'

import { useMutation } from '@tanstack/react-query'
import { useSnackbar } from 'notistack'

import { assignCardToDemoUser } from '@/app/business/viabo-card/register-cards/services'
import { getErrorAPI, getNotificationTypeByErrorCode } from '@/shared/interceptors'

export const useAssignCardToDemoUser = (options = {}) => {
  const { enqueueSnackbar } = useSnackbar()
  const [customError, setCustomError] = useState(null)

  const register = useMutation({
    mutationFn: assignCardToDemoUser,
    onSuccess: () => {
      setCustomError(null)
    },
    onError: error => {
      const errorMessage = getErrorAPI(error, 'No se puede asignar la tarjeta. Intente nuevamente o reporte a sistemas')
      setCustomError(errorMessage)
      enqueueSnackbar(errorMessage, {
        variant: getNotificationTypeByErrorCode(error),
        autoHideDuration: 5000
      })
    },
    ...options
  })

  return {
    ...register,
    error: customError || null,
    isLoading: register.isPending
  }
}
