import { useEffect, useState } from 'react'

import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { toast } from 'react-toastify'

import { TERMINALS_KEYS } from '../adapters'
import { getMovementsToConciliateTerminal } from '../services'

import { getErrorAPI, getNotificationTypeByErrorCode } from '@/shared/interceptors'

export const useFindMovementsToConciliateTerminal = (terminalId, date, options = {}) => {
  const finalDate = format(date, 'yyyy-MM-dd')
  const [customError, setCustomError] = useState(null)

  const key = terminalId ? [TERMINALS_KEYS.CONCILIATE_MOVEMENTS, terminalId] : [TERMINALS_KEYS.MOVEMENTS, 'global']

  const query = useQuery({
    queryKey: key,
    queryFn: ({ signal }) => getMovementsToConciliateTerminal(terminalId, finalDate, signal),
    refetchOnWindowFocus: false,
    retry: false,
    staleTime: 60000,
    ...options
  })

  useEffect(() => {
    if (query?.isError) {
      const errorMessage = getErrorAPI(
        query.error,
        'No se puede obtener la lista de movimientos para conciliar la terminal. Intente nuevamente o reporte a sistemas'
      )
      setCustomError(errorMessage)
      toast.error(errorMessage, {
        type: getNotificationTypeByErrorCode(query.error)
      })
    }
  }, [query.isError, query.error])

  return {
    ...query,
    error: customError || null
  }
}
