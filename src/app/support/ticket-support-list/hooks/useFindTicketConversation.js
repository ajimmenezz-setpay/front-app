import { useEffect, useState } from 'react'

import { useInfiniteQuery } from '@tanstack/react-query'
import { toast } from 'react-toastify'

import { TICKETS_SUPPORT_LIST_KEYS } from '../adapters'
import { getSupportTicketConversation } from '../services'
import { useTicketSupportListStore } from '../store'

import { getErrorAPI, getNotificationTypeByErrorCode } from '@/shared/interceptors'

export const useFindTicketConversation = (tickedId, options = {}) => {
  const [customError, setCustomError] = useState(null)
  const setCanCloseTicket = useTicketSupportListStore(state => state.setCanCloseTicket)

  const query = useInfiniteQuery({
    queryKey: [TICKETS_SUPPORT_LIST_KEYS.TICKET_CONVERSATION, tickedId],
    queryFn: async ({ pageParam = 1 }) => {
      const data = await getSupportTicketConversation(tickedId, pageParam)
      setCanCloseTicket(!!data?.canCloseTicket)
      return data
    },
    getNextPageParam: lastPage => lastPage.next,
    refetchOnMount: 'always',
    staleTime: 60 * 5000,
    ...options
  })

  useEffect(() => {
    if (query?.isError) {
      const errorMessage = getErrorAPI(
        query.error,
        'No se puede obtener la conversación del ticket. Intente nuevamente o reporte a sistemas'
      )
      setCustomError(errorMessage)
      toast.error(errorMessage, {
        type: getNotificationTypeByErrorCode(query.error)
      })
      setCanCloseTicket(false)
    }
  }, [query.isError, query.error])

  return {
    ...query,
    error: customError || null
  }
}
