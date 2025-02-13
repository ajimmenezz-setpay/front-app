import { useEffect, useState } from 'react'

import { useQuery } from '@tanstack/react-query'

import { TERMINALS_KEYS } from '../adapters'
import { getCommerceTerminals } from '../services'

import { getErrorAPI } from '@/shared/interceptors'

export const useFindCommerceTerminals = (options = {}) => {
  const [customError, setCustomError] = useState(null)
  const query = useQuery({
    queryKey: [TERMINALS_KEYS.LIST],
    queryFn: getCommerceTerminals,
    refetchOnMount: 'always',
    staleTime: 60000,
    ...options
  })

  useEffect(() => {
    if (query?.isError) {
      const errorMessage = getErrorAPI(
        query.error,
        'No se puede obtener la lista de terminales del comercio. Intente nuevamente o reporte a sistemas'
      )
      setCustomError(errorMessage)
    }
  }, [query.isError, query.error])

  return {
    ...query,
    error: customError || null
  }
}
