import { fCurrency, fDate, fFullDateTime, fTime, isEmpty } from '@/shared/utils'

export const SpeiCommissionsReportAdapter = movements =>
  movements?.map(movement => {
    const date = isEmpty(movement?.liquidationDate) ? null : movement?.liquidationDate
    return {
      id: movement?.id,
      reference: movement?.reference,
      trackingKey: movement?.trackingKey,
      type: {
        name: movement?.typeName?.toUpperCase(),
        color: movement?.typeName === 'Entrada' ? 'success' : 'error'
      },
      concept: movement?.concept,
      sourceAccount: {
        name: movement?.sourceName,
        number: movement?.sourceAccount,
        complete: `${movement?.sourceName}  ${movement?.sourceAccount}`
      },
      destinationAccount: {
        name: movement?.destinationName,
        number: movement?.destinationAccount,
        complete: `${movement?.destinationName}  ${movement?.destinationAccount}`
      },
      amount: {
        number: movement?.amount,
        color: Number(movement?.amount) < 0 ? 'error.main' : 'success.main',
        format: fCurrency(movement?.amount)
      },
      total: {
        number: movement?.totalCommission,
        format: fCurrency(movement?.totalCommission)
      },
      date: {
        original: date,
        date: date ? fDate(date) : '',
        time: date ? fTime(date) : '',
        dateTime: date ? fFullDateTime(date) : ''
      },
      commissions: {
        speiOut: {
          number: movement?.speiOut || 0,
          format: fCurrency(movement?.speiOut || 0)
        },
        internalTransfer: {
          number: movement?.internal || 0,
          format: fCurrency(movement?.internal || 0)
        },
        fee: {
          number: movement?.feeStp || 0,
          format: fCurrency(movement?.feeStp || 0)
        },
        speiIn: {
          number: movement?.speiIn || 0,
          format: fCurrency(movement?.speiIn || 0)
        }
      }
    }
  }) || []
