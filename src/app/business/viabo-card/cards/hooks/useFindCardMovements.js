import { useEffect, useState } from 'react'

import { useQuery } from '@tanstack/react-query'
import { endOfDay, format, startOfDay } from 'date-fns'
import { es } from 'date-fns/locale'
import { toast } from 'react-toastify'

import { CARDS_COMMERCES_KEYS } from '@/app/business/viabo-card/cards/adapters'
import { getCardMovements } from '@/app/business/viabo-card/cards/services'
import { useCommerceDetailsCard } from '@/app/business/viabo-card/cards/store'
import { getErrorAPI, getNotificationTypeByErrorCode } from '@/shared/interceptors'

export const useFindCardMovements = (cardId, startDate, endDate, options = {}) => {
  if (!startDate || !endDate) {
    return null
  }
  const initialDate = format(startOfDay(startDate), 'yyyy-MM-dd')
  const finalDate = format(endOfDay(endDate), 'yyyy-MM-dd')
  const [customError, setCustomError] = useState(null)
  const addInfoCard = useCommerceDetailsCard(state => state.addInfoCard)

  const query = useQuery({
    queryKey: [CARDS_COMMERCES_KEYS.CARD_MOVEMENTS, cardId],
    queryFn: ({ signal }) => getCardMovements(cardId, initialDate, finalDate, signal),
    refetchOnWindowFocus: false,
    retry: false,
    staleTime: 60000,
    ...options
  })

  useEffect(() => {
    if (query?.isError) {
      const errorMessage = getErrorAPI(
        query.error,
        'No se puede obtener la lista de movimientos de la tarjeta. Intente nuevamente o reporte a sistemas'
      )
      setCustomError(errorMessage)
      toast.error(errorMessage, {
        type: getNotificationTypeByErrorCode(query.error)
      })
      addInfoCard({
        monthBalance: null,
        filterDate: {
          startDate: startOfDay(startDate),
          endDate: endOfDay(endDate),
          text: `${format(startDate, 'dd MMMM yyyy', { locale: es })} - ${format(endDate, 'dd MMMM yyyy', {
            locale: es
          })}`
        },
        movements: [],
        expenses: '$0.00',
        income: '$0.00',
        balanceMovements: '$0.00'
      })
    }
  }, [query.isError, query.error])

  return {
    ...query,
    error: customError || null
  }
}
