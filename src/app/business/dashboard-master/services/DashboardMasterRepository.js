import { GlobalCardsAdapter, MasterMovementsAdapter } from '@/app/business/dashboard-master/adapters'
import { CardsAdapter } from '@/app/shared/adapters'
import { axios } from '@/shared/interceptors'

export const getGlobalCards = async () => {
  const { data } = await axios.get(`/main-cards/information`)
  return GlobalCardsAdapter(data)
}

export const getMasterMovements = async (initialDate, finalDate, signal) => {
  const { data } = await axios.get('/master-cards/movements', {
    params: {
      startDate: initialDate,
      endDate: finalDate
    }
  })
  return MasterMovementsAdapter(data)
}

export const getCommerceCardsByPaymentProcessors = async paymentProcessors => {
  const resultsByPaymentProcessorId = {}
  const requests = paymentProcessors.map(paymentProcessorId =>
    axios
      .get(`/enabled-cards/commerce?paymentProcessorId=${paymentProcessorId}`)
      .then(response => CardsAdapter(response.data))
      .then(cards => {
        // Almacena los resultados en el objeto resultsByPaymentProcessorId
        resultsByPaymentProcessorId[paymentProcessorId] = cards
      })
  )
  await Promise.all(requests)

  return resultsByPaymentProcessorId
}
