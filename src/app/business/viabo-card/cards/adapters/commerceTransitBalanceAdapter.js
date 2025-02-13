import { fCurrency } from '@/shared/utils'

export const CommerceTransitBalanceAdapter = transit => {
  const balance = parseFloat(transit === '' ? '0' : transit.replace(/,/g, ''))
  return {
    inTransit: balance,
    inTransitFormatted: fCurrency(balance)
  }
}
