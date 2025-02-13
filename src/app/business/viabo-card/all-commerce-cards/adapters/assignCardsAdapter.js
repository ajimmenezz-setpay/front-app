import { getCryptInfo } from '@/shared/utils'

export const AssignCardsAdapter = (formValues, cards, isEmptyCVV) => {
  const { phone, email, name } = formValues
  const data = {
    name,
    phone,
    email,
    cards: isEmptyCVV
      ? [{ id: cards[0]?.id, cvv: formValues?.cvv }]
      : cards?.map(card => ({
          id: card?.id,
          cvv: card?.cvv
        })) || []
  }
  return getCryptInfo(data)
}
