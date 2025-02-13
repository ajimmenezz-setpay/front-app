import { CardDetailsAdapter } from './cardAdapter'

import { convertCatalogToReactSelect, getDecryptInfo } from '@/shared/utils'

export const CardsAdapter = cards => {
  const decryptedCards = getDecryptInfo(cards?.ciphertext, cards?.iv)
  if (decryptedCards && Array.isArray(decryptedCards)) {
    const cardsAdapter = decryptedCards?.map(card => CardDetailsAdapter(card))
    cardsAdapter?.sort((a, b) => a?.assignUser?.fullName?.localeCompare(b?.assignUser?.fullName))
    return convertCatalogToReactSelect(cardsAdapter, 'id', 'cardUserNumber') || []
  }

  throw new Error('No se pueden obtener las tarjetas')
}
