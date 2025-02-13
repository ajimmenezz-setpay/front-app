export const ManagementCommerceInformationAdapter = (information, commerce) => {
  const formCommerce = new FormData()

  const dataAdapted = {
    commerceId: commerce?.id,
    fiscalPersonType: information?.fiscalTypePerson,
    fiscalName: information?.fiscalName,
    tradeName: information?.commercialName,
    rfc: information?.rfc,
    employees: information?.employeesNumber,
    branchOffices: information?.branchesNumber,
    postalAddress: information?.postalAddress,
    phoneNumbers: information?.phoneNumbers,
    slug: information?.terminalCommerceSlug?.toLowerCase()?.trim() || '',
    publicTerminal: information?.publicTerminal?.value || '',
    logo: information?.commerceLogo || null
  }

  Object.entries(dataAdapted).forEach(([key, value]) => {
    formCommerce.append(key, value)
  })

  return formCommerce
}
