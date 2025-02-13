const ERROR_CODES = {
  400: 'warning',
  401: 'warning',
  403: 'warning',
  406: 'error',
  500: 'error',
  404: 'error',
  200: 'success'
}

const getNotificationTypeByErrorCode = error => ERROR_CODES[error?.response?.status] ?? 'error'

export { ERROR_CODES, getNotificationTypeByErrorCode }
