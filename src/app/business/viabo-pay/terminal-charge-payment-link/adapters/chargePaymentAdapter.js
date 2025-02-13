import { format } from 'date-fns'

import { getCryptInfo } from '@/shared/utils'

export const ChargePaymentAdapter = (payment, details) => {
  const date = payment?.expiration ? format(new Date(payment?.expiration), 'MM/yyyy') : null

  const expirationYear = date ? date?.slice(-2) : ''
  const expirationMonth = date ? date?.slice(0, 2) : ''

  const expirationFormatted = date ? date?.slice(0, 3) + expirationYear : ''

  const paymentData = {
    payId: details?.id,
    cardHolder: payment?.name,
    phone: payment?.phone,
    cardNumber: payment?.cardNumber.replace(/\s+/g, ''),
    expirationDate: expirationFormatted,
    expMonth: expirationMonth,
    expYear: expirationYear,
    security: payment?.cvv,
    email: payment?.email
  }

  return getCryptInfo(paymentData)
}
