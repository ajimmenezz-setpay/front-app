export const TicketCausesByProfileAdapter = causes =>
  causes?.map(cause => ({
    id: cause?.id,
    cause: cause?.name,
    color: cause?.color?.trim() === '' ? null : cause?.color?.trim()
  })) || []
