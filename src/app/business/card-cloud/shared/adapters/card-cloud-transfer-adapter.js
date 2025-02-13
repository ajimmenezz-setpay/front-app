export const CARD_CLOUD_TRANSFER_TYPES = {
  SUBACCOUNT: 'subaccount',
  CARD: 'card'
}

export const CardCloudTransferAdapter = transfer => ({
  sourceType: transfer?.originType,
  source: transfer?.origin,
  destinationType: transfer?.destinationType,
  destination: transfer?.destination,
  amount: parseFloat(transfer?.amount ?? '0'),
  description: transfer?.concept || ''
})
