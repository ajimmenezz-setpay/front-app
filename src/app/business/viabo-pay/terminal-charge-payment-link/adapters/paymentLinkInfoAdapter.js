import { fCurrency, getDecryptInfo } from '@/shared/utils'

export const PaymentLinkInfoAdapter = paymentLinkInfo => {
  const paymentLinkDecrypted = getDecryptInfo(paymentLinkInfo?.ciphertext, paymentLinkInfo?.iv)

  if (paymentLinkDecrypted) {
    return {
      id: paymentLinkDecrypted?.id,
      name: paymentLinkDecrypted?.clientName,
      amount: fCurrency(paymentLinkDecrypted?.amount),
      description: paymentLinkDecrypted?.description,
      email: paymentLinkDecrypted?.email,
      phone: paymentLinkDecrypted?.phone,
      status: {
        id: paymentLinkDecrypted?.statusId,
        name: paymentLinkDecrypted?.statusName
      },
      reference: paymentLinkDecrypted?.reference,
      terminalId: paymentLinkDecrypted?.terminalId,
      transaction: {
        reference: paymentLinkDecrypted?.apiReferenceNumber !== '' ? paymentLinkDecrypted?.apiReferenceNumber : '-',
        authCode: paymentLinkDecrypted?.apiAuthCode !== '' ? paymentLinkDecrypted?.apiAuthCode : '-'
      }
    }
  } else {
    throw new Error('Algo fallo al obtenerla información de la liga de pago')
  }
}
