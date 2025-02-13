import { isValid } from 'date-fns'

import { fCurrency, fDateTime, fFullDateTime, isValidUnixTimestamp } from '@/shared/utils'

export const CardCloudFundingReportMovementsAdapter = movements =>
  movements?.map((movement, index) => {
    const parseAmount = Number(movement?.amount || 0)

    const { timeZone } = Intl.DateTimeFormat().resolvedOptions()
    const dateProps = {
      timeZone
    }

    const date = isValidUnixTimestamp(Number(movement?.date)) ? Number(movement?.date) * 1000 : null

    return {
      id: index.toString(),
      amount: {
        format: fCurrency(parseAmount),
        number: parseAmount,
        color: parseAmount >= 0 ? 'success.main' : 'error.main'
      },
      company: movement?.company,
      date: {
        original: date,
        format: isValid(new Date(date)) ? fDateTime(date, dateProps) : ''
      },
      description: movement?.description,
      environment: movement?.enviroment,
      approvedBy: movement?.approved_by
    }
  }) || []

export const CardCloudFundingReportAdapter = report => {
  const { timeZone } = Intl.DateTimeFormat().resolvedOptions()
  const dateProps = {
    timeZone
  }

  const lastUpdate = isValidUnixTimestamp(Number(report?.last_update)) ? Number(report?.last_update) * 1000 : null
  return {
    lastUpdate: {
      original: lastUpdate,
      format: isValid(new Date(lastUpdate)) ? fFullDateTime(lastUpdate, dateProps) : ''
    },
    movements: CardCloudFundingReportMovementsAdapter(report?.data)
  }
}
