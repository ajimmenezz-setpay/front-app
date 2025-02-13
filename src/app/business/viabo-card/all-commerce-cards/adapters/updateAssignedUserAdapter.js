import { getCryptInfo } from '@/shared/utils'

export const UpdateAssignedUserAdapter = (newUserInfo, cardInfo) => {
  const dataAdapted = {
    ownerId: cardInfo?.assignUser?.id,
    name: newUserInfo?.name,
    lastName: newUserInfo?.lastName,
    phone: newUserInfo?.phone
  }

  return getCryptInfo(dataAdapted)
}
