import { convertCatalogToReactSelect, fCardNumberShowLastDigits, fCurrency, isObject } from '@/shared/utils'
import { contrastColor, cssStyles, getRandomColorPreset } from '@/theme/utils'

export const CardAdapterOfCardCloud = card => {
  if (!isObject(card)) {
    throw new Error('No se puede obtener la información de la tarjeta')
  }

  let balance = parseFloat(card?.balance) ?? 0
  balance = balance < 0 ? 0 : balance

  const palette = getRandomColorPreset()

  return {
    id: card?.card_id,
    idTable: card?.card_id?.substr(card?.card_id?.length - 12),
    clientId: card?.client_id,
    clabe: card?.clabe,
    isAssigned: !!card?.ownerId,
    number: {
      complete: card?.pan,
      bin: fCardNumberShowLastDigits(`${card?.bin}`),
      masked: card?.masked_pan,
      hidden: fCardNumberShowLastDigits(`****${card?.bin}`, 4)
    },
    balance: {
      number: balance,
      format: fCurrency(balance)
    },
    type: {
      isPhysical: card?.card_type?.toLowerCase() === 'physical',
      name: card?.card_type?.toLowerCase() === 'physical' ? 'Física' : 'Virtual',
      brand: card?.brand
    },
    status: {
      isActive: card?.status?.toUpperCase() === 'NORMAL',
      name: card?.status?.toUpperCase() === 'NORMAL' ? 'Encendida' : 'Apagada',
      color: card?.status?.toUpperCase() === 'NORMAL' ? 'success' : 'error'
    },
    userAssigned: {
      id: card?.ownerId,
      name: card?.name?.trim(),
      lastName: card?.lastname,
      fullName: card?.lastname ? `${card?.name?.trim()} ${card?.lastname?.trim()}` : card?.name?.trim(),
      email: card?.email
    },
    company: {
      subAccountId: card?.companyId || ''
    },
    styles: {
      palette,
      color: palette?.main ? contrastColor(palette?.main) : null,
      bgGradient: theme =>
        palette ? { ...cssStyles(theme).bgGradient({ startColor: palette?.main, endColor: palette?.dark }) } : null
    },
    original: card
  }
}

export const CardsListAdapterOfCardCloud = cardsResponse => {
  if (!Array.isArray(cardsResponse)) {
    throw new Error('No se puede obtener la información de las tarjetas')
  }
  const cardsAdapted = cardsResponse?.map(card => CardAdapterOfCardCloud(card)) || []

  return convertCatalogToReactSelect(cardsAdapted, 'id', 'clientId')
}
