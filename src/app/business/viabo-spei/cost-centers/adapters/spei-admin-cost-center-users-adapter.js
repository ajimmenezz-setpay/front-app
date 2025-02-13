import { convertCatalogToReactSelect } from '@/shared/utils'

export const SpeiAdminCostCenterUsersAdapter = users => {
  const usersAdapted = users?.map(user => ({
    id: user?.id,
    name: user?.name
  }))

  return convertCatalogToReactSelect(usersAdapted, 'id', 'name')
}
