import { CardCloudMovementAdapter } from './card-cloud-movements-adapter'

import { fCurrency } from '@/shared/utils'

export const CardCloudCardByClientIdV2Adapter = card => ({
  id: card?.card_id,
  clientId: card?.client_id,
  maskedPan: card?.masked_pan
})

export const CardCloudTransferBetweenCardsV2Adapter = (transfer, source, destination) => ({
  source_card: source?.id,
  destination_card: destination?.id,
  amount: parseFloat(transfer?.amount?.trim()?.replace(/,/g, '') ?? '0'),
  concept: transfer?.concept,
  auth_code: transfer?.googleCode || ''
})

export const CardCloudTransactionBetweenCardsV2Adapter = transaction => {
  let balance = parseFloat(transaction?.new_balance) ?? 0
  balance = balance < 0 ? 0 : balance

  return {
    balance: {
      number: balance,
      format: fCurrency(balance)
    },
    movement: CardCloudMovementAdapter(transaction?.movement)
  }
}
