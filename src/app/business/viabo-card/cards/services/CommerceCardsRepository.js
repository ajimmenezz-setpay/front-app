import {
  CommerceCardTypesAdapter,
  CommerceTransitBalanceAdapter,
  CreateFundingOrderResponseAdapter
} from '@/app/business/viabo-card/cards/adapters'
import { CardAdapter, CardMainAdapter, CardMovementsAdapter, CardsAdapter } from '@/app/shared/adapters'
import { axios } from '@/shared/interceptors'

export const getCommerceCardTypes = async () => {
  const { data } = await axios.get('/payment-processors/of/commerce')
  return CommerceCardTypesAdapter(data)
}

export const getEnabledCommerceCards = async cardTypeId => {
  const { data } = await axios.get(`/enabled-cards/commerce?paymentProcessorId=${cardTypeId}`)
  return CardsAdapter(data)
}

export const getCardInfo = async (cardId, signal) => {
  const { data } = await axios.get(`/card/information/${cardId}`, { signal })
  return CardAdapter(data)
}

export const changeStatusCard = async card => {
  const { data } = await axios.put(`/card/${card?.id}/block/${card?.cardON ? 'unblocked' : 'blocked'}`)
  return card
}

export const transactionsCard = async transactions => {
  const { data } = await axios.post('/card/transactions', transactions?.data)
  return transactions
}

export const getCardMovements = async (cardId, initialDate, finalDate, signal) => {
  const { data } = await axios.get('/card/movements', {
    timeout: 30000,
    signal,
    params: {
      cardId,
      startDate: initialDate,
      endDate: finalDate
    }
  })
  return CardMovementsAdapter(data)
}

export const getMainCardCommerce = async (cardTypeId, signal) => {
  const { data } = await axios.get(`/main-card/information?paymentProcessorId=${cardTypeId}`, { signal })
  return CardMainAdapter(data)
}

export const getTransitBalance = async cardTypeId => {
  const { data } = await axios.get(`/card-transactions/commerce?paymentProcessorId=${cardTypeId}`)
  return CommerceTransitBalanceAdapter(data)
}

export const sendMessageCards = async message => {
  const { data } = await axios.post('/cards/send/message', message)
  return data
}

export const sharedChargeKeys = async emails => {
  const { data } = await axios.post('/card/send/spei-key', emails)
  return data
}

export const createFundingOrder = async order => {
  const { data } = await axios.post('/funding-order/new', order)
  return CreateFundingOrderResponseAdapter(data)
}

export const sharedFundingOrder = async order => {
  const { data } = await axios.post('/funding-order/send', order)
  return data
}
