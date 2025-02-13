import { CardCloudDailyReportAdapter } from '../adapters'

import { API_SET_V2 } from '@/shared/interceptors'

export const getCardCloudDailyConsumeReport = async filters => {
  const { data } = await API_SET_V2.get('/reports/card-cloud/daily-consume', { params: filters })

  return CardCloudDailyReportAdapter(data)
}
