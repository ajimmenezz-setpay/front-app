import { getCryptInfo } from '@/shared/utils'

function convertToDoubleDigit(number) {
  return /^([1-9])$/.test(number) ? '0' + number : number
}

export const PaymentByVirtualTerminalAdapter = (terminal, payment) => {
  const paymentData = {
    commerceId: terminal?.commerceId,
    terminalId: terminal?.terminalId,
    amount: parseFloat(
      payment?.amount?.toString() === '' ? '0' : payment?.amount?.toString().replace(/,/g, '')
    ).toString(),
    description: payment?.concept,
    clientName: payment?.name,
    phone: `+52 ${payment?.phone}`,
    cardNumber: payment?.cardNumber.replace(/\s+/g, ''),
    expMonth: convertToDoubleDigit(payment?.month + 1)?.toString() || '',
    expYear: payment?.year?.toString()?.slice(-2) || '',
    security: payment?.cvv,
    email: payment?.email
  }

  return getCryptInfo(paymentData)
}
