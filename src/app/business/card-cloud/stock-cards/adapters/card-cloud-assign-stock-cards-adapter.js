export const CardCloudAssignStockCardsAdapter = data => ({
  subaccount_id: data?.company?.subAccountId,
  card_type: data?.type?.value,
  quantity: data?.amount
})
