export const PublicPaymentAdapter = payment => ({
  method: payment?.paymentType,
  name: payment?.name,
  email: payment?.email,
  phone: `+52 ${payment?.phone}`,
  amount: parseFloat(
    payment?.amount?.toString() === '' ? '0' : payment?.amount?.toString().replace(/,/g, '')
  ).toString(),
  description: payment?.concept
})
