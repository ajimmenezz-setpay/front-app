import { getCryptInfo } from '@/shared/utils'

export const CardTransactionsAdapter = (originCardId, transactions, concept, isGlobal) => {
  let adaptedData
  if (isGlobal) {
    adaptedData = {
      originCardId,
      destinationCards: [
        {
          cardId: transactions?.card?.value.toString(),
          concept: concept?.toString() || '',
          amount: parseFloat(
            transactions?.amount.toString() === '' ? '0' : transactions?.amount?.toString().replace(/,/g, '')
          ).toString()
        }
      ]
    }
  } else {
    adaptedData = {
      originCardId,
      destinationCards: transactions?.map(transaction => ({
        cardId: transaction?.card?.value?.toString(),
        concept: concept?.toString() || '',
        amount: parseFloat(
          transaction?.amount.toString() === '' ? '0' : transaction?.amount?.toString().replace(/,/g, '')
        ).toString()
      }))
    }
  }

  return {
    cardId: adaptedData?.originCardId,
    data: getCryptInfo(adaptedData)
  }
}
