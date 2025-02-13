import { format } from 'date-fns'
import { es } from 'date-fns/locale'

import { fCurrency, normalizeDateString } from '@/shared/utils'

export const ViaboPayLiquidatedMovementsAdapter = data => {
  const movements =
    data?.map(movement => {
      const amount = parseFloat(movement?.amount || '0')
      const date = movement?.transaction_date
        ? format(normalizeDateString(movement?.transaction_date), 'dd MMM yyyy', { locale: es })
        : ''
      const time = movement?.transaction_date ? format(normalizeDateString(movement?.transaction_date), 'p') : ''

      return {
        id: movement?.id,
        terminalName: movement?.terminal_name,
        terminalId: movement?.terminal_id,
        amount,
        amountFormat: fCurrency(amount),
        amountToLiquidate: movement?.amountToSettled,
        amountToLiquidateFormat: fCurrency(movement?.amountToSettled),
        commerceName: movement?.commerceName,
        commerceId: movement?.commerceId,
        approved: movement?.approved,
        cardType: movement?.card_brand,
        authNumber: movement?.authorization_number,
        commission: movement?.commission >= 0 ? `${movement?.commission}%` : '0%',
        cardNumber: movement?.card_number,
        cardBank: movement?.issuer,
        transactionDate: {
          fullDate: format(normalizeDateString(movement?.transaction_date), 'dd MMM yyyy HH:mm', { locale: es }),
          date,
          time
        },
        serverDate: normalizeDateString(movement?.transaction_date),
        description: `${movement?.issuer === '' ? movement?.card_brand : movement?.issuer}-${
          movement?.card_number
        }`.toUpperCase(),
        transactionMessage: movement?.result_message,
        conciliated: !!movement?.conciliated,
        conciliatedName: movement?.conciliated ? 'Conciliada' : 'Sin Conciliar',
        liquidationStatus: {
          id: movement?.liquidationStatusId,
          name: movement?.liquidationStatusName
        },
        dataToLiquidate: {
          id: movement?.id,
          commerceId: movement?.commerceId,
          authorization_number: movement?.authorization_number,
          terminal_id: movement?.terminal_id,
          terminal_spei_card: movement?.terminal_spei_card || '',
          amountToSettled: movement?.amountToSettled
        }
      }
    }) ?? []

  return movements
}
