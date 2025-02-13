import { format } from 'date-fns'

export const CardCloudAddCardToCardHolderAdapter = data => {
  const date = data?.expiration ? format(new Date(data?.expiration), 'MM/yyyy') : null

  const expirationYear = date ? date?.slice(-2) : ''
  const expirationMonth = date ? date?.slice(0, 2) : ''

  return {
    card: data?.cardNumber?.trim()?.replace(' ', ''),
    pin: data?.nip,
    expiration_date: `${expirationMonth}${expirationYear}`
  }
}
