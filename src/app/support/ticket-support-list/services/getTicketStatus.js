export const TICKET_STATUS = [
  {
    id: '1',
    name: 'Nuevo',
    color: 'info'
  },
  {
    id: '2',
    name: 'Problema',
    color: 'warning'
  },
  {
    id: '3',
    name: 'Resuelto',
    color: 'success'
  }
]

export const getIdTicketStatusByName = nameStatus =>
  TICKET_STATUS.find(status => status.name.toLowerCase() === nameStatus?.toLowerCase())?.id

export const getColorTicketStatusById = id => TICKET_STATUS.find(status => status.id.toString() === id)?.color || 'info'
