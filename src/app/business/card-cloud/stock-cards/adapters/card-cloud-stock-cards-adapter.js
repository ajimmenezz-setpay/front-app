import { CardAdapterOfCardCloud } from '../../shared/adapters'

import { convertCatalogToReactSelect } from '@/shared/utils'

export const StockCardsListAdapterOfCardCloud = cardsResponse => {
  if (!Array.isArray(cardsResponse?.cards)) {
    throw new Error('No se puede obtener la lista de tarjetas')
  }
  const cardsAdapted = cardsResponse?.cards?.map(card => CardAdapterOfCardCloud(card)) || []

  return {
    data: convertCatalogToReactSelect(cardsAdapted, 'id', 'number.hidden'),
    total: cardsResponse?.total_records
  }
}
