import { useState } from 'react'

import { useQuery } from '@tanstack/react-query'

import { ALL_COMMERCE_CARDS_KEYS } from '@/app/business/viabo-card/all-commerce-cards/adapters'
import { getCommerceCards } from '@/app/business/viabo-card/all-commerce-cards/services'
import { getErrorAPI } from '@/shared/interceptors'

export const useFindAllCommerceCards = (filters = {}, options = {}) => {
  const { columnFilters, globalFilter, pageIndex, pageSize, sorting } = filters

  const [customError, setCustomError] = useState(null)

  const query = useQuery({
    queryKey: [ALL_COMMERCE_CARDS_KEYS.LIST, columnFilters, globalFilter, pageIndex, pageSize, sorting],
    queryFn: async ({ signal }) => getCommerceCards(filters, signal),
    keepPreviousData: true,
    onError: error => {
      const errorMessage = getErrorAPI(
        error,
        'No se puede obtener la lista de tarjetas. Intente nuevamente o reporte a sistemas'
      )
      setCustomError(errorMessage)
    },
    staleTime: 60000,
    refetchOnWindowFocus: false,
    ...options
  })

  return {
    ...query,
    error: customError || null
  }
}
