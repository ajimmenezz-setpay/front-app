import { ViaboSpeiAccountsAdapter, ViaboSpeiMovementsAdapter, ViaboSpeiResumeBalance } from '../adapters'

import { API_SET_V2, axios } from '@/shared/interceptors'

export const getBalanceResumeViaboSpei = async filters => {
  const { data } = await axios.get('/spei/transaccions/balance', {
    params: filters
  })

  return ViaboSpeiResumeBalance(data)
}

export const createSpeiOut = async transactions => {
  const { data } = await axios.post('/spei/transaction/process-payments', transactions)
  if (data && Array.isArray(data)) {
    return data?.map(operation => ({
      account: operation?.destinationsAccount,
      url: operation?.url
    }))
  }

  throw new Error('Se realizo las transacciones pero no se obtuvo los comprobantes de las operaciones')
}

export const getMovementsViaboSpei = async filters => {
  const { data } = await axios.get('/spei/transaccions', {
    params: filters
  })

  return ViaboSpeiMovementsAdapter(data)
}

export const getAccountInfoViaboSpei = async () => {
  const { data } = await axios.get('/spei/accounts')

  return ViaboSpeiAccountsAdapter(data)
}

export const payConcentratorCommissions = async commissions => {
  const { data } = await API_SET_V2.post('/commission/pay', commissions)
  return data
}
