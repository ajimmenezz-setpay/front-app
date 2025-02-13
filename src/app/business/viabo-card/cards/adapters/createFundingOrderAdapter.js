import { getDecryptInfo } from '@/shared/utils'

export const CreateFundingOrderAdapter = (values, card) => {
  const speiInProcessorTypes = values?.processorTypes?.find(type => type === '1')
  const payCashInProcessorTypes = values?.processorTypes?.find(type => type === '2')

  return {
    cardId: card?.id,
    amount: values?.amount.toString(),
    spei: speiInProcessorTypes ? card?.SPEI : '',
    payCash: payCashInProcessorTypes ? '1' : ''
  }
}

export const CreateFundingOrderResponseAdapter = response => {
  const decryptedResponse = getDecryptInfo(response?.ciphertext, response?.iv)

  if (decryptedResponse) {
    return {
      id: decryptedResponse?.id,
      reference: decryptedResponse?.referenceNumber
    }
  } else {
    throw new Error('Algo fallo al obtener la información')
  }
}
