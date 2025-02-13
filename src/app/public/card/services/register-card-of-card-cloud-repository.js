import { axios } from '@/shared/interceptors'

export const validateCardOfCardCloud = async card => {
  const { data } = await axios.get(`/cardCloud/card-id`, {
    params: card
  })
  return data
}

export const assignCardOfCardCloud = async cardholder => {
  const { data } = await axios.post(`/cardCloud/card/assign-cardholder`, cardholder)
  return data
}
