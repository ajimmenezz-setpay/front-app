import { getDecryptInfo } from '@/shared/utils'

export const CommerceCardTypesAdapter = cardTypes => {
  const decryptedCardTypes = getDecryptInfo(cardTypes?.ciphertext, cardTypes?.iv)
  const dataAdapted =
    decryptedCardTypes?.map(cardType => ({
      id: cardType?.id,
      name: cardType?.name?.toUpperCase()
    })) || []

  return dataAdapted
}
