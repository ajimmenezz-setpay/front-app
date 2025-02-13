import { getCryptInfo } from '@/shared/utils'

export const SendMessageCardsAdapter = (cards, values) => {
  const message = {
    subject: values?.subject,
    message: values?.message,
    emails: cards?.map(card => card?.assignUser?.email) || []
  }
  return getCryptInfo(message)
}
