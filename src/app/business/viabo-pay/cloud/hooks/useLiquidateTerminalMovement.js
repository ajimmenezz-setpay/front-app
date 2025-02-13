import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'

import { CLOUD_VIABO_PAY_KEYS } from '../adapters'
import { liquidateTerminalMovement } from '../services'

import { getErrorAPI, getNotificationTypeByErrorCode } from '@/shared/interceptors'
import { isFunction } from '@/shared/utils'

export const useLiquidateTerminalMovement = (options = {}) => {
  const client = useQueryClient()
  const liquidateMovement = useMutation({
    mutationFn: liquidateTerminalMovement,
    ...options
  })
  const liquidate = async (formData, options) => {
    const { onSuccess, onError, mutationOptions } = options

    try {
      await toast.promise(liquidateMovement.mutateAsync(formData, mutationOptions), {
        pending: 'Liquidando movimiento ...',
        success: {
          render({ data }) {
            client.invalidateQueries({ queryKey: [CLOUD_VIABO_PAY_KEYS.MOVEMENTS] })
            isFunction(onSuccess) && onSuccess(data)
            return 'Se liquidó el movimiento con éxito'
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
    ...liquidateMovement,
    mutate: liquidate,
    isLoading: liquidateMovement.isPending
  }
}
