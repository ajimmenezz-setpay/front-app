import { getCryptInfo } from '@/shared/utils'

export const ViaboSpeiOutAdapter = (transactions, concept, googleCode, origin, internal) => {
  const adaptedData = {
    destinationsAccounts: transactions?.map(transaction => ({
      bankAccount: transaction?.account?.clabe?.toString(),
      amount: parseFloat(
        transaction?.amount.toString() === '' ? '0' : transaction?.amount?.toString().replace(/,/g, '')
      )
    })),
    concept: concept?.toString() || '',
    googleAuthenticatorCode: googleCode?.toString() || '',
    originBankAccount: origin,
    internalTransaction: internal
  }

  return getCryptInfo(adaptedData)
}
