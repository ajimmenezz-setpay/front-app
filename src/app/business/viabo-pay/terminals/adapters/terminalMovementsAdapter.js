import { format } from 'date-fns'
import { es } from 'date-fns/locale'

import { fCurrency, normalizeDateString } from '@/shared/utils'

export const TerminalMovementsAdapter = data => {
  const movements =
    data?.movements?.map(movement => {
      const amount = parseFloat(movement?.amount || '0')
      const date = movement?.transaction_date
        ? format(normalizeDateString(movement?.transaction_date), 'dd MMM yyyy', { locale: es })
        : ''
      const time = movement?.transaction_date ? format(normalizeDateString(movement?.transaction_date), 'p') : ''

      return {
        id: movement?.id,
        terminalName: movement?.terminal_name,
        amount,
        amountFormat: fCurrency(amount),
        approved: movement?.approved,
        cardType: movement?.card_brand,
        cardNumber: movement?.card_number,
        cardBank: movement?.issuer,
        transactionDate: {
          fullDate: format(normalizeDateString(movement?.transaction_date), 'dd MMM yyyy HH:mm', { locale: es }),
          date,
          time
        },
        date: normalizeDateString(movement?.transaction_date),
        description: `${movement?.issuer === '' ? movement?.card_brand : movement?.issuer}-${
          movement?.card_number
        }`.toUpperCase(),
        transactionMessage: movement?.result_message,
        conciliated: !!movement?.conciliated,
        conciliatedName: movement?.conciliated ? 'Conciliada' : 'Sin Conciliar'
      }
    }) ?? []

  const balance = {
    amount: fCurrency(data?.balance?.amount),
    month: data?.balance?.month?.toLowerCase()
  }
  const filters = {
    status: {
      all: movements?.length || 0,
      approved: movements?.filter(movement => movement?.approved)?.length || 0,
      rejected: movements?.filter(movement => !movement?.approved)?.length || 0
    }
  }

  return {
    movements,
    balance,
    filters
  }
}
