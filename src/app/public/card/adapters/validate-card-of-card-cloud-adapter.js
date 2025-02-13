import { format } from 'date-fns'

import { getCryptInfo } from '@/shared/utils'

export const ValidateCardOfCardCloudAdapter = data => {
  const date = data?.expiration ? format(new Date(data?.expiration), 'MM/yyyy') : null

  const expirationYear = date ? date?.slice(-2) : ''
  const expirationMonth = date ? date?.slice(0, 2) : ''

  const cardData = {
    number: data?.cardNumber?.trim()?.replace(' ', ''),
    nip: data?.nip,
    date: `${expirationMonth}${expirationYear}`
  }

  return getCryptInfo(cardData)
}
