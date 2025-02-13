import { useIsFetching } from '@tanstack/react-query'

import { CARD_CLOUD_SHARED_KEYS } from '../adapters'

export const useQueryStateCardCloudShared = () => {
  const isFetchingCardsCompanyBySubAccount = subAccountId =>
    !!useIsFetching({
      queryKey: [CARD_CLOUD_SHARED_KEYS.CARDS, subAccountId]
    })

  return { isFetchingCardsCompanyBySubAccount }
}
