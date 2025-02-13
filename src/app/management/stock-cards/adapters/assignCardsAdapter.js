export const AssignCardsAdapter = cards => {
  const commerceId = cards?.commerce?.value || ''
  if (cards?.cardId) {
    return {
      cardId: cards?.cardId,
      commerceId
    }
  }

  return {
    amount: cards?.numberOfCards.toString(),
    paymentProcessorId: cards?.cardType?.value || '',
    commerceId
  }
}
