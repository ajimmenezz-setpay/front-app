import { getCryptInfo } from '@/shared/utils'

export const CreateCardAdapter = card => {
  const { cardNumber, cardType, expiration, cvv, assigned } = card

  const expirationYear = expiration?.slice(-2)

  const expirationFormatted = expiration?.slice(0, 3) + expirationYear

  const cardAdapter = {
    cardNumber: cardNumber.replace(/\s+/g, ''),
    paymentProcessorId: cardType?.value,
    expirationDate: expirationFormatted,
    cvv,
    commerceId: assigned?.value || ''
  }
  return getCryptInfo(cardAdapter)
}
