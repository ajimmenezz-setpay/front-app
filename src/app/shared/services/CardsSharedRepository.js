import { CardTypesAdapter } from '@/app/shared/adapters'
import { axios } from '@/shared/interceptors'

export const getCardTypes = async () => {
  const { data } = await axios.get('/payment-processors')
  return CardTypesAdapter(data)
}
