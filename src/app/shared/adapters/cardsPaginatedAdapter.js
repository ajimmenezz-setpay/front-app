
import { CardDetailsAdapter } from './cardAdapter'

import { convertCatalogToReactSelect, getDecryptInfo } from '@/shared/utils'

export const CardsPaginatedAdapter = cards => {
  const decryptedCards = getDecryptInfo(cards?.ciphertext, cards?.iv)
  if (decryptedCards && Array.isArray(decryptedCards)) {
    const cardsAdapter = decryptedCards?.map(card => CardDetailsAdapter(card))
    const data = convertCatalogToReactSelect(cardsAdapter, 'id', 'cardUserNumber') || []
    return {
      data,
      meta: {
        total: data?.length ?? 0
      }
    }
  }

  throw new Error('No se pueden obtener las tarjetas')
}
