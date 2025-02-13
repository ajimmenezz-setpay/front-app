import { useEffect, useState } from 'react'

import { useQuery } from '@tanstack/react-query'
import { toast } from 'react-toastify'

import { SPEI_COMMISSIONS_REPORT_KEYS } from '../adapters'
import { getSpeiCloudCommissionsReport } from '../services'

import { getErrorAPI, getNotificationTypeByErrorCode } from '@/shared/interceptors'

export const useFindSpeiCloudCommissionsReportMovements = (filters, options = {}) => {
  const [customError, setCustomError] = useState(null)

  const query = useQuery({
    queryKey: [SPEI_COMMISSIONS_REPORT_KEYS.MOVEMENTS, filters],
    queryFn: ({ signal }) => getSpeiCloudCommissionsReport(filters),
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
        'No se puede obtener las comisiones de la cuenta. Intente nuevamente o reporte a sistemas'
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
