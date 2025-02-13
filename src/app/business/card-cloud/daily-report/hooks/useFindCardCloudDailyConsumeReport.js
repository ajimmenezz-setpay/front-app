import { useEffect, useState } from 'react'

import { useQuery } from '@tanstack/react-query'
import { toast } from 'react-toastify'

import { CARD_CLOUD_DAILY_REPORT_KEYS } from '../adapters'
import { getCardCloudDailyConsumeReport } from '../services'

import { getErrorAPI, getNotificationTypeByErrorCode } from '@/shared/interceptors'

export const useFindCardCloudDailyConsumeReport = (filters, options = {}) => {
  const [customError, setCustomError] = useState(null)

  const query = useQuery({
    queryKey: [CARD_CLOUD_DAILY_REPORT_KEYS.MOVEMENTS, filters],
    queryFn: ({ signal }) => getCardCloudDailyConsumeReport(filters),
    refetchOnWindowFocus: false,
    refetchOnMount: 'always',
    retry: false,
    staleTime: 300000,
    ...options
  })

  useEffect(() => {
    if (query?.isError) {
      const errorMessage = getErrorAPI(
        query.error,
        'No se puede obtener el reporte de consumos diarios. Intente nuevamente o reporte a sistemas'
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
