import { convertCatalogToReactSelect } from '@/shared/utils'

export const SpeiConcentratorListAdapter = concentrators => {
  const concentratorsAdapted = concentrators?.map(concentrator => ({
    id: concentrator?.id,
    name: concentrator?.name
  }))
  return convertCatalogToReactSelect(concentratorsAdapted, 'id', 'name')
}
