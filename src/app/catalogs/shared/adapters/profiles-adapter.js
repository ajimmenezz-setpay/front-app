import { convertCatalogToReactSelect } from '@/shared/utils'

export const ProfilesAdapter = profiles => {
  const profilesAdapted = profiles?.map(profile => ({
    id: profile?.id,
    status: profile?.active,
    name: profile?.name,
    initUrl: profile?.urlInit,
    level: Number(profile?.level)
  }))

  return convertCatalogToReactSelect(profilesAdapted, 'id', 'name', 'status')
}
