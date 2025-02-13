import { format } from 'date-fns'
import { es } from 'date-fns/locale'

import { fCardNumberShowLastDigits, fCurrency, fFullDateTime, fTime, isValidUnixTimestamp } from '@/shared/utils'

const CARD_CLOUD_OPERATIONS = [
  {
    name: 'DEPOSIT',
    color: 'success.main'
  },
  {
    name: 'TRANSFER OUT',
    color: 'error'
  },
  {
    name: 'PURCHASE',
    color: 'error'
  },
  {
    name: 'REVERSAL',
    color: 'success.main'
  }
]

export const CardCloudMovementAdapter = movement => {
  const { timeZone } = Intl.DateTimeFormat().resolvedOptions()
  const dateProps = {
    timeZone
  }

  const amount = Number(movement?.amount) ?? 0
  const balance = Number(movement?.balance) ?? 0

  const date = isValidUnixTimestamp(Number(movement?.date)) ? Number(movement?.date) * 1000 : null

  return {
    id: movement?.movement_id,
    order: movement?.movement_order,
    card: {
      id: movement?.card?.card_id,
      number: movement?.card?.masked_pan,
      bin: movement?.card?.bin,
      hidden: fCardNumberShowLastDigits(`****${movement?.card?.bin}`, 4)
    },
    type: movement?.type,
    description: movement?.description,
    authCode: movement?.reference || movement?.authorization_code,
    amount: {
      number: amount,
      format: fCurrency(amount),
      color: amount < 0 ? 'error' : 'success.main'
    },
    balance: {
      number: balance,
      format: fCurrency(balance)
    },
    date: {
      original: date,
      dateTime: date ? fFullDateTime(date, dateProps) : '',
      time: date ? fTime(date, dateProps) : '',
      groupBy: date ? format(new Date(date), 'dd MMMM yyyy', { locale: es, ...dateProps }) : 'sin fecha'
    },
    original: movement
  }
}

export const CardCloudMovementsAdapter = movements => {
  const movementsAdapted = movements?.map(movement => CardCloudMovementAdapter(movement)) || []

  movementsAdapted.sort((a, b) => new Date(b.date.original) - new Date(a.date.original))

  const movementsByDay = {}
  movementsAdapted.forEach(movement => {
    const dateKey = movement?.date?.groupBy
    if (!movementsByDay?.[dateKey]) {
      movementsByDay[dateKey] = []
    }
    movementsByDay[dateKey].push(movement)
  })

  return { groupByDay: movementsByDay, original: movements, originalAdapted: movementsAdapted }
}
