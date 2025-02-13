import { useEffect, useState } from 'react'

import { useQuery } from '@tanstack/react-query'
import { toast } from 'react-toastify'

import { DASHBOARD_MASTER_KEYS } from '../adapters/dashboardMasterKeys'
import { getCommerceCardsByPaymentProcessors } from '../services'

import { getErrorAPI, getNotificationTypeByErrorCode } from '@/shared/interceptors'

export const useFindCommerceCardsByPaymentProcessors = (paymentProcessors, options = {}) => {
  const [customError, setCustomError] = useState(null)

  const query = useQuery({
    queryKey: [DASHBOARD_MASTER_KEYS.COMMERCE_CARDS],
    queryFn: ({ signal }) => getCommerceCardsByPaymentProcessors(paymentProcessors, signal),
    staleTime: 60000,
    ...options
  })

  useEffect(() => {
    if (query?.isError) {
      const errorMessage = getErrorAPI(
        query.error,
        'No se puede obtener la lista de tarjetas del comercio. Intente nuevamente o reporte a sistemas'
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
