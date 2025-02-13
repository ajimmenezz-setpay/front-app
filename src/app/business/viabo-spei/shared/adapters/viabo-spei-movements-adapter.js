import { format } from 'date-fns'
import { es } from 'date-fns/locale'

import { fCurrency, fDateTime, fTime } from '@/shared/utils'

const status = {
  Liquidado: {
    name: 'Liquidado',
    color: 'success'
  },
  Devuelto: {
    name: 'Devuelto',
    color: 'error'
  },
  'En tránsito': {
    name: 'En tránsito',
    color: 'warning'
  },
  default: {
    name: 'No reconocido',
    color: 'warning'
  }
}

const SPEI_OPERATIONS = {
  SPEI_IN: 'Spei In',
  SPEI_OUT: 'Spei Out'
}

export const ViaboSpeiMovementsAdapter = movements => {
  const movementsAdapted = movements?.map(movement => {
    const date = movement?.liquidationDate ? movement?.liquidationDate : movement?.createDate
    const totalCommissions =
      movement?.commissions?.feeStp +
      movement?.commissions?.speiIn +
      movement?.commissions?.internal +
      movement?.commissions?.speiOut +
      movement?.commissions?.stpAccount
    return {
      id: movement?.id,
      stpId: movement?.stpId,
      type: movement?.typeName?.toUpperCase(),
      beneficiary: {
        name: movement?.destinationName,
        account: movement?.destinationAccount,
        bankCode: movement?.destinationBankCode
      },
      source: {
        name: movement?.sourceName,
        account: movement?.sourceAccount
      },
      movement: movement?.concept,
      date: {
        original: date,
        dateTime: fDateTime(date),
        time: fTime(date),
        groupBy: format(new Date(date), 'dd MMMM', { locale: es })
      },
      amount: {
        number: movement?.amount,
        format:
          movement?.typeName === SPEI_OPERATIONS.SPEI_IN
            ? fCurrency(movement?.amount || 0)
            : `- ${fCurrency(movement?.amount || 0)}`,
        color: movement?.typeName === SPEI_OPERATIONS.SPEI_IN ? 'success.main' : 'error'
      },
      reference: movement?.reference,
      banxicoKey: movement?.trackingKey,
      status: {
        ...(movement?.statusName ? status[movement.statusName] || status.default : status.default)
      },
      commissions: {
        fee: fCurrency(-movement?.commissions?.feeStp || 0),
        internalCompany: fCurrency(-movement?.commissions?.internal || 0),
        speiIn: fCurrency(-movement?.commissions?.speiIn || 0),
        speiOut: fCurrency(-movement?.commissions?.speiOut || 0),
        stpAccount: fCurrency(-movement?.commissions?.stpAccount || 0),
        total: {
          number: totalCommissions || 0,
          format: fCurrency(-totalCommissions || 0)
        },
        total_with_commissions:
          movement?.typeName === SPEI_OPERATIONS.SPEI_IN
            ? fCurrency(movement?.commissions?.total || 0)
            : `- ${fCurrency(movement?.commissions?.total || 0)}`
      },
      fileCEP: movement?.urlCEP,
      receipt: movement?.receiptUrl
    }
  })

  movementsAdapted.sort((a, b) => new Date(b.date.original) - new Date(a.date.original))

  const movementsByDay = {}
  movementsAdapted.forEach(movement => {
    const dateKey = movement.date.groupBy
    if (!movementsByDay[dateKey]) {
      movementsByDay[dateKey] = []
    }
    movementsByDay[dateKey].push(movement)
  })

  return { groupByDay: movementsByDay, original: movementsAdapted }
}
