import { useEffect, useState } from 'react'

import { useQuery } from '@tanstack/react-query'

import { PUBLIC_PAYMENTS } from '../adapters'
import { getCommerceInfoBySlug } from '../services'
import { usePublicPaymentStore } from '../store'

import { getErrorAPI } from '@/shared/interceptors'

export const useFindCommerceInfoBySlug = (slug, options = {}) => {
  const [customError, setCustomError] = useState(null)
  const setCommerceInfo = usePublicPaymentStore(state => state.setCommerceInfo)

  const query = useQuery({
    queryKey: [PUBLIC_PAYMENTS.COMMERCE_INFO_SLUG],
    queryFn: async ({ signal }) => {
      const data = await getCommerceInfoBySlug(slug, signal)
      setCommerceInfo(data)

      return data
    },
    staleTime: 60000,
    ...options
  })

  useEffect(() => {
    if (query?.isError) {
      const errorMessage = getErrorAPI(
        query.error,
        'No se puede obtener la información del comercio. Intente nuevamente o reporte a sistemas'
      )
      setCustomError(errorMessage)
    }
  }, [query.isError, query.error])

  return {
    ...query,
    error: customError || null
  }
}
