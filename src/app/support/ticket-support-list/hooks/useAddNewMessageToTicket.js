import { useMutation, useQueryClient } from '@tanstack/react-query'
import { chunk } from 'lodash'
import { toast } from 'react-toastify'

import { TICKETS_SUPPORT_LIST_KEYS } from '../adapters'
import { addMessageToSupportTicketConversation } from '../services'

import { getErrorAPI, getNotificationTypeByErrorCode } from '@/shared/interceptors'
import { isFunction } from '@/shared/utils'

export const useAddNewMessageToTicket = (options = {}) => {
  const client = useQueryClient()
  const setMessage = useMutation({
    mutationFn: addMessageToSupportTicketConversation,
    onMutate: async message => {
      const queryKey = [TICKETS_SUPPORT_LIST_KEYS.TICKET_CONVERSATION, message?.ticketId]
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await client.cancelQueries({ queryKey })

      // Snapshot the previous value
      const previousMessages = client.getQueryData(queryKey)

      // Optimistically update to the new value
      client.setQueryData(queryKey, old => {
        const newData = old.pages.flat().map(comments => ({
          ...comments,
          results: {
            participants: comments?.results?.participants || [],
            messages: [message?.optimistic, ...comments?.results?.messages]
          }
        }))
        const newPages = chunk(newData, 10)

        const newPagination = {
          pageParams: [undefined, ...newPages.slice(0, -1).map(page => page.at(-1).createdAt)],
          pages: newPages.flat()
        }

        return newPagination
      })

      // Return a context object with the snapshotted value
      return { previousMessages }
    },
    // eslint-disable-next-line n/handle-callback-err
    onError: (err, message, context) => {
      client.setQueryData([TICKETS_SUPPORT_LIST_KEYS.TICKET_CONVERSATION, message?.ticketId], context.previousMessages)
    },

    // eslint-disable-next-line n/handle-callback-err
    onSettled: (data, err, message, context) => {
      client.invalidateQueries({ queryKey: [TICKETS_SUPPORT_LIST_KEYS.TICKET_CONVERSATION, message?.ticketId] })
    },
    ...options
  })
  const mutate = async (formData, options) => {
    const { onSuccess, onError, ...mutationOptions } = options

    try {
      await toast.promise(setMessage.mutateAsync(formData, mutationOptions), {
        pending: 'Agregando Mensaje al Ticket...',
        success: {
          render({ data }) {
            isFunction(onSuccess) && onSuccess(data)
            return 'Se envió el mensaje con éxito'
          }
        }
      })
      client.invalidateQueries({ queryKey: [TICKETS_SUPPORT_LIST_KEYS.ASSIGNED_LIST] })
      client.invalidateQueries({ queryKey: [TICKETS_SUPPORT_LIST_KEYS.GENERATED_LIST] })
    } catch (error) {
      const errorFormatted = getErrorAPI(
        error,
        `No se puede realizar esta operación en este momento. Intente nuevamente o reporte a sistemas`
      )
      isFunction(onError) && onError(errorFormatted)
      toast.error(errorFormatted, {
        type: getNotificationTypeByErrorCode(error)
      })
    }
  }

  return {
    ...setMessage,
    mutate,
    isLoading: setMessage.isPending
  }
}
