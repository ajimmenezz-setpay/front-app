import { useEffect, useState } from 'react'

import { useQuery } from '@tanstack/react-query'

import { CARDS_COMMERCES_KEYS } from '@/app/business/viabo-card/cards/adapters'
import { getEnabledCommerceCards } from '@/app/business/viabo-card/cards/services'
import { getErrorAPI } from '@/shared/interceptors'

export const useFindCommerceCards = (cardTypeId, options = {}) => {
  const [customError, setCustomError] = useState(null)

  const query = useQuery({
    queryKey: [CARDS_COMMERCES_KEYS.CARDS_COMMERCE_LIST, cardTypeId],
    queryFn: () => getEnabledCommerceCards(cardTypeId),
    refetchOnMount: 'always',
    retry: false,
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
