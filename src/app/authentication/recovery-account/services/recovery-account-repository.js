import { axios } from '@/shared/interceptors'

export const validateUserEmail = async user => {
  const { data } = await axios.get(`/legal-representative/verificate`, {
    params: {
      username: `${user?.email}`
    }
  })
  return data
}

export const resetUserPassword = async user => {
  const { data } = await axios.get(`/user/password/reset/${user?.userId}`)
  return data
}
