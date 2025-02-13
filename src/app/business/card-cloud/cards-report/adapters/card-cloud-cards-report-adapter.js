import { fCurrency, fFullDateTime, isValidUnixTimestamp } from '@/shared/utils'

export const CardCloudCardsReportAdapter = cards =>
  cards?.map((card, index) => {
    const parseBalance = Number(card.balance?.replaceAll(',', '') || '0')

    const { timeZone } = Intl.DateTimeFormat().resolvedOptions()
    const dateProps = {
      timeZone
    }

    const activationDate = isValidUnixTimestamp(Number(card?.active_date)) ? Number(card?.active_date) * 1000 : null

    return {
      id: index?.toString(),
      environment: card.enviroment,
      balance: {
        number: parseBalance,
        format: fCurrency(parseBalance),
        get color() {
          if (this.number === 0) {
            return 'text.primary'
          }
          if (this.number < 0) {
            return 'error.main'
          }

          return 'success.main'
        }
      },
      status: {
        name: card.status,
        get color() {
          if (card.status.toUpperCase() === 'NORMAL') {
            return 'success'
          }
          if (card.status.toUpperCase() === 'CANCELED') {
            return 'error'
          }
          return 'warning'
        },
        isActive: card.status.toUpperCase() === 'NORMAL',
        isCancelled: card.status.toUpperCase() === 'CANCELED'
      },
      activationDate: {
        original: activationDate,
        format: activationDate ? fFullDateTime(activationDate, dateProps) : ''
      },
      company: card.company,
      type: card.type?.toUpperCase(),
      clientId: card.client_id,
      maskedPan: card.masked_pan
    }
  }) || []
