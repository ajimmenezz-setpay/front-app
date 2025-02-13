import { axios } from '@/shared/interceptors'

export const sendValidationCode = async () => {
  const { data } = await axios.post('/code/verification/resend')
  return data
}

export const validateCode = async validationCode => {
  const { data } = await axios.post('/code/verificate', validationCode)
  return data
}
