import { fCardNumber, fCardNumberHidden, getDecryptSerialize, isObject } from '@/shared/utils'

export const CardCloudCardSecurity = card => {
  const cardDecode = atob(card)

  const cardDecodeJSON = JSON.parse(cardDecode)

  const decryptedResponse = getDecryptSerialize(cardDecodeJSON?.value, cardDecodeJSON?.iv)

  if (!isObject(decryptedResponse)) {
    throw new Error('No se puede obtener la información de la tarjeta')
  }

  const dateStr = decryptedResponse?.expiration_date || ''

  const date = new Date(dateStr + 'T00:00:00Z')

  const monthOptions = { month: '2-digit', timeZone: 'UTC' }
  const yearOptions = { year: '2-digit', timeZone: 'UTC' }

  const formatMonth = new Intl.DateTimeFormat('en', monthOptions)
  const formatYear = new Intl.DateTimeFormat('en', yearOptions)

  const month = formatMonth.format(date)
  const year = formatYear.format(date)

  return {
    number: {
      full: decryptedResponse?.pan,
      format: fCardNumber(decryptedResponse?.pan),
      hidden: fCardNumberHidden(decryptedResponse?.pan)
    },
    expiration: {
      date: decryptedResponse?.expiration_date,
      format: decryptedResponse?.expiration_date ? month + '/' + year : 'XX/XX'
    },
    nip: decryptedResponse?.pin
  }
}
