import { useEffect, useState } from 'react'

import { useQuery } from '@tanstack/react-query'

import { CARDS_COMMERCES_KEYS } from '@/app/business/viabo-card/cards/adapters'
import { getCardInfo } from '@/app/business/viabo-card/cards/services'
import { getErrorAPI } from '@/shared/interceptors'

export const useFindCardDetails = (cardId, options = {}) => {
  const [customError, setCustomError] = useState(null)
  const query = useQuery({
    queryKey: [CARDS_COMMERCES_KEYS.CARD_INFO, cardId],
    queryFn: ({ signal }) => getCardInfo(cardId, signal),
    staleTime: 60000,
    refetchOnWindowFocus: false,
    ...options
  })

  useEffect(() => {
    if (query?.isError) {
      const errorMessage = getErrorAPI(
        query.error,
        'No se puede obtener la información de la tarjeta. Intente nuevamente o reporte a sistemas'
      )
      setCustomError(errorMessage)
    }
  }, [query.isError, query.error])

  return {
    ...query,
    error: customError || null
  }
}
