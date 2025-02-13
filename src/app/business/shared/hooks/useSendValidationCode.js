import { useMutation } from '@tanstack/react-query'
import { useSnackbar } from 'notistack'

import { sendValidationCode } from '@/app/business/shared/services/ValidationUserRepository'
import { getErrorAPI, getNotificationTypeByErrorCode } from '@/shared/interceptors'

export const useSendValidationCode = (options = {}) => {
  const { enqueueSnackbar } = useSnackbar()
  const mutation = useMutation({
    mutationFn: sendValidationCode,
    onSuccess: () => {
      enqueueSnackbar('Código Enviado!', {
        variant: 'success'
      })
    },
    onError: error => {
      const message = getErrorAPI(error, 'No se puede enviar el código')
      enqueueSnackbar(message, {
        variant: getNotificationTypeByErrorCode(error),
        autoHideDuration: 5000
      })
    },
    ...options
  })

  return {
    ...mutation,
    isLoading: mutation.isPending
  }
}
