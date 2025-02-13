import { CardCloudMovementsAdapter } from './card-cloud-movements-adapter'

import { fCurrency, isObject } from '@/shared/utils'

const WalletAdapter = wallet => {
  const balance = parseFloat(wallet?.balance ? wallet?.balance : 0)?.toFixed(2) ?? 0

  return {
    id: wallet?.wallet_id,
    clabe: wallet?.clabe,
    balance: {
      number: balance,
      format: fCurrency(balance)
    },
    lastMovements: CardCloudMovementsAdapter(wallet?.last_movements)
  }
}

export const CardCloudSubAccountInfoAdapter = subAccountInfo => {
  if (!isObject(subAccountInfo)) {
    throw new Error('No se puede obtener la información de la subcuenta')
  }

  return {
    subAccountId: subAccountInfo?.subaccount_id,
    externalId: subAccountInfo?.external_id,
    description: subAccountInfo?.description,
    wallet: WalletAdapter(subAccountInfo?.wallet)
  }
}
