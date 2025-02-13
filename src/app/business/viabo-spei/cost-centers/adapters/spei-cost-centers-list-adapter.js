import { convertCatalogToReactSelect } from '@/shared/utils'

export const SpeiCostCentersListAdapter = costCenters => {
  const costCentersAdapted =
    costCenters?.map(costCenter => ({
      id: costCenter?.id,
      folio: costCenter?.folio,
      name: costCenter?.name,
      status: costCenter?.active === '1',
      companies: costCenter?.companyTotal,
      create: {
        user: costCenter?.createdByUser,
        date: costCenter?.createDate
      },
      adminUsers: costCenter?.users?.map(user => user?.id) || []
    })) || []

  return convertCatalogToReactSelect(costCentersAdapted, 'id', 'name')
}
