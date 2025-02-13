import { useEffect, useState } from 'react'

import { useQuery } from '@tanstack/react-query'
import { toast } from 'react-toastify'

import { NEW_TICKET_SUPPORT_KEYS } from '../adapters'
import { getTicketCausesByProfile } from '../services'

import { getErrorAPI, getNotificationTypeByErrorCode } from '@/shared/interceptors'

export const useFindTicketCausesByProfile = (options = {}) => {
  const [customError, setCustomError] = useState(null)

  const query = useQuery({
    queryKey: [NEW_TICKET_SUPPORT_KEYS.CAUSES_BY_PROFILE],
    queryFn: getTicketCausesByProfile,
    refetchOnWindowFocus: false,
    retry: false,
    staleTime: 300000,
    ...options
  })

  useEffect(() => {
    if (query?.isError) {
      const errorMessage = getErrorAPI(
        query.error,
        'No se puede obtener la lista de las causas. Intente nuevamente o reporte a sistemas'
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
