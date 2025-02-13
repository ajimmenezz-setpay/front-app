import { useEffect, useState } from 'react'

import { useQuery } from '@tanstack/react-query'

import { SPEI_COMPANIES_KEYS } from '../adapters'
import { getViaboSpeiAdminCompanyUsers } from '../services'

import { getErrorAPI } from '@/shared/interceptors'

export const useFindSpeiAdminCompanyUsers = (options = {}) => {
  const [customError, setCustomError] = useState(null)

  const query = useQuery({
    queryKey: [SPEI_COMPANIES_KEYS.USERS_ADMIN_COMPANY_LIST],
    queryFn: ({ signal }) => getViaboSpeiAdminCompanyUsers(),
    refetchOnWindowFocus: false,
    retry: false,
    staleTime: 300000,
    ...options
  })

  useEffect(() => {
    if (query?.isError) {
      const errorMessage = getErrorAPI(
        query.error,
        'No se puede obtener la lista de usuarios. Intente nuevamente o reporte a sistemas'
      )
      setCustomError(errorMessage)
    }
  }, [query.isError, query.error])

  return {
    ...query,
    error: customError || null
  }
}
