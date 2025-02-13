import { DemoCardValidationResponseAdapter } from '@/app/business/viabo-card/register-cards/adapters'
import { axios } from '@/shared/interceptors'

export const createNewDemoUser = async user => {
  const { data } = await axios.post('/security/commerce-demo/user/new', user)
  return data
}

export const validateDemoCard = async card => {
  const { data } = await axios.get(`/card-demo/information/${card?.cardNumber}`)
  return DemoCardValidationResponseAdapter(data)
}

export const assignCardToDemoUser = async card => {
  const { data } = await axios.put('/assign/commerce-demo-card/to/user', card)
  return data
}
