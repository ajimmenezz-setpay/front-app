import { METHODS_NEW_COMPANY_USERS } from './spei-companies-keys'

export const SpeiNewCompanyAdapter = company => ({
  fiscalName: company?.fiscalName?.trim(),
  rfc: company?.rfc?.trim(),
  commercialName: company?.commercialName?.trim(),
  stpAccount: company?.concentrator?.value,
  isNewUser: company?.method === METHODS_NEW_COMPANY_USERS.NEW_ADMIN_USER,
  assignedUsers: company?.adminUsers?.map(user => user.value) || [],
  userName: company?.adminName?.trim(),
  userLastName: company?.adminLastName?.trim(),
  userEmail: company?.adminEmail?.trim(),
  userPhone: company?.adminPhone?.trim(),
  costCenters: company?.costCenters?.map(user => user.value) || [],
  hasViaboCard: company?.hasViaboCard,
  commissions: {
    speiOut: company?.speiOut,
    speiIn: company?.speiIn,
    internal: company?.internalTransferCompany,
    feeStp: company?.fee
  }
})
