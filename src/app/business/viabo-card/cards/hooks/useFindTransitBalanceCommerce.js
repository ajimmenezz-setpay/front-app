import { useEffect, useState } from 'react'

import { useQuery } from '@tanstack/react-query'
import { toast } from 'react-toastify'

import { CARDS_COMMERCES_KEYS } from '@/app/business/viabo-card/cards/adapters'
import { getTransitBalance } from '@/app/business/viabo-card/cards/services'
import { getErrorAPI, getNotificationTypeByErrorCode } from '@/shared/interceptors'

export const useFindTransitBalanceCommerce = (cardTypeId, options = {}) => {
  const [customError, setCustomError] = useState(null)

  const query = useQuery({
    queryKey: [CARDS_COMMERCES_KEYS.TRANSIT_BALANCE],
    queryFn: ({ signal }) => getTransitBalance(cardTypeId),
    staleTime: 60000,
    ...options
  })

  useEffect(() => {
    if (query?.isError) {
      const errorMessage = getErrorAPI(
        query.error,
        'No se puede obtener la información del saldo en transito. Intente nuevamente o reporte a sistemas'
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
