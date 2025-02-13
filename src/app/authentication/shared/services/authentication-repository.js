import { UserModulesAdapter } from '../adapters'

import { axios } from '@/shared/interceptors'

export const signIn = async user => {
  const { data } = await axios.post('/login', user)
  return data
}

export const logout = async () => {
  const { data } = await axios.post('/logout')
  return data
}

export const getUserModules = async token => {
  const { data } = await axios.get('/modules/user')
  return UserModulesAdapter(data)
}

export const updateUserData = async user => {
  const { data } = await axios.put('/user/update-data', user)
  return data
}
