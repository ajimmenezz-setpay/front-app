import { ConciliateMovementsByOrderAdapter, FundingOrderAdapter, FundingOrdersAdapter } from '../adapters'

import { axios } from '@/shared/interceptors'

export const getFundingOrders = async () => {
  const { data } = await axios.get('/funding-orders')
  return FundingOrdersAdapter(data)
}

export const getFundingOrderDetails = async fundingOrder => {
  const { data } = await axios.get(`/funding-order/${fundingOrder?.id}`)
  return FundingOrderAdapter(data)
}

export const getMovementsByFundingOrder = async order => {
  const { data } = await axios.get(`/master-card/movements/unreconciled?fundingOrderId=${order?.id}`)
  return ConciliateMovementsByOrderAdapter(data)
}

export const conciliateFundingOrder = async conciliateOrder => {
  const { data } = await axios.put(`/funding-order/conciliation`, conciliateOrder)
  return data
}

export const cancelFundingOrder = async fundingOrder => {
  const { data } = await axios.put(`/funding-order/cancel/${fundingOrder?.id}`)
  return data
}
