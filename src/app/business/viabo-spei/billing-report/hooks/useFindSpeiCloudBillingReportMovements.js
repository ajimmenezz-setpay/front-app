import { useEffect, useState } from 'react'

import { useQuery } from '@tanstack/react-query'
import { toast } from 'react-toastify'

import { SPEI_BILLING_REPORT_KEYS } from '../adapters'
import { getSpeiCloudBillingReport } from '../services'

import { getErrorAPI, getNotificationTypeByErrorCode } from '@/shared/interceptors'

export const useFindSpeiCloudBillingReportMovements = (filters, options = {}) => {
  const [customError, setCustomError] = useState(null)

  const query = useQuery({
    queryKey: [SPEI_BILLING_REPORT_KEYS.MOVEMENTS_LIST, filters],
    queryFn: ({ signal }) => getSpeiCloudBillingReport(filters),
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
        'No se puede obtener los movimientos de la cuenta. Intente nuevamente o reporte a sistemas'
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
