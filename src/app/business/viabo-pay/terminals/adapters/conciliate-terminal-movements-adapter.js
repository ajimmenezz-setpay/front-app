export const ConciliateTerminalMovementsAdapter = (terminal, terminalMovements, cardMovement) => {
  const terminalMovementsAdapter =
    terminalMovements?.map(terminalMovement => ({
      transactionId: terminalMovement?.id?.toString(),
      amount: terminalMovement?.amount?.toString()
    })) ?? []

  return {
    terminalId: terminal?.terminalId,
    speiCardTransactionId: cardMovement?.id?.toString(),
    speiCardTransactionAmount: cardMovement?.amount?.toString(),
    transactions: terminalMovementsAdapter
  }
}
