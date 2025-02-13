import { SupportTicketAdapter, SupportTicketsListAdapter } from '../adapters'

import { API_SET_V2 } from '@/shared/interceptors'

export const getSupportTicketsList = async () => {
  const { data } = await API_SET_V2.get('/ticket')

  return SupportTicketsListAdapter(data)
}

export const generateNewTicketSupportV2 = async ticket => {
  const { data } = await API_SET_V2.post('/ticket', ticket)

  return SupportTicketAdapter(data)
}

export const getTicketSupportDetailsV2 = async ticketId => {
  const { data } = await API_SET_V2.get(`/ticket/${ticketId}`)

  return SupportTicketAdapter(data)
}
