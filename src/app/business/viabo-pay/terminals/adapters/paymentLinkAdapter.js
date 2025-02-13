import { getCryptInfo } from '@/shared/utils'

export const PaymentLinkAdapter = (terminal, data) => {
  const paymentLink = {
    commerceId: terminal?.commerceId,
    terminalId: terminal?.terminalId,
    amount: parseFloat(data?.amount.toString() === '' ? '0' : data?.amount?.toString().replace(/,/g, '')).toString(),
    clientName: data?.name,
    email: data?.email,
    phone: data?.phone,
    description: data?.concept
  }

  return getCryptInfo(paymentLink)
}
