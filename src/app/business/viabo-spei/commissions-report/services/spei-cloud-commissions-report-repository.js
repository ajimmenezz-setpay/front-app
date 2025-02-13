import { SpeiCommissionsReportAdapter } from '../adapters'

import { axios } from '@/shared/interceptors'

export const getSpeiCloudCommissionsReport = async filters => {
  const { data } = await axios.get('/spei/transactions/stp-account-commissions', { params: filters })

  return SpeiCommissionsReportAdapter(data)
}
