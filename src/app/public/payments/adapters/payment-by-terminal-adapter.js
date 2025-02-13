import { PublicPaymentAdapter } from './public-payment-adapter'

function convertToDoubleDigit(number) {
  return /^([1-9])$/.test(number) ? '0' + number : number
}

export const PaymentByTerminalAdapter = (payment, commerce) => {
  const publicPayment = PublicPaymentAdapter(payment)
  const dataAdapted = {
    ...publicPayment,
    commerceId: commerce?.id,
    terminalId: commerce?.information?.publicTerminal,
    cardNumber: payment?.cardNumber.replace(/\s+/g, ''),
    expMonth: convertToDoubleDigit(payment?.month + 1)?.toString() || '',
    expYear: payment?.year?.toString()?.slice(-2) || '',
    security: payment?.cvv,
    clientName: commerce?.name
  }
  return dataAdapted
}
