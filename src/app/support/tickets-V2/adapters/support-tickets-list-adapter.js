import { isValid } from 'date-fns'

import { fCurrency, fDateTime, fFullDateTime, fTime, isValidUnixTimestamp } from '@/shared/utils'

export const SupportTicketMovementAdapter = movement => {
  const { timeZone } = Intl.DateTimeFormat().resolvedOptions()
  const dateProps = {
    timeZone
  }

  const amount = Number(movement?.amount) ?? 0
  const balance = Number(movement?.balance) ?? 0

  const date = isValidUnixTimestamp(Number(movement?.date)) ? Number(movement?.date) * 1000 : null

  return {
    id: movement?.movement_id,
    clientID: movement?.client_id,
    type: movement?.type,
    description: movement?.description,
    authCode: movement?.reference || movement?.authorization_code,
    amount: {
      number: amount,
      format: fCurrency(amount),
      color: amount < 0 ? 'error' : 'success.main'
    },
    balance: {
      number: balance,
      format: fCurrency(balance)
    },
    status: {
      name: movement?.status,
      color: movement?.status?.toUpperCase() === 'APPROVED' ? 'success.main' : 'error'
    },
    date: {
      original: date,
      dateTime: date ? fFullDateTime(date, dateProps) : '',
      time: date ? fTime(date, dateProps) : ''
    }
  }
}

export const SupportTicketAdapter = ticket => ({
  id: ticket.id,
  title: ticket.title || ticket?.name,
  description: ticket.description,
  status: {
    name: ticket?.status,
    color: ticket?.status_color
  },
  createdAt: {
    original: ticket.created_at,
    format: isValid(new Date(ticket.created_at)) ? fDateTime(ticket.created_at) : ''
  },
  updatedAt: {
    original: ticket.updated_at,
    format: isValid(new Date(ticket.updated_at)) ? fDateTime(ticket.updated_at) : ''
  },
  movement: SupportTicketMovementAdapter(ticket.movement)
})

export const SupportTicketsListAdapter = tickets => tickets.map(SupportTicketAdapter) || []
