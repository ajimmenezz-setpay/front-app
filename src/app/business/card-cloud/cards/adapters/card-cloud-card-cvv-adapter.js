import { fDateTime, fToNow, getDecryptInfo, isObject, isValidUnixTimestamp } from '@/shared/utils'

export const CardCloudCardCVVAdapter = data => {
  const decryptedResponse = getDecryptInfo(data?.ciphertext, data?.iv)

  if (!isObject(decryptedResponse)) {
    throw new Error('No se puede obtener el cvv dinámico')
  }

  const { timeZone } = Intl.DateTimeFormat().resolvedOptions()
  const dateProps = {
    timeZone
  }

  const date = isValidUnixTimestamp(Number(decryptedResponse?.expiration_date))
    ? Number(decryptedResponse?.expiration_date) * 1000
    : null

  return {
    cvv: decryptedResponse?.cvv,
    expiration: {
      original: date,
      toNow: date ? fToNow(date, dateProps) : '',
      date: date ? fDateTime(date, dateProps) : ''
    }
  }
}
