import { useMutation } from '@tanstack/react-query'
import { useSnackbar } from 'notistack'

import { validateDemoCard } from '@/app/business/viabo-card/register-cards/services'
import { getErrorAPI, getNotificationTypeByErrorCode } from '@/shared/interceptors'

export const useValidateDemoCard = (options = {}) => {
  const { enqueueSnackbar } = useSnackbar()
  const mutation = useMutation({
    mutationFn: validateDemoCard,
    onError: error => {
      const message = getErrorAPI(error, 'No se puede validar la tarjeta.')
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
