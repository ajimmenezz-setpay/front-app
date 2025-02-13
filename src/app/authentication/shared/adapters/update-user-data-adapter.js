import { getCryptInfo } from '@/shared/utils'

export const updateUserDataAdapter = user => {
  const userData = {
    name: user?.userName?.trim(),
    lastName: user?.userLastName?.trim(),
    email: user?.userEmail?.trim(),
    phone: user?.userPhone?.trim() || '',
    googleAuthenticatorCode: user?.googleCode
  }
  return getCryptInfo(userData)
}
