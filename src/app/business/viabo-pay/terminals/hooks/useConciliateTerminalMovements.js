import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'

import { TERMINALS_KEYS } from '../adapters'
import { conciliateTerminalMovements } from '../services'

import { getErrorAPI, getNotificationTypeByErrorCode } from '@/shared/interceptors'

export const useConciliateTerminalMovements = (options = {}) => {
  const client = useQueryClient()
  const conciliateOrder = useMutation({
    mutationFn: conciliateTerminalMovements,
    ...options
  })
  const conciliate = async (formData, options) => {
    const { onSuccess, onError, mutationOptions } = options

    try {
      await toast.promise(conciliateOrder.mutateAsync(formData, mutationOptions), {
        pending: 'Conciliando movimientos de la terminal ...',
        success: {
          render({ data }) {
            client.invalidateQueries({ queryKey: [TERMINALS_KEYS.MOVEMENTS, formData?.terminalId] })
            onSuccess(data)
            return 'Se creó la conciliación con éxito'
          }
        }
      })
    } catch (error) {
      const errorFormatted = getErrorAPI(
        error,
        `No se puede realizar esta operación en este momento. Intente nuevamente o reporte a sistemas`
      )
      onError(errorFormatted)
      toast.error(errorFormatted, {
        type: getNotificationTypeByErrorCode(error)
      })
    }
  }

  return {
    ...conciliateOrder,
    mutate: conciliate,
    isLoading: conciliateOrder.isPending
  }
}
