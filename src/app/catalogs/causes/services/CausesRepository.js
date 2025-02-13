import { CausesListAdapter } from '../adapters'

import { axios } from '@/shared/interceptors'

export const newCause = async cause => {
  const { data } = await axios.post('/support-reason/new', cause)

  return data
}

export const getCausesList = async () => {
  const { data } = await axios.get('/tickets/support-reasons')

  return CausesListAdapter(data)
}

export const changeStatusCause = async cause => {
  const { data } = await axios.put(
    `/tickets/support-reasons/${cause?.id}/${cause?.changeStatus ? 'disable' : 'enable'}`
  )
  return cause
}

export const updateCause = async cause => {
  const { data } = await axios.put('/support-reason/update', cause)

  return data
}
