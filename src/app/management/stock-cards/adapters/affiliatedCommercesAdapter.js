import { convertCatalogToReactSelect } from '@/shared/utils'

export const AffiliatedCommercesAdapter = commerces => {
  const dataAdapted =
    commerces?.map(commerce => ({
      id: commerce?.id,
      name: commerce?.name
    })) || []
  return convertCatalogToReactSelect(dataAdapted, 'id', 'name')
}
