import { getFundingOrderAdapter } from './funding-order-details-adapter'

import { getDecryptInfo } from '@/shared/utils'

export const FundingOrdersAdapter = orders => {
  const decryptedOrders = getDecryptInfo(orders?.ciphertext, orders?.iv)
  return decryptedOrders?.map(order => getFundingOrderAdapter(order))
}
