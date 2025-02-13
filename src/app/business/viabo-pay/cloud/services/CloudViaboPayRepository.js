import { ViaboPayLiquidatedMovementsAdapter } from '../adapters'

import { axios } from '@/shared/interceptors'

export const getViaboPayLiquidatedMovements = async (startDate, endDate, signal) => {
  const { data } = await axios.get('/terminals/shared/transactions', {
    signal,
    params: {
      startDate,
      endDate
    }
  })
  return ViaboPayLiquidatedMovementsAdapter(data)
}

export const liquidateTerminalMovement = async movement => {
  const { data } = await axios.post('/card/transactions/shared-terminals', movement)
  return data
}
