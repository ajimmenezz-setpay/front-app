import { convertCatalogToReactSelect } from '@/shared/utils'

export const CardCloudCardHoldersByCompanyAdapter = cardholders => {
  const usersAdapted =
    cardholders?.map(user => ({
      id: user?.id,
      name: user?.name
    })) || []

  return convertCatalogToReactSelect(usersAdapted, 'id', 'name')
}
