import { CardCloudFundingReportAdapter } from '../adapters'

import { API_SET_V2 } from '@/shared/interceptors'

export const getCardCloudFundingReport = async filters => {
  const { data } = await API_SET_V2.get('/reports/card-cloud/fundings', { params: filters })

  return CardCloudFundingReportAdapter(data)
}
