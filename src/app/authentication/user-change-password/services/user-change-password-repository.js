import { axios } from '@/shared/interceptors'

export const changePassword = async password => {
  const { data } = await axios.put('/user/password/reset', password)
  return data
}
