import { CommerceTerminalsAdapter, MovementsToConciliateTerminalAdapter, TerminalMovementsAdapter } from '../adapters'

import { axios } from '@/shared/interceptors'

export const getCommerceTerminals = async () => {
  const { data } = await axios.get('/commerces/terminals')
  return CommerceTerminalsAdapter(data)
}

export const createPaymentLink = async paymentLink => {
  const { data } = await axios.post(`/commerce/pay/new`, paymentLink)
  return data
}

export const generatePaymentByVirtualTerminal = async payment => {
  const { data } = await axios.post(`/commerce/virtual/pay`, payment)
  return data
}

export const getTerminalMovements = async (terminalId, initialDate, finalDate) => {
  const params = terminalId
    ? {
        fromDate: initialDate,
        toDate: finalDate,
        terminalId
      }
    : {
        fromDate: initialDate,
        toDate: finalDate
      }
  const { data } = await axios.get('/commerces-pay/transactions/all', { params })
  return TerminalMovementsAdapter(data)
}

export const getMovementsToConciliateTerminal = async (terminalId, date) => {
  const { data } = await axios.get('/card/movements/terminal/conciliated', {
    params: {
      startDate: date,
      terminalId
    }
  })
  return MovementsToConciliateTerminalAdapter(data)
}

export const conciliateTerminalMovements = async movements => {
  const { data } = await axios.post(`/commerce/terminal/consolidation/create`, movements)
  return data
}
