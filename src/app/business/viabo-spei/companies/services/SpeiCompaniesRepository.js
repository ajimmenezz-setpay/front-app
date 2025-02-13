import {
  SpeiAdminCompanyUsersAdapter,
  SpeiCompaniesListAdapter,
  SpeiCompanyDetailsAdapter,
  SpeiConcentratorListAdapter
} from '../adapters'

import { axios } from '@/shared/interceptors'

export const getSpeiCompaniesList = async () => {
  const { data } = await axios.get('/commerces')
  return SpeiCompaniesListAdapter(data)
}

export const newSpeiCompany = async company => {
  const { data } = await axios.post('/backoffice/company/new', company)
  return data
}

export const getViaboSpeiAdminCompanyUsers = async () => {
  const { data } = await axios.get('/security/users/administrators-of-companies')

  return SpeiAdminCompanyUsersAdapter(data)
}

export const changeSpeiCompanyStatus = async company => {
  const { data } = await axios.put(
    '/backoffice/company/toggle',
    {},
    {
      params: {
        company: company?.id,
        active: company?.changeStatus
      }
    }
  )

  return company
}

export const getViaboSpeiCompanyDetails = async companyId => {
  const { data } = await axios.get(`/backoffice/company/${companyId}`)

  return SpeiCompanyDetailsAdapter(data)
}

export const updateViaboSpeiCompany = async company => {
  const { data } = await axios.put('/backoffice/company/update', company)

  return company
}

export const getViaboSpeiConcentratorsList = async () => {
  const { data } = await axios.get('/spei/concentrator')

  return SpeiConcentratorListAdapter(data)
}

export const getViaboSpeiCommissions = async () => {
  const { data } = await axios.get('/backoffice/rates')

  return {
    percentage: data?.CommisionPercentage,
    amount: data?.FeeStp
  }
}
