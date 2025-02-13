import { ManagementUsersCardCloudAdapter, ManagementUsersSpeiCloudAdapter } from '../adapters'

import { axios } from '@/shared/interceptors'

export const getSpeiCloudUsers = async () => {
  const { data } = await axios.get('/security/users-by-admin-stp')
  return ManagementUsersSpeiCloudAdapter(data)
}

export const getCardCloudUsers = async filters => {
  const { data } = await axios.get('/company/card-holders', { params: filters })
  return ManagementUsersCardCloudAdapter(data)
}

export const changeStatusOfUser = async user => {
  const { data } = await axios.put('/user/update-active', {
    userId: user?.id,
    active: user?.active
  })
  return {
    request: user,
    response: data
  }
}

export const updateUserInfo = async user => {
  const { data } = await axios.put('/user/admin/update-data', user)
  return data
}
