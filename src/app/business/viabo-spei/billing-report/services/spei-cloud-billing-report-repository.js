import { SpeiBillingReportAdapter } from '../adapters'

import { axios } from '@/shared/interceptors'

export const getSpeiCloudBillingReport = async filters => {
  const { data } = await axios.get('/spei/transactions/statement-account', { params: filters })

  return SpeiBillingReportAdapter(data)
}
