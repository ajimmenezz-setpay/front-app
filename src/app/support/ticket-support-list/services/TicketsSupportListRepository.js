import { AssignedTicketsListAdapter, GeneratedTicketsListAdapter, TicketConversationAdapter } from '../adapters'

import { axios } from '@/shared/interceptors'

export const getGeneratedTicketsSupportList = async () => {
  const { data } = await axios.get('/tickets', {
    params: {
      created: true
    }
  })

  return GeneratedTicketsListAdapter(data)
}

export const getAssignedTicketsSupportList = async () => {
  const { data } = await axios.get('/tickets', {
    params: {
      assigned: true
    }
  })

  return AssignedTicketsListAdapter(data)
}

export const getSupportTicketConversation = async (ticketId, page) => {
  // const page = pageParam === 0 ? 1 : pageParam

  const { data } = await axios.get('/tickets/messages', {
    params: {
      ticket: ticketId,
      limit: 10,
      page
    }
  })

  return TicketConversationAdapter(data, page)
}

export const addMessageToSupportTicketConversation = async message => {
  const { data } = await axios.post('/tickets/message/new', message?.data)

  return message?.ticketId
}

export const finishSupportTicket = async ticket => {
  const { data } = await axios.put(`/tickets/ticket/${ticket?.ticketId}/close`)

  return data
}
