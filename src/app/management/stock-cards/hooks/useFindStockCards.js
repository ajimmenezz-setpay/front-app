import { useEffect, useState } from 'react'

import { useQuery } from '@tanstack/react-query'

import { MANAGEMENT_STOCK_CARDS_KEYS } from '@/app/management/stock-cards/adapters'
import { getStockCards } from '@/app/management/stock-cards/services'
import { getErrorAPI } from '@/shared/interceptors'

export const useFindStockCards = (options = {}) => {
  const [customError, setCustomError] = useState(null)

  const query = useQuery({
    queryKey: [MANAGEMENT_STOCK_CARDS_KEYS.STOCK_CARDS_LIST],
    queryFn: getStockCards,
    staleTime: 60000,
    ...options
  })

  useEffect(() => {
    if (query?.isError) {
      const errorMessage = getErrorAPI(
        query.error,
        'No se puede obtener la lista de tarjetas. Intente nuevamente o reporte a sistemas'
      )
      setCustomError(errorMessage)
    }
  }, [query.isError, query.error])

  return {
    ...query,
    error: customError || null
  }
}
