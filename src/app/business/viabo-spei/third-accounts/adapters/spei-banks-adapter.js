import { convertCatalogToReactSelect } from '@/shared/utils'

export const SpeiBanksAdapter = banks => {
  const banksAdapted =
    banks?.map(bank => ({
      id: bank?.id,
      bankCode: bank?.code,
      name: `${bank?.shortName} - ${bank?.code}`,
      commercialName: bank?.name,
      status: bank?.active === '1',
      abmCode: bank?.code?.slice(-3)
    })) || []

  return convertCatalogToReactSelect(banksAdapted, 'id', 'name', 'status')
}
