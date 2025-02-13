import { isValid } from 'date-fns'

import { fCurrency, fDate, fDateTime, fFullDateTime, isValidUnixTimestamp } from '@/shared/utils'

const CardCloudDailyReportMovementsAdapter = movements =>
  movements?.map((movement, index) => {
    const parseAmount = Number(movement?.amount || 0)
    return {
      id: index.toString(),
      amount: {
        format: fCurrency(parseAmount),
        number: parseAmount,
        color: parseAmount >= 0 ? 'success.main' : 'error.main'
      },
      authCode: movement?.authorization_code,
      company: movement?.company,
      card: {
        clientId: movement?.client_id,
        maskedPan: movement?.masked_pan
      },
      date: {
        original: movement?.date,
        format: isValid(new Date(movement?.date)) ? fDateTime(movement?.date) : ''
      },
      description: movement?.description,
      environment: movement?.enviroment,
      type: movement?.type
    }
  }) || []

export const CardCloudDailyReportAdapter = report => {
  const { timeZone } = Intl.DateTimeFormat().resolvedOptions()
  const dateProps = {
    timeZone
  }

  const parseBalance = Number(report?.total_amount || 0)
  const lastUpdate = isValidUnixTimestamp(Number(report?.last_update)) ? Number(report?.last_update) * 1000 : null
  return {
    balance: {
      number: parseBalance,
      format: fCurrency(parseBalance)
    },
    date: {
      original: report?.request_date,
      format: isValid(new Date(report?.request_date)) ? fDate(report?.request_date) : ''
    },
    lastUpdate: {
      original: lastUpdate,
      format: isValid(new Date(lastUpdate)) ? fFullDateTime(lastUpdate, dateProps) : ''
    },
    movements: CardCloudDailyReportMovementsAdapter(report?.movements)
  }
}
