import { CardsPaginatedAdapter } from '@/app/shared/adapters'
import { axios } from '@/shared/interceptors'

export const getCommerceCards = async (filters, signal) => {
  const { columnFilters, globalFilter, pageIndex, pageSize, sorting } = filters

  const { data } = await axios.get('/cards/commerce', {
    signal,
    params: {
      start: `${pageIndex * pageSize}`,
      size: pageSize,
      filters: JSON.stringify(columnFilters ?? []),
      globalFilter: globalFilter ?? '',
      sorting: JSON.stringify(sorting ?? [])
    }
  })
  return CardsPaginatedAdapter(data)
}

export const updateUserInfo = async userInfo => {
  const { data } = await axios.put('/card-owner/data/update', userInfo)
  return data
}

export const recoveryPasswordAssignedUser = async user => {
  const { data } = await axios.put(`/card-owner/password/reset/${user.id}`)
  return data
}
