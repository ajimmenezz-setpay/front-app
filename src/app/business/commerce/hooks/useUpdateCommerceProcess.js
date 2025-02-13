import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useSnackbar } from 'notistack'

import { COMMERCE_KEYS } from '@/app/business/commerce/adapters'
import { updateCommerceProcess } from '@/app/business/commerce/services'
import { getErrorAPI } from '@/shared/interceptors'

export const useUpdateCommerceProcess = (options = {}) => {
  const { enqueueSnackbar } = useSnackbar()
  const client = useQueryClient()
  const mutation = useMutation({
    mutationFn: updateCommerceProcess,
    onSuccess: () => {
      client.invalidateQueries({
        queryKey: [COMMERCE_KEYS.COMMERCE_PROCESS]
      })
      enqueueSnackbar('Se actualizo la información del proceso!', {
        variant: 'success'
      })
    },
    onError: error => {
      const message = getErrorAPI(error, 'No se puede agregar la información al proceso')
      enqueueSnackbar(message, {
        variant: error?.status === 500 ? 'error' : 'warning',
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
