export const NewTicketSupportAdapter = ticket => {
  const formData = new FormData()

  const ticketAdapted = {
    supportReasonId: ticket?.cause?.id,
    description: ticket?.description
  }

  Object.entries(ticketAdapted)?.forEach(([key, value]) => {
    formData.append(key, value)
  })

  if (ticket?.file) {
    formData.append('files', ticket?.file)
  }

  return formData
}
