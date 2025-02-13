export const SpeiNewThirdAccountAdapter = account => ({
  interbankCLABE: account?.clabe,
  beneficiary: account?.name?.trim(),
  rfc: account?.rfc?.trim() || '',
  alias: account?.alias?.trim() || '',
  bankId: account?.bank?.value,
  email: account?.email?.trim() || '',
  phone: account?.phone?.trim() || '',
  googleAuthenticatorCode: account?.googleCode.toString() || ''
})
