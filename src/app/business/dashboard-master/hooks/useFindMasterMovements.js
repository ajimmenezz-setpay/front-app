import { useEffect, useState } from 'react'

import { useQuery } from '@tanstack/react-query'
import { endOfDay, format, startOfDay } from 'date-fns'
import { es } from 'date-fns/locale'
import { toast } from 'react-toastify'

import { DASHBOARD_MASTER_KEYS } from '@/app/business/dashboard-master/adapters/dashboardMasterKeys'
import { getMasterMovements } from '@/app/business/dashboard-master/services'
import { useMasterGlobalStore } from '@/app/business/dashboard-master/store'
import { getErrorAPI, getNotificationTypeByErrorCode } from '@/shared/interceptors'

export const useFindMasterMovements = (startDate, endDate, options = {}) => {
  if (!startDate || !endDate) {
    return null
  }
  const initialDate = format(startOfDay(startDate), 'yyyy-MM-dd')
  const finalDate = format(endOfDay(endDate), 'yyyy-MM-dd')
  const [customError, setCustomError] = useState(null)
  const { setMovements, setFilterDate } = useMasterGlobalStore(state => state)

  const query = useQuery({
    queryKey: [DASHBOARD_MASTER_KEYS.MOVEMENTS],
    queryFn: ({ signal }) => getMasterMovements(initialDate, finalDate, signal),
    refetchOnWindowFocus: false,
    retry: false,
    staleTime: 60000,
    ...options
  })

  useEffect(() => {
    if (query?.isError) {
      const errorMessage = getErrorAPI(
        query.error,
        'No se puede obtener la lista de movimientos. Intente nuevamente o reporte a sistemas'
      )
      setCustomError(errorMessage)
      setMovements(null)
      toast.error(errorMessage, {
        type: getNotificationTypeByErrorCode(query.error)
      })
    }
  }, [query.isError, query.error])

  useEffect(() => {
    if (query?.isSuccess) {
      setFilterDate({
        startDate: startOfDay(startDate),
        endDate: endOfDay(endDate),
        text: `${format(startDate, 'dd MMMM yyyy', { locale: es })} - ${format(endDate, 'dd MMMM yyyy', {
          locale: es
        })}`
      })
    }
  }, [query.isSuccess])

  return {
    ...query,
    error: customError || null
  }
}
