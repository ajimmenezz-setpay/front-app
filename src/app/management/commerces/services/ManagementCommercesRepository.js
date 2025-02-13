import { CommerceAdapter, ManagementCommercesAdapter } from '@/app/management/commerces/adapters'
import { axios } from '@/shared/interceptors'

export const getCommerceList = async () => {
  const { data } = await axios.get('/commerces')
  return ManagementCommercesAdapter(data)
}

export const getCommerceDetails = async commerceId => {
  const { data } = await axios.get(`/commerce/${commerceId}`)
  return CommerceAdapter(data)
}

export const updateCommerceCommissions = async commissions => {
  const { data } = await axios.post('/commerce/commissions/register', commissions)
  return data
}

export const updateCommerceInformation = async commerce => {
  const { data } = await axios.post('/backoffice/commerce/update', commerce)
  return data
}

export const updateCommerceService = async service => {
  const { data } = await axios.put('/backoffice/commerce/service/update', service)
  return data
}
