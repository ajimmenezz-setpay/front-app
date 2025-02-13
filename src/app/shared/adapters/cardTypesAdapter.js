import { convertCatalogToReactSelect } from '@/shared/utils'

export const CardTypesAdapter = cardTypes => {
  const dataAdapted =
    cardTypes.map(cardType => ({
      id: cardType?.id,
      name: cardType?.name?.toUpperCase(),
      statusId: cardType?.active
    })) || []

  return convertCatalogToReactSelect(dataAdapted, 'id', 'name')
}
