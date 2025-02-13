import { getCryptInfo } from '@/shared/utils'

export const SharedChargeKeysCardsAdapter = (card, values) => {
  const shared = {
    spei: card?.SPEI,
    paynet: card?.PAYNET,
    emails: values?.emails
  }
  return getCryptInfo(shared)
}
