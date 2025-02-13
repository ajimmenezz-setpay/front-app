import { getCryptInfo } from '@/shared/utils'

export const ChangePasswordAdapter = data => {
  const password = {
    code: data?.authCode,
    currentPassword: data?.currentPassword,
    newPassword: data?.newPassword,
    confirmationPassword: data?.verifyNewPassword
  }
  return getCryptInfo(password)
}
