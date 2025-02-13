import { useEffect, useState } from 'react'

import { useQuery } from '@tanstack/react-query'
import { toast } from 'react-toastify'

import { SUPPORT_TICKETS_V2_KEYS } from '../adapters'
import { getTicketSupportDetailsV2 } from '../services'

import { getErrorAPI, getNotificationTypeByErrorCode } from '@/shared/interceptors'

export const useFindSupportTicketDetails = (ticketId, options = {}) => {
  const [customError, setCustomError] = useState(null)

  const query = useQuery({
    queryKey: [SUPPORT_TICKETS_V2_KEYS.DETAILS, ticketId],
    queryFn: () => getTicketSupportDetailsV2(ticketId),
    refetchOnWindowFocus: false,
    refetchOnMount: 'always',
    retry: false,
    staleTime: 300000,
    ...options
  })

  useEffect(() => {
    if (query?.isError) {
      const errorMessage = getErrorAPI(
        query.error,
        'No se puede obtener la información del ticket. Intente nuevamente o reporte a sistemas'
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
