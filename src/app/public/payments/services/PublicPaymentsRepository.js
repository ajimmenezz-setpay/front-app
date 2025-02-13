import { PaymentByCashAdapterResponseAdapter } from '../adapters'

import { CommerceAdapter } from '@/app/management/commerces/adapters'
import { axios } from '@/shared/interceptors'

export const getCommerceInfoBySlug = async slug => {
  const { data } = await axios.get(`/commerce-slug/${slug}`)

  return CommerceAdapter(data, true)
}

export const payWithCashMethod = async payment => {
  const { data } = await axios.post(`/slug/funding-order/new`, payment)

  return PaymentByCashAdapterResponseAdapter(data)
}

export const payWithTerminalMethod = async payment => {
  const { data } = await axios.post(`/commerce-slug/terminal/transaction`, payment)
  return data
}
