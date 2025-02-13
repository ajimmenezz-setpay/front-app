export const ConciliateFundingOrderAdapter = (fundingOrder, movement) => ({
  fundingOrderId: fundingOrder?.id,
  conciliationNumber: movement?.id
})
