import { CardAdapterOfCardCloud } from '../../shared/adapters'
import { StockCardsListAdapterOfCardCloud } from '../adapters'

import { axios } from '@/shared/interceptors'

export const getStockCardsOfCardCloud = async () => {
  const { data } = await axios.get('/cardCloud/cards-stock')
  return StockCardsListAdapterOfCardCloud(data)
}

export const assignCardsByCompanyOfCardCloud = async cards => {
  const { data } = await axios.put('/cardCloud/cards/assign', cards)
  return data
}

export const changeStatusStockCard = async card => {
  const { data } = await axios.put(`/cardCloud/card/${card?.id}/block/${card?.cardON ? 'unblock' : 'block'}`)
  const cardUpdated = CardAdapterOfCardCloud(data?.card)
  const cardAdapted = { request: card, response: cardUpdated }
  return cardAdapted
}
