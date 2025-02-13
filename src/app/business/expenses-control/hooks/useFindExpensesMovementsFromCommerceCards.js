import { useEffect, useState } from 'react'

import { useQuery } from '@tanstack/react-query'
import { endOfDay, format, startOfDay } from 'date-fns'
import { toast } from 'react-toastify'

import { EXPENSES_CONTROL_KEYS } from '../adapters'
import { getExpensesMovementsCommerceCards } from '../services'

import { getErrorAPI, getNotificationTypeByErrorCode } from '@/shared/interceptors'

export const useFindExpensesMovementsFromCommerceCards = (startDate, endDate, options = {}) => {
  if (!startDate || !endDate) {
    return null
  }
  const initialDate = format(startOfDay(startDate), 'yyyy-MM-dd HH:mm:ss')
  const finalDate = format(endOfDay(endDate), 'yyyy-MM-dd HH:mm:ss')
  const [customError, setCustomError] = useState(null)

  const query = useQuery({
    queryKey: [EXPENSES_CONTROL_KEYS.MOVEMENTS],
    queryFn: ({ signal }) => getExpensesMovementsCommerceCards(initialDate, finalDate, signal),
    refetchOnWindowFocus: false,
    retry: false,
    staleTime: 300000,
    ...options
  })

  useEffect(() => {
    if (query?.isError) {
      const errorMessage = getErrorAPI(
        query.error,
        'No se puede obtener la lista de movimientos. Intente nuevamente o reporte a sistemas'
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
