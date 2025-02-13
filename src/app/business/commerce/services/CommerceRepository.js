import { CommerceProcessAdapter } from '@/app/business/commerce/adapters'
import { axios } from '@/shared/interceptors'

export const createNewCommerce = async commerce => {
  const { data } = await axios.post('/security/legalRepresentative/new', commerce)
  return data
}

export const getCommerceToken = async commerceEmail => {
  const { data } = await axios.get(`/legal-representative/verificate`, {
    headers: {
      Username: `${commerceEmail}`
    }
  })
  return data
}

export const getCommerceProcess = async () => {
  const { data } = await axios.get(`/commerce/legal-representative`)
  return CommerceProcessAdapter(data)
}

export const updateCommerceProcess = async commerceInfo => {
  const { data } = await axios.put(`/commerce/update`, commerceInfo)
  return data
}

export const uploadDocuments = async documents => {
  const { data } = await axios.post(`/commerce/documents/create`, documents)
  return data
}

export const deleteDocuments = async documents => {
  const { data } = await axios.post(`/commerce/documents/delete`, documents)
  return data
}
