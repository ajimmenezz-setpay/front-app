import { format } from 'date-fns'
import { es } from 'date-fns/locale'

import { fCurrency, fDateTime, getDecryptInfo } from '@/shared/utils'

const getLastStatusDateByFundingOrder = fundingOrder => {
  if (fundingOrder?.statusName === 'Pagada') {
    return fundingOrder?.payCashData?.date
  }

  if (fundingOrder?.statusName === 'Liquidada') {
    return fundingOrder?.conciliationDate
  }

  if (fundingOrder?.statusName === 'Cancelada') {
    return fundingOrder?.cancellationDate
  }

  return fundingOrder?.registerDate
}

export const getFundingOrderAdapter = order => {
  let paymentMethods = ''
  if (order?.spei && order?.referencePayCash && order.spei !== '' && order.referencePayCash !== '') {
    paymentMethods = 'SPEI,PAYCASH'
  } else if (order?.spei && order.spei !== '') {
    paymentMethods = 'SPEI'
  } else if (order?.referencePayCash && order.referencePayCash !== '') {
    paymentMethods = 'PAYCASH'
  }

  const date = order?.registerDate ? format(new Date(order?.registerDate), 'dd MMM yyyy', { locale: es }) : ''
  const time = order?.registerDate ? format(new Date(order?.registerDate), 'p') : ''

  const lastStatusDate = getLastStatusDateByFundingOrder(order)
  return {
    id: order?.id,
    cardId: order?.cardId,
    cardNumber: order?.cardNumber,
    paymentProcessorName: order?.paymentProcessorName,
    paymentMethods,
    referenceNumber: order?.referenceNumber,
    amount: fCurrency(order?.amount),
    status: order?.statusName,
    date: order?.registerDate,
    registerDate: {
      fullDate: fDateTime(order?.registerDate),
      time,
      date
    },
    spei: order?.spei,
    emails: order?.emails?.split(','),
    conciliatedName: order?.conciliated !== 'No' ? 'Conciliada' : 'Sin Conciliar',
    conciliated: order?.conciliated !== 'No',
    conciliationInfo: {
      number: order?.conciliationNumber,
      userId: order?.conciliationUserId,
      userName: order?.conciliationUserName,
      date: order?.conciliationDate ? fDateTime(order?.conciliationDate) : ''
    },
    cancelationInfo: {
      userId: order?.canceledByUserId,
      userName: order?.canceledByUserName,
      date: order?.cancellationDate
    },
    payCash: order?.referencePayCash,
    payCashURLS: order?.instructionsUrls,
    paymentInfo: {
      folio: order?.payCashData?.folio,
      authorizationCode: order?.payCashData?.authorizationCode,
      date: order?.payCashData?.date ? fDateTime(order?.payCashData?.date) : ''
    },
    lastStatusDate: lastStatusDate ? fDateTime(lastStatusDate) : ''
  }
}

export const FundingOrderAdapter = order => {
  const decryptedOrder = getDecryptInfo(order?.ciphertext, order?.iv)
  return getFundingOrderAdapter(decryptedOrder)
}
