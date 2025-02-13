const PAYMENT_TERMINAL_STATUS = [
  {
    id: '6',
    color: 'warning'
  },
  {
    id: '7',
    color: 'success'
  },
  {
    id: '8',
    color: 'error'
  }
]

export const getColorStatusPaymentLinkById = id =>
  PAYMENT_TERMINAL_STATUS.find(status => status?.id === id)?.color ?? 'info'
