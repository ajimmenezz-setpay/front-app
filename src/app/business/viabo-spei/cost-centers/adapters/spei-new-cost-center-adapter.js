import { METHODS_NEW_COST_CENTER_USERS } from './spei-cost-centers-keys'

export const SpeiNewCostCenterAdapter = company => ({
  name: company?.name?.trim(),
  isNewUser: company?.method === METHODS_NEW_COST_CENTER_USERS.NEW_ADMIN_USER,
  assignedUsers: company?.adminUsers?.map(user => user.value) || [],
  userName: company?.adminName?.trim(),
  userLastName: company?.adminLastName?.trim(),
  userEmail: company?.adminEmail?.trim(),
  userPhone: company?.adminPhone?.trim()
})
