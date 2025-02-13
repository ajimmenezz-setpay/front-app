import { GoogleAuthQRCodeAdapter } from '@/app/authentication/2FA/adapters'
import { axios } from '@/shared/interceptors'

export const getGoogleAuthQRCode = async () => {
  const { data } = await axios.get('/security/google-authenticator/qr')
  return GoogleAuthQRCodeAdapter(data)
}

export const enableTwoAuth = async twoAuth => {
  const { data } = await axios.post('/security/google-authenticator/enable', twoAuth)
  return data
}

export const validateGoogleAuthCode = async code => {
  const { data } = await axios.post('/security/google-authenticator/validate', code, {
    headers: { Authorization: `Bearer ${code?.token}` }
  })
  return data
}
