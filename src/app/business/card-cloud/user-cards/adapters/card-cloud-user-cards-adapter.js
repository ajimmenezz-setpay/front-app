import { CardAdapterOfCardCloud } from '../../shared/adapters'

import { convertCatalogToReactSelect } from '@/shared/utils'

export const CardCloudUserCardsAdapter = cardsResponse => {
  if (!Array.isArray(cardsResponse)) {
    throw new Error('No se puede obtener la información de las tarjetas')
  }
  const cardsAdapted = cardsResponse?.map(card => CardAdapterOfCardCloud(card)) || []

  return convertCatalogToReactSelect(cardsAdapted, 'id', 'number.hidden')
}
