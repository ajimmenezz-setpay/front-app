import { useState } from 'react'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useSnackbar } from 'notistack'

import { COMMERCE_KEYS } from '@/app/business/commerce/adapters'
import { createNewCommerce } from '@/app/business/commerce/services'
import { getErrorAPI } from '@/shared/interceptors'

export const useRegisterCommerce = (options = {}) => {
  const { enqueueSnackbar } = useSnackbar()
  const [customError, setCustomError] = useState(null)
  const client = useQueryClient()

  const register = useMutation({
    mutationFn: createNewCommerce,
    onSuccess: () => {
      setCustomError(null)
      client.removeQueries({ queryKey: [COMMERCE_KEYS.TOKEN_COMMERCE] })
      enqueueSnackbar('Se creo el comercio', {
        variant: 'success',
        autoHideDuration: 5000
      })
    },
    onError: error => {
      setCustomError(getErrorAPI(error, 'No se puede crear el comercio'))
    },
    ...options
  })

  return {
    ...register,
    error: customError || null,
    isLoading: register.isPending
  }
}
