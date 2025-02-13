import { CardAdapterOfCardCloud } from '../../shared/adapters'
import { CardCloudUserCardsAdapter } from '../adapters'

import { API_SET_V2, axios } from '@/shared/interceptors'
import { fCurrency } from '@/shared/utils'

export const getUserCardsOfCardCloud = async () => {
  const { data } = await axios.get(`/cardCloud/user-cards`)

  return CardCloudUserCardsAdapter(data)
}

export const addCardToCardHolderOfCardCloud = async card => {
  const { data } = await API_SET_V2.post(`/cardCloud/card/activate`, card)

  return data
}

export const getPriceOfVirtualCard = async card => {
  const { data } = await API_SET_V2.get(`/cardCloud/card/virtual_card_price`, {
    params: {
      card_id: card?.id
    }
  })

  return {
    price: {
      number: parseFloat(data?.price, 10) || 0,
      format: fCurrency(data?.price || 0)
    }
  }
}

export const payVirtualCard = async card => {
  const { data } = await API_SET_V2.post(`/cardCloud/card/buy_virtual_card`, card)

  return CardAdapterOfCardCloud(data)
}
