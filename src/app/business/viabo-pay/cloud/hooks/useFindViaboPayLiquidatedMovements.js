import { useEffect, useState } from 'react'

import { useQuery } from '@tanstack/react-query'
import { endOfDay, format, startOfDay } from 'date-fns'
import { es } from 'date-fns/locale'
import { toast } from 'react-toastify'

import { CLOUD_VIABO_PAY_KEYS } from '../adapters'
import { getViaboPayLiquidatedMovements } from '../services'
import { useViaboPayLiquidatedMovementsStore } from '../store'

import { getErrorAPI, getNotificationTypeByErrorCode } from '@/shared/interceptors'

export const useFindViaboPayLiquidatedMovements = (startDate, endDate, options = {}) => {
  if (!startDate || !endDate) {
    return null
  }
  const { setFilterDate } = useViaboPayLiquidatedMovementsStore(state => state)
  const initialDate = format(startOfDay(startDate), 'yyyy-MM-dd HH:mm:ss')
  const finalDate = format(endOfDay(endDate), 'yyyy-MM-dd HH:mm:ss')

  const [customError, setCustomError] = useState(null)



  const query = useQuery({
    queryKey: [CLOUD_VIABO_PAY_KEYS.MOVEMENTS],
    queryFn: ({ signal }) => getViaboPayLiquidatedMovements(initialDate, finalDate, signal),
    refetchOnWindowFocus: false,
    retry: false,
    staleTime: 300000,
    onSuccess: data => {
      setFilterDate({
        startDate: startOfDay(startDate),
        endDate: endOfDay(endDate),
        text: `${format(startDate, 'dd MMMM yyyy', { locale: es })} - ${format(endDate, 'dd MMMM yyyy', {
          locale: es
        })}`
      })
    },
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
