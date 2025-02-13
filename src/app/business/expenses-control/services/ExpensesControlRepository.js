import { CardMovementsAdapter } from '@/app/shared/adapters'
import { axios } from '@/shared/interceptors'

export const getExpensesMovementsCommerceCards = async (startDate, endDate, signal) => {
  const filters = [
    { field: 'date', operator: '>=', value: startDate },
    { field: 'date', operator: '<=', value: endDate },
    { field: 'operationType', operator: '=', value: 'OTROS CARGOS' }
  ]

  const params = filters.reduce((acc, filter, index) => {
    Object.entries(filter).forEach(([key, value]) => {
      acc[`filters[${index}][${key}]`] = value
    })
    return acc
  }, {})

  const { data } = await axios.get('/cards/movements/commerce', {
    signal,
    params
  })
  return CardMovementsAdapter(data)
}
