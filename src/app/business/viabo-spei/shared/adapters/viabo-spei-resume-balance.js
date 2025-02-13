import { fCurrency } from '@/shared/utils'

export const ViaboSpeiResumeBalance = balance => ({
  balance: {
    amount: Number(balance?.balance),
    currency: fCurrency(balance?.balance || 0)
  },
  deposits: {
    balance: Number(balance?.speiInTotal),
    currency: fCurrency(balance?.speiInTotal || 0),
    count: balance?.speiInCount || 0
  },
  transfers: {
    balance: Number(balance?.speiOutTotal),
    currency: fCurrency(balance?.speiOutTotal || 0),
    count: balance?.speiOutCount || 0
  }
})
