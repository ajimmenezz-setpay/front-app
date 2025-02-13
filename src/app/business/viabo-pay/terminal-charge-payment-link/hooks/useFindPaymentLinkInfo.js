import { useEffect, useState } from 'react'

import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'

import { CHARGE_PAYMENT_LINK } from '../adapters'
import { getPaymentLinkInfo } from '../services'

import { getErrorAPI } from '@/shared/interceptors'

export const useFindPaymentLinkInfo = (paymentId, options = {}) => {
  const [customError, setCustomError] = useState(null)
  const navigate = useNavigate()

  const query = useQuery({
    queryKey: [CHARGE_PAYMENT_LINK.INFO, paymentId],
    queryFn: ({ signal }) => getPaymentLinkInfo(paymentId),
    retry: false,
    staleTime: 60000,
    ...options
  })

  useEffect(() => {
    if (query?.isError) {
      const errorMessage = getErrorAPI(
        query.error,
        'No se puede obtener la información de la tarjeta. Intente nuevamente o reporte a sistemas'
      )
      setCustomError(errorMessage)
      navigate('/404')
    }
  }, [query.isError, query.error])

  return {
    ...query,
    error: customError || null
  }
}
