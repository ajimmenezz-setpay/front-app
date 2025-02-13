import { useEffect, useState } from 'react'

import { useQuery } from '@tanstack/react-query'
import { toast } from 'react-toastify'

import { FUNDING_ORDERS_KEYS } from '../adapters'
import { getFundingOrderDetails } from '../services'

import { getErrorAPI, getNotificationTypeByErrorCode } from '@/shared/interceptors'

export const useFindFundingOrderDetails = (fundingOrder, options = {}) => {
  const [customError, setCustomError] = useState(null)

  const query = useQuery({
    queryKey: [FUNDING_ORDERS_KEYS.DETAILS, fundingOrder?.id],
    queryFn: () => getFundingOrderDetails(fundingOrder),
    refetchOnWindowFocus: false,
    retry: false,
    staleTime: 60000,
    ...options
  })

  useEffect(() => {
    if (query?.isError) {
      const errorMessage = getErrorAPI(
        query.error,
        'No se puede obtener la información de la orden de fondeo. Intente nuevamente o reporte a sistemas'
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
