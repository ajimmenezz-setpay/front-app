import { fCurrency, getDecryptInfo } from '@/shared/utils'

const PAYMENT_PROCESSORS = {
  'MASTER CARD': '1',
  MASTERCARD: '1',
  CARNET: '2'
}

export const GlobalCardsAdapter = cards => {
  const decryptedCards = getDecryptInfo(cards?.ciphertext, cards?.iv)
  let masterBalance = 0
  let masterTransit = 0
  const dataAdapted = decryptedCards?.map(card => {
    masterBalance += parseFloat(card?.balance)
    masterTransit += parseFloat(card?.inTransit)
    return {
      ...card,
      paymentProcessorId: PAYMENT_PROCESSORS[card?.paymentProcessor?.toUpperCase()] ?? null,
      id: card?.cardId,
      SPEI: card?.spei,
      balanceFormatted: fCurrency(card?.balance),
      inTransitFormatted: fCurrency(card?.inTransit),
      cardNumber: card?.cardNumber || '',
      cardON: !(card?.block === 'Blocked')
    }
  })

  return {
    master: {
      balance: masterBalance,
      inTransit: masterTransit,
      balanceFormatted: fCurrency(masterBalance),
      inTransitFormatted: fCurrency(masterTransit)
    },
    globals: dataAdapted
  }
}
