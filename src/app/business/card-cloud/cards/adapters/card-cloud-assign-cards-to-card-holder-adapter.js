import { METHODS_ASSIGN_CARDS_TO_USERS } from './card-cloud-cards-keys'

export const CardCloudAssignCardsToCardHolderAdapter = (assignedCards, company) => ({
  companyId: company?.id,
  subAccountId: company?.subAccountId,
  cards:
    assignedCards?.cards?.map(card => ({
      card_id: card?.value,
      pan: card?.number?.complete
    })) || [],
  isNewUser: assignedCards?.method === METHODS_ASSIGN_CARDS_TO_USERS.NEW_CARD_USER,
  user: assignedCards?.cardUser?.value,
  newUser: {
    name: assignedCards?.userName?.trim(),
    lastname: assignedCards?.userLastName?.trim(),
    phone: assignedCards?.userPhone?.trim(),
    email: assignedCards?.userEmail?.trim()
  }
})
