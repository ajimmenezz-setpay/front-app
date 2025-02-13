import { useEffect, useState } from 'react'

import { useQuery } from '@tanstack/react-query'

import { CARDS_COMMERCES_KEYS } from '@/app/business/viabo-card/cards/adapters'
import { getCommerceCardTypes } from '@/app/business/viabo-card/cards/services'
import { useCommerceDetailsCard } from '@/app/business/viabo-card/cards/store'
import { getErrorAPI } from '@/shared/interceptors'

export const useFindCommerceCardTypes = (options = {}) => {
  const [customError, setCustomError] = useState(null)
  const setCardTypeSelected = useCommerceDetailsCard(state => state.setCardTypeSelected)
  const cardTypeSelected = useCommerceDetailsCard(state => state.cardTypeSelected)

  const query = useQuery({
    queryKey: [CARDS_COMMERCES_KEYS.PAYMENT_PROCESSORS],
    queryFn: getCommerceCardTypes,
    staleTime: 60000,
    refetchOnMount: 'always',
    ...options
  })

  useEffect(() => {
    if (query?.isError) {
      const errorMessage = getErrorAPI(
        query.error,
        'No se puede obtener la lista de los tipos de tarjetas. Intente nuevamente o reporte a sistema'
      )
      setCustomError(errorMessage)
    }
  }, [query.isError, query.error])

  useEffect(() => {
    if (query?.data) {
      const data = query?.data
      const findSelected =
        query?.data?.find(cardType => cardType?.id === '2') ||
        (Array.isArray(data) && data?.length > 0 && data[0]) ||
        null

      if (findSelected && !cardTypeSelected) {
        setCardTypeSelected(findSelected?.id)
      }
    }
  }, [query.data])

  return {
    ...query,
    error: customError || null
  }
}
