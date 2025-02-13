import { CardAdapterOfCardCloud, CardCloudMovementsAdapter } from '../../shared/adapters'
import { CardCloudCardCVVAdapter, CardCloudCardSecurity } from '../adapters'

import { API_SET_V2, axios } from '@/shared/interceptors'

export const getCardInfo = async cardId => {
  const { data } = await axios.get(`/cardCloud/card/${cardId}/details`)

  return CardAdapterOfCardCloud(data)
}

export const getCardMovements = async (cardId, filters) => {
  const { data } = await axios.get(`/cardCloud/card/${cardId}/movements`, {
    params: filters
  })

  return CardCloudMovementsAdapter(data?.movements)
}

export const changeStatusCard = async card => {
  const { data } = await axios.put(`/cardCloud/card/${card?.id}/block/${card?.cardON ? 'unblock' : 'block'}`)
  const cardUpdated = CardAdapterOfCardCloud(data?.card)
  const cardAdapted = { request: card, response: cardUpdated }
  return cardAdapted
}

export const getCardSecurityDetails = async cardId => {
  const { data } = await axios.get(`/cardCloud/card/${cardId}/sensitive`)

  return CardCloudCardSecurity(data?.sensitive_data)
}

export const getCardDynamicCVV = async cardId => {
  const { data } = await axios.get(`/cardCloud/card/${cardId}/cvv`)

  return CardCloudCardCVVAdapter(data)
}

export const assignCardsToCardHolder = async cards => {
  const { data } = await axios.put(`/cardCloud/cards/assign-user`, cards)
  return cards
}

export const assignCardsToCardHolderWithFile = async cards => {
  const { data } = await axios.postForm(`/cardCloud/cards/assign-user-from-file`, cards)
  return {
    request: cards,
    response: data
  }
}

export const changeCardNIP = async card => {
  const { data } = await API_SET_V2.post(`/cardCloud/card/${card?.id}/nip`, card)
  return data
}
