import { useEffect, useState } from 'react'

import { useQuery } from '@tanstack/react-query'
import { endOfMonth, format, startOfMonth } from 'date-fns'
import { toast } from 'react-toastify'

import { TERMINALS_KEYS } from '../adapters'
import { getTerminalMovements } from '../services'
import { useTerminals } from '../store'

import { getErrorAPI, getNotificationTypeByErrorCode } from '@/shared/interceptors'

export const useFindTerminalMovements = (terminalId, date, options = {}) => {
  const resetBalance = useTerminals(state => state.resetBalance)
  const resetGlobalBalance = useTerminals(state => state.resetGlobalBalance)
  const primerDiaMes = startOfMonth(date)
  const ultimoDiaMes = endOfMonth(date)
  const initialDate = format(primerDiaMes, 'yyyy-MM-dd')
  const finalDate = format(ultimoDiaMes, 'yyyy-MM-dd')
  const [customError, setCustomError] = useState(null)

  const key = terminalId ? [TERMINALS_KEYS.MOVEMENTS, terminalId] : [TERMINALS_KEYS.MOVEMENTS, 'global']

  const query = useQuery({
    queryKey: key,
    queryFn: ({ signal }) => getTerminalMovements(terminalId, initialDate, finalDate, signal),
    refetchOnWindowFocus: false,
    retry: false,
    staleTime: 60000,
    ...options
  })

  useEffect(() => {
    if (query?.isError) {
      const errorMessage = getErrorAPI(
        query.error,
        'No se puede obtener la lista de movimientos de la terminal. Intente nuevamente o reporte a sistemas'
      )
      setCustomError(errorMessage)
      toast.error(errorMessage, {
        type: getNotificationTypeByErrorCode(query.error)
      })
      terminalId ? resetBalance() : resetGlobalBalance()
    }
  }, [query.isError, query.error])

  return {
    ...query,
    error: customError || null
  }
}
