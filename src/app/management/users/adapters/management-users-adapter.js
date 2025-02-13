import { fCardNumberShowLastDigits, fDate, fFullDateTime, fTime, isEmpty } from '@/shared/utils'
import { createAvatar, getNameAvatar } from '@/theme/utils'

export const UserAdapter = user => {
  const date = isEmpty(user?.register) ? null : user?.register
  const lastSessionDate = isEmpty(user?.lastSession) ? null : user?.lastSession
  return {
    id: user?.id,
    firstName: user?.name,
    lastName: user?.lastname,
    email: user?.email,
    phone: user?.phone ?? '',
    avatar: {
      initials: getNameAvatar(user?.name || ''),
      color: createAvatar(user?.name)?.color ?? 'primary'
    },
    profile: {
      id: user?.profileId,
      name: user?.profile
    },
    createDate: {
      original: date,
      date: date ? fDate(date) : '',
      time: date ? fTime(date) : '',
      dateTime: date ? fFullDateTime(date) : ''
    },
    lastSessionDate: {
      original: lastSessionDate,
      date: lastSessionDate ? fDate(lastSessionDate) : '',
      time: lastSessionDate ? fTime(lastSessionDate) : '',
      dateTime: lastSessionDate ? fFullDateTime(lastSessionDate) : ''
    },
    status: {
      isActive: user?.active === '1',
      name: user?.active === '1' ? 'Activo' : 'Inactivo',
      color: user?.status === '1' ? 'success' : 'error'
    }
  }
}

export const CompaniesAdapter = companies => ({
  names: companies?.map(company => company?.name)?.toString() || 'Sin Empresas',
  list:
    companies?.map(company => ({
      id: company?.id,
      name: company?.name,
      avatar: {
        initials: getNameAvatar(company?.name || ''),
        color: createAvatar(company?.name)?.color ?? 'primary'
      }
    })) || []
})

export const CardsAdapter = cards => {
  const cardsAdapted =
    cards?.map(card => ({
      id: card?.card_id,
      number: {
        complete: card?.pan,
        hidden: fCardNumberShowLastDigits(`****${card?.pan?.slice(-8)}`)
      }
    })) || []

  return {
    names: cardsAdapted?.map(card => card?.number?.hidden)?.toString() || 'Sin Tarjetas',
    list: cardsAdapted
  }
}

export const ManagementUsersSpeiCloudAdapter = users =>
  users?.map(user => {
    const userAdapted = UserAdapter(user)
    return {
      ...userAdapted,
      companies: CompaniesAdapter(user?.companies)
    }
  }) || []

export const ManagementUsersCardCloudAdapter = users =>
  users?.map(user => {
    const userAdapted = UserAdapter(user)
    return {
      ...userAdapted,
      cards: CardsAdapter(user?.cards)
    }
  }) || []
