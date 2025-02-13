import { jwtDecode } from 'jwt-decode'

import { fCardNumberHidden } from '@/shared/utils'

export const DemoCardValidationResponseAdapter = dataResponse => {
  const tokenResponse = dataResponse?.token
  const decoded = jwtDecode(tokenResponse)
  return {
    token: tokenResponse,
    id: decoded?.cardId,
    cardNumber: decoded?.cardNumber,
    cardNumberHidden: fCardNumberHidden(decoded?.cardNumber ?? '')
  }
}
