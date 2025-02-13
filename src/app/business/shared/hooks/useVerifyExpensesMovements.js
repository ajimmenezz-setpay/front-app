import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'

import { DASHBOARD_MASTER_KEYS } from '../../dashboard-master/adapters/dashboardMasterKeys'
import { CARDS_COMMERCES_KEYS } from '../../viabo-card/cards/adapters'
import { verifyExpenses } from '../services'

import { getErrorAPI, getNotificationTypeByErrorCode } from '@/shared/interceptors'
import { isFunction } from '@/shared/utils'

export const useVerifyExpensesMovements = (options = {}) => {
  const client = useQueryClient()
  const verify = useMutation({
    mutationFn: verifyExpenses,
    ...options
  })
  const mutate = async (formData, options) => {
    const { onSuccess, onError, ...mutationOptions } = options

    try {
      await toast.promise(verify.mutateAsync(formData, mutationOptions), {
        pending: 'Comprobando movimientos ...',
        success: {
          render({ data }) {
            client.invalidateQueries({
              queryKey: [DASHBOARD_MASTER_KEYS.MOVEMENTS]
            })
            client.invalidateQueries({
              queryKey: [CARDS_COMMERCES_KEYS.CARD_MOVEMENTS]
            })
            isFunction(onSuccess) && onSuccess(data)
            return 'Se creó la comprobación con éxito'
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
    ...verify,
    mutate,
    isLoading: verify.isPending
  }
}
