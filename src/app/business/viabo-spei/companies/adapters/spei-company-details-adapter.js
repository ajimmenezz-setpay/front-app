export const SpeiCompanyDetailsAdapter = company => {
  const companyAdapted = {
    id: company?.id,
    commercialName: company?.tradeName,
    fiscalName: company?.fiscalName,
    rfc: company?.rfc,
    adminUsers: company?.users?.map(user => user?.id) || [],
    costCenters: company?.costCenters?.map(costCenter => costCenter?.id) || [],
    commissions: {
      speiOut: company?.speiCommissions?.speiOut,
      internalTransferCompany: company?.speiCommissions?.internal,
      fee: company?.speiCommissions?.feeStp,
      speiIn: company?.speiCommissions?.speiIn
    },
    concentrator: {
      id: company?.stpAccountId
    }
  }

  return companyAdapted
}
