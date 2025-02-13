import { CardCloudCardsReportAdapter } from '../adapters'

import { API_SET_V2 } from '@/shared/interceptors'

export const getCardCloudCardsReport = async () => {
  const { data } = await API_SET_V2.get('/reports/card-cloud/card-status')

  return CardCloudCardsReportAdapter(data)
}
