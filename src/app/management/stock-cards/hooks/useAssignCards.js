import { useState } from 'react'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useSnackbar } from 'notistack'

import { MANAGEMENT_STOCK_CARDS_KEYS } from '@/app/management/stock-cards/adapters'
import { assignCards } from '@/app/management/stock-cards/services'
import { getErrorAPI, getNotificationTypeByErrorCode } from '@/shared/interceptors'

export const useAssignCards = (options = {}) => {
  const { enqueueSnackbar } = useSnackbar()
  const [customError, setCustomError] = useState(null)
  const client = useQueryClient()

  const register = useMutation({
    mutationFn: assignCards,
    onSuccess: () => {
      setCustomError(null)
      client.invalidateQueries({ queryKey: [MANAGEMENT_STOCK_CARDS_KEYS.STOCK_CARDS_LIST] })
      enqueueSnackbar('Se asignaron las tarjetas al comercio', {
        variant: 'success',
        autoHideDuration: 5000
      })
    },
    onError: error => {
      client.invalidateQueries({ queryKey: [MANAGEMENT_STOCK_CARDS_KEYS.STOCK_CARDS_LIST] })
      const errorFormatted = getErrorAPI(error, 'No se puede asignar las tarjetas al comercio')
      enqueueSnackbar(errorFormatted, {
        variant: getNotificationTypeByErrorCode(error),
        autoHideDuration: 5000
      })
      setCustomError(errorFormatted)
    },
    ...options
  })

  return {
    ...register,
    error: customError || null,
    isLoading: register.isPending
  }
}
