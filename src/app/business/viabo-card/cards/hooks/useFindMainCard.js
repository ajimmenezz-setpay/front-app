import { useEffect, useState } from 'react'

import { useQuery } from '@tanstack/react-query'
import { toast } from 'react-toastify'

import { CARDS_COMMERCES_KEYS } from '@/app/business/viabo-card/cards/adapters'
import { getMainCardCommerce } from '@/app/business/viabo-card/cards/services'
import { useCommerceDetailsCard } from '@/app/business/viabo-card/cards/store'
import { getErrorAPI, getNotificationTypeByErrorCode } from '@/shared/interceptors'

export const useFindMainCard = (cardTypeId, options = {}) => {
  const [customError, setCustomError] = useState(null)
  const setMainCard = useCommerceDetailsCard(state => state.setMainCard)

  const query = useQuery({
    queryKey: [CARDS_COMMERCES_KEYS.MAIN_CARD],
    queryFn: ({ signal }) => getMainCardCommerce(cardTypeId, signal),
    refetchOnWindowFocus: false,
    retry: false,
    staleTime: 60000,
    ...options
  })

  useEffect(() => {
    if (query?.isError) {
      const errorMessage = getErrorAPI(
        query.error,
        'No se puede obtener la información de la tarjeta principal. Intente nuevamente o reporte a sistemas'
      )
      setCustomError(errorMessage)
      setMainCard(null)
      toast.error(errorMessage, {
        type: getNotificationTypeByErrorCode(query.error)
      })
    }
  }, [query.isError, query.error])

  useEffect(() => {
    if (query?.data) {
      setMainCard(query?.data)
    }
  }, [query.data])

  return {
    ...query,
    error: customError || null
  }
}
