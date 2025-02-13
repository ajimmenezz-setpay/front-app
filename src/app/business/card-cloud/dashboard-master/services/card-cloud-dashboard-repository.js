import { CardCloudMovementsAdapter } from '../../shared/adapters'

import { axios } from '@/shared/interceptors'

export const getCardCloudSubAccountMovements = async (filters, subAccountId) => {
  const { data } = await axios.get(`commerce/${subAccountId}/sub-account/movements`, {
    params: filters
  })

  const movements = data?.movements
  if (!Array.isArray(movements)) {
    throw new Error('No se encontraron movimientos de la subcuenta')
  }

  return CardCloudMovementsAdapter(movements)
}
