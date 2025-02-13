import { PublicPaymentAdapter } from './public-payment-adapter'

import { getDecryptInfo } from '@/shared/utils'

export const PaymentByCashAdapter = (payment, commerce) => {
  const publicPayment = PublicPaymentAdapter(payment)
  const dataAdapted = {
    commerceId: commerce?.id,
    ...publicPayment,
    email: [publicPayment?.email]
  }

  return dataAdapted
}

export const PaymentByCashAdapterResponseAdapter = response => {
  const decryptedResponse = getDecryptInfo(response?.ciphertext, response?.iv)

  if (decryptedResponse) {
    return {
      download: decryptedResponse?.instructionsUrls?.download,
      pay: decryptedResponse?.instructionsUrls?.format,
      id: decryptedResponse?.id,
      reference: decryptedResponse?.referenceNumber
    }
  } else {
    throw new Error('Algo fallo al obtener la información')
  }
}
