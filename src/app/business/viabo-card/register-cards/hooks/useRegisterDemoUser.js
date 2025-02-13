import { useState } from 'react'

import { useMutation } from '@tanstack/react-query'
import { useSnackbar } from 'notistack'

import { createNewDemoUser } from '@/app/business/viabo-card/register-cards/services'
import { getErrorAPI, getNotificationTypeByErrorCode } from '@/shared/interceptors'

export const useRegisterDemoUser = (options = {}) => {
  const { enqueueSnackbar } = useSnackbar()
  const [customError, setCustomError] = useState(null)

  const register = useMutation({
    mutationFn: createNewDemoUser,
    onSuccess: () => {
      setCustomError(null)
      enqueueSnackbar('Se creo el usuario con éxito', {
        variant: 'success',
        autoHideDuration: 5000
      })
    },
    onError: error => {
      const errorMessage = getErrorAPI(error, 'No se puede crear el usuario. Intente nuevamente o reporte a sistemas')
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
