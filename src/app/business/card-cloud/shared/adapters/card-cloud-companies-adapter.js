import { convertCatalogToReactSelect } from '@/shared/utils'

export const CardCloudCompaniesAdapter = companies => {
  if (!Array.isArray(companies)) {
    throw new Error('No se puede obtener la información de las empresas del servicio')
  }
  const companiesAdapted = companies?.map(company => ({
    id: company?.id,
    name: company?.tradeName,
    subAccountId: company?.subAccountId
  }))

  return convertCatalogToReactSelect(companiesAdapted, 'subAccountId', 'name')
}
