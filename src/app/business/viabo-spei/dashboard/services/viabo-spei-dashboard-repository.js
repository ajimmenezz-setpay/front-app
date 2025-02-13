import { axios } from '@/shared/interceptors'
import { generateResponseFile, MIME_TYPES } from '@/shared/utils'

export const getSpeiBillingReport = async report => {
  try {
    const response = await axios.get('/spei/transactions/statement-account-pdf', {
      params: report,
      responseType: 'blob'
    })

    await generateResponseFile(
      response,
      MIME_TYPES.pdf,
      `Estado de Cuenta Spei Cloud_${report?.account}_${report?.month}/${report?.year}_created_at_${new Date().toISOString()}.pdf`,
      false,
      false
    )

    return response.data
  } catch (e) {
    throw new Error(e)
  }
}
